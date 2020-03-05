/********
* user.js file (services/users)
********/
/*
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/
const User = require('../../models/userModel');
const bcrypt_const = require('../../functions/BCrypt');
const jwt = require('jsonwebtoken');

require('custom-env').env('staging');
const secret = process.env.SECRET || 'the default secret';

const getUsers = async (req, res, next) => {
    try {
        let users =  await User.findAll({ where : {} , raw : true });
        console.log(users[0]);
        if (users.length > 0) {
            return res.status(200).json({
                'message': 'users fetched successfully',
                'data': users
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const createUsers= async (req, res, next) => {
    try {
        const {
            UserName,
            UserEmail,
            UserPhoneNo,
            UserPassword,
        } = req.body;
        if (UserName === undefined || UserName === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'UserName'
            });
        }
        let isUserNameExists = await User.findAll({
            where: {
                UserName: UserName
            },
            raw: 'true'
        });
        if (isUserNameExists.length > 0) {
            return res.status(409).json({
                'code': 'ENTITY_ALREAY_EXISTS',
                'description': 'Username already exists',
                'field': 'UserName'
            });
        }
        if (UserEmail === undefined || UserEmail === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'UserEmail'
            });
        }
        let isEmailExists = await User.findAll({
            where: {
                UserEmail : UserEmail
            }, 
            raw : 'true'
        });
        if (isEmailExists.length > 0) {
            return res.status(409).json({
                'code': 'ENTITY_ALREAY_EXISTS',
                'description': 'email already exists',
                'field': 'email'
            });
        }
        if (UserPhoneNo === undefined || UserPhoneNo === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'UserPhoneNo is required',
                'field': 'UserPhoneNo'
            });
        }
        if (UserPassword === undefined || UserPassword === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'UserPassword is required',
                'field': 'UserPassword'
            });
        }
        hashval = bcrypt_const.hashSync(UserPassword,10);
        
        let userToBeSaved = {
            UserName: UserName,
            UserEmail: UserEmail,
            UserPhoneNo: UserPhoneNo,
            UserPassword: hashval
        }

        let newUser = await User.create(userToBeSaved);

        if (newUser) {
            return res.status(201).json({
                'message': 'user created successfully',
                // 'data': newUser
            });
        } else {
            throw new Error('something went worng');
        }
    }catch (error) {    //try ends here
        console.log(error);
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const userLogin = async (req, res, next) => {
    const { UserEmail, UserPassword} = req.body;
    try{
        let user = await User.findAll({ where: { UserEmail:UserEmail}, raw: true });
        if(user.length === 0){
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No users found in the system'
            });
        }
        const isMatchingDbAndUserPasswords = bcrypt_const.compareSync(UserPassword, user[0]["UserPassword"]);
        
        if (isMatchingDbAndUserPasswords){
            const payload = {
                id: user[0].id,
                name: user[0].UserName
            };
            
                jwt.sign(payload, secret, { expiresIn: 36000 },
                    (err, token) => {
                        if (err) {
                            return res.status(500).json({
                                    error: "Error signing token",
                                    raw: err
                                });
                        }
                        return res.status(200).json({
                            'message': 'users fetched successfully',
                            // 'data': users
                            token: `Bearer ${token}`
                        });
                        //     res.json({
                        //     success: true,
                        //     token: `Bearer ${token}`
                        // });
                    }
                );
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No users found in the system'
            });
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
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
    // getUserById: getUserById,
    // createUser: createUser,
    // updateUser: updateUser,
    // deleteUser: deleteUser
}