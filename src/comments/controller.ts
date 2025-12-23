import { Response, Request } from 'express';
import pool from '../db/db';
import { DatabaseError } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export async function getCommentController(req: Request, res: Response)
{
    try {
    
        const { id } = req.query;

        if (!id)
        {
            const db_response = await pool.query(
                "SELECT * FROM comments"
            );
            
            res.status(200).json(db_response.rows)
        } 
        
        const db_response = await pool.query(
            "SELECT * FROM comments WHERE id=$1", 
            [id]
        );
        
        if (db_response.rowCount === 0)
        {
            res.status(404).json({ message : "No Such Comment Found" });
        }

        res.status(200).json(db_response.rows)
    } catch (err)
    {
        if (err instanceof DatabaseError) {
            res.status(500).json({ message: err.message })
        } 
        if (err instanceof Error){
            res.status(400).json({ message: err.message })
        }
    }
}

export async function deleteCommentController(req: Request, res: Response)
{
    try 
    {
        const { id } = req.body;
        const db_response = await pool.query(
            "DELETE FROM comments WHERE id=$1",
            [id]
        );

        if (db_response.rowCount === 0)
        {
            res.status(404).json({ message: id + " No Such Object Found" })
        }

        res.status(200).json({ message: id + " Deleted"})
    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            res.status(500).json({ message: err.message })
        }
        if (err instanceof Error)
        {
            res.status(400).json({ message: err.message })
        }
    }
}

export async function updateCommentController(req: Request, res: Response)
{
    try {
        const { id, user_id, post_id, comment, likes, dislikes} = req.body;

        if (!id) {
            res.status(400).json({ message : "Please provide a ID" });
        } else if (!user_id) {
            res.status(400).json({ message : "Please provide a User ID"});
        } else if (!post_id) {
            res.status(400).json({ message : "Please provide a Post ID"});
        } else if (!comment) {
            res.status(400).json({ message : "Please provide a comment"});
        }

        let newLikes, newDislikes;
        if (!likes)
        {
            newLikes = 0
        } else {
            newLikes = likes;
        }

        if (!dislikes)
        {
            newDislikes = 0;
        } else 
        {
            newDislikes = dislikes;
        }

        const updated_at = new Date();

        const db_response = await pool.query(
            "UPDATE comments SET user_id=$2, post_id=$3, comment=$4, likes=$5, dislikes=$6, updated_at=$7 WHERE id=$1", 
            [id, user_id, post_id, comment, newLikes, newDislikes, updated_at]
        )
        
        if (db_response.rowCount == 0)
        {
            res.status(404).json({ message: "Comment with ID " + id + " Not Found" })
        }

        res.status(200).json({ message: id + " Updated" })

    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            res.status(500).json({ message: err.message });
        }
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
    
}

export async function createCommentController(req: Request, res: Response)
{
    try {   
        const { user_id, post_id, comment, likes, dislikes } = req.body;
        
        let updated_likes = likes, updated_dislikes = dislikes;

        if (!user_id)
        {
            res.status(400).json({ message: "Please Provide User ID" });
        }
        if (!post_id)
        {
            res.status(400).json({ message: "Please Provide Post ID" });
        }
        if (!comment)
        {
            res.status(400).json({ message: "Please Provide Comment Text"});
        }
        if (!likes)
        {
            updated_likes = 0;
        }
        if (!dislikes)
        {
            updated_dislikes = 0;
        }

        const id = uuidv4();
        const current_date_time = new Date(); 

        const db_response = await pool.query(
            "INSERT INTO comments (id, user_id, post_id, comment, likes, dislikes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [id, user_id, post_id, comment, updated_likes, updated_dislikes, current_date_time, current_date_time]
        )

        res.status(201).json({ message: id + " Created" })
    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            res.status(500).json({ message: err.message });
        } 
        if (err instanceof Error)
        {
            res.status(400).json({ message: err.message});
        }
    }
}