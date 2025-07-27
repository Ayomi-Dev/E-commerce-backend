import { NextFunction, Request, Response } from "express";

interface UserAuthRequest extends Request {
    user?: {
        isAdmin?:boolean
    }
}


export const requireAdmin = (req:UserAuthRequest, res:Response, next: NextFunction) => {
    
    if(!req.user?.isAdmin){
        return (res as any).status(403).json({message: "Access Denied!"})
    }
    next()
} 