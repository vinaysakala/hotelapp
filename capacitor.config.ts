import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vinay.hotelapp',
  appName: 'hotelapp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Show for 2 seconds
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
