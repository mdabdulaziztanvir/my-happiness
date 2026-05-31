#include <napi.h>
#include <cmath> // For std::sqrt

// 1. The actual C++ square root function
Napi::Value MySqrt(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Check if an argument was passed and if it's a number
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Convert the JavaScript number to a C++ double
    double input = info[0].As<Napi::Number>().DoubleValue();

    // Handle negative numbers just in case
    if (input < 0) {
        Napi::TypeError::New(env, "Cannot take square root of a negative number").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Calculate the square root
    double result = std::sqrt(input);

    // Return the result back as a JavaScript Number
    return Napi::Number::New(env, result);
}

// 2. Initialize the module and bind the C++ function to a JS key
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // We are exposing 'MySqrt' to JS as the function name 'customSqrt'
    exports.Set(Napi::String::New(env, "customSqrt"), Napi::Function::New(env, MySqrt));
    return exports;
}

// 3. Register the module
NODE_API_MODULE(addon, Init)