import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password:{
            type: String,
            required: true,
            minlength: 8
        },
        role:{
            type: String,
            enum: ["Admin", "Customer"],
            default: "Customer"
        }
    }
);

userSchema.statics.hashPassword = async function (pass){
  return await bcrypt.hash(pass, 10);
};

userSchema.methods.comparePassword = async function (pass){
  return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
