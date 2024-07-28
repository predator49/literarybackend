import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Log the incoming request body
        console.log("Signup Request Body:", req.body);

        // Validate request body
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPassword = await bcryptjs.hash(password, 10);

        // Create and save the new user
        const createdUser = new User({
            fullname,
            email,
            password: hashPassword,
        });

        await createdUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            },
        });
    } catch (error) {
        console.error("Signup Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log the incoming request body
        console.log("Login Request Body:", req.body);

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ message: "Both email and password are required" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare the password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
