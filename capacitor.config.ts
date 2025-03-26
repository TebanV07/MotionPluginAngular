import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'AR Orientation',
  webDir: 'dist/angular-motion/browser',
  android: {
    buildOptions: {
      keystorePath: '',
      keystoreAlias: ''
    }
  },
  ios: {
    scheme: 'App'
  },
  plugins: {
    // Configuración de plugins si los necesitas
  }
};

export default config;