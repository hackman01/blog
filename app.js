const { json } = require('express');
const express = require('express');

const app=express();
const blogStat = require("./blog-stat/blog-stat");
const blogSearch = require("./blog-search/blog-search");
app.use(json())

app.get('/home',(req,res)=>{
   res.send("start routing!")
})



app.use('/api/blog-stat',blogStat);
app.use('/api/blog-search',blogSearch);

app.listen(8000,()=>{
    console.log("Server started successfully")
})