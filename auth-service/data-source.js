const { DataSource } = require('typeorm');
const path = require('path');
const User = require(path.resolve(__dirname, 'src/entities/user.entity.js'));

module.exports = new DataSource({
	type: 'postgres',
	host: process.env.HOST,
	port: +process.env.PORT,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
  entities: [User],
  migrations: [path.resolve(__dirname, 'src/migrations/*.ts')],
	synchronize: true,
});



