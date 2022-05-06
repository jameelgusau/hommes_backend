const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,   allowNull: false,   primaryKey: true },
        name: { type: DataTypes.STRING(50), allowNull: false, },
        months: { type: DataTypes.STRING(5), allowNull: false},
        initialDeposite: { type: DataTypes.STRING(50), allowNull: false},
        monthlyDeposite: { type: DataTypes.STRING(50), allowNull: false},
        total: { type: DataTypes.STRING(50), allowNull: false},

    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('paymentPlan', attributes, options);
}