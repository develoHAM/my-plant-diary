const PlantModel = (sequelize, Sequelize) => {
	return sequelize.define(
		'plant',
		{
			id: {
				type: Sequelize.DataTypes.INTEGER(),
				allowNull: false,
				primaryKey: true,
			},
			name_ko: {
				type: Sequelize.DataTypes.STRING(40),
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
};

export default PlantModel;
