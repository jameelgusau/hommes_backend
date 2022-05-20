const { DataTypes } = require("sequelize"); 
 
module.exports = model; 
 
function model(sequelize) {
  const attributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false},
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    phone: {type: DataTypes.STRING(25), required: true, allowNull: false, unique: true},
    passwordHash: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.STRING(20), allowNull: false },
    address: { type: DataTypes.STRING(250), allowNull: false},
    verificationToken: { type: DataTypes.STRING(100) },
    verified: { type: DataTypes.DATE },
    resetToken: { type: DataTypes.STRING(100) },
    resetTokenExpires: { type: DataTypes.DATE },
    passwordReset: { type: DataTypes.DATE },
    lastLogin: { type: DataTypes.DATE },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated: { type: DataTypes.DATE },
    updatedBy: { type: DataTypes.STRING(100) },
    isVerified: { type: DataTypes.VIRTUAL,
      get() {
        return !!(this.verified || this.passwordReset);
      },
    },
  }; 
 
  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };

  return sequelize.define("account", attributes, options);
} 