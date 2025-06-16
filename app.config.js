import 'dotenv/config';

export default {
  expo: {
    name: 'Сatalyze',
    slug: 'catalyze',
    version: '1.0.0',
    owner: 'groo21021984',
    sdkVersion: '53.0.0',
    scheme: 'myapp',
    orientation: 'portrait',
    icon: './assets/images/Cat_images/icon.png',

    splash: {
      image: './assets/images/Cat_images/splash.png', // ✅ путь к PNG-файлу splash-экрана
      resizeMode: 'contain', // или 'cover'
      backgroundColor: '#ffffff', // ✅ можно заменить на любой
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/Cat_images/icon.png',
        backgroundColor: '#ffffff',
      },
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/Cat_images/icon.png',
    },

    updates: {
      url: 'https://u.expo.dev/964375c5-9b06-47da-83ef-207b6b406e36',
    },

    runtimeVersion: {
      policy: 'appVersion',
    },

    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      eas: {
        projectId: '964375c5-9b06-47da-83ef-207b6b406e36',
      },
      'expo-router': {
        appRoot: 'app', // 👈 Указываем корень маршрутов
      },
    },

    plugins: ['expo-router'],

    experiments: {
      typedRoutes: true,
    },
  },
};
