import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

const JWT_SECRET = process.env.JWT_SECRET as string; // Fetching the JWT secret from environment variables

// Register functionality
// This function handles user registration by checking if the user already exists, hashing the password, and saving the new user to the database. It also generates a JWT token for the user upon successful registration.
// It responds with the user's details and the token if successful, or an error message if there are any issues during the process.
export const registerNewUser = async (req: Request, res: Response) => {
    const { email, password, confirmPassword, name } = req.body

    if ( password.length < 8 ||  //checks conditions to validate password received from the request
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&.*]/.test(password)
    ) {
        return res.status(400).json({
            message: "Password must include uppercase, lowercase, number, special character, and be at least 8 characters."
        });
    }

    if (password !== confirmPassword) { //checks if password received from the request matches the one confirmed
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try{ 
        const userExists = await UserModel.findOne({ email })

        if(userExists) { //checks if a user with the given email already exists
            return (res as any).status(400).json({message: "User already exists"})
        }

        const hashPassword = await bcrypt.hash(password, 10) // Hashing the password specifying the salt rounds

        const newUser = new UserModel({  //creates a new user object with the provided details
            email,
            name,
            password: hashPassword,
        }) 
        
        await newUser.save() // Saves the new user to the database
        
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return res.status(500).json({ message: "Server config error" });
        }

        const token = jwt.sign({id: newUser._id}, JWT_SECRET, { expiresIn: '7d' }) // Generates a JWT token for the user
        res.status(201).json({
            user:{
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            },
            token
        }) // Responds with the new user's details and the token
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message: "Internal server error"}) 
    }
}


    // Login functionality
export const loginUser = async (req:Request, res: Response) => {
    const {email, password } = req.body

        try {
            const user = await UserModel.findOne({ email }) // Finds the user by email
            
            if (!user) {
                return (res as any).status(400).json({ message: "Invalid email" })
            }

            const validPassword = await bcrypt.compare(password, user.password) //compares the provided password with the hashed password in the database
            if(!validPassword){
                return res.status(400).json({ message: 'Password not correct'})
            }

            //create jwt token to authenticate the user
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {expiresIn: '7d'}) // Generates a JWT token for the user
            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token
            })
        } 
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error" }) // Handles any errors that occur during the process
        }
    }
