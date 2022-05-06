const { Op } = require('sequelize');
const db = require("../db/db");

module.exports = {
    addPaymentPlan,
    editPaymentPlan,
    getPaymentPlan,
    deletePaymentPlan
}

async function addPaymentPlan(params) {
    if (await db.PaymentPlan.findOne({ where: { name: params.name } })) {
        throw ` ${params.name} already exist`;
      }
      const plan = new db.PaymentPlan(params);
      await plan.save();
}


async function editPaymentPlan(params) {
    console.log(params);
    const plan = await db.PaymentPlan.findByPk(params.id);
    // console.log(unit)
  
    // validate (if email was changed)
    if (
      params.name &&
      plan.name !== params.name &&
      (await db.PaymentPlan.findOne({
        where: { name: params.name }
      }))
    ) {
      throw 'Plan"' + params.name + '" is already taken';
    }
  
    // copy params to account and save
    Object.assign(plan, params);
  
    await plan.save();
  
    return plan;
  }

  async function getPaymentPlan() {
    const plans = await db.PaymentPlan.findAll();
    return plans;
  }



  async function deletePaymentPlan(id) {
    const plan = await db.PaymentPlan.findByPk(id);
    await plan.destroy();
  }