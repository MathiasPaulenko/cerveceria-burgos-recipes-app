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

  // Copy keystore into project so signing config finds it
  if (fs.existsSync('./android.keystore')) {
    fs.copyFileSync('./android.keystore', path.join(projectPath, 'android.keystore'));
    console.log('Keystore copied to project');
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
