import { NextFunction, Request, Response } from "express";
import { dbPool } from "../config/dbConfig.js";

export const getCallsData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await dbPool()
        const { id } = req.body;
        const [rows] = await db.query(`
            SELECT 
                c.id AS company_id,
                c.name AS company_name,
                cl.id AS call_id,
                cl.user_id,
                cl.body,
                cl.call_duration,
                cl.date,
                cl.created_at AS call_created_at,
                cl.updated_at AS call_updated_at,
                co.id AS outcome_id,
                co.name AS outcome_name,
                co.swatch_color AS outcome_color,
                co.created_at AS outcome_created_at,
                co.updated_at AS outcome_updated_at
            FROM tbl_companies c
            JOIN tbl_callables cb 
                ON cb.callable_id = c.id 
            --     AND cb.callable_type = 'Company'
            JOIN tbl_calls cl 
                ON cl.id = cb.call_id
            LEFT JOIN tbl_call_outcomes co
                ON co.id = cl.call_outcome_id
            WHERE c.id = ${id}
            ORDER BY cl.created_at DESC
            Limit 50;
`);
        // res.status(200).json(rows);
        (req as any).callsData = rows;
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
