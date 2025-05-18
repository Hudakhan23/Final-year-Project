import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'super_admin' } })
            .select('-password')
            .populate('profile.company', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all companies with their owners
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('userId', 'fullname email phoneNumber')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all jobs with company and creator details
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('company', 'name logo location')
            .populate('created_by', 'fullname email')
            .populate('applications')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all applications with job and applicant details
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('job', 'title company')
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .populate('applicant', 'fullname email phoneNumber')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Delete user and all associated data
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // If user is a recruiter, delete their company and all jobs
        if (user.role === 'recruiter') {
            // Find and delete all companies owned by this user
            const companies = await Company.find({ userId: userId });
            
            for (const company of companies) {
                // Delete all jobs for this company
                await Job.deleteMany({ company: company._id });
                // Delete the company
                await Company.findByIdAndDelete(company._id);
            }
        }

        // Delete all applications by this user
        await Application.deleteMany({ applicant: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "User and all associated data deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Delete company and all associated jobs
export const deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        // Delete all jobs for this company
        await Job.deleteMany({ company: companyId });

        // Delete all applications for jobs of this company
        const jobs = await Job.find({ company: companyId });
        for (const job of jobs) {
            await Application.deleteMany({ job: job._id });
        }

        // Delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company and all associated data deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'super_admin' } });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalRecruiters,
                totalCompanies,
                totalJobs,
                totalApplications
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};