const Joi = require("joi");
const Role = require("../helpers/roles")
const validateRequest = require("../middlewares/validate-request");
const validateFiles = require("../middlewares/validate-files");
const services = require("../services/accounts.services");

module.exports = {
  registerAdminSchema,
  registerAdmin,
  verifyEmailSchema,
  verifyEmail,
  forgotPasswordSchema,
  forgotPassword,
  resetPasswordSchema,
  resetPassword,
  authenticateSchema,
  authenticate,
  addUserSchema,
  addProfileImage,
  addProfileImageSchema,
  addSignatureSchema,
  revokeTokenSchema,
  revokeToken,
  addUser,
  addSignature,
  delete:_delete,
  getUserById,
  getAllUsers,
  getSignature,
  refreshToken,
  updateAccount,
  updateAccountSchema,
  invateToLogin,
  invateToLoginSchema,
  addEmailListSchema,
  addEmailList,
  deleteEmailList,
  getEmailList,
  getProfileImage
};

function registerAdminSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function registerAdmin(req, res, next) {
  console.log(req.body, "req");
  services
    .registerAdmin(req.body, req.get("origin"))
    .then(() =>
      res.json({
        meta:{
          status: 200,
          message: "Registration successful, please check your email for verification instructions"
        },
        data: {}
      })
    )
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  console.log(req.cookies, "refreshed")
  const ipAddress = req.ip;
  services
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json({
        meta:{
          status: 200,
          message: ''
        },
        data:account
      });
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
      token: Joi.string().empty('')
  });
  validateRequest(req, next, schema);
}
function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  console.log(token)
  console.log(req)
  const ipAddress = req.ip;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
      return res.status(401).json({
        meta:{
          status: 401,
          message: 'Unauthorized'
        },
        data: {}
      });
  }

  services.revokeToken({ token, ipAddress })
      .then(() => res.json({
        meta:{
          status: 200,
          message: 'Token revoked'
        },
        data: {}
      }))
      .catch(next);
}

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
      token: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
  services.verifyEmail(req.body)
      .then(() => res.json({
        meta:{
          status: 200,
          message: 'Verification successful, you can now login'
        },
        data: {}
      }))
      .catch(next);
}

function forgotPasswordSchema(req, res, next) {
  const schema = Joi.object({
      email: Joi.string().email().required()
  });
  validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
  services.forgotPassword(req.body, req.get('origin'))
      .then(() => res.json({
        meta:{
          status: 200,
          message: 'Please check your email for password reset instructions'
        },
        data: {}
      }))
      .catch(next);
}

function resetPasswordSchema(req, res, next) {
  const schema = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
  services.resetPassword(req.body)
      .then(() => res.json({
        meta:{
          status: 200,
          message: 'Password reset successful, you can now login'
        },
        data: {}
      }))
      .catch(next);
}

function getProfileImage(req, res, next) {
  // users can get their own account and admins can get any account
  // const { id } = 
  services.getProfileImage(req.user.id)
      .then(account => res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: account
      })) 
      .catch(next);
}

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { email, password } = req.body;
  // console.log(req.body)
  const ipAddress = req.ip;
  services.authenticate({ email, password, ipAddress })
      .then(({ refreshToken, ...account }) => {
        // console.log(refreshToken, "refreshed")
          setTokenCookie(res, refreshToken);
          res.json({
            meta:{
              status: 200,
              message: ''
            },
            data: account
          });
      })
      .catch(next);
}



function addProfileImageSchema(req, res, next) {
  const schema = Joi.object({
    image: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

async function addProfileImage(req, res, next) {
  services.addProfileImage(req.body, req.user.id)
  .then(() =>
  res.json({
    meta:{
      status: 200,
      message:  "Image successfully added!"
    },
    data: {}
  })
).catch(next);
}

function invateToLoginSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(150).required(),
    id: Joi.string().required(),
    phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required(),
    email: Joi.string().email().required(),

  });
  validateRequest(req, next, schema);
}

  function invateToLogin(req, res, next) {
    const { email } = req.body
    services.invateToLogin(req.body, req.get("origin"))
    .then(() =>
    res.json({
      meta:{
        status: 200,
        message:  `Please check ${email} email for reset password instructions`
      },
      data: {}
    })
  ).catch(next);
  }
  
