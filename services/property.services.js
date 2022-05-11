const db = require("../db/db");
const Role = require("../helpers/roles");
const { Op } = require("sequelize");
const cron = require("node-cron");
const sendReservationRequest = require("../middlewares/sendReservationRequest");
const sendConfirmationRequest = require("../middlewares/sendConfirmationRequest");
const sendRejectionLatter = require("../middlewares/sendRejectionLatter");
const sendOfferedLetter = require("../middlewares/sendOfferedLetter");
const sendPaymentNotification = require("../middlewares/sendPaymentNotification");
// const sendPasswordResetEmail = require("../middlewares/sendResetPassword");

module.exports = {
  addProperty,
  addUnit,
  getProperty,
  getAllProperty,
  getUnitsByProp,
  getUnit,
  addPropertyImage,
  getUnitsByFloorProp,
  deleteUnit,
  editUnit,
  editProperty,
  deleteProperty,
  getPropertyImage,
  reservedUnit,
  deleteReservedUnit,
  getReservedUnits,
  addProspect,
  getProspects,
  deleteProspect,
  getAllReserved,
  rejectRequest,
  sendOffer,
  addPaymentImage,
  getPayments,
  getPayment,
  // invateToLogin
};
// add property
async function addProperty(params) {
  console.log(params);
  // validate
  if (await db.Property.findOne({ where: { name: params.name } })) {
    throw "Property already exist";
  }
  // create account object
  const property = new db.Property(params);
  await property.save();
}

// get property
async function getProperty(id) {
  const property = await getProp(id);
  return property;
}

//add prospect
async function addProspect(params) {
  // console.log(params);
  console.log(db, "db");
  // validate
  if (await db.Prospect.findOne({ where: { email: params.email } })) {
    throw "Prospect already exist";
  }
  // create account object
  const prospect = new db.Prospect(params);
  // console.log(prospect)
  await prospect.save();
}

async function getProp(id) {
  const property = await db.Property.findByPk(id);
  if (!property) throw "Property not found";
  return property;
}

async function addPropertyImage(params) {
  const property = await db.PropertyImg.findOne({
    where: {
      propertyId: params.propertyId,
      [Op.and]: [{ floorNumber: params.floorNumber }],
    },
  });
  if (property) {
    Object.assign(property, params);
    await property.save();
    return;
  }

  const newProp = new db.PropertyImg(params);
  console.log(newProp);
  await newProp.save();
}

async function addPaymentImage(params) {
  const reserved = await db.ReservedUnit.findByPk(params.reservedUnitId);
  if (!reserved) {
    throw "Unit is not reserved";
  }
  const emails = await db.EmailList.findAll({
    where: { group: "Payment is upload" },
    attributes: { include: ["email"] },
  });
  let newArr = [];
  emails.map((e) => newArr.push(e.email));

  const unit = await db.Unit.findByPk(reserved.unitId);
  const property = await db.Property.findByPk(reserved.propertyId);
  const account = await db.Account.findByPk(reserved.accountId);
  const payment = new db.Payments(params);
  payment.status = "pending";
  payment.plan = unit.paymentType;
  payment.save();
  await sendPaymentNotification(account, unit, newArr, property);
}

async function getAllProperty() {
  const properties = await db.Property.findAll();
  if (!properties) {
    throw "No property found!";
  }
  return properties;
}

// add property
async function addUnit(params) {
  const unit = await db.Unit.findOne({
    where: {
      propertyId: params.propertyId,
      [Op.and]: [{ name: params.name }, { floorNumber: params.floorNumber }],
    },
  });

  if (unit) {
    throw "Unit already exist";
  }
  const newUnit = new db.Unit(params);
  await newUnit.save();
}

// get Units
async function getUnit(id) {
  const unit = await getUn(id);
  return unit;
}

async function getUn(id) {
  const unit = await db.Unit.findByPk(id);
  if (!unit) throw "Unit not found";
  return unit;
}

async function getUnitsByProp(id) {
  const units = await db.Property.findOne({
    where: {
      id: id,
    },
    include: [db.Unit],
  });
  return units;
}

async function getReservedUnits(id) {
  const units = await db.ReservedUnit.findAll({
    where: {
      accountId: id,
    },
    include: [
      {
        model: db.Unit,
        required: true,
      },
      {
        model: db.Property,
      },
    ],
  });
  return units;
}

async function getAllReserved() {
  const units = await db.ReservedUnit.findAll({
    include: [
      {
        model: db.Unit,
        required: true,
      },
      {
        model: db.Property,
      },
      {
        model: db.Account,
      },
      {
        model: db.PaymentPlan,
      },
    ],
  });

  return units.map((x) => basicDetails(x));
}

async function getProspects() {
  const prospects = await db.Prospect.findAll();
  return prospects;
}

async function getPayments() {
  const payments = await db.Payments.findAll({
    attributes: { exclude: ["image"] },
    include: {
      model: db.ReservedUnit,
      include: [
        {
          model: db.Account,
          attributes:{exclude: ["email", "id", "lastLogin","passwordHash", "passwordReset","phone","resetToken","resetTokenExpires", "role", "updated", "updatedBy","verificationToken", "verified", "created"] },
        },
      ],
    },
  });
  return payments.map((x) => paymentDetails(x));
}


async function getPayment(id) {
  const payment = await db.Payments.findOne({
    where: {id},
    include: {
      model: db.ReservedUnit,
      include: [
        {
          model: db.Account,
          attributes:{exclude: ["id", "lastLogin","passwordHash", "passwordReset","resetToken","resetTokenExpires", "role", "updated", "updatedBy","verificationToken", "verified", "created"] },
        },
        {
          model: db.Unit,
        },
        {
          model: db.Property,
        }
      ],
    },
  });
  return payment;
}

