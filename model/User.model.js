const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator")
// const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "A user must have a first name"],
  },
  lastname: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "A user email must be unique"],
    lowercase: true,
    validate: [validator.isEmail, "Please, enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

//add a pre-hook(signal) function to the UserSchema. This function gets called
//before the user info is stored in the database
UserSchema.pre("save", async function (next) {
 //hash incoming password before saving to db
 this.password = await bcrypt.hash(this.password, 12);
 next()
});

//Add a method to the Schema. This method will chain a
//function that compares and validates the password.
//in this case 'isValidPassword' is the function that gets called
UserSchema.methods.isValidPassword = async function (currentPassword,storedUserPassword){
  return await bcrypt.compare(currentPassword, storedUserPassword)
} 
  


const User = mongoose.model("User", UserSchema);
module.exports = User;
