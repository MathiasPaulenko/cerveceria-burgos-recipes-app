const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const projectPath = '.';
  const androidPath = path.join(projectPath, 'android');

  // 1. Build the web app
  console.log('Building web app...');
  execSync('npm run build', {
    cwd: projectPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      CAPACITOR_BUILD: 'true',
    },
  });

  // 1b. Inject Capacitor runtime flag into built HTML so main.tsx detects it
  const distIndexPath = path.join(projectPath, 'dist', 'index.html');
  if (fs.existsSync(distIndexPath)) {
    let html = fs.readFileSync(distIndexPath, 'utf8');
    html = html.replace(
      '</head>',
      '  <script>window.__CAPACITOR__=true</script>\n  </head>'
    );
    fs.writeFileSync(distIndexPath, html);
    console.log('Injected __CAPACITOR__ flag into dist/index.html');
  }

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

  // 6. Override styles.xml for true fullscreen (modifies AppTheme used by Capacitor's MainActivity)
  const stylesPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'styles.xml');
  if (fs.existsSync(stylesPath)) {
    const fullscreenTheme = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.NoTitleBar.Fullscreen">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>`;
    fs.writeFileSync(stylesPath, fullscreenTheme);
    console.log('Fullscreen theme written to styles.xml');
  }

  // 6b. Create splash drawable and colors
  const resPath = path.join(androidPath, 'app', 'src', 'main', 'res');

  // Create colors.xml with splash background
  const colorsPath = path.join(resPath, 'values', 'colors.xml');
  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#99120f</color>
</resources>`;
  fs.writeFileSync(colorsPath, colorsXml);
  console.log('Created colors.xml');

  const iconSrc = path.join(projectPath, 'public', 'icons', 'icon-512x512.png');

  // 6b. Remove ALL Capacitor-generated splash PNGs before creating our own resources
  const resDir = path.join(androidPath, 'app', 'src', 'main', 'res');
  const entries = fs.readdirSync(resDir);
  for (const entry of entries) {
    if (entry.startsWith('drawable')) {
      for (const file of ['splash.png', 'ic_launcher_background.png', 'ic_launcher_foreground.png']) {
        const fpath = path.join(resDir, entry, file);
        if (fs.existsSync(fpath)) {
          fs.unlinkSync(fpath);
          console.log('Removed', path.join(entry, file));
        }
      }
    }
  }

  // 6c. Create splash drawable with centered icon
  const drawablePath = path.join(resPath, 'drawable');
  if (!fs.existsSync(drawablePath)) fs.mkdirSync(drawablePath, { recursive: true });

  // Copy icon to drawable so splash can reference it reliably
  fs.copyFileSync(iconSrc, path.join(drawablePath, 'ic_launcher_icon.png'));
  console.log('Copied icon to drawable/ic_launcher_icon.png');

  const splashXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item
        android:width="180dp"
        android:height="180dp"
        android:gravity="center">
        <shape android:shape="oval">
            <solid android:color="#FBF5DD" />
            <stroke android:width="4dp" android:color="#99120f" />
        </shape>
    </item>
    <item
        android:width="120dp"
        android:height="120dp"
        android:gravity="center">
        <bitmap android:src="@drawable/ic_launcher_icon" android:gravity="center" />
    </item>
</layer-list>`;
  fs.writeFileSync(path.join(drawablePath, 'splash.xml'), splashXml);
  console.log('Created drawable/splash.xml');

  // 6d. Disable Capacitor's native SplashScreen in AndroidManifest.xml
  const manifestPath = path.join(androidPath, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    // Ensure MainActivity uses our NoActionBarLaunch theme (not Capacitor's default)
    if (!manifest.includes('AppTheme.NoActionBarLaunch')) {
      manifest = manifest.replace(
        /android:theme="@style\/AppTheme"/,
        'android:theme="@style/AppTheme.NoActionBarLaunch"'
      );
    }
    fs.writeFileSync(manifestPath, manifest);
    console.log('Ensured AppTheme.NoActionBarLaunch in AndroidManifest.xml');
  }

  // Copy icon to all mipmap densities (Android will scale as needed)
  const mipmapDirs = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  for (const dir of mipmapDirs) {
    const mipmapPath = path.join(resPath, dir);
    if (!fs.existsSync(mipmapPath)) fs.mkdirSync(mipmapPath, { recursive: true });
    fs.copyFileSync(iconSrc, path.join(mipmapPath, 'ic_launcher.png'));
    fs.copyFileSync(iconSrc, path.join(mipmapPath, 'ic_launcher_foreground.png'));
    fs.copyFileSync(iconSrc, path.join(mipmapPath, 'ic_launcher_round.png'));
  }
  console.log('Copied icon to all mipmap directories');

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
