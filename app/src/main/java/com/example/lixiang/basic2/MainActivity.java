package com.example.lixiang.basic2;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.*;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.*;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.MenuItemCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.*;
import android.widget.*;
import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import baidu.location.service.LocationService;
import com.example.lixiang.basic2.guide.guideActivity;
import com.google.gson.*;
import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebView;
import org.apache.cordova.engine.SystemWebViewEngine;
import org.json.JSONArray;
import org.json.JSONObject;
import tourguide.tourguide.TourGuide;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

//
public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener, CordovaInterface, SeekBar.OnSeekBarChangeListener {

    public TourGuide mTutorialHandler;
    CordovaWebView cordovaWebView;
    private final ExecutorService threadPool = Executors.newCachedThreadPool();
    protected int activityResultRequestCode;
    protected CordovaPlugin activityResultCallback;
    protected CordovaPreferences prefs = new CordovaPreferences();
    protected ArrayList<PluginEntry> pluginEntries = null;
    protected SystemWebView systemWebView;
    protected Button compass;
    private AlertDialog.Builder builder;
    private AlertDialog.Builder industry;
    private AlertDialog.Builder mapDialog;
    private AlertDialog.Builder videoDialog;
    private AlertDialog.Builder chooseDialog;
    private AlertDialog.Builder playDialog;
    public final static int CODE = 1;
    private SlidingDrawer slidingDrawer;
    private LinearLayout linearLayout;
    private int[] pics;
    private String[] picsName;
    private String[] date;
    private String[] introduce;
    private String[] industries;
    private LayoutInflater mInflater;
    private LocationService locationService;
    private String permissionInfo;
    private final int SDK_PERMISSION_REQUEST = 127;
    private Toolbar toolbar;
    private String longtitude;
    private String latitude;
    private boolean bool = false;
    private Snackbar snackbar;
    private CoordinatorLayout container;
    private Button map;
    private boolean[] showMap;
    private boolean[] showVideo;
    private SeekBar transparent;
    public Activity mActivity;
    private CompoundButton nav_cameraButton;
    private CompoundButton nav_galleryButton;
    private CompoundButton nav_slideshowButton;
    private ImageView iv = null;
    private Button satellite;
    private String[] credit;
    private String[] videoName;
    private String[] videoUrl;
    private DownloadManager downManager;
    private BroadcastReceiver broadcastReceiver;

    private CountDownTimer timer = new CountDownTimer(8000, 1000) {

        @Override
        public void onTick(long millisUntilFinished) {
            systemWebView.loadUrl("file:///android_asset/www/index.html");
        }

        @Override
        public void onFinish() {
            iv.setVisibility(View.GONE);
            systemWebView.setVisibility(View.VISIBLE);
            map.setVisibility(View.VISIBLE);
            compass.setVisibility(View.VISIBLE);
            toolbar.setVisibility(View.VISIBLE);
            satellite.setVisibility(View.VISIBLE);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mActivity = this;
        setContentView(R.layout.activity_main);
        StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                .detectDiskReads().detectDiskWrites().detectNetwork()
                .penaltyLog().build());
        StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                .detectLeakedSqlLiteObjects().detectLeakedClosableObjects()
                .penaltyLog().penaltyDeath().build());
        container = (CoordinatorLayout) findViewById(R.id.coordinator);
        getPersimmions();
        mInflater = LayoutInflater.from(this);


        JsonObject obj = new JsonParser().parse(loadJson("http://10.10.90.6:8080/GetInitialLayers.do?xmlname=LayersCollection")).getAsJsonObject();
        JsonArray jsonArray = obj.get("layers").getAsJsonObject().get("layer").getAsJsonArray();
        int index = 0;
        credit = new String[jsonArray.size()];
        for (JsonElement jsonElement : jsonArray) {
            credit[index] = jsonElement.getAsJsonObject().get("credit").getAsString();
            index++;
        }
        showMap = new boolean[jsonArray.size()];
        for (int k = 0; k < showMap.length; k++)
            showMap[k] = false;


        JsonObject obj2 = new JsonParser().parse(loadJson("http://10.10.90.6:8080/GetVideoList.do")).getAsJsonObject();
        JsonArray j2 = obj2.get("videos").getAsJsonObject().get("video").getAsJsonArray();
        int index2 = 0;
        videoName = new String[j2.size()];
        videoUrl = new String[j2.size()];
        for (JsonElement jsonElement2 : j2) {
            videoName[index2] = jsonElement2.getAsJsonObject().get("name").getAsString();
            videoUrl[index2] = "http://10.10.90.6:8080" + jsonElement2.getAsJsonObject().get("src").getAsString();
            index2++;
        }



        industries = new String[]{
                "国土资源部",
                "环境保护部",
                "农业部",
                "住房和城乡建设部",
                "交通运输部",
                "国家林业局",
                "民政部",
                "中国地震局",
                "水利部",
                "国家统计局"
        };
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        transparent = (SeekBar) findViewById(R.id.transparent);
        transparent.setOnSeekBarChangeListener(this);
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        toolbar.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.home:
                        systemWebView.loadUrl("javascript:backHome()");
                        break;

                    case R.id.share:
                        Snackbar.make(container, "抱歉，分享功能尚未开放", Snackbar.LENGTH_LONG).show();
                        break;

                    case R.id.locate:
                        locationService.registerListener(mListener);
                        locationService.start();

                }
                return true;
            }

        });
        compass = (Button) findViewById(R.id.compass);
        map = (Button) findViewById(R.id.map);
        satellite = (Button) findViewById(R.id.satellite);

        satellite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                systemWebView.loadUrl("javascript:satellite()");
            }
        });
        map.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                chooseMapOrVideo();
            }
        });

        compass.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                systemWebView.loadUrl("javascript:compass(\"compass\")");
            }
        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        iv = (ImageView) this.findViewById(R.id.id_iv);

        systemWebView = (SystemWebView) findViewById(R.id.cordovaWebView);
        ConfigXmlParser parser = new ConfigXmlParser();
        parser.parse(this);
        cordovaWebView = new CordovaWebViewImpl(new SystemWebViewEngine(systemWebView));
        cordovaWebView.init(this, parser.getPluginEntries(), parser.getPreferences());
        //systemWebView.loadUrl("file:///android_asset/www/index.html");
        timer.start();
        MenuItem nav_camera = navigationView.getMenu().findItem(R.id.layer1);
        MenuItem nav_gallery = navigationView.getMenu().findItem(R.id.layer2);
        MenuItem nav_slideshow = navigationView.getMenu().findItem(R.id.layer3);
        nav_cameraButton = (CompoundButton) MenuItemCompat.getActionView(nav_camera);
        nav_galleryButton = (CompoundButton) MenuItemCompat.getActionView(nav_gallery);
        nav_slideshowButton = (CompoundButton) MenuItemCompat.getActionView(nav_slideshow);

        nav_cameraButton.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) nav_cameraButton.setClickable(false);
            }
        });

        nav_galleryButton.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) nav_galleryButton.setClickable(false);
            }
        });

        nav_slideshowButton.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) nav_slideshowButton.setClickable(false);
            }
        });
    }

    private void chooseMapOrVideo() {
        chooseDialog = new AlertDialog.Builder(this);
        chooseDialog.setMessage("您要浏览的种类是：");
        chooseDialog.setPositiveButton("图层信息", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                showMapDialog();

            }
        });
        chooseDialog.setNegativeButton("视频信息", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                showVideoDialog();
            }
        });
        chooseDialog.setCancelable(true);
        AlertDialog dialog = chooseDialog.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams lp = window.getAttributes();
        window.setAttributes(lp);
        dialog.show();
    }

    public void showPlayDialog(int index) {
        Log.e("sdfsdf", String.valueOf(index));
        final String videourl = videoUrl[index];
        final String videoname = videoName[index];
        playDialog = new AlertDialog.Builder(this);
        playDialog.setMessage("是否立刻播放视频？");
        playDialog.setPositiveButton("是", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                downloadVideo(videourl, videoname);
            }
        });
        playDialog.setNegativeButton("否", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
            }
        });
        playDialog.setCancelable(true);
        AlertDialog dialog = playDialog.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams lp = window.getAttributes();
        window.setAttributes(lp);
        dialog.show();
    }

    long id;

    private void downloadVideo(String videoUrl, final String videoname) {
        /*

        假装在加载
         */
        String[] strings = videoUrl.split("/");
        final String fileName = strings[strings.length - 1];
        Toast.makeText(getApplicationContext(), "视频 \"" + videoname + "\" 正在缓冲，请等待...", Toast.LENGTH_LONG).show();
        /*

        开始偷偷下载
         */
        downManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(videoUrl));
        request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE);
        request.setAllowedOverRoaming(false);

        request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, fileName);
        id = downManager.enqueue(request);
        /*
        监听是否偷偷下载完成

        */
        IntentFilter intentFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long ID = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (ID == id)
                    Toast.makeText(getApplicationContext(), "视频 \"" + videoname + " \"缓冲完成", Toast.LENGTH_SHORT).show();
                Intent intent2 = new Intent(Intent.ACTION_VIEW);
                intent2.setDataAndType(Uri.parse(Environment.getExternalStorageDirectory().getPath()
                        + "/Android/data/"
                        + MainActivity.this.getPackageName()
                        + "/files/"
                        + Environment.DIRECTORY_DOWNLOADS
                        + "/"
                        + fileName), "video/mp4");
                startActivity(intent2);
            }
        };
        registerReceiver(broadcastReceiver, intentFilter);
    }

    public void showVideoDialog() {
        final int[] index = {-1};
        videoDialog = new AlertDialog.Builder(this);
        videoDialog.setTitle("请选择视频：");

        videoDialog.setSingleChoiceItems(videoName, -1, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                transparent.setVisibility(View.VISIBLE);
                systemWebView.loadUrl("javascript:selectVideo(\"" + i + "\")");
                index[0] = i;
            }
        });
        videoDialog.setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                showPlayDialog(index[0]);
            }
        });
        videoDialog.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
            }
        });
        videoDialog.setCancelable(true);
        AlertDialog dialog = videoDialog.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams lp = window.getAttributes();
        window.setAttributes(lp);
        dialog.show();
    }

    public void showMapDialog() {
        mapDialog = new AlertDialog.Builder(this);
        mapDialog.setTitle("请选择图层：");
        mapDialog.setMultiChoiceItems(credit, showMap, new DialogInterface.OnMultiChoiceClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i, boolean b) {
                transparent.setVisibility(View.VISIBLE);
                showMap[i] = b;
                systemWebView.loadUrl("javascript:selectMap(\"" + i + "\")");
            }
        });

        mapDialog.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });
        mapDialog.setCancelable(true);
        AlertDialog dialog = mapDialog.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams lp = window.getAttributes();
        window.setAttributes(lp);
        dialog.show();
    }

    @Override
    protected void onStart() {
        super.onStart();
        locationService = ((PicApplication) getApplication()).locationService;
        locationService.registerListener(mListener);
        int type = getIntent().getIntExtra("from", 0);
        if (type == 0) {
            locationService.setLocationOption(locationService.getDefaultLocationClientOption());
        } else if (type == 1) {
            locationService.setLocationOption(locationService.getOption());
        }

    }

    @Override
    protected void onStop() {
        // TODO Auto-generated method stub
        locationService.unregisterListener(mListener);
        locationService.stop();
        super.onStop();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();
        /**
         * city life
         */
        if (id == R.id.layer1) {
            nav_cameraButton.setChecked(true);
            nav_galleryButton.setChecked(false);
            nav_slideshowButton.setChecked(false);
            systemWebView.loadUrl("javascript:selectLayers(\"0\")");

        } else if (id == R.id.layer2) {
            nav_cameraButton.setChecked(false);
            nav_galleryButton.setChecked(true);
            nav_slideshowButton.setChecked(false);
            systemWebView.loadUrl("javascript:selectLayers(\"1\")");
        } else if (id == R.id.layer3) {
            nav_cameraButton.setChecked(false);
            nav_galleryButton.setChecked(false);
            nav_slideshowButton.setChecked(true);
            systemWebView.loadUrl("javascript:selectLayers(\"2\")");
        }
        if (id == R.id.hangye) {
            showIndustryDialog();

        } else if (id == R.id.nav_send) {
            Snackbar.make(container, "抱歉，社交功能尚未开放", Snackbar.LENGTH_LONG).show();
        } else if (id == R.id.userInfo) {
            /**
             * login
             */
            Intent intent = new Intent();
            intent.setClass(MainActivity.this, LoginActivity.class);
            startActivityForResult(intent, 0);
        } else if (id == R.id.order) {
            Snackbar.make(container, "抱歉，订单功能尚未开放", Snackbar.LENGTH_LONG).show();
        } else if (id == R.id.guide) {
            Intent intent = new Intent().setClass(MainActivity.this, guideActivity.class);
            startActivity(intent);
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void startActivityForResult(CordovaPlugin cordovaPlugin, Intent intent, int i) {
        setActivityResultCallback(cordovaPlugin);
        try {
            startActivityForResult(intent, i);
        } catch (RuntimeException e) {
            activityResultCallback = null;
            throw e;
        }
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin cordovaPlugin) {
        if (activityResultCallback != null) {
            activityResultCallback.onActivityResult(activityResultRequestCode, Activity.RESULT_CANCELED, null);
        }
        this.activityResultCallback = cordovaPlugin;
    }

    @Override
    public Activity getActivity() {
        return this;
    }

    @Override
    public Object onMessage(String s, Object o) {
        if ("exit".equals(s)) {
            super.finish();
        }
        return null;
    }

    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    @Override
    public void requestPermission(CordovaPlugin cordovaPlugin, int i, String s) {

    }

    @Override
    public void requestPermissions(CordovaPlugin cordovaPlugin, int i, String[] strings) {

    }

    @Override
    public boolean hasPermission(String s) {
        return false;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 0 && resultCode == 0) {
            /**
             * get UserName
             */
            Bundle bundle = data.getExtras();
            final String userName = bundle.getString("userName");
            Log.e("---username----", userName);
            systemWebView.loadUrl("javascript:showAlert(\"" + userName + "\")");

        }
    }


    @Override
    public void onProgressChanged(SeekBar seekBar, final int progress, boolean b) {

        systemWebView.loadUrl("javascript:seekBar(\"" + progress + "\")");

    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }

    private void showIndustryDialog() {
        industry = new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Light_Dialog);
        industry.setTitle("请选择行业:");
        industry.setSingleChoiceItems(industries, -1, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Snackbar.make(container, "您选择的行业是 ：" + industries[i], Snackbar.LENGTH_LONG).show();
                dialogInterface.dismiss();
            }
        });
        industry.setPositiveButton("关闭", null);
        industry.setCancelable(true);
        industry.show();
    }


    @TargetApi(23)
    private void getPersimmions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ArrayList<String> permissions = new ArrayList<String>();

            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }
            if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }

            if (addPermission(permissions, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                permissionInfo += "Manifest.permission.WRITE_EXTERNAL_STORAGE Deny \n";
            }

            if (addPermission(permissions, Manifest.permission.READ_PHONE_STATE)) {
                permissionInfo += "Manifest.permission.READ_PHONE_STATE Deny \n";
            }

            if (permissions.size() > 0) {
                requestPermissions(permissions.toArray(new String[permissions.size()]), SDK_PERMISSION_REQUEST);
            }
        }
    }

    @TargetApi(23)
    private boolean addPermission(ArrayList<String> permissionsList, String permission) {
        if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
            if (shouldShowRequestPermissionRationale(permission)) {
                return true;
            } else {
                permissionsList.add(permission);
                return false;
            }

        } else {
            return true;
        }
    }

    @TargetApi(23)
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        // TODO Auto-generated method stub
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    }

    private BDLocationListener mListener = new BDLocationListener() {
        @Override
        public void onReceiveLocation(BDLocation location) {
            // TODO Auto-generated method stub
            if (null != location && location.getLocType() != BDLocation.TypeServerError) {
                StringBuffer sb = new StringBuffer(256);
                latitude = "" + location.getLatitude();
                longtitude = "" + location.getLongitude();
                systemWebView.loadUrl("javascript:setLocation(\"" + latitude + "," + longtitude + "\")");
                sb.append(location.getLatitude());
                sb.append("-");
                sb.append(location.getLongitude());
                logMsg(sb.toString());
                Snackbar.make(container, "您所在的经纬度是 ：" + sb.toString(), Snackbar.LENGTH_LONG).show();
                locationService.stop();

            }
        }
    };


    public void logMsg(String str) {
        Log.e("LOCATION", str);
    }

    public static String loadJson(String url) {
        StringBuilder json = new StringBuilder();
        try {
            URL urlObject = new URL(url);
            URLConnection uc = urlObject.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(uc.getInputStream(), "utf-8"));

            String inputLine = null;
            while ((inputLine = in.readLine()) != null) {
                json.append(inputLine);
            }
            in.close();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //String arr=new String(json.toString().getBytes("iso8859-1"),"utf-8");
        return json.toString();
    }
}