// hello.cc
#include <node.h>
#include "zinnia.h"
#include "my_model.h"
using namespace v8;

static v8::Handle<v8::Object> myModule;


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
}

NODE_MODULE(zinnia, Init)