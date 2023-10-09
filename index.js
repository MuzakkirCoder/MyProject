import varMiddleware from "./midleweare/var.js";
import express from "express";
import { engine, create } from "express-handlebars";
import mongoose from "mongoose";
import flash from 'connect-flash'
import cookieParser from "cookie-parser";
import session from "express-session";
import * as dotenv from 'dotenv';
import userMiddleware from "./midleweare/user.js";
import serverless from 'serverless-http';
const router  = express.Router() 

// Your code here

// Routes
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/product.js";
import hbHelper from './utils/index.js'


dotenv.config()

const app = express()

const hbs = create({ defaultLayout: "main", extname: "hbs", helpers: hbHelper })

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(session({secret: "Muzakkir" , resave: false, saveUninitialized: false}))
app.use('/netlify/functions/', router)


app.use(AuthRoutes);
app.use(ProductRoutes);

const startApp = async () => {
  try {
    mongoose.set("strictQuery", false);
      await   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
      console.log('Mongo DB connection');
    const PORT = process.env.PORT || 4100;
    app.listen(4100, () => console.log(`Server is running ${PORT}`));
  } catch (error) {
   console.log(error);
  }
};


startApp()

export const handler = serverless(app);