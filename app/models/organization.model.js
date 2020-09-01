const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  links: [
    {
      type: String,
      required: true,
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15,
  },
  address: {
    type: String,
    required: true,
    unique: true,
    maxlength: 55,
  },
  description: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  preference: {
    type: String,
    enum: ["people", "animal"],
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
  password: {
    type: String,
    required: true,
  },
  confirm: {
    type: Boolean,
    required: true,
  },
});
OrganizationSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const OrganizationModel = mongoose.model("organization", OrganizationSchema);

module.exports = OrganizationModel;
