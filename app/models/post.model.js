
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  location : {
    type : String,
    required : true,
  },
  number : {
    type : String,
    required : true,
    unique : true,
    maxlength: 15
  },
  type: {
    type: String,
    enum : ['people','animal'],
    required : true
  },
  password : {
    type : String,
    required : true
  }
});
PostSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


const PostModel = mongoose.model('pot',PostSchema);

module.exports = PostModel;