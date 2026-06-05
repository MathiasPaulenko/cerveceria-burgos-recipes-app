const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const projectPath = '.';
  const androidPath = path.join(projectPath, 'android');

  // 1. Build the web app
  console.log('Building web app...');
  execSync('npm run build', { cwd: projectPath, stdio: 'inherit' });

  // 2. Add Android platform if not exists
  if (!fs.existsSync(androidPath)) {
    console.log('Adding Android platform...');
    execSync('npx cap add android', { cwd: projectPath, stdio: 'inherit' });
  }

  // 3. Sync Capacitor
  console.log('Syncing Capacitor...');
  execSync('npx cap sync android', { cwd: projectPath, stdio: 'inherit' });

  // 4. Copy keystore into android/app/ directory
  const appKeystorePath = path.join(androidPath, 'app', 'android.keystore');
  if (fs.existsSync('./android.keystore')) {
    fs.copyFileSync('./android.keystore', appKeystorePath);
    console.log('Keystore copied to android/app/');
  }

  // 5. Inject signing config into android/app/build.gradle
  const buildGradlePath = path.join(androidPath, 'app', 'build.gradle');
  if (fs.existsSync(buildGradlePath)) {
    let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

    // Add signingConfigs block after android { opening
    const signingBlock = `
    signingConfigs {
        release {
            storeFile file('android.keystore')
            storePassword 'android'
            keyAlias 'android'
            keyPassword 'android'
        }
    }`;
    buildGradle = buildGradle.replace(
      /android\s*\{/,
      `android {${signingBlock}`
    );
    buildGradle = buildGradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{)/,
      `$1\n            signingConfig signingConfigs.release`
    );
    fs.writeFileSync(buildGradlePath, buildGradle);
    console.log('Signing config injected into build.gradle');
  }

  // 6. Inject fullscreen into AndroidManifest.xml
  const manifestPath = path.join(androidPath, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');

    // Apply fullscreen theme to MainActivity (matches any package name)
    manifest = manifest.replace(
      /(<activity[^>]*android:name="[^"]*\.MainActivity")/,
      '$1\n            android:theme="@android:style/Theme.NoTitleBar.Fullscreen"\n            android:configChanges="orientation|screenSize|smallestScreenSize|keyboardHidden"\n            android:windowSoftInputMode="adjustResize"'
    );

    fs.writeFileSync(manifestPath, manifest);
    console.log('Fullscreen theme injected into AndroidManifest.xml');
  }

  // 7. Override styles.xml for true fullscreen
  const stylesPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'styles.xml');
  if (fs.existsSync(stylesPath)) {
    const fullscreenTheme = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme.NoActionBarLaunch" parent="android:Theme.NoTitleBar.Fullscreen">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>`;
    fs.writeFileSync(stylesPath, fullscreenTheme);
    console.log('Fullscreen theme written to styles.xml');
  }

  // 8. Build APK
  console.log('Building APK...');
  const gradlewPath = path.join(androidPath, 'gradlew');
  if (fs.existsSync(gradlewPath)) {
    try {
      fs.chmodSync(gradlewPath, 0o755);
      console.log('Made gradlew executable');
    } catch (e) {
      console.log('Could not chmod gradlew, trying anyway...');
    }
    execSync('./gradlew assembleRelease', {
      cwd: androidPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        ANDROID_HOME: process.env.ANDROID_HOME,
      }
    });
  } else {
    console.log('gradlew not found, using gradle directly...');
    execSync('gradle assembleRelease', {
      cwd: androidPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        ANDROID_HOME: process.env.ANDROID_HOME,
      }
    });
  }

  // 9. Copy APK to root
  const apkDir = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'release');
  const files = fs.readdirSync(apkDir);
  console.log('APK files found:', files.join(', '));
  let apkFile = files.find(f => f.endsWith('.apk') && !f.includes('unsigned'));
  if (!apkFile) {
    apkFile = files.find(f => f.endsWith('.apk'));
  }
  if (apkFile) {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const outName = `cerveceria-burgos-recipes-v${pkg.version}.apk`;
    fs.copyFileSync(
      path.join(apkDir, apkFile),
      `./${outName}`
    );
    console.log('APK built successfully:', outName);
  } else {
    throw new Error('No APK file found after build');
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
