import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

const UserModel = (sequelize, Sequelize) => {
	return sequelize.define('user', {
		id: {
			type: Sequelize.DataTypes.INTEGER(),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userid: {
			type: Sequelize.DataTypes.STRING(20),
			allowNull: false,
		},
		password: {
			type: Sequelize.DataTypes.STRING(500),
			allowNull: false,
		},
		name: {
			type: Sequelize.DataTypes.STRING(10),
			allowNull: false,
		},
		email: {
			type: Sequelize.DataTypes.STRING(),
			allowNull: false,
		},
		profile_pic: {
			type: Sequelize.DataTypes.STRING(),
			defaultValue: env.DEFAULT_PROFILE_IMG_SRC,
		},
	});
};

export default UserModel;
