import express from "express";
import userRouter from "./routes/userroute.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app=express();

config({
  path:"./database/config.env",
});

//using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
  })
);

//using routesz
app.use("/api/v1/users",userRouter);
app.get("/",(req,res)=>{
res.send("Welcome");
});




// Using error Middleware
app.use(errorMiddleware);