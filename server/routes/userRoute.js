const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();

    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);
    } else {
      return res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

//make a user admin
router.post("/makeAdmin/:id",async(req,res)=>{
  try{
    const userToAdmin=req.params.id;
    const user= await User.findById(userToAdmin);
    if(!user){
      return res.status(400).json({ message: "User Not Found" });
    }
    user.isAdmin=true;
    await user.save();
    return res.status(200).json({ message: `${user.name} is now Admin`});
  }catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }

})

module.exports = router;
