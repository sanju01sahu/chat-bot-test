import { Request, Response } from 'express';
import { dbPool } from '../config/dbConfig.js';

// GET /companies?search=abc
export const getCompanies = async (req: Request, res: Response) => {
    try {
        const db = await dbPool();
        const search = (req.query.search as string || '').trim();

        if (!search) {
            return res.status(400).json({ message: 'Search query is required.' });
        }
        // Use dbPool to query tbl_companies instead of Prisma
        const [companies] = await db.query(
            `SELECT * FROM tbl_companies WHERE name LIKE ? ORDER BY name ASC`,
            [`${search}%`]
        );
        res.json(companies)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};