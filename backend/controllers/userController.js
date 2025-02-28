import bcrypt from 'bcryptjs';
import validator from 'validator';
import userModel from '../models/userModel.js';
import generateToken from '../utils/createToken.js';

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User does not exist' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token and send response
    generateToken(res, user._id);
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new userModel({ username, email, password: hashedPassword });
    const user = await newUser.save();

    // Generate token and send response
    generateToken(res, user._id);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { loginUser, registerUser };
