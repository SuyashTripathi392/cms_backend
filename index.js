import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import certificatesRoutes from './routes/certificatesRoutes.js';
import contactDetailsRoutes from './routes/contactDetailsRoutes.js';


const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend URL
  credentials: true // <- must for cookies
}));
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('CMS server is running ')
})

app.use('/api/auth',authRoutes)
app.use('/api/about',aboutRoutes)
app.use('/api/skills',skillsRoutes)
app.use('/api/projects',projectsRoutes)
app.use('/api/contact',contactRoutes)
app.use('/api/certificates',certificatesRoutes)
app.use("/api/contact-details", contactDetailsRoutes);





const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})