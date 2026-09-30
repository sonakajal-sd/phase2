import pool from "./connection";

async function testConnection(){
    try{
        const result= await pool.query("SELECT NOW()");

        console.log("Database connected successfully");
        console.log(result.rows[0]);
    }catch(error){
        console.log("Database connnection failed:", error);
    }finally{
        await pool.end();
    }
}

testConnection();