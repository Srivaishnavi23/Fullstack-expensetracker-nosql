// const Sequelize = require('sequelize')

// const sequelize = require('../Util/database')

// const forgotPassword = sequelize.define('forgotPassword',{
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = forgotPassword

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotpasswordSchema = new Schema({
  _id: {
    type: String,  // change data type to String
    required: true,
  },
    
            active: {
                type: Boolean,
                required: true
              },
              expiresby: {
                type: Date,
                
              },
              UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        
})

module.exports = mongoose.model('forgotpassword', ForgotpasswordSchema);