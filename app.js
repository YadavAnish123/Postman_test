// const dbConnect = require('./mongodb');
const express = require('express');
const app = express();
const mongoose=require("mongoose");
app.use(express.json());
 
const sch={
    name:String,
    email:String,
    phone:Number
}

mongoose.connect('mongodb://localhost:27017/myapp');
const MyModel = mongoose.model('Test', sch);
// Works
MyModel.findOne(function(error, result) { /* ... */ });

// const monmodel=mongoose.model("empdata",sch)
app.post("/insert",async (req,resp)=>{
    console.log("inside the post function");
    const data=new MyModel({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    })
    const val=await data.save();
    resp.json(val);
})

//update by phone number
app.put("/update/:phone",async (req,resp)=>{
    let upphone=req.params.phone;
    let upname= req.body.name;
    let upemail=req.body.email;

    MyModel.findOneAndUpdate({phone:upphone},{$set:{name:upname,email:upemail}},
        {new:true},(err,data) =>{
            if(data==null)
            {
                resp.send("nothing found")
            }
            else{
                resp.send(data)
            }

        })

})
 
// fetch all data
app.get("/fetchall",(req,res)=>{
    MyModel.find((err,val)=>{
        if(err)
        {
            console.log(err)
        }else{
            res.json(val)
        }
    })
})

//deleteOne
app.delete("/delete/:phone",function(req,res){
    let delphone=req.params.phone;
    MyModel.findOneAndDelete(({phone:delphone}),function(err,docs){
        res.send(docs)
    })
})

//find by phone number
app.get("/find/:phone",function(req,res){
    let delphone=req.params.phone;
    MyModel.find(({phone:delphone}),function(err,docs){
        res.send(docs)
    })
})
app.listen(3000,()=>{
    console.log("runing...")
})
