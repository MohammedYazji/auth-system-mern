import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// user document middlewares

// hash password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.log("error in hashing password", error);
  }
});

// compare password if is valid
// userSchema.methods.isValidPassword = async function (password) {
//   try {
//     // Compare provided password with stored hash
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     console.log("Password comparison failed");
//     return false;
//   }
// };

const User = mongoose.model("User", userSchema);
export default User;
