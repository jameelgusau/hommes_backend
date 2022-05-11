const hash = require("../middlewares/hash");
const db = require("../db/db");
const Role = require("../helpers/roles");
const { Op } = require("sequelize");
const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const randomTokenString = require("../middlewares/randomTokenString");
const sendVerificationEmail = require("../middlewares/sendVerificationEmail");
const sendPasswordResetEmail = require("../middlewares/sendResetPassword");
module.exports = {
  registerAdmin,
  authenticate,
  verifyEmail,
  forgotPassword,
  resetPassword,
  addUser,
  addSignature,
  getSignature,
  delete: _delete,
  getUserById,
  getAllUsers,
  refreshToken,
  revokeToken,
  updateAccount,
  invateToLogin,
  addEmailList,
  deleteEmailList,
  getEmailList,
  addProfileImage,
  getProfileImage
};

async function registerAdmin(params, origin) {
  // validate
  if (await db.Account.findOne({ where: { email: params.email } })) {
    throw "Email already exist";
  }
  if (await db.Account.findOne({ where: { phone: params.phone } })) {
    throw "Phone number already exist";
  }
  // create account object
  const account = new db.Account(params);

  // first registered account is an admin
  const isFirstAccount = (await db.Account.count()) === 0;
  account.role = isFirstAccount ? Role.Admin : Role.Prospect;

  account.verificationToken = randomTokenString();

  // hash password
  account.passwordHash = await hash(params.password);

  await account.save();
  // send email
  await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }) {
  const account = await db.Account.findOne({
    where: { verificationToken: token },
  });

  if (!account) throw "Verification failed";

  account.verified = Date.now();
  account.verificationToken = null;
  await account.save();
}

async function forgotPassword({ email }, origin) {
  const account = await db.Account.findOne({ where: { email } });

  // always return ok response to prevent email enumeration
  if (!account) throw "Email is not registered";

  // create reset token that expires after 24 hours
  account.resetToken = randomTokenString();
  account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await account.save();

  // send email
  await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!account) throw "Invalid token";

  return account;
}

async function resetPassword({ token, password }) {
  const account = await validateResetToken({ token });

  // update password and remove reset token
  account.passwordHash = await hash(password);
  account.passwordReset = Date.now();
  account.resetToken = null;
  await account.save();
}

async function authenticate({ email, password, ipAddress }) {
  const account = await db.Account.scope("withHash").findOne({
    where: { email },
  });

  if (
    !account ||
    !account.isVerified ||
    !(await bcrypt.compare(password, account.passwordHash))
  ) {
    throw "Email or password is incorrect";
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);

  // save log time

  account.lastLogin = Date.now();
  await account.save();
  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

async function updateAccount(params, id) {
  console.log(params);
  const account = await getAccount(params.id);

  // validate (if email was changed)
  if (
    params.email &&
    account.email !== params.email &&
    (await db.Account.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  account.updatedBy = id;
  await account.save();

  return basicDetails(account);
}

async function addEmailList(params) {
  
  if (await db.EmailList.findOne({ where: {[Op.and]:[{ accountId: params.accountId}, {group: params.group}] }})) {
    throw "Account already exist";
  }
  const newEmail = await db.Account.findByPk(params.accountId);

  const email = new db.EmailList(params);
  email.email = newEmail.email
  await email.save()
}

async function addSignature(params, id) {
  console.log(params, id);
  const account = new db.Signature({
    imageType: params.mimetype,
    imageName: params.originalname,
    imageData: params.buffer,
    accountId: id,
  });
  console.log(account);
  await account.save();
}

async function getSignature(id) {
  const account = await getSign(id);
  return account;
}

async function addUser(params, origin) {
  // validate
  if (await db.Account.findOne({ where: { email: params.email } })) {
    throw "Email already exist";
  }
  if (await db.Account.findOne({ where: { phone: params.phone } })) {
    throw "Phone number already exist";
  }
  // create account object
  const account = new db.Account(params);

  account.resetToken = randomTokenString();
  account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // hash password
  account.passwordHash = await hash(params.name);

  await account.save();
  // send email
  await sendPasswordResetEmail(account, origin);
}

async function invateToLogin(params, origin) {
  // validate
  if (await db.Account.findOne({ where: { email: params.email } })) {
    throw "Email already exist";
  }
  if (await db.Account.findOne({ where: { phone: params.phone } })) {
    throw "Phone number already exist";
  }

  // create account object
  const account = new db.Account(params);

  account.resetToken = randomTokenString();
  account.role = Role.Prospect;
  account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // hash password
  account.passwordHash = await hash(params.name);

  await account.save();
  // send email
  await sendPasswordResetEmail(account, origin);
}

async function getUserById(id) {
  const account = await getAccount(id);
  return basicDetails(account);
}

async function _delete(id) {
  const account = await getAccount(id);
  await account.destroy();
}




async function addProfileImage({image}, id) {
  const account = await db.ProfileImage.findOne({ where: { accountId: id } });
  const params = {
    accountId: id,
    image
  }
  if (account) {

    Object.assign(account, params);
    await account.save();
    return;
  }
  // console.log("image", image)
  const newAcc = new db.ProfileImage(params)
  await newAcc.save();
}

async function getProfileImage(id) {
  const image = await db.ProfileImage.findOne({
    where: { accountId: id },
  });
  if (!image) throw "Image not found";
  return image;
}



async function deleteEmailList(id) {
  const account = await db.EmailList.findByPk(id);
  await account.destroy();
}


async function getAllUsers() {
  console.log(db, 'db')
  const accounts = await db.Account.findAll({
    where: {
      role: {
        [Op.ne]: "Prospect",
      },
    },
  });
  return accounts.map((x) => basicDetails(x));
}

async function getAccount(id) {
  const account = await db.Account.findByPk(id);
  if (!account) throw "Account not found";
  return account;
}

async function getSign(id) {
  const account = await db.Signature.findOne({ where: { accountId: id } });
  if (!account) throw "Signature not found";
  return account;
}


async function getEmailList(group) {
  const account = await db.EmailList.findAll({ where: { group: group } , include:[{ model: db.Account, required: true}]});
  if (!account) throw "Empty Users";
  return account;
}


async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const account = await refreshToken.getAccount();

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

function generateJwtToken(account) {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({ sub: account.id, id: account.id }, config.secret, {
    expiresIn: "150m",
  });
}

function generateRefreshToken(account, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    accountId: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

function basicDetails(account) {
  const {
    id,
    name,
    phone,
    email,
    role,
    created,
    updated,
    updatedBy,
    isVerified,
  } = account;
  return {
    id,
    name,
    phone,
    email,
    role,
    created,
    updated,
    updatedBy,
    isVerified,
  };
}

async function getRefreshToken(token) {
  console.log(token, "token")
  const refreshToken = await db.RefreshToken.findOne({ where: { token } });
  console.log(refreshToken, "refreshToken")
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
}
