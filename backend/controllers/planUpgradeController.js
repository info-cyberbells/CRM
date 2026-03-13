import PlanUpgrade from "../models/planUpgrade.js";
import Case from "../models/case.js";
import User from "../models/user.js";

// POST /api/sale/upgrade-plan/:caseId
export const addPlanUpgrade = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { product, amount, validity } = req.body;

        if (!product || !amount || !validity) {
            return res.status(400).json({
                success: false,
                message: "product, amount and validity are required",
            });
        }

        const existingCase = await Case.findOne({ where: { caseId } });
        if (!existingCase) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        const upgrade = await PlanUpgrade.create({
            caseId,
            product,
            amount,
            validity,
            addedById: req.user.id, // 👈 from authGuard
        });

        return res.status(201).json({
            success: true,
            message: "Plan upgraded successfully",
            upgrade,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add plan upgrade",
            error: error.message,
        });
    }
};

// GET /api/sale/get-plan/:caseId
export const getPlanUpgrades = async (req, res) => {
    try {
        const { caseId } = req.params;

        const existingCase = await Case.findOne({ where: { caseId } });
        if (!existingCase) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        const upgrades = await PlanUpgrade.findAll({
            where: { caseId },
            include: [
                {
                    model: User,
                    as: "addedBy",
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            upgrades,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch plan upgrades",
            error: error.message,
        });
    }
};