function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
      httpOnly: true,
      secure:true,
      sameSite:'none',
      expires: new Date(Date.now() + 7*24*60*60*1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
}

function addUserSchema(req, res, next) {
  const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required(),
      email: Joi.string().email().required(),
      role: Joi.string().valid(Role.Admin, Role.User).required()
  });
  validateRequest(req, next, schema);
}

function addUser(req, res, next) {
  const { email } = req.body
  services.addUser(req.body, req.get("origin"))
  .then(() =>
  res.json({
    meta:{
      status: 200,
      message:  `An invitation link has been sent to ${email}`
    },
    data: {}
  })
).catch(next);
}

// Add User Signature
function addSignatureSchema(req, res, next) {
  const schema = Joi.object({
      name: Joi.string().required(),
      data: Joi.binary().required()
  });
  validateFiles(req, next, schema);
}

async function addSignature(req, res, next) {
  // console.log(req.files.image)
  console.log(req.file)
  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).send('No file were uploaded.');
  }
  // const buffer = await getStream(req.file.stream)

  const params =  {}
  services.addSignature(req.file, req.user.id)
  .then(() =>
  res.json({
    meta:{
      status: 200,
      message:  "You successfully added your signature"
    },
    data: {}
  })
).catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({
        meta:{
          status: 401,
          message: "Unauthorized" 
        },
        data: {}
      });
  }
  if (req.params.id == req.user.id && req.user.role == Role.Admin) {
    return res.status(401).json({
      meta:{
        status: 401,
        message: "Sorry! You can not delete your account as an Admin" 
      },
      data: {}
    });
  }

  services
    .delete(req.params.id)
    .then(() => res.json({
      meta:{
        status: 200,
        message: "Account deleted successfully"
      },
      data: {

      }
    }))
    .catch(next);
}
function getAllUsers(req, res, next) {
   services.getAllUsers()

      .then(accounts => res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: accounts
      }))
      .catch(next);
}

function getUserById(req, res, next) {
  // users can get their own account and admins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
      return res.status(401).json({
        meta:{
          status: 401,
          message: 'Unauthorized'
        },
        data: {}
      });
  }
  services.getUserById(req.params.id)
      .then(account => account ? res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: account
      }) : res.sendStatus(404))
      .catch(next);
}


function getSignature(req, res, next) {
  // users can get their own account and admins can get any account
  services.getSignature(req.user.id)
      .then(account => account ? res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: account
      }) : res.sendStatus(404))
      .catch(next);
}


function updateAccountSchema(req, res, next) {
  const schemaRules = {
    id: Joi.string().empty(''),
      name: Joi.string().empty(''),
      email: Joi.string().email().empty(''),
      phone: Joi.string().regex(/^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/).messages({'string.pattern.base': `Phone number must have at least 10 digits.`}).required(),
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
      schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
  }

  const schema = Joi.object(schemaRules);
  validateRequest(req, next, schema);
}

function updateAccount(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.body.id !== req.user.id && req.user.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  services.updateAccount(req.body, req.user.id)
      .then(account => res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: account
      }))
      .catch(next);
}


function addEmailListSchema(req, res, next) {
  const schema = Joi.object({
    group: Joi.string().required(),
    accountId: Joi.string().required(),
    // email: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function addEmailList(req, res, next) {
  // const { email } = req.body
  services.addEmailList(req.body)
  .then(() =>
  res.json({
    meta:{
      status: 200,
      message:  `Successfully added`
    },
    data: {}
  })
).catch(next);
}

function deleteEmailList(req, res, next) {
  // users can delete their own account and admins can delete any account
  services
  .deleteEmailList(req.params.id)
  .then(() => res.json({
    meta:{
      status: 200,
      message: "Account removed successfully"
    },
    data: {

    }
  }))
  .catch(next);
}


function getEmailList(req, res, next) {
  // users can get their own account and admins can get any account
  services.getEmailList(req.params.group)
      .then(account => account ? res.json({
        meta:{
          status: 200,
          message: ""
        },
        data: account
      }) : res.sendStatus(404))
      .catch(next);
}
