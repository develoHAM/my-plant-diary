const Config = {
	development: {
		username: 'visitor',
		password: '1234',
		database: 'my-plant-diary',
		host: '127.0.0.1',
		dialect: 'mysql',
	},
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql',
	},
	production: {
		username: 'root',
		password: null,
		database: 'database_production',
		host: '127.0.0.1',
		dialect: 'mysql',
	},
};

export default Config;
