package com.example.lixiang.basic2;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.example.lixiang.basic2.guide.guide2Activity;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.SimpleDraweeView;

import java.util.Timer;
import java.util.TimerTask;


/**
 * Created by Administrator on 2017/1/3 0003.
 */
public class AnimationActivity extends Activity {
    private SimpleDraweeView dvWelcome;
    private final int SKIP_DELAY_TIME = 6000;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fresco.initialize(this);
        setContentView(R.layout.activity_animation);
        dvWelcome= (SimpleDraweeView) findViewById(R.id.animation);
        DraweeController draweeController = Fresco.newDraweeControllerBuilder()
                .setAutoPlayAnimations(true)
                .setUri(Uri.parse("asset://com.example.administrator.basic/animation.gif"))
                .build();
        dvWelcome.setController(draweeController);
        Timer time = new Timer();
        TimerTask task = new TimerTask(){
            @Override
            public void run() {
                startActivity(new Intent(AnimationActivity.this,guide2Activity.class));
            }
        };
        time.schedule(task, SKIP_DELAY_TIME);

    }
}
