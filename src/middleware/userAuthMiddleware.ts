import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

const JWT_SECRET = process.env.JWT_SECRET as string; // Fetching the JWT secret from environment variables

interface UserAuthRequest extends Request {
    user?:any 
} 
        
// Middleware to authenticate user requests
export const protect = async (req: UserAuthRequest, res:Response, next: NextFunction) => {
    let token;
    try {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // Checks if the Authorization header is present and starts with 'Bearer' 
        token = req.headers.authorization.split(' ')[1]; // Extracts the token from the Authorization header

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return (res as any).status(500).json({ message: "Server config error" });
        } 
        
    
        if(!token){
            return res.status(401).json({message: 'Unauthorized, no valid token'})
        }

        const decoded: any = jwt.verify(token, JWT_SECRET) as { id: string }; // Verifies the token using the JWT secret
        req.user = await UserModel.findById( decoded.id).select('-password'); // Attaches the decoded user information to the request object

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next(); // Calls the next middleware or route handler 
    }
    else {
      return res
        .status(401)
        .json({ message: "Unauthorized, no valid token provided" });
    }
    } 
    catch (error) {
    console.error("Token verification failed:", error);
    return (res as any).status(401).json({ message: "Unauthorized, invalid token" });
    }
}