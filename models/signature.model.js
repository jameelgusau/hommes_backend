const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4,   allowNull: false,   primaryKey: true },
        // imageType: DataTypes.STRING,
        // imageName: DataTypes.STRING,
        // imageData: DataTypes.BLOB('long') 
        fileName: DataTypes.ARRAY( DataTypes.STRING)
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };
    return sequelize.define('signature', attributes, options);
}