// hello.cc
#include <node.h>
#include "zinnia.h"
#include "my_model.h"
using namespace v8;

static v8::Handle<v8::Object> myModule;


// native blocking/compute intensive function
void delay(int seconds) {
    int i;
    int j;

    // a long computation
    for(i=0;i<2000000;++i) {
        for(j=0;j<400;++j)   {
                count = count * seconds;
        }
    }

    /**
     * or a blocking call
     * sleep(seconds);
     */
}

// the 'baton' is the carrier for data between functions
struct DelayBaton
{
    // required
    uv_work_t request;                  // libuv
    Persistent<Function> callback;      // javascript callback

    // optional : data goes here.
    // data that doesn't go back to javascript can be any typedef
    // data that goes back to javascript needs to be a supported type
    int         seconds;
    char        greeting[256];
};

// called by libuv worker in separate thread
static void DelayAsync(uv_work_t *req)
{
    DelayBaton *baton = static_cast<DelayBaton *>(req->data);
    delay(baton->seconds);
}

// called by libuv in event loop when async function completes
static void DelayAsyncAfter(uv_work_t *req,int status)
{
    // get the reference to the baton from the request
    DelayBaton *baton = static_cast<DelayBaton *>(req->data);

    // set up return arguments
    Handle<Value> argv[] =
        {
            Handle<Value>(Int32::New(baton->seconds)),
            Handle<Value>(String::New(baton->greeting))
        };

    // execute the callback
    baton->callback->Call(Context::GetCurrent()->Global(),2,argv);

    // dispose the callback object from the baton
    baton->callback.Dispose();

    // delete the baton object
    delete baton;
}

// javascript callable function
Handle<Value> Delay(const Arguments &args)
{
    // create 'baton' data carrier
    DelayBaton *baton = new DelayBaton;

    // get callback argument
    Handle<Function> cb = Handle<Function>::Cast(args[2]);

    // attach baton to uv work request
    baton->request.data = baton;

    // assign incoming arguments to baton
    baton->seconds =   args[0]->Int32Value();

    // point at the argument as a string, then copy it to the baton
    v8::String::Utf8Value str(args[1]);
    strncpy(baton->greeting,*str,sizeof(baton->greeting));

    // assign callback to baton
    baton->callback = Persistent<Function>::New(cb);

    // queue the async function to the event loop
    // the uv default loop is the node.js event loop
    uv_queue_work(uv_default_loop(),&baton->request,DelayAsync,DelayAsyncAfter);

    // nothing returned
    return Undefined();
}


void Add(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	if (args.Length() < 1) {
		isolate->ThrowException(Exception::TypeError(
		                            String::NewFromUtf8(isolate, "Wrong number of arguments")));
		return;
	}

	if (!args[0]->IsString()) {
		isolate->ThrowException(Exception::TypeError(
		                            String::NewFromUtf8(isolate, "Wrong arguments")));
		return;
	}



    zinnia::Recognizer *recognizer = zinnia::Recognizer::create();

    
	double value = 0;
	if (!recognizer->open(my_model, my_model_size)) {
		const char * what = recognizer->what();
		args.GetReturnValue().Set(String::NewFromUtf8(isolate, what));
		return;
	}

	Local<Number> num = Number::New(isolate, value);

	args.GetReturnValue().Set(num);
    delete recognizer;
}

void Init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "add", Add);
	 // add the async function to the exports for this object
  exports->Set(
                String::NewSymbol("delay"),                          // javascript function name
                FunctionTemplate::New(Delay)->GetFunction()          // attach 'Delay' function to javascript name
              );
}

NODE_MODULE(zinnia, Init)