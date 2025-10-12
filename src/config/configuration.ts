export default () => ({
  port: parseInt(process.env.PORT as string),
  secret: process.env.SECRET as string,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT as string),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dbName: process.env.DB_NAME,
});
