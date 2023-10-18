const Config = {
	development: {
		username: 'admin',
		password: '12341234',
		database: 'my-plant-diary',
		host: 'my-plant-diary.crlsht4xwcw6.ap-northeast-2.rds.amazonaws.com',
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
