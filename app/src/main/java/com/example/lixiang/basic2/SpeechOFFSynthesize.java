package com.example.lixiang.basic2;

import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by Administrator on 2016/12/16 0016.
 */
public class SpeechOFFSynthesize extends CordovaPlugin {
    public void speak(String content){
        Log.e("SpeechOFFSynthesize",content);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("speak".equals(action)){
            //speechSynthesize
            String content = args.getString(0);
            speak(content);
            callbackContext.success("finish");//如果不调用success回调，则js中successCallback不会执行
            return true;
        }
        return false;
    }
}