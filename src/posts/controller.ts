import { Request, response, Response } from "express";
import pool from "../db/db";
import { v4 as uuidv4 } from "uuid";
import { DatabaseError } from "pg";


export async function createPostController(req: Request, res: Response)
{
    try {
        const { title, image_url, content } = req.body;

        if (!title)
        {
            return res.status(400).json({ message: "Please provide Title" });
        } else if (!image_url)
        {
            return res.status(400).json({ message: "Please provide Image Url" });
        } else if (!content)
        {
            return res.status(400).json({ message: "Please provide Content" });
        }

        const id = uuidv4();
        const created_at = new Date();
        const updated_at = new Date();

        const db_response = await pool.query(
            "INSERT INTO posts (id, title, image_url, content, created_at, updated_at ) VALUES ($1, $2, $3, $4, $5, $6)",
            [id, title, image_url, content, created_at, updated_at]
        );

        return res.status(201).json({ message: id + " Created"});

    } catch (err) {
        if (err instanceof DatabaseError)
        {
            return res.status(500).json({ message: err.message });
        }
        if (err instanceof Error)
        {
            return res.status(400).json({ message: err.message });
        }
    }
}

export async function deletePostController(req: Request, res: Response)
{
    try {
        const { id } =  req.body;

        if (!id)
        {
            return res.status(200).json({ message: "Please send a valid ID"})
        }

        const db_response = await pool.query(
            "DELETE FROM posts WHERE id=$1",
            [id]
        )

        if (db_response.rowCount === 0)
        {
            return res.status(404).json({ message: id + " No Such Object Found" })
        }

        return res.status(200).json({ message : id + " Deleted"})
    
    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            return res.status(500).json({ message: err.message })
        }
        if (err instanceof Error)
        {
            return res.status(400).json({ message: err.message })
        }
    }
}

export async function updatePostController(req: Request, res: Response)
{
    try {
        const { id, title, image_url, content } = req.body;

        if (!id)
        {
            return res.status(400).json({ message: "Please provide a valid ID" });
        } 
        if (!title)
        {
            return res.status(400).json({ message: "Please provide a valid title" });
        }
        if (!image_url)
        {
            return res.status(400).json({ message: "Please provide a valid Image Url"});
        }
        if (!content)
        {
            return res.status(400).json({ message: "Please provide a valid content"})
        }

        const updated_at = new Date();

        const db_response = await pool.query(
            "UPDATE posts SET title=$2, image_url=$3, content=$4, updated_at=$5 WHERE id=$1",
            [id, title, image_url, content, updated_at]
        )

        return res.status(200).json({ message: id + " Updated"})

    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            return res.status(400).json({ message: err.message})
        } 
        if (err instanceof Error)
        {
            return res.status(400).json({ message: err.message })
        }
    }
}

export async function getPostController(req: Request, res: Response)
{
    try {
        const { id, title } = req.query;

        if (!id && !title)
        {
            const db_response = await pool.query(
                "SELECT * FROM posts",
            )
            return res.status(200).json(db_response.rows)
        }

        if (id)
        {
            const db_response = await pool.query(
                "SELECT * FROM posts WHERE id=$1",
                [id]
            )
            return res.status(200).json(db_response.rows)
        }

        if (title)
        {
            const db_response = await pool.query(
                "SELECT * FROM posts WHERE title=$1", 
                [title]
            )
            return res.status(200).json(db_response.rows)
        }
    } catch (err)
    {
        if (err instanceof DatabaseError)
        {
            return res.status(500).json({ message : err.message });
        }
        if (err instanceof Error)
        {
            return res.status(400).json({ message: err.message });
        }
    }

}