#!/usr/bin/env bash
set -euo pipefail

package=app.nexusphalanx.stage.homefinal
apk=android-stage/android/app/build/outputs/apk/debug/app-debug.apk
evidence=/tmp/phx-home-final-android
mkdir -p "$evidence"
adb install "$apk"
adb shell am start -W -n "$package/.MainActivity"
adb shell dumpsys webviewupdate > "$evidence/webview-version.txt"
adb exec-out screencap -p > "$evidence/android-launch.png"
for ((attempt=0; attempt<30; attempt++)); do
  pid="$(adb shell pidof "$package" | tr -d '\r' || true)"
  if [[ -n "$pid" ]] && adb shell cat /proc/net/unix | grep -q "webview_devtools_remote_${pid}"; then
    break
  fi
  sleep 1
done
export NODE_PATH=/tmp/phx-browser/node_modules
node android-stage/scripts/test-home-final-android.cjs
adb exec-out screencap -p > "$evidence/android-home.png"
