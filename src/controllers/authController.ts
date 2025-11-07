import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";

const generateToken = (id: string, email: string): string => {
    /**
     * Generate a JWT token for the user
     * @param id - User ID
     * @param email - User email
     * @returns JWT token as a string
     */
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const payload = { id, email };

    return jwt.sign(payload, secret, { expiresIn: "1h" }); // Token valid for 1 hour
};

export const register = async (req: Request, res: Response) => {
    /**
     * Register a new User
     * Expected body: { name: string, email: string, password: string }
     */
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        const userJson = newUser.toJSON();

        const { password: removedPassword, ...userResponse } = userJson;

        res.status(201).json({ user: userResponse, message: "User registered successfully" });
    } catch (error: any) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    /**
     * Login a User
     * Expected body: { email: string, password: string }
     */
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const token = generateToken(user.id, user.email);
    
        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};