import { Request, Response } from "express";
import { dbPool } from "../config/dbConfig.js";

export const getCompanyData = async (req: Request, res: Response) => {
    try {
        const db = await dbPool();
        const { id } = req.query;
        const [rows] = await db.query(`SELECT * FROM tbl_companies WHERE id = ${id}`);
        res.json({ message: "Company data fetched successfully", data: rows });
    } catch (error) {
        console.error("Error fetching company data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};