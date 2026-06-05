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
  const apkFile = files.find(f => f.endsWith('.apk'));
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
