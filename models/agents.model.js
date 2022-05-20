const { DataTypes } = require("sequelize"); 
 
module.exports = model; 
 
function model(sequelize) {
  const attributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false},
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(25), required: true, allowNull: false, unique: true},
    bank: { type: DataTypes.STRING(50) },
    accountNumber: { type: DataTypes.STRING(50), unique: true },
    status: { type: DataTypes.STRING(20) }, // types are active or inactive,
  
  }; 
 
  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
  
  };

  return sequelize.define("agent", attributes, options);
} 