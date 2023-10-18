'use strict';

import Sequelize from 'sequelize';
import Config from '../config/config.js';
import UserModel from './Users.js';
import PlantModel from './Plants.js';
import PostModel from './Posts.js';

const env = process.env.NODE_ENV || 'development';

const config = Config[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Users = UserModel(sequelize, Sequelize);
db.Plants = PlantModel(sequelize, Sequelize);
db.Posts = PostModel(sequelize, Sequelize);

db.Users.hasMany(db.Posts, { foreignKey: 'userId' });
db.Posts.belongsTo(db.Users, { foreignKey: 'userId' });

export default db;
