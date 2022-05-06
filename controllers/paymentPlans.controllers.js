const Joi = require("joi");
const Role = require("../helpers/roles")
const validateRequest = require("../middlewares/validate-request");
const validateFiles = require("../middlewares/validate-files");
const services = require("../services/paymentPlans.services");


module.exports = {
    addPaymentPlanSchema,
    addPaymentPlan,
    editPaymentPlan,
    editPaymentPlanSchema,
    getPaymentPlan,
    deletePaymentPlan

}

function addPaymentPlanSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        months: Joi.string().required(),
        initialDeposite: Joi.string().required(),
        monthlyDeposite: Joi.string().required(),
        total: Joi.string().required(),
    })
    validateRequest(req, next, schema);
}


function addPaymentPlan(req, res, next) {
  
 services.addPaymentPlan(req.body)
 .then(() =>
 res.json({
   meta:{
     status: 200,
     message:  `You successfully added new plan`
   },
   data: {}
 })
).catch(next);
}


function editPaymentPlanSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().empty(''),
        name: Joi.string().required(),
        months: Joi.string().required(),
        initialDeposite: Joi.string().required(),
        monthlyDeposite: Joi.string().required(),
        total: Joi.string().required(),
    })
    validateRequest(req, next, schema);
}


function editPaymentPlan(req, res, next) {
  
 services.editPaymentPlan(req.body)
 .then(() =>
 res.json({
   meta:{
     status: 200,
     message:  `You successfully updated plan`
   },
   data: {}
 })
).catch(next);
}

function getPaymentPlan(req, res, next) {
    console.log(req,"req")
    services.getPaymentPlan()
 
       .then(plans => res.json({
         meta:{
           status: 200,
           message: ""
         },
         data: plans
       }))
       .catch(next);
 }


 function deletePaymentPlan(req, res, next) {
    services
    .deletePaymentPlan(req.params.id)
    .then(() => res.json({
      meta:{
        status: 200,
        message: "Plan deleted successfully"
      },
      data: {

      }
    }))
    .catch(next);
  }