export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT),
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUND: Number(process.env.SALT_ROUND),
  NODE_ENV: process.env.NODE_ENV,
  AWS: {
    BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    REGION: process.env.AWS_REGION,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
  }
};
