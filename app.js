const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const { application } = require("express");
const _=require("lodash");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect('mongodb+srv://Raj:raj123@list.opxbg.mongodb.net/my_database');

const tSchema = new mongoose.Schema({
    name:String
});
const collection = mongoose.model('collection',tSchema);

var c1 = new collection({name:"morning walk"});
var c2 = new collection({name:"breakfast"});
var c3 = new collection({name:"newspaper reading"});
var c4 = new collection({name:"spend time with nature!"});

var work =[c1,c2,c3,c4];

// collection.insertMany({work},function(err)
// {
//    if(err) console.log("error in inserting many");
//    else{
//        console.log("everything has been inserted successfully!");
//    }
// });


const ListSchema =new mongoose.Schema(
    {
        name:String,
        items:[tSchema]
    });

const page = mongoose.model('page',ListSchema);

const days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var today = new Date();
var t = today.getDay();
var day =days[t];


app.get('/',function(req,res)
{   
    

    
    
collection.find({},function(err,itemfound)
{
   if(itemfound.length === 0)
   {
    collection.insertMany({work},function(err)
    {
       if(err) {console.log("error in inserting many");}
       else{
           console.log("everything has been inserted successfully!");
       }
    });
    res.redirect("/");
   }
   else{
    res.render('index',{kindofday : day, listitems: itemfound});

   }

});

});   
    
app.get("/:customelistname",function(req,res)
{
    const customelistname = _.capitalize(req.params.customelistname);
   
    page.findOne({name:customelistname},function(err,foundList)
    {
        if(!err) {
            if(!foundList)
            {
                const p1 = new page(
                    {
                        name:customelistname,
                        items:work
                    }
                );
                p1.save();
                res.redirect("/"+ customelistname);
            }
            else{
                 console.log("Exists!");
                res.render('index',{kindofday : foundList.name, listitems: foundList.items});
            }
        }
        else{
            console.log("error found in directing other pages!")
        }
    })
});

   
    // const days =["Sunday","Monday","Tuesday","Wednesday","Friday","Saturday"];
    // var today = new Date();
    // var t = today.getDay();
    // var day =days[t];
  



    

app.post("/",function(req,res)
{
   const activity = req.body.items;
   const title = req.body.add;
   const c = new collection({name:activity});

   if(title === day)
   {
    
    c.save();
    res.redirect("/");
   }
   else{
       page.findOne({name:title},function(err,foundlist)
       {
           if(!err)
           {
               foundlist.items.push(c);
               foundlist.save();
               res.redirect("/" + title);
           }
           else{
               throw err;
            //    console.log("error found in post ");
           }
       });
   }


  
});


app.post("/delete",function(req,res)
{
  
     const removebox = req.body.deletebox;
     const pagename = req.body.delname;
     if(pagename === day){
     collection.findByIdAndRemove(removebox,function(err)
     {
         if(err) {console.log("there is error in deleting.");}
         else{
             console.log("the idbox has been deleted.");
             res.redirect("/");
         }
         
     });
    }
    else{
        page.findOneAndUpdate({name:pagename},{$pull:{items: {_id:removebox}}},function(err)
        {
            if(!err){
                res.redirect("/" + pagename);
            }
        });
    }
  
});


app.listen(3000,function(err)
{  if(err){
    console.log("the server has not connected!");
     }
    else
    {
        console.log("the server has linked!");
    }
});