// const Sequelize =require('sequelize');
// const sequelize = require('../Util/database');


// const Downloadurl = sequelize.define('downloadurl' , {
//     id:{
//         type:Sequelize.INTEGER,
//         unique:true,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true,
//     },
//     filename:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     fileurl:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     }
// })

// module.exports = Downloadurl

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DownloadurlSchema = new Schema({
    filename: {
                type: String,
                required: true   
            },
            fileurl: {
                type: String,
                required: true,

                  },
                  
                  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        
})

module.exports = mongoose.model('downloadurl', DownloadurlSchema);