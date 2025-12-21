import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
const filename=fileURLToPath(import.meta.url)
const dirname=path.dirname(filename)
const app=express()
app.use(express.static(dirname))
const port=8080
app.use(express.json())
app.get('/',(req,res)=>
{
    res.sendFile(dirname,path.join(dirname,'index.html'))
})
const pool=new pkg.Pool({
    connectionString:'postgresql://neondb_owner:npg_sw58OFiXJGeC@ep-odd-truth-a5etezja-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
})
pool.connect()
app.post('/feedback',(req,res)=>
{
    const {name,email,feedback_message}=req.body
    pool.query('insert into public.whatsupp_feedback(name,email,feedback) values($1,$2,$3)',[name,email,feedback_message],(err,result)=>
    {
        return err?res.json({success:false}):result.rowCount===1?res.json({success:true}):res.json({success:false})
    })
})
app.listen(port,()=>
{
    console.log(`http://localhost:${port}`)
})