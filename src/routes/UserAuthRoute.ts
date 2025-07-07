import { Router } from "express";

import { registerNewUser, loginUser } from "../controllers/UserAuthController";

const router = Router();

// Route for user registration
router.post('/sign-up', registerNewUser)

// Route for user login
router.post('/login', loginUser)

export default router; // This router handles user authentication routes, including registration and login.