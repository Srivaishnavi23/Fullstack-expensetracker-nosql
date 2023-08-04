// const Sequelize = require('sequelize')

// const sequelize = require('../Util/database')

// const Users = sequelize.define('Users', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     username: {
//         type: Sequelize.STRING,
//         allowNull: false,   
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true 
//     },
//     password: {
//         type: Sequelize.STRING,
//     },
//     ispremiumuser: {
//         type: Sequelize.BOOLEAN,
//         default: false
//     }

// })

// module.exports = Users

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
                type: String,
                required: true   
            },
            email: {
                type: String,
                required: true,
                unique: true
                 
            },
            password: {
                type: String,
                required: true 
            },
            ispremiumuser: { 
                type: Boolean,
                default: false 
            }
             
        
})

module.exports = mongoose.model('User', userSchema);