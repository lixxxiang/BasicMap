package com.example.lixiang.basic2;

import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class CallBack extends CordovaPlugin {

    public static String url = "";
    public static String credits = "";


    public void speak(String content) {
        Log.e("url---------", content);

        url = content;

    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("speak".equals(action)) {
            String content = args.getString(0);
            speak(content);
            return true;
        }
        return false;
    }

}
