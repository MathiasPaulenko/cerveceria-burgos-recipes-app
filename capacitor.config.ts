import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.mathiaspaulenko.cerveceriarecipes',
  appName: 'CerveceriaBurgos Recetas',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#99120f',
    allowMixedContent: false,
    captureInput: true,
    useLegacyBridge: false,
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#99120f',
    },
  },
};

export default config;
