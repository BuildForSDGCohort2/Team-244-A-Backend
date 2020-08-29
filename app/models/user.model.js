
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  number : {
    type : String,
    required : true,
    unique : true,
    maxlength: 15
  },
  posts : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts"
  }],
  password : {
    type : String,
    required : true
  }
});
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


const UserModel = mongoose.model('user',UserSchema);

module.exports = UserModel;