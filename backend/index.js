import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({});
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import path from "path";



const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}
app.use(cors(corsOptions)); 




app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/vite-project/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend","vite-project", "dist", "index.html"));
})


app.get("/", (req, res) => {
  return res.status(200).json({
    message: "coming from backend form /",
    success: true,
  })
})

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening on port ${PORT}`);
})
