const {TwaManifest, TwaGenerator} = require('@bubblewrap/core');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

async function main() {
  console.log('Loading TWA manifest...');
  const manifestJson = JSON.parse(fs.readFileSync('./twa-manifest.json', 'utf8'));
  const twaManifest = new TwaManifest(manifestJson);

  console.log('Generating Android project...');
  const projectPath = './android-app';
  const generator = new TwaGenerator();
  await generator.createTwaProject(projectPath, twaManifest);

  // Copy keystore into app/ directory so signing config finds it
  const appKeystorePath = path.join(projectPath, 'app', 'android.keystore');
  if (fs.existsSync('./android.keystore')) {
    fs.copyFileSync('./android.keystore', appKeystorePath);
    console.log('Keystore copied to app/');
  }

  // Inject signing config into app/build.gradle
  const buildGradlePath = path.join(projectPath, 'app', 'build.gradle');
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
    // Insert signingConfigs after android {
    buildGradle = buildGradle.replace(
      /android\s*\{/,
      `android {${signingBlock}`
    );
    // Update release buildType to use signingConfig
    buildGradle = buildGradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{)/,
      `$1\n            signingConfig signingConfigs.release`
    );
    fs.writeFileSync(buildGradlePath, buildGradle);
    console.log('Signing config injected into build.gradle');
  }

  // Inject TWA fullscreen metadata into AndroidManifest.xml
  const manifestPath = path.join(projectPath, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');

    // Replace the LauncherActivity theme with our fullscreen theme
    manifest = manifest.replace(
      /(<activity[^>]*android:name="com\.google\.androidbrowserhelper\.trusted\.LauncherActivity")/,
      '$1\n            android:theme="@style/AppTheme.Fullscreen"'
    );

    // Insert TWA display mode metadata INSIDE the LauncherActivity, before </activity>
    manifest = manifest.replace(
      /(<activity[^>]*android:name="com\.google\.androidbrowserhelper\.trusted\.LauncherActivity"[\s\S]*?)(<intent-filter>)/,
      '$1            <meta-data android:name="trusted_web_activity_display_mode" android:value="fullscreen" />\n            $2'
    );

    fs.writeFileSync(manifestPath, manifest);
    console.log('TWA fullscreen metadata injected into AndroidManifest.xml');
  }

  // Override styles.xml to create a true fullscreen theme
  const stylesPath = path.join(projectPath, 'app', 'src', 'main', 'res', 'values', 'styles.xml');
  if (fs.existsSync(stylesPath)) {
    const fullscreenTheme = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme.Fullscreen" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    </style>
</resources>`;
    fs.writeFileSync(stylesPath, fullscreenTheme);
    console.log('Fullscreen theme written to styles.xml');
  }

  console.log('Generating Gradle wrapper...');
  execSync('gradle wrapper', {
    cwd: projectPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      ANDROID_HOME: process.env.ANDROID_HOME,
    }
  });

  console.log('Building APK...');
  execSync('gradle assembleRelease', {
    cwd: projectPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      ANDROID_HOME: process.env.ANDROID_HOME,
    }
  });

  const apkDir = path.join(projectPath, 'app', 'build', 'outputs', 'apk', 'release');
  const files = fs.readdirSync(apkDir);
  console.log('APK files found:', files.join(', '));
  // Prefer signed APK, avoid unsigned
  let apkFile = files.find(f => f.endsWith('.apk') && !f.includes('unsigned'));
  if (!apkFile) {
    apkFile = files.find(f => f.endsWith('.apk'));
  }
  if (apkFile) {
    fs.copyFileSync(
      path.join(apkDir, apkFile),
      './app-release-signed.apk'
    );
    console.log('APK built successfully: app-release-signed.apk');
  } else {
    throw new Error('No APK file found after build');
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
