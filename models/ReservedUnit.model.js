const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,   allowNull: false,   primaryKey: true },
        reservationDate: { type: DataTypes.DATE, allowNull: false},
        expiringDate: { type: DataTypes.DATE, allowNull: false},
        status: { type: DataTypes.STRING(20), allowNull: false},// types are reserved, expired, and rrejected, approved
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('reservedUnit', attributes, options);
}