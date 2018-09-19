package com.wepay;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.reactlibrary.RNSyanImagePickerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.beefe.picker.PickerViewPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.BuildConfig;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FastImageViewPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage(),
            new RNSyanImagePickerPackage(),
            new SplashScreenReactPackage(),
            new PickerViewPackage(),
            new CodePush("v-5TDPSESydQj-n9alBgCVEab3Mefdf2b04e-456b-420f-8acd-58a99c8306be", getApplicationContext(), BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    //腾讯的日志收集器  和SDKInitializer 冲突了 错误 build.gradle 中的 ndk 代码
    CrashReport.initCrashReport(getApplicationContext(), "d03e0bc48b", true);
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
