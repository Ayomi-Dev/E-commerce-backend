import { NextFunction, Request, Response } from "express";


export const requireAdmin = (req:Request, res:Response, next: NextFunction) => {
    if(!(req as any).user.isAdmin){
        return (res as any).status(403).json({message: "Access Denied!"})
    }
    next()
}