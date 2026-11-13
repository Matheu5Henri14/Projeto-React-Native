const mysql=require('mysql2/promise'); const {db}=require('./config'); const pool=mysql.createPool(db);
async function checkDatabase(){const c=await pool.getConnection();try{await c.query('SELECT 1')}finally{c.release()}}
module.exports={pool,checkDatabase};