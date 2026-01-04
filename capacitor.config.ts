import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vinay.hotelapp',
  appName: 'RMS',
  webDir: 'www', // Ensure your build folder is actually named 'www'
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // STOP automatic hiding
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};
export default config;
