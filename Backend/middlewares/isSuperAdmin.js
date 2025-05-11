import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isSuperAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        
        // Check if user exists and is super admin
        const user = await User.findById(decode.userId);
        if (!user || user.role !== 'super_admin') {
            return res.status(403).json({
                message: "Access denied. Super admin privileges required.",
                success: false
            });
        }
        
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export default isSuperAdmin;