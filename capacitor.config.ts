
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.89fa53da99894011886dcb1d6aaeaa76',
  appName: 'face-attend-field',
  webDir: 'dist',
  server: {
    url: "https://89fa53da-9989-4011-886d-cb1d6aaeaa76.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#1a73e8"
    }
  }
};

export default config;
