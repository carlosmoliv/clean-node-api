export default {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
}
