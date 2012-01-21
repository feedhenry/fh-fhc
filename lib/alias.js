module.exports  = alias;
alias.getAlias  = getGuitByAlias;
alias.usage     = "\nfhc alias <alias>=<guit>";


var apps    = require("./apps"),
    ini     = require("./utils/ini"),
    prompt  = require("./utils/prompt"),
    fhc     = require("./fhc");

function alias(args,cb){
   if(args.length !==1 || args[0].indexOf("=")=== -1 )cb(alias.usage);

   var bits     = args[0].split("="),
       ali      = bits[0].trim(),
       guit     = bits[1].trim(),
       where    = ini.get("global") ? "global" : "user",
       saved    = undefined;


   validateGuit(guit,function(err){
      if(err)return cb(err);
      validateAlias(ali,function(err){
        
        if(err)return cb(err);
        
        saved   = ini.set(ali,guit,where);
        
        if(saved){
          cb(null,"ok");
        }

     });
   });

};

/**
 *
 * @param guit string 24 character id
 * @param cb function
 * validates the guit passed against the users apps
 */
function validateGuit(guit,cb){

  apps.list(function(err,data){
    if(err)return cb(err);
    
    var max = data.list.length, app = {};
    for(var i = 0; i < max; i++){
        
        if(data.list[i].id === guit){ return cb();};
    }
    //not found so no app

    return cb("no guit found");

  });
};

/**
*@param ali string 
*@param cb function
* validates an alias is ok to use
**/
function validateAlias(ali,cb){
    if(ali.length > 23) return cb("an alias must be less than 24 chars"); 
    //reserved words
    var reserved = ["feedhenry","_password","cookie","username"];
    for(var i = 0; i < reserved.length; i++){
        if(reserved[i]=== ali){
          return cb(ali+" is a reserved word");
        }
    }
    //check to see if the key is already used
    var where = ini.get("global") ? "global" : "user";
    var val   = ini.get(ali,where);
    if(val){
      //todo prompt for override of existing alias
    }
    return cb();
}

/**
 *
 * @param alias string
 * attempts to find guit via its alias
 */
function getGuitByAlias(alias){
    var where = ini.get("global") ? "global" : "user";
    var val   = ini.get(alias,where);
    return ini.get(alias,where);
};



