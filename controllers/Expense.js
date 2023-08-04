const path = require('path')
const jwt = require('jsonwebtoken')
const Expense = require('../models/expenseDetails');
const Downloadurl = require('../models/URL')
const AWS = require('aws-sdk');








exports.getExpenses = async (req,res,next)=>{
  console.log("Getting Expenses");
  let page = +req.params.page ||  1;
  console.log('ctrolpage',page)

  let Items_Per_Page = +(req.body.Items_Per_Page)|| 5;
  let totalItems;

  try{
    let count = await Expense.countDocuments({UserId: req.user._id})
    console.log('hbjkl',count)
    totalItems = count;
    

   
    const data = await Expense.find({ UserId: req.user._id })
  .skip((page - 1) * Items_Per_Page)
  .limit(Items_Per_Page);
    console.log(data)

        return res.status(201).json({data, info: {
          currentPage: page,
            hasNextPage: totalItems > page * Items_Per_Page,
            hasPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
            lastPage: Math.ceil(totalItems / Items_Per_Page),
          }
        });
       
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error:error});
  }
  
 
}



exports.postAddExpenses = async(req, res, next) => {
  console.log('adding a user');
  try{
    const Number = req.body.Number;
    const Description = req.body.Description;
    const Categories = req.body.Categories;

    if(!Categories){
      throw new Error('please enter phone number');
    }

    const data =  new Expense({
      Number: Number,
      Description: Description,
      Categories: Categories,
      UserId: req.user.id
    })
    await data.save()
    res.status(201).json({newExpenseDetails: data});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:error});
  }
}


exports.deleteExpense = async (req,res,next)=>{
  
  try{
    let userId = req.params.userId;
    console.log('delete', userId)
    if(!userId){
      res.status(400).json({error:'id missing'});
    }
    await Expense.findByIdAndDelete({_id:userId});
    res.sendStatus(200);
    
  }
  catch(error){
    console.log(error);
    res.status(500).json('error occured');
  };
}
  function uploadToS3(data, filename){

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_KEY,
        secretAccessKey: process.env.IAM_SECRET_KEY
    })
        var params = {
        Bucket: process.env.S3_BUCKET_NAME ,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    } 
    return new Promise((resolve, reject)=>{
      s3bucket.upload(params, (err,s3response)=>{
        if(err){
            console.log('Something went wrong',err);
            reject(err)
        }
        else{
            console.log('success', s3response)
            resolve(s3response.Location)
             
        }
    });
    })    
   
 }




exports.downloadExpense = async (req, res, next) => {
  try {
    const ispremiumuser = req.user.ispremiumuser;
    const expenses = await Expense.find({userId: req.user._id});
    const cleanedExpenses = expenses.map(expenses=>({
      ...expenses
    } ))
    const stringifiedExpenses = JSON.stringify(cleanedExpenses);
    const userId = req.user._id;

    const filename = `expenses${userId}/${new Date()}.csv`;
    const fileUrl = await S3Services.uploadtoS3(stringifiedExpenses, filename);
    const urldata = await Downloadurl.create({
      filename: filename,
      fileurl: fileUrl,
      userId: req.user._id
    });

    if (ispremiumuser === true) {
      const url = urldata.save();
      res.status(201).json({ fileUrl, urldata, success: true });
    }

    if (ispremiumuser === false || ispremiumuser === null) {
      return res
        .status(207)
        .json({ message: 'Not a premium user', success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: '', success: false, err: err });
  }
};

exports.getDownloadUrls = async (req, res, next) => {
  try {
    const ispremiumuser = req.user.ispremiumuser;
    const data = await Downloadurl.find({ userId: req.user._id });

    if (data && ispremiumuser === true) {
      return res.status(200).json({ data, success: true });
    }

    if (!data) {
      return res
        .status(404)
        .json({ message: 'No URLs found with this user', success: false });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};





