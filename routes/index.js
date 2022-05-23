const express = require("express");
const router = express.Router();
const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })

const account = require("../controllers/accounts.controllers");
const property = require("../controllers/property.controllers");
const payment = require("../controllers/paymentPlans.controllers");
const authorize = require("../auth/authorize");
const Role = require("../helpers/roles");

const upload = multer({
  dest: "uploads/",
  storage: multer.memoryStorage(),
});

router.get("/prospect", authorize(Role.Admin), property.getProspects);
router.get("/get-propertyimage/:id/:floor",
 authorize(),
 property.getPropertyImage);
router.get("/get-reserved", authorize(), property.getReservedUnits);
router.get("/get-signature", authorize(), account.getSignature);
router.get("/get-allReserved", authorize(), property.getAllReserved);
router.get("/get-property", authorize(), property.getAllProperty);
router.get("/get-property/:id", authorize(), property.getProperty);
router.get("/get-unit/:id", authorize(), property.getUnit);
router.get("/get-payment/:id", authorize(Role.Admin), property.getPayment);
router.get("/get-payments", authorize(Role.Admin), property.getPayments);
router.get("/get-units/:id/:floor", authorize(), property.getUnitsByProp);
router.get("/get-unitsbyfloor/:id/:floor", authorize(), property.getUnitsByFloorProp);
router.get("/profileImage", authorize(), account.getProfileImage);
router.get("/agent", authorize(), property.getAgents);
router.get("/agentList", authorize(), property.getAgentsList);
router.post(
  "/agent",
  authorize(Role.Admin), 
  property.registerAgentSchema,
  property.registerAgent
);
router.put(
  "/agent",
  authorize(Role.Admin), 
  property.editAgentSchema,
  property.editAgent
);

router.post(
  "/profileImage",
  authorize(), 
  account.addProfileImageSchema,
  account.addProfileImage
);

router.post(
  "/register-admin",
  account.registerAdminSchema,
  account.registerAdmin
);

router.post(
  "/add-plan",
  authorize(Role.Admin),
  payment.addPaymentPlanSchema,
  payment.addPaymentPlan
);

router.post(
  "/rejection-letter",
  authorize(Role.Admin),
  property.rejectRequestSchema,
  property.rejectRequest
);

router.post(
  "/offer-letter",
  authorize(Role.Admin),
  property.sendOfferSchema,
  property.sendOffer
);

router.post(
  "/add-payment",
  authorize(Role.Admin),
  property.addPaymentImageSchema,
  property.addPaymentImage
);

router.post("/verify-email", account.verifyEmailSchema, account.verifyEmail);
router.post(
  "/forgot-password",
  account.forgotPasswordSchema,
  account.forgotPassword
);

router.post(
  "/reset-password",
  account.resetPasswordSchema,
  account.resetPassword
);
router.post("/authenticate", account.authenticateSchema, account.authenticate);
router.post(
  "/add-user",
  authorize(Role.Admin),
  account.addUserSchema,
  account.addUser
);
router.post(
  "/add-property",
  authorize(Role.Admin),
  property.addPropertySchema,
  property.addProperty
);
router.post(
  "/add-unit",
  authorize(Role.Admin),
  property.addUnitSchema,
  property.addUnit
);

router.post(
  "/prospect",
  authorize(Role.Admin),
  property.addProspectSchema,
  property.addProspect
);

router.post(
  "/reserve",
  authorize(),
  property.reservedUnitSchema,
  property.reservedUnit
);
router.post(
  "/invite",
  authorize(),
  account.invateToLoginSchema,
  account.invateToLogin
);

router.post(
  "/email-list",
  authorize(),
  account.addEmailListSchema,
  account.addEmailList
);
router.get("/plans", authorize(), payment.getPaymentPlan);
router.get("/", authorize(Role.Admin), account.getAllUsers);
router.get("/email-list/:group", authorize(Role.Admin), account.getEmailList);
router.delete("/email-list/:id", authorize(Role.Admin), account.deleteEmailList);
router.get("/:id", authorize(Role.Admin), account.getUserById);
router.delete("/:id", authorize(), account.delete);
router.delete("/agent/:id", authorize(Role.Admin), property.deleteAgent);
router.delete("/plan/:id", authorize(Role.Admin), payment.deletePaymentPlan);
router.delete("/unit/:id", authorize(), property.deleteUnit);
router.delete("/reserve/:id", authorize(), property.deleteReservedUnit);
router.delete("/property/:id", authorize(), property.deleteProperty);
router.delete("/prospect/:id", authorize(Role.Admin), property.deleteProspect);
router.post("/refresh-token", account.refreshToken);
router.post(
  "/revoke-token",
  authorize(),
  account.revokeTokenSchema,
  account.revokeToken
);
router.put(
  "/edit-user",
  authorize(),
  account.updateAccountSchema,
  account.updateAccount
);

router.put(
  "/edit-unit",
  authorize(),
  property.editUnitSchema,
  property.editUnit
);


router.put(
  "/edit-property",
  authorize(),
  property.editPropertySchema,
  property.editProperty
);

router.put(
  "/edit-plan",
  authorize(Role.Admin),
  payment.editPaymentPlanSchema,
  payment.editPaymentPlan
);

router.post(
  "/signature",
  authorize(),
  upload.single("image"),
  account.addSignature
);


router.post(
  "/image",
  authorize(),
  property.addPropertyImageSchema,
  property.addPropertyImage
);


module.exports = router;
