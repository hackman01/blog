const route = require('express').Router();
const axios = require('axios');
const _ = require('lodash');



const memoizeFunc = (func,timeout) => {
  
  let cache = {}

   return (text,...args)=>{
    const key = JSON.stringify(text)

    if(cache.key)
    {
      const { value,timestamp } = cache[key];
      const currentTime = Date.now()
      if(currentTime - timestamp <= timeout)
      {
        return value;
      }
    }

    const result = func(text,...args)
    const timeStamp = Date.now()
    cache[key] = {value:{result, timeStamp}}

    return result;
   }

}

const search =  async (text,res)=>{

  const config = {
    headers:{
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
    }
  };
const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
let result;
  try{
    var data = await axios.get(url,config);
    
   result = _.filter(data.data.blogs, function (e){return _.includes(e.title.toUpperCase(),text.toUpperCase())})
   
  }catch(err)
  {
    console.log(err)
    res.status(503).json("Service Unavailable "+err)
    
  }
  return result;
}

const memoizedSearch = memoizeFunc(search,3000); 


route.get('/',async (req,res)=>{
    const text = req.query.query;
    
   try {
    
    
    
    const ans = await memoizedSearch(text,res)
    
    return res.status(200).json(ans);
   
  
  }catch(err){
    console.log(err);
    return res.status(503).json("Service Unavailable : "+err);
   }
})



module.exports = route