async function getUnitsByFloorProp(params) {
  const units = await db.Unit.findAll({
    where: {
      // id: id,
      propertyId: params.id,
      floorNumber: params.floor,
    },
    // include: [db.Unit],
  });
  return units;
}

async function deleteUnit(id) {
  const unit = await db.Unit.findByPk(id);
  await unit.destroy();
}

async function deleteProperty(id) {
  const property = await db.Property.findByPk(id);
  await property.destroy();
}

async function deleteProspect(id) {
  const property = await db.Prospect.findByPk(id);
  await property.destroy();
}

async function editUnit(params) {
  console.log(params);
  const unit = await db.Unit.findByPk(params.id);
  // console.log(unit)

  // validate (if email was changed)
  if (
    params.name &&
    unit.name !== params.name &&
    (await db.Unit.findOne({
      where: {
        propertyId: unit.propertyId,
        [Op.and]: [{ name: params.name }, { floorNumber: params.floorNumber }],
      },
    }))
  ) {
    throw 'Unit"' + params.name + '" is already taken';
  }

  // copy params to account and save
  Object.assign(unit, params);

  await unit.save();

  return unit;
}

async function editProperty(params) {
  console.log(params);
  const property = await db.Property.findByPk(params.id);
  if (!property) throw "Property not found";
  // validate (if email was changed)
  if (
    params.name &&
    property.name !== params.name &&
    (await db.Property.findOne({ where: { name: params.name } }))
  ) {
    throw "Property name already exist";
  }

  // copy params to account and save
  Object.assign(property, params);

  await property.save();

  return property;
}

async function getPropertyImage(params) {
  const image = await getPropImage(params);
  return image;
}
async function getPropImage(params) {
  const image = await db.PropertyImg.findOne({
    where: { propertyId: params.id, floorNumber: params.floor },
  });
  if (!image) throw "Property image not found";
  return image;
}

// add reserved
async function reservedUnit(params, account) {
  const unit = await db.Unit.findByPk(params.unitId);
  if (unit.status !== "Available") {
    throw "Unit is not available";
  }

  const property = await db.Property.findByPk(unit.propertyId);
  console.log(property, "Property");
  const email = await db.EmailList.findAll({
    where: { group: "Prospect is added" },
    attributes: { include: ["email"] },
  });
  // console.log(email)
  let newArr = [];
  const arr = email.map((e) => newArr.push(e.email));

  // console.log(newArr)
  const acc = await db.Account.findByPk(account.id);
  const data = {
    ...params,
    accountId: account.id,
  };
  const newUnit = new db.ReservedUnit(data);
  const date = new Date().setDate(new Date().getDate() + 7);
  newUnit.expiringDate = date;
  newUnit.reservationDate = new Date();
  unit.status = "Reserved";
  unit.releaseDate = date;
  newUnit.status = "Reserved";
  await unit.save();
  await newUnit.save();
  await sendReservationRequest(acc, unit, newArr, property);
  await sendConfirmationRequest(acc, unit, newArr, property);
}

async function deleteReservedUnit(id) {
  const reserved = await db.ReservedUnit.findByPk(id);
  await reserved.destroy();
}

async function rejectRequest(id) {
  const reservation = await db.ReservedUnit.findByPk(id);

  if (!reservation) {
    throw "Reservation not found";
  }
  const unit = await db.Unit.findByPk(reservation.unitId);
  const account = await db.Account.findByPk(reservation.accountId);
  const property = await db.Property.findByPk(reservation.propertyId);
  unit.status = "Available";
  reservation.status = "Rejected";
  unit.save();
  reservation.save();
  await sendRejectionLatter(account, unit, property.name);
}

async function sendOffer(id) {
  const reservation = await db.ReservedUnit.findByPk(id);

  if (!reservation) {
    throw "Reservation not found";
  }
  const unit = await db.Unit.findByPk(reservation.unitId);
  const account = await db.Account.findByPk(reservation.accountId);
  const property = await db.Property.findByPk(reservation.propertyId);
  reservation.status = "Offered";
  unit.save();
  reservation.save();
  await sendOfferedLetter(account, unit, property.name);
}

cron.schedule("0 1 * * * *", async () => {
  console.log(
    `running a task every minute at the 1am second ${new Date().setDate(
      new Date().getDate() + 7
    )}`
  );
  const properties = await db.ReservedUnit.findAll({
    where: { status: "Reserved" },
  });
  properties &&
    properties.map(async (e) => {
      const expiringDate = e.expiringDate.toISOString().split("T")[0];
      const todayDate = new Date();
      const xDate = new Date(expiringDate);
      if (todayDate >= xDate) {
        const unit = await db.Unit.findByPk(e.unitId);
        unit.status = "Available";
        e.status = "Expired";
        unit.save();
        e.save();
      }
    });
});


function basicDetails(x) {
  const {
    id, account, property, unit
  } = x;
  return {
    id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    property: property.name,
    floor: unit.floorNumber,
    status: unit.status,
    dimention: unit.dimension,
    price: unit.price,
    unit: unit.name,
    unitId: unit.id,
    paymentType: unit.paymentType,
  };
}

function paymentDetails(x) {
  const {
    id, reservedUnit: { account }, date, unit, amount, status, 
  } = x;
  return {
    id,
    name: account.name,
    date,
    unit,
    amount,
    status
    // phone: account.phone,
    // property: property.name,
    // floor: unit.floorNumber,
    // status: unit.status,
    // dimention: unit.dimension,
    // price: unit.price,
    // unit: unit.name,
    // unitId: unit.id,
    // paymentType: unit.paymentType,
  };
}