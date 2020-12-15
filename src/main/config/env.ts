export default {
	mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
	port: process.env.port || 5000,
	jwtSecret: process.env.JWT_SECRET || 'mysupersecretkey'
}
