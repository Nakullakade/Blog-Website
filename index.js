const express=require("express");
const path= require("path");

const User=require("./models/user.js");

const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog").then(()=>{console.log("Mongo Connected !")});

const cookieParser= require("cookie-parser");

const {checkForAuthenticationCookie}=require("./middleware/auth.js");


const app=express();
const PORT=8010;

const userRoute=require("./routes/user_rout.js");
const blogRoute=require("./routes/blog_rout.js");
const Blog = require("./models/blog.js");

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/", async (req,res)=>{
   const allBlogs= await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})
app.get("/signup",(req,res)=>{
    res.render("signup");
});
app.get("/signin",(req,res)=>{
    res.render("signin");
});

app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.listen(PORT,()=> console.log(`Server Started at port ${PORT}`));