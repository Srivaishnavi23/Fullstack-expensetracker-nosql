const path = require('path')
const uuid = require('uuid')
const sendGrid = require('@sendgrid/mail')
require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/userDetails')
const Forgotpassword = require('../models/resetPassDetails')


exports.fogetpassDetails =  (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgotPassword.html'));
  }



exports.forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const id = uuid.v4().toString();
        console.log('my id----', id)
        const forgotpasswordrequest = await new Forgotpassword({
          _id:id,
          UserId: user._id,
          active: true,
        });
        forgotpasswordrequest.save();
        sendGrid.setApiKey(process.env.SENGRID_API_KEY);
        const msg = {
          to: email,
          from: 'srivaishnavidurgapu023@gmail.com',
          subject: 'Reset PassWord',
          text: 'Resetting the password , email sent from SriVaishnavi',
          html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        };
        console.log(msg);
        sendGrid
          .send(msg)
          .then((response) => {
            return res.status(response[0].statusCode).json({
              message:
                'Link Sent To Your Mail For Resetting The PassWord',
              success: true,
            });
          })
          .catch((err) => {
            throw new Error(err);
          });
      } else {
        throw new Error('User Doesnt Exist ');
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: err, success: false });
    }
  };
  
  exports.resetpassword = async (req, res, next) => {
    const id = req.params.id;
    console.log('ye id hai', id)
    try {
      const forgotpasswordrequest = await Forgotpassword.findOne({ _id: id });
      if (forgotpasswordrequest) {
        await forgotpasswordrequest.updateOne({ active: false });
        res
          .status(200)
          .send(`<html>
                  <script>
                    function formsubmitted(e){
                      e.preventDefault();
                      console.log('called');
                    }
                  </script>
                  <form action="/password/updatepassword/${id}" method="GET">
                    <lable for="newpassword"> Enter New PassWord</lable>
                    <input name="newpassword" type="password" required></input>
                    <button>Reset PassWord</button>
                  </form>
                </html>`);
        res.end();
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message, success: false });
    }
  };
  
  
  
  exports.updatepassword = async (req, res, next) => {
      try {
          const { newpassword } = req.query;
          const { resetpasswordid } = req.params;
  
          const resetpasswordrequest = await Forgotpassword.findOne({ _id: resetpasswordid }).exec();
          if (!resetpasswordrequest) {
              return res.status(404).json({ error: 'Invalid reset password request', success: false });
          }
  
          const user = await User.findOne({ _id: resetpasswordrequest.UserId }).exec();
          console.log('ye hi hai bc', user)
          if (!user) {
              return res.status(404).json({ error: 'No user exists', success: false });
          }
  
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(newpassword, salt);
  
          await user.updateOne({ password: hash }).exec();
  
          res.status(201).json({ message: 'Successfully updated the new password' });
  
      } catch (err) {
          console.log(err);
          return res.status(500).json({ error: err.message, success: false });
      }
  };

