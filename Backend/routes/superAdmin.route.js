import express from "express";
import { 
    getAllUsers, 
    getAllCompanies, 
    getAllJobs, 
    getAllApplications, 
    deleteUser, 
    deleteCompany,
    getDashboardStats 
} from "../controllers/superAdmin.controller.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.js";

const router = express.Router();

// All routes require super admin authentication
router.use(isSuperAdmin);

// Dashboard stats
router.route("/dashboard").get(getDashboardStats);

// Get all data
router.route("/users").get(getAllUsers);
router.route("/companies").get(getAllCompanies);
router.route("/jobs").get(getAllJobs);
router.route("/applications").get(getAllApplications);

// Delete operations
router.route("/users/:userId").delete(deleteUser);
router.route("/companies/:companyId").delete(deleteCompany);

export default router;