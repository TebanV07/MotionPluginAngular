import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'AR Orientation',
  webDir: 'dist',
  plugins: {
    Motion: {}
  }
};

export default config;