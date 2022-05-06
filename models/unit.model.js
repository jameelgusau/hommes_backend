const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,   allowNull: false,   primaryKey: true },
        name: { type: DataTypes.STRING(50), allowNull: false, },
        price: { type: DataTypes.STRING(20), allowNull: false},
        dimension: { type: DataTypes.STRING(50), allowNull: false},
        status: { type: DataTypes.STRING(100), allowNull: false},// types are available, sold, and reserved, occupied
        floorNumber: { type: DataTypes.STRING(50), allowNull: false},
        paymentType: { type: DataTypes.STRING(50), defaultValue: "One-off", allowNull: false},
        releaseDate: { type: DataTypes.DATE},
        discription: { type: DataTypes.STRING(), allowNull: false},
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('unit', attributes, options);
}