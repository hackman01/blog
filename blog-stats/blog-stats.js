const route = require('express').Router();
const axios = require('axios');
const _ = require('lodash');



const memoizeFunc = (func,timeout) => {
  
  let cache = {}

   return (...args)=>{
    

    if(cache)
    {
      const { value,timestamp } = cache;
      const currentTime = Date.now()
      if(currentTime - timestamp <= timeout)
      {
        return value;
      }
    }

    const result = func(...args)
    const timeStamp = Date.now()
    cache = {result, timeStamp}

    return result;
   }

}



const stat = async (res)=>{

        const config = {
          headers:{
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
          }
        };

        const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';


        try {
        var data = await axios.get(url,config);

        const length=_.size(data.data.blogs);
        const longestTitle = _.last(_.sortBy(data.data.blogs, [function(o) { return o.title.length; }])).title;
        const privacyBlogs = _.size(_.filter(data.data.blogs, function(e) {return (_.includes(e.title.toUpperCase(),'PRIVACY'))}));
        const uniqueTitles = _.uniq(_.map(data.data.blogs, function(e) { return e.title}));

        const response = {
          length,longestTitle,privacyBlogs,uniqueTitles
        }

        return response

      }catch(err)
      {
        res.status(503).json("Service Unavailable "+err)
      }

}

const memoizedStat = memoizeFunc(stat,3000)

route.get('/',async (req,res)=>{


    try{
    
      const response = await memoizedStat(res)
    return res.send(response);

   }catch(err){

      console.log(err);
      return res.status(503).json("Service Unavailable : "+err);

   }
    
});

module.exports = route;