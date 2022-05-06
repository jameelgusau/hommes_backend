const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    plan: { type: DataTypes.STRING(100), allowNull: false },
    amount: { type: DataTypes.STRING(100), allowNull: false },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    image: { type: DataTypes.STRING(10485760), allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false }, // types are pending and confirmed,
  };

  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
  };

  return sequelize.define("payments", attributes, options);
}
