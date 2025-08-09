import { Router } from "express";
import { protect } from "../middleware/userAuthMiddleware"; // Importing the authentication middleware

import { registerNewUser, loginUser, deleteUser, getUsers, editUserInfo, getUserById } from "../controllers/UserAuthController";
import { UserModel } from "../models/UserModel"; // Importing the User model for database operations
import { requireAdmin } from "../middleware/adminAuth";
import upload from "../utils/multer";

const router = Router();

// Route for user registration
router.post('/sign-up', registerNewUser)

// Route for user login
router.post('/login', loginUser)

router.get('/profile', protect, async (req, res) => {
    try{
        const user = await UserModel.findById((req as any).user).select('-password'); // Fetching the user profile excluding password and version fields

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: `Welcome ${user.name}, you are logged in successfully`,
            // Accessing the user ID from the request object set by the protect middleware
            _id: user._id, 
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image,
            address: user.address,
            phone: user.phone
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/profile/edit/:id', protect, getUserById);

router.put('/profile/edit/:id', protect, upload.single("image"), editUserInfo);
// router.put('/profile/edit/:id', protect, upload.single("image"), (req,res) => {
//     console.log('upload passed')
//     res.send('all good')
// });


router.get("/admin/all-users", protect, requireAdmin, getUsers )

router.delete("/deactivate/:id", protect, requireAdmin, deleteUser)

export default router; // This router handles user authentication routes, including registration and login