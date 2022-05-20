const Joi = require("joi");
const Role = require("../helpers/roles");
const validateRequest = require("../middlewares/validate-request");
const validateFiles = require("../middlewares/validate-files");
const services = require("../services/property.services");

module.exports = {
  addPropertySchema,
  addProperty,
  getProperty,
  registerAgentSchema,
  registerAgent,
  getAllProperty,
  addUnitSchema,
  getUnitsByProp,
  addUnit,
  getAgents,
  getAgentsList,
  getUnit,
  addPropertyImageSchema,
  addPropertyImage,
  getUnitsByFloorProp,
  deleteUnit,
  editUnitSchema,
  editUnit,
  deleteAgent,
  editPropertySchema,
  editAgentSchema,
  editProperty,
  deleteProperty,
  getPropertyImage,
  editAgent,
  reservedUnitSchema,
  reservedUnit,
  deleteReservedUnit,
  getReservedUnits,
  addProspectSchema,
  addProspect,
  getProspects,
  deleteProspect,
  getAllReserved,
  sendOfferSchema,
  sendOffer,
  rejectRequestSchema,
  rejectRequest,
  addPaymentImageSchema,
  addPaymentImage,
  getPayments,
  getPayment,
};

function addPropertySchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(150).required(),
    address: Joi.string().max(250).required(),
    status: Joi.string().valid("Completed", "Under Construction").required(),
    completion_date: Joi.date().required(),
    num_of_units: Joi.number().required(),
    num_of_floors: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function addProperty(req, res, next) {
  const { body } = req;
  services
    .addProperty(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function registerAgentSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required().max(100),
    phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required().max(25),
    email: Joi.string().email().required().max(50),
    bank: Joi.string().max(50),
    accountNumber: Joi.string().max(50),
    status: Joi.string().max(20),
  });
  validateRequest(req, next, schema);
}

function registerAgent(req, res, next) {
  console.log(req.body, "req");
  services
    .registerAgent(req.body)
    .then(() =>
      res.json({
        meta:{
          status: 200,
          message: "Registration successful"
        },
        data: {}
      })
    )
    .catch(next);
}

function addProspectSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(150).required(),
    phone: Joi.string()
      .regex(
        /^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/
      )
      .messages({
        "string.pattern.base": `Phone number must have at least 10 digits.`,
      })
      .required(),
    email: Joi.string().email().required(),
    // canLogin: Joi.boolean().required()
  });
  validateRequest(req, next, schema);
}

function addProspect(req, res, next) {
  const { body } = req;
  services
    .addProspect(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function sendOfferSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function sendOffer(req, res, next) {
  const { body } = req;
  services
    .sendOffer(body.id,  req.get("origin"))
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `Offer Letter have been sent to the Applicant`,
        },
        data: {},
      })
    )
    .catch(next);
}

function rejectRequestSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function rejectRequest(req, res, next) {
  const { body } = req;
  services
    .rejectRequest(body.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `Applicant request have been rejected`,
        },
        data: {},
      })
    )
    .catch(next);
}

function getProspects(req, res, next) {
  services
    .getProspects()

    .then((accounts) =>
      res.json({
        meta: {
          status: 200,
          message: "",
        },
        data: accounts,
      })
    )
    .catch(next);
}

function getProperty(req, res, next) {
  services
    .getProperty(req.params.id)
    .then((property) =>
      property
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: property,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getAllProperty(req, res, next) {
  services
    .getAllProperty()
    .then((property) =>
      property
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: property,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function addUnitSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    propertyId: Joi.string().max(150).required(),
    dimension: Joi.string().max(150).required(),
    price: Joi.string().max(20).required(),
    status: Joi.string()
      .valid("Available", "Sold", "Reserved", "Occupied")
      .required(),
    floorNumber: Joi.string().max(50).required(),
    paymentType: Joi.string().valid("One-off", "Installment").max(50),
    discription: Joi.string().required(),
    releaseDate: Joi.date(),
  });
  validateRequest(req, next, schema);
}

function addUnit(req, res, next) {
  // console.log(req.body, "req");
  const { body } = req;
  services
    .addUnit(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function editUnitSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.string().empty(""),
    name: Joi.string().max(50).required(),
    dimension: Joi.string().max(150).required(),
    price: Joi.string().max(20).required(),
    status: Joi.string()
      .valid("Available", "Sold", "Reserved", "Occupied")
      .required(),
    floorNumber: Joi.string().max(50).required(),
    paymentType: Joi.string().valid("One-off", "Installment").max(50),
    discription: Joi.string().required(),
    releaseDate: Joi.date(),
  });
  validateRequest(req, next, schema);
}

