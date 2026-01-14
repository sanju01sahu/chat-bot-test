import { NextFunction, Request, Response } from "express";
import { dbPool } from "../config/dbConfig.js";

export const getVisitsData =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await dbPool()
        const {id} = req.body;
        const [rows] = await db.query(`
        SELECT
            c.id AS company_id,
            c.name AS company_name,
            a.id AS activity_id,
            a.title,
            a.description,
            a.note,
            a.due_date,
            a.due_time,
            a.end_date,
            a.end_time,
            a.reminder_minutes_before,
            a.reminder_at,
            a.reminded_at,
            a.user_id,
            a.owner_assigned_date,
            a.activity_type_id,
            at.name AS activity_type_name,
            at.swatch_color AS activity_type_color,
            at.icon AS activity_type_icon,
            at.flag AS activity_type_flag,
            a.completed_at,
            a.import_id,
            a.created_by,
            a.created_at AS activity_created_at,
            a.updated_at AS activity_updated_at
        FROM tbl_companies c
        JOIN tbl_activityables ab 
            ON ab.activityable_id = c.id
        --     AND ab.activityable_type = 'Company'
        JOIN tbl_activities a 
            ON a.id = ab.activity_id
        LEFT JOIN tbl_activity_types at 
            ON at.id = a.activity_type_id
        WHERE c.id = ${id}
        ORDER BY a.created_at DESC
        Limit 50;
        `);

        (req as any).visitsData = rows;
        next()
    } catch (error) {
        console.error("Error fetching visit data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
