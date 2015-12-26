// hello.cc
#include <node.h>
#include <string>
#include <v8.h>
#include <uv.h>
#include <vector>
#include "zinnia.h"
#include "my_model.h"
using namespace v8;

static v8::Handle<v8::Object> myModule;

struct Position {
		int x, y;
		Position(int x_, int y_): x(x_), y(y_) {}
	};
	
struct Work {
	uv_work_t  request;
	Persistent<Function> callback;

	int width, height;
	
	using stroke = std::vector<Position>;
	std::vector<stroke> strokes;
	std::string result;
	bool isSuccess;

	Work() {
		width = height = -1;
		isSuccess = false;
	}

	void FailWith(std::string reason) {
		result = reason;
		isSuccess = false;
	}
};

static void WorkAsync(uv_work_t *req)
{
	Work *work = static_cast<Work *>(req->data);

	auto *recognizer = zinnia::Recognizer::create();

	if (!recognizer->open(my_model, my_model_size)) {
		work->FailWith(recognizer->what());
		delete recognizer;
		return;
	}


	auto *character = zinnia::Character::create();
	character->clear();
	character->set_width(work->width);
	character->set_height(work->height);
	int strokeIndex = 0;
	for (auto stroke : work->strokes) {
		for (auto position : stroke) {
			character->add(strokeIndex, position.x, position.y);
		}
		++strokeIndex;
	}

	zinnia::Result *result = recognizer->classify(*character, 1);
	if (!result) {
		work->FailWith(recognizer->what());
		delete recognizer;
		delete character;
		delete result;
		return;
	}


	work->result = std::string(result->value(0));
	
	delete result;
	delete character;
	delete recognizer;
}


// called by libuv in event loop when async function completes
static void WorkAsyncComplete(uv_work_t *req, int status)
{
	Isolate * isolate = Isolate::GetCurrent();
	v8::HandleScope handleScope(isolate); // Required for Node 4.x

	Work *work = static_cast<Work *>(req->data);
	Local<Boolean> isSuccess = Boolean::New(isolate, work->isSuccess);
	Local<String> result = String::NewFromUtf8(isolate, work->result.c_str());

// set up return arguments
	Handle<Value> argv[] = { isSuccess, result };

	// execute the callback
	Local<Function>::New(isolate, work->callback)->
	Call(isolate->GetCurrentContext()->Global(), 2, argv);

	// Free up the persistent function callback
	work->callback.Reset();

	delete work;
}


// width, height, [[x,y], [x,y] ... ]
void CalculateResultsAsync(const v8::FunctionCallbackInfo<v8::Value>&args) {
	Isolate* isolate = args.GetIsolate();

	Work * work = new Work();
	work->request.data = work;

	work->width = args[0]->IntegerValue();
	work->height = args[1]->IntegerValue();
	Local<Array> strokes = Local<Array>::Cast(args[2]);
	for (unsigned int strokeIndex = 0 ; strokeIndex < strokes->Length(); ++strokeIndex) {
		Local<Array> positions = Local<Array>::Cast(strokes->Get(strokeIndex));
		work->strokes.push_back(Work::stroke());

		for (unsigned int positionIndex = 0 ; positionIndex < positions->Length(); ++positionIndex) {
			Local<Array> position = Local<Array>::Cast(positions->Get(positionIndex));
			int x = Local<Integer>::Cast(position->Get(0))->IntegerValue();
			int y = Local<Integer>::Cast(position->Get(1))->IntegerValue();
			work->strokes.at(strokeIndex).push_back(Position(x, y));
		}
	}

	// store the callback from JS in the work package so we can
	// invoke it later
	Local<Function> callback = Local<Function>::Cast(args[1]);
	work->callback.Reset(isolate, callback);

	// kick of the worker thread
	uv_queue_work(uv_default_loop(), &work->request,
	              WorkAsync, WorkAsyncComplete);

	args.GetReturnValue().Set(Undefined(isolate));

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
	NODE_SET_METHOD(exports, "calculate_results_async", CalculateResultsAsync);
}

NODE_MODULE(zinnia, Init)