function editUnit(req, res, next) {
  // console.log(req.body, "req");
  const { body } = req;
  services
    .editUnit(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function editPropertySchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.string().empty(""),
    name: Joi.string().max(150).required(),
    address: Joi.string().max(250).required(),
    status: Joi.string().valid("Completed", "Under Construction").required(),
    completion_date: Joi.date().required(),
    num_of_units: Joi.number().required(),
    num_of_floors: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function editProperty(req, res, next) {
  console.log(req.body, "req");
  const { body } = req;
  services
    .editProperty(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function editAgentSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.string().empty(""),
    name: Joi.string().max(150).required(),
    phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required().max(25),
    email: Joi.string().email().required().max(50),
    bank: Joi.string().max(50),
    accountNumber: Joi.string().max(50),
    status: Joi.string().max(20),
  });
  validateRequest(req, next, schema);
}

function editAgent(req, res, next) {
  const { body } = req;
  services
    .editAgent(body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `${body.name} successfully added`,
        },
        data: {},
      })
    )
    .catch(next);
}

function addPropertyImageSchema(req, res, next) {
  const schema = Joi.object({
    image: Joi.string().required(),
    propertyId: Joi.string().required(),
  });
  validateFiles(req, next, schema);
}
async function addPropertyImage(req, res, next) {
  services
    .addPropertyImage(req.body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Image successfully added!",
        },
        data: {},
      })
    )
    .catch(next);
}

function addPaymentImageSchema(req, res, next) {
  const schema = Joi.object({
    image: Joi.string().required(),
    reservedUnitId: Joi.string().required(),
    amount: Joi.string().max(20).required(),
  });
  validateFiles(req, next, schema);
}
async function addPaymentImage(req, res, next) {
  services
    .addPaymentImage(req.body)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Image successfully added!",
        },
        data: {},
      })
    )
    .catch(next);
}

function getUnit(req, res, next) {
  // users can get their own account and admins can get any account
  // console.log(req.params.id)
  services
    .getUnit(req.params.id)
    .then((unit) =>
      unit
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: unit,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getUnitsByProp(req, res, next) {
  // users can get their own account and admins can get any account
  // console.log(req.params)
  services
    .getUnitsByProp(req.params.id)
    .then((units) =>
      units
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: units,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getReservedUnits(req, res, next) {
  services
    .getReservedUnits(req.user.id)
    .then((units) =>
      units
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: units,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getAllReserved(req, res, next) {
  services
    .getAllReserved()
    .then((units) =>
      units
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: units,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getAgents(req, res, next) {
  services
    .getAgents()
    .then((units) =>
      units
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: units,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}


function getAgentsList(req, res, next) {
  services
    .getAgentsList()
    .then((list) =>
      list
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: list,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getPayments(req, res, next) {
  services
    .getPayments()
    .then((payments) =>
      payments
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: payments,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getPayment(req, res, next) {
  services
    .getPayment(req.params.id)
    .then((payment) =>
      payment
        ? res.json({
            meta: {
              status: 200,
              message: "",
            },
            data: payment,
          })
        : res.sendStatus(404)
    )
    .catch(next);
}

function getUnitsByFloorProp(req, res, next) {
  services
    .getUnitsByFloorProp(req.params)
    .then((units) =>
      res.json({
        meta: {
          status: 200,
          message: "",
        },
        data: units,
      })
    )
    .catch(next);
}

function deleteUnit(req, res, next) {
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({
      meta: {
        status: 401,
        message: "Unauthorized",
      },
      data: {},
    });
  }
  services
    .deleteUnit(req.params.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Unit deleted successfully",
        },
        data: {},
      })
    )
    .catch(next);
}

function deleteProperty(req, res, next) {
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({
      meta: {
        status: 401,
        message: "Unauthorized",
      },
      data: {},
    });
  }
  services
    .deleteProperty(req.params.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Unit deleted successfully",
        },
        data: {},
      })
    )
    .catch(next);
}

function deleteProspect(req, res, next) {
  services
    .deleteProspect(req.params.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Unit deleted successfully",
        },
        data: {},
      })
    )
    .catch(next);
}

function deleteAgent(req, res, next) {
  services
    .deleteAgent(req.params.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Agent deleted successfully",
        },
        data: {},
      })
    )
    .catch(next);
}

function getPropertyImage(req, res, next) {
  // users can get their own account and admins can get any account
  // const { id } =
  services
    .getPropertyImage(req.params)
    .then((account) =>
      res.json({
        meta: {
          status: 200,
          message: "",
        },
        data: account,
      })
    )
    .catch(next);
}

function reservedUnitSchema(req, res, next) {
  const schema = Joi.object({
    unitId: Joi.string().empty(""),
    propertyId: Joi.string().empty(""),
    paymentPlanId: Joi.string().empty(""),
    agent: Joi.string().empty("")
  });
  validateRequest(req, next, schema);
}

function reservedUnit(req, res, next) {
  const { body } = req;
  console.log(req.get("origin"), "req.get('origin')")
  services
    .reservedUnit(body, req.user, req.get("origin"))
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: `Unit successfully reserved`,
        },
        data: {},
      })
    )
    .catch(next);
}

function deleteReservedUnit(req, res, next) {
  services
    .deleteReservedUnit(req.params.id)
    .then(() =>
      res.json({
        meta: {
          status: 200,
          message: "Deleted successfully",
        },
        data: {},
      })
    )
    .catch(next);
}
