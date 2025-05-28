// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../Models/UserModel.js';

// Sign up
export const signup = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ msg: "Required fields are missing." });
  }

  const existingUserWithEmail = await UserModel.findOne({ email });
  if (existingUserWithEmail) {
    return res.status(400).json({ error: "User with the same email already exists." });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new UserModel({ email, password: hashedPassword, role });
  await newUser.save();

  console.log('JWT_TOKEN:', process.env.JWT_TOKEN);

  const token = jwt.sign(
    { _id: newUser._id, role: newUser.role },
    process.env.JWT_TOKEN, // Ensure this is correctly set
    { expiresIn: '24h' }
  );

  res.json({ token });
};


// Log in
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Not Get User In DataBase' });
  }
   // Compare Secured (hashed) Password with provided password
   const passwordMatch = await bcryptjs.compare(password, user.password);

   // check is the provided password match with user password
   if (!passwordMatch) {
     return res.status(404).json({ error: "Invalid password" });
   }
   
  console.log('JWT_TOKEN_login:', process.env.JWT_TOKEN);
   //  JWT
   const token = jwt.sign(
     { email: user.email, id: user._id, role: user.role },
     process.env.JWT_TOKEN,
     { expiresIn: '24h' }
   );

  res.json({ token });
};
// Get current user:
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.decoded.id || req.decoded.userId);
    // console.log("user", req.decoded)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Get all users:
export const getUsers = async (req, res) =>{
  try{
   const users = await UserModel.find();
   res.status(200).json(users)
  }
  catch (e){
    res.status(500).json({message:"Internal Server Error."})
  }
}
// update user with id:
export const updateUser = async (req, res) =>{
  const id = req.params.id;
  const { email, password, role } = req.body;
  try{
  const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
     const updatedUser = await UserModel.findByIdAndUpdate(id,{
        email: email || user.email,
        password: hashedPassword || user.password,
        role: role || user.role,
      }, { new: true });
    res.status(200).json(updatedUser);
  }
  catch (e){
    res.status(500).json({message:"Internal Server Error."})
  }
}
// Delete user with id:
export const deleteUser = async (req, res) =>{
  const id = req.params.id;
  try{
  const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
      await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User successfully deleted." });
  }
  catch (e){
    res.status(500).json({message:"Internal Server Error."})
  }
}