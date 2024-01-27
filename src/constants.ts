export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT),
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUND: Number(process.env.SALT_ROUND),
  NODE_ENV: process.env.NODE_ENV,
  MINIO: {
    ENDPOINT: process.env.ENDPOINT,
    PORT: Number(process.env.PORT),
    ACCESS_KEY: process.env.ACCESSKEY,
    SECRET_KEY: process.env.SECRETKEY,
    BUCKET: process.env.BUCKET,
    SSL: process.env.SSL.toString() == "true",
  },
  MINIO1: {
    ENDPOINT: process.env.ENDPOINT1,
    PORT: Number(process.env.PORT1),
    ACCESS_KEY: process.env.ACCESSKEY1,
    SECRET_KEY: process.env.SECRETKEY1,
    BUCKET: process.env.BUCKET1,
    SSL: process.env.SSL1.toString() == "true",
  },
  DOCKER: {
    PG_CONTAINER_ID: process.env.PG_CONTAINER_ID,
    PG_DB: process.env.PG_DB,
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PASSWORD: process.env.PASSWORD,
  },
  MYSQL: {
    HOST: process.env.MYSQL_HOST,
    PORT: process.env.MYSQL_PORT,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    DATABASE: process.env.MYSQL_DATABASE,
  }
};
