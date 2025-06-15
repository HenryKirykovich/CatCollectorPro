import 'dotenv/config';

export default {
  expo: {
    name: 'catalyze',
    slug: 'catalyze',
    version: '1.0.0',
    owner: 'groo21021984',
    sdkVersion: '53.0.0',
    scheme: 'myapp', // это тоже нужно
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
        appRoot: 'app', // 👈 Указываем, что папка app — корень маршрутов
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/Cat_images/icon.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
  },
};
