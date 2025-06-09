import 'dotenv/config';

export default {
  expo: {
    name: 'cat-collection-app',
    slug: 'cat-collection-app',
    version: '1.0.0',
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
};
