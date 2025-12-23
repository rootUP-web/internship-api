import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    // connectionString: connectionString,
    host: "localhost",
    user: "apiapp",
    password: "new_password",
    database: "apidb",
    port: 5432,
});

// const connectionString = 'postgresql://apiapp:new_password@localhost:5432/apidb'
 

// const pool = new Pool({
//     connectionString
// })

export default pool;