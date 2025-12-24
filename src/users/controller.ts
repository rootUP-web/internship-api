import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db/db";
import { DatabaseError } from "pg";
import { checkPassword, hashPassword } from "../utils/passwordManager";
import jsonwebtoken from 'jsonwebtoken';
import { getToken } from "../utils/tokenManager";

export async function createAccountController(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, username, password, phone } = req.body;

    if (!first_name || !last_name || !email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = uuidv4();
    const now = new Date();
    const hashedPassword = await hashPassword(password);

    await pool.query(
      `INSERT INTO users 
      (id, first_name, last_name, email, username, password, phone, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, first_name, last_name, email, username, hashedPassword, phone, now, now]
    );

    return res.status(201).json({ message: `${id} Created` });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      return res.status(409).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAccountController(req: Request, res: Response) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Please provide ID" })
        }

        const db_response = await pool.query("DELETE FROM users WHERE id = $1", [id])

        if (db_response.rowCount === 0) {
            return res.status(404).json({ message: id + " No Such Object Found" })
        }


        res.status(200).json({ message: id + " Deleted" })
    } catch (err: unknown) {
        if (err instanceof DatabaseError) {
            return res.status(500).json({ message: err.message })
        }
    }
}

export async function updateAccountController(req: Request, res: Response) {

    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Please provide ID" })
        }
        const { first_name, last_name, password, phone } = req.body;

        const updated_at = new Date();

        const db_response = await pool.query(
            "UPDATE users SET first_name=$1, last_name=$2, password=$3, phone=$4, updated_at=$5 WHERE id=$6",
            [first_name, last_name, password, phone, updated_at, id]
        )
        res.status(200).json({ message: id + " Updated" });
    } catch (err: unknown) {
        if (err instanceof DatabaseError) {
            return res.status(500).json({ message: err.message })
        }
    }

}

export async function getUserController(req: Request, res: Response) {
    try {
        const id = req.query.id;
        const email = req.query.email;

        if (!id && !email) {
            const db_response = await pool.query("SELECT * FROM users");
            return res.status(200).json(db_response.rows)
        }

        if (id) {
            const db_response = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
            if (db_response.rowCount === 0)
            {
                res.status(404).json({ message : "No Such Record Found" })
            }
            return res.status(200).json(db_response.rows)
        }

        if (email) {
            const db_response = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
            if (db_response.rowCount === 0)
            {
                res.status(404).json({ message : "No Such Record Found" })
            }
            return res.status(200).json(db_response.rows)
        }

    } catch (err: unknown) {
        if (err instanceof DatabaseError) {
            res.status(500).json({ message: err.message })
        }
    }
}

export async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide proper credentials" });
        }

        const db_response = await pool.query(
            "SELECT id, email, username, password FROM users WHERE email=$1",
            [email]
        )

        if (db_response.rowCount === 0)
        {
            res.status(404).json({ message: "User Not Found" })
        }

        const db_password = db_response.rows[0].password;

        const password_match = await checkPassword(password, db_password)

        if (password_match)
        {
            var token = getToken({
                id: db_response.rows[0].id,
                username: db_response.rows[0].username,
                email: db_response.rows[0].email
            })
            return res.status(200).json({ token: token });
        }

        return res.status(200).json({ message: "Password Didn't Match" });

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