import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Major: {
      type: String,
      required: false,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Rating: {
      type: Number,
      default: 0,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      required: true,
      enum: ["client", "provider", "admin"],
      default: "client",
    },
    Verified: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
