const config = require("config.json");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  const { host, port, user, password, database } = config.database;
  let sequelize 
  if (process.env.NODE_ENV === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL,  {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
      }})
  }else{
   sequelize = new Sequelize(database, user, password, {
    host: "localhost",
    dialect: "postgres",
    port,
  });
  }
  // init models and add them to the exported db object
  db.Account = require("../models/accounts.model")(sequelize);
  db.RefreshToken = require("../models/refresh-token.model")(sequelize);
  db.Signature = require("../models/signature.model")(sequelize);
  db.Property = require("../models/property.model")(sequelize);
  db.PropertyImg = require("../models/propertyImg.model")(sequelize);
  db.Unit = require("../models/unit.model")(sequelize);
  db.ReservedUnit = require("../models/ReservedUnit.model")(sequelize);
  db.PaymentPlan = require("../models/paymentPlans.model")(sequelize);
  db.Prospect = require("../models/prospects.model")(sequelize);
  db.EmailList = require("../models/emailList.model")(sequelize);
  db.Payments = require("../models/payments.model")(sequelize);
  db.ProfileImage = require("../models/profileImage.model")(sequelize);
  db.Agent = require("../models/agents.model")(sequelize);

    // define relationships
  db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
  db.RefreshToken.belongsTo(db.Account);

  db.Account.hasMany(db.ProfileImage, { onDelete: "CASCADE" });
  db.ProfileImage.belongsTo(db.Account);

  db.Account.hasMany(db.Signature, { onDelete: "CASCADE" });
  db.Signature.belongsTo(db.Account);

  db.Property.hasMany(db.Unit, { onDelete: "CASCADE" });
  db.Unit.belongsTo(db.Property);

  db.Property.hasMany(db.PropertyImg, { onDelete: "CASCADE" });
  db.PropertyImg.belongsTo(db.Property);

  db.Account.hasMany(db.ReservedUnit, { onDelete: "CASCADE" });
  db.ReservedUnit.belongsTo(db.Account);

  db.Unit.hasMany(db.ReservedUnit, { onDelete: "CASCADE" });
  db.ReservedUnit.belongsTo(db.Unit);

  db.Property.hasMany(db.ReservedUnit, { onDelete: "CASCADE" });
  db.ReservedUnit.belongsTo(db.Property);

  db.PaymentPlan.hasMany(db.ReservedUnit, { onDelete: "CASCADE" });
  db.ReservedUnit.belongsTo(db.PaymentPlan);

  db.Account.hasMany(db.Prospect, { onDelete: "CASCADE" });
  db.Prospect.belongsTo(db.Account);

  db.Account.hasMany(db.EmailList, { onDelete: "CASCADE" });
  db.EmailList.belongsTo(db.Account);

  db.ReservedUnit.hasMany(db.Payments, { onDelete: "CASCADE"});
  db.Payments.belongsTo(db.ReservedUnit)

  db.Agent.hasMany(db.ReservedUnit, { onDelete: "CASCADE" });
  db.ReservedUnit.belongsTo(db.Agent);
  
  await sequelize.sync();
}
