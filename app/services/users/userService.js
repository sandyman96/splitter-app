/********
 * user.js file (services/users)
 ********/
/*
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/
const User = require('../../models/userModel');
const OTPUserList = require('../../models/OTPUserlistModel');
const nodemailsender = require('../../services/Email/nodemailer');
const bcrypt_const = require('../../functions/BCrypt');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const op = require('sequelize').Op;
const Sequelize = require('sequelize');
const csprngRandomOTP = require('../../functions/csprngRandomNumber');

require('custom-env').env('staging');
const secret = process.env.SECRET || 'the default secret';
console.log(secret);

const getUsers = async (req, res, next) => {
  try {
    let users = await User.findAll({ where: {}, raw: true }).then( resolved =>{
      return resolved;
    }).catch( rejected => {
      throw(rejected);
    });

    let userValuesNeeded = [];
    users.forEach(element => {
      let newUser = {
        UserName: element.UserName,
        UserEmail: element.UserEmail,
        UserPhoneNo: element.UserPhoneNo
      };
      userValuesNeeded.push(newUser);
    });

    if (users.length > 0) {
      console.log(users[0]);
      return res.status(200).json({
        message: 'users fetched successfully',
        data: userValuesNeeded
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No users found in the system'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: error.message
    });
  }
};

const getUsersForAdmin = async (req, res, next) => {
  try {
    let users = await User.findAll({ where: {}, raw: true });
    console.log(users[0]);
    if (users.length > 0) {
      return res.status(200).json({
        message: 'users fetched successfully',
        data: users
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No users found in the system'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again'
    });
  }
};

const createUsers = async (req, res, next) => {
  try {
    const { UserName, UserEmail, UserPhoneNo, UserPassword } = req.body;
    if (UserName === undefined || UserName === '') {
      return res.status(422).json({
        code: 'REQUIRED_FIELD_MISSING',
        description: 'name is required',
        field: 'UserName'
      });
    }
    let isUserNameExists = await User.findAll({
      where: {
        UserName: UserName
      },
      raw: 'true'
    }).then( resolved => {
      return resolved;
    }).catch(rejected => {
      throw rejected;
    });
    if (isUserNameExists.length > 0) {
      return res.status(409).json({
        code: 'ENTITY_ALREAY_EXISTS',
        description: 'Username already exists',
        field: 'UserName'
      });
    }
    if (UserEmail === undefined || UserEmail === '') {
      return res.status(422).json({
        code: 'REQUIRED_FIELD_MISSING',
        description: 'email is required',
        field: 'UserEmail'
      });
    }
    let isEmailExists = await User.findAll({
      where: {
        UserEmail: UserEmail
      },
      raw: 'true'
    });
    if (isEmailExists.length > 0) {
      return res.status(409).json({
        code: 'ENTITY_ALREAY_EXISTS',
        description: 'email already exists',
        field: 'email'
      });
    }
    if (UserPhoneNo === undefined || UserPhoneNo === '') {
      return res.status(422).json({
        code: 'REQUIRED_FIELD_MISSING',
        description: 'UserPhoneNo is required',
        field: 'UserPhoneNo'
      });
    }
    if (UserPassword === undefined || UserPassword === '') {
      return res.status(422).json({
        code: 'REQUIRED_FIELD_MISSING',
        description: 'UserPassword is required',
        field: 'UserPassword'
      });
    }
    hashval = bcrypt_const.hashSync(UserPassword, 10);
    let userToBeSaved = {
      UserName: UserName,
      UserEmail: UserEmail,
      UserPhoneNo: UserPhoneNo,
      UserPassword: hashval,
      UserRole: 'user'
    };
    let newUser = await User.create(userToBeSaved);
    if (newUser) {
      return res.status(201).json({
        message: 'user created successfully',
        data: newUser
      });
    } else {
      throw new Error('something went worng');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again'
    });
  }
};

const userLogin = async (req, res, next) => {
  console.log(req.body);
  const { UserEmail, UserPassword } = req.body;
  try {
    let user = await User.findAll({
      where: { UserEmail: UserEmail },
      raw: true
    }).then( resolved => {{
      return resolved;
    }}).catch(rejected => {
      throw rejected;
    });

    console.log(user);
    if (user.length === 0) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system'
      });
    }
    if (user.length > 1) {
      return res.status(500).json({
        code: 'DATABASE_ERROR',
        description: 'multiple users with same username found.'
      });
    }
    const isMatchingDbAndUserPasswords = bcrypt_const.compareSync(
      UserPassword,
      user[0]['UserPassword']
    );
    if (isMatchingDbAndUserPasswords) {
      const payload = {
        id: user[0].id,
        name: user[0].UserName,
        role: user[0].UserRole
      };
      jwt.sign(payload, secret, { expiresIn: '21d' }, (err, token) => {
        if (err) {
          return res.status(500).json({
            error: 'Error signing token',
            raw: err
          });
        } else {
          return res.cookie("jwt", token, { maxAge: ms('2 days') }).status(200).
            json({
              message: 'user logged in',
              data: user,
              token: token
            })
        }
      });
    } else {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system'
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again'
    });
  }
};

const userLogout = async (req, res, next) => 
{
  res.clearCookie('jwt');
  return res.redirect('/api/v1/home')
}

const resetEligibilityCheck = async (req, res, next) => {
  try{
    const { UserEmailOrPhoneNo } = req.body;
      let user = await User.findAll({ where:{ 
          [op.or]:
          [
              {UserEmail: UserEmailOrPhoneNo},
              {UserPhoneNo: UserEmailOrPhoneNo}
            ]
        }
        ,raw: 'true'
      }
      ).then(resolved => {
          console.log(resolved);
          return resolved;
      }).catch(reject => {
        throw(reject);
      });
    if (user.length == 0) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system'
      });
    }

    const OTPuserlistsaved = await OTPUserList.findAll({
      where:{
        UserId:user[0].id
    }
  });

  if(OTPuserlistsaved.length > 0){
    let savedOTPDatetime = OTPuserlistsaved[0].time;
    let presentDatetime = new Date();

    const diffTimeSeconds = Math.floor(( Math.abs(presentDatetime - savedOTPDatetime)) / 1000);
    const diffTimeMinutes = Math.floor(diffTimeSeconds/60);
    
    if (diffTimeMinutes < 2) {

      const remainingTotalSeconds  = 120 - diffTimeSeconds;
      const remainingMinutes = Math.floor(remainingTotalSeconds/60);
      const remainingSeconds = Math.floor((remainingTotalSeconds%60));
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: `OTP Already requested. Wait for ${remainingMinutes}:${remainingSeconds}.`
      });
    }else{
      const csprngOTP = await csprngRandomOTP(1379, 9463).then(resolved => {
        return resolved.toString();
      }).catch(rejected => { throw (rejected) });

      console.log(csprngOTP);

      let hash = bcrypt_const.hashSync(csprngOTP, 10);
      let date = new Date();

      const updatedOTPUserlist = {
        OTPBcrypt: hash,
        time : date,
        tries: 5
      }
      
      const updatedOTPuserlistAfterSave = await OTPUserList.update(updatedOTPUserlist, {
        where: {
          id: OTPuserlistsaved[0].id
        }
      }).then(resolved => {
        return resolved;
      }).catch(rejected => {
        console.log(rejected);
        return res.status(500).json({
          code: 'SERVER_ERROR',
          description: "error in server"
        });
      });

      if(updatedOTPuserlistAfterSave){
        //send mail
        var mailResult = nodemailsender("splitterwebapp@gmail.com", "sandeepraman@qburst.com", `OTP : ${csprngOTP}`,`The OTP is ${csprngOTP}`,(err, res) => {
          console.log(err,res);
        });
        return res.status(201).json({
          message: 'OTP created successfully',
          data: updatedOTPuserlistAfterSave
        });
      }else{
        return res.status(500).json({
          code: 'SERVER_ERROR',
          description: "error in server"
        });
      }
    }
  }
    const csprngOTP = await csprngRandomOTP(1379, 9463).then(resolved => {
      return resolved.toString();
    }).catch(rejected => { throw (rejected) });

    console.log(csprngOTP);
    
    let hash = bcrypt_const.hashSync(csprngOTP, 10) ;

    let date = new Date();
    let OTPToBeSaved = {
      UserId: user[0].id,
      OTPBcrypt: hash,
      time: date,
      tried:5
    };

    let newOTPUserlist = await OTPUserList.create(OTPToBeSaved);
    if (newOTPUserlist) {
      return res.status(201).json({
        message: 'OTP created successfully',
        data: newOTPUserlist
      });
    } else {
      throw new Error('something went worng');
    }

  }catch(err){
    console.log(err);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description:"error in server"
    });
  }  
}

const setNewPassword = async(req, res, next) => {
  try{
      const {OTPFromUser, newpass, UserEmailOrPhoneNo } = req.body;
    const user = await User.findAll({ where : {
      [op.or]:
      [
        { UserEmail: UserEmailOrPhoneNo },
        { UserPhoneNo: UserEmailOrPhoneNo }
      ]},
      raw: true
    }).then(resolved => {
      console.log(resolved);
      return resolved;
    }).catch(reject => {
      throw (reject);
    });

    if(user.length === 0){
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system'
      });
    }

      const OTPuserlistsaved = await OTPUserList.findAll({
        where: {
          UserId : user[0].id
        },raw: true
      });

    if (OTPuserlistsaved.length === 0) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: "you haven't requested for an OTP."
      });
    }

    let savedOTPDatetime = OTPuserlistsaved[0].time;
    let presentDatetime = new Date();

    const diffTime = Math.floor((Math.abs(presentDatetime - savedOTPDatetime))/(1000*60));

    if(diffTime>1){
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: "OTP Expired."
      });
    }
    
    const isOTPmatching = bcrypt_const.compareSync(OTPFromUser, OTPuserlistsaved[0].OTPBcrypt);

    if(isOTPmatching){
      const newPassword =  bcrypt_const.hashSync(newpass, 10);
      const updatedUser = await User.update({ UserPassword: newPassword}, {
        where: {
          id: user[0].id
        }
      });
      return res.status(201).json({
        message: 'password changed successfully',
        data: updatedUser
      });
    }else{
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: "OTP doesn't match"
      });
    }
}catch(err){
    console.log(err);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: "error in server"
    });
}
}

// const getUserById = async (req, res, next) => {
//     try {
//         let user = await User.findById(req.params.id);
//         if (user) {
//             return res.status(200).json({
//                 'message': `user with id ${req.params.id} fetched successfully`,
//                 'data': user
//             });
//         }
//         return res.status(404).json({
//             'code': 'BAD_REQUEST_ERROR',
//             'description': 'No users found in the system'
//         });
//     } catch (error) {
//         return res.status(500).json({
//             'code': 'SERVER_ERROR',
//             'description': 'something went wrong, Please try again'
//         });
//     }
// }

// const createUser = async (req, res, next) => {
//     try {
//         const {
//             name,
//             email
//         } = req.body;
//         if (name === undefined || name === '') {
//             return res.status(422).json({
//                 'code': 'REQUIRED_FIELD_MISSING',
//                 'description': 'name is required',
//                 'field': 'name'
//             });
//         }
//         if (email === undefined || email === '') {
//             return res.status(422).json({
//                 'code': 'REQUIRED_FIELD_MISSING',
//                 'description': 'email is required',
//                 'field': 'email'
//             });
//         }
//         let isEmailExists = await User.findOne({
//             "email": email
//         });
//         if (isEmailExists) {
//             return res.status(409).json({
//                 'code': 'ENTITY_ALREAY_EXISTS',
//                 'description': 'email already exists',
//                 'field': 'email'
//             });
//         }

//         const temp = {
//             name: name,
//             email: email
//         }

//         let newUser = await User.create(temp);

//         if (newUser) {
//             return res.status(201).json({
//                 'message': 'user created successfully',
//                 'data': newUser
//             });
//         } else {
//             throw new Error('something went worng');
//         }
//     } catch (error) {
//         return res.status(500).json({
//             'code': 'SERVER_ERROR',
//             'description': 'something went wrong, Please try again'
//         });
//     }
// }

// const updateUser = async (req, res, next) => {
//     try {
//         const userId = req.params.id;
//         const {
//             name,
//             email
//         } = req.body;
//         if (name === undefined || name === '') {
//             return res.status(422).json({
//                 'code': 'REQUIRED_FIELD_MISSING',
//                 'description': 'name is required',
//                 'field': 'name'
//             });
//         }

//         if (email === undefined || email === '') {
//             return res.status(422).json({
//                 'code': 'REQUIRED_FIELD_MISSING',
//                 'description': 'email is required',
//                 'field': 'email'
//             });
//         }

//         let isUserExists = await User.findById(userId);

//         if (!isUserExists) {
//             return res.status(404).json({
//                 'code': 'BAD_REQUEST_ERROR',
//                 'description': 'No user found in the system'
//             });
//         }

//         const temp = {
//             name: name,
//             email: email
//         }

//         let updateUser = await User.findByIdAndUpdate(userId, temp, {
//             new: true
//         });

//         if (updateUser) {
//             return res.status(200).json({
//                 'message': 'user updated successfully',
//                 'data': updateUser
//             });
//         } else {
//             throw new Error('something went worng');
//         }
//     } catch (error) {

//         return res.status(500).json({
//             'code': 'SERVER_ERROR',
//             'description': 'something went wrong, Please try again'
//         });
//     }
// }

// const deleteUser = async (req, res, next) => {
//     try {
//         let user = await User.findByIdAndRemove(req.params.id);
//         if (user) {
//             return res.status(204).json({
//                 'message': `user with id ${req.params.id} deleted successfully`
//             });
//         }

//         return res.status(404).json({
//             'code': 'BAD_REQUEST_ERROR',
//             'description': 'No users found in the system'
//         });

//     } catch (error) {

//         return res.status(500).json({
//             'code': 'SERVER_ERROR',
//             'description': 'something went wrong, Please try again'
//         });
//     }
// }

module.exports = {
  getUsers: getUsers,
  createUsers: createUsers,
  userLogin: userLogin,
  userLogout: userLogout,
  resetEligibilityCheck: resetEligibilityCheck,
  setNewPassword: setNewPassword,

  getUsersForAdmin: getUsersForAdmin
  // getUserById: getUserById,
  // createUser: createUser,
  // updateUser: updateUser,
  // deleteUser: deleteUser
}
