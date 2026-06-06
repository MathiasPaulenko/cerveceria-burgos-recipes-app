import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.mathiaspaulenko.cerveceriarecipes',
  appName: 'CerveceriaBurgos Recetas',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    useLegacyBridge: false,
  },
};

export default config;
