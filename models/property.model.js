const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,   allowNull: false,   primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false,  unique: true },
        address: { type: DataTypes.STRING(250), allowNull: false},
        status: { type: DataTypes.STRING(100), allowNull: false},
        completion_date: { type: DataTypes.DATE, allowNull: false},
        num_of_units: { type: DataTypes.STRING(50), allowNull: false},
        num_of_floors:  { type: DataTypes.STRING(50), allowNull: false}, 
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('property', attributes, options);
}