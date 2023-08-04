const Expense = require('../models/expenseDetails');
const User = require('../models/userDetails');


 exports.getAllUsers = async (req, res, next) => {
    try {
      const leaderboardofUsers = await User.aggregate([
        {
          $lookup: {
            from: "expenses",
            localField: "_id",
            foreignField: "UserId",
            as: "expenses"
          }
        },
        {
          $addFields: {
            TotalCost: {
              $sum: "$expenses.Number"
            }
          }
        },
        {
          $sort: {
            TotalCost: -1
          }
        }
      ]);
      res.status(201).json(leaderboardofUsers);
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }