// const Sequelize = require('sequelize');
// const sequelize = require('../Util/database');

// //id, name , password, phone number, role

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
            paymentid: {
                type: String,
                  
            },
            orderid: {
                type: String,
                
                 
            },
            status: {
                type: String,
                
            },
            UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

        
})

module.exports = mongoose.model('order', OrderSchema);