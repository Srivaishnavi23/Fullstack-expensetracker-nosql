// const Sequelize = require('sequelize')

// const sequelize = require('../Util/database')

// const Expense = sequelize.define('Expense',{
//  id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//  },
//  Number: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//  },
//  Description: {
//     type: Sequelize.STRING,
//     allowNull: false
//  },
//  Categories: {
//     type: Sequelize.STRING,
//     allowNull: false,
//  }     
// })

// module.exports = Expense

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
   UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            Number: {
                type: Number,
                required: true   
            },
            Description: {
                type: String,
                required: true,
            },
            Categories: {
                type: String,
                required: true 
            }
            
        
        
})

module.exports = mongoose.model('expenses', ExpenseSchema);