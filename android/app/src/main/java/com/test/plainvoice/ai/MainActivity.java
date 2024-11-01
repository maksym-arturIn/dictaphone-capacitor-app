package com.test.plainvoice.ai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
  }

  @Override
  public void onDestroy() {
      // Use the bridge to trigger a JavaScript event when onDestroy is called
      if (getBridge() != null) {
          getBridge().triggerWindowJSEvent("appOnDestroy");
      }

      super.onDestroy();
  }
}