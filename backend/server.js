const express=require("express");
const cors=require("cors");
const path=require("path");
require("dotenv").config();
const authRoutes=require("./routes/auth");
const formRoutes=require("./routes/forms");
const submitRoutes=require("./routes/submit");

const app=express();

app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use("/filled",express.static("filled"));

app.use("/api/auth",authRoutes);
app.use("/api/forms",formRoutes);
app.use("/api/submit",submitRoutes);

const distPath=path.join(__dirname,"..","dist");
app.use(express.static(distPath));
app.get("*",(req,res)=>{
  res.sendFile(path.join(distPath,"index.html"));
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server running on ${PORT}`));