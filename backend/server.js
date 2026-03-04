const express=require("express");
const cors=require("cors");

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

app.listen(5000,()=>console.log("Server running on 5000"));