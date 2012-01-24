module.exports          = alias;
alias.getAlias          = getGuitByAlias;
alias.getAliasByGuit    = getAliasByGuit;
alias.usage             = "\nfhc alias <alias>=<guit>";
alias.reserved          = ["feedhenry","_password","cookie","username"];


var apps    = require("./apps"),
    ini     = require("./utils/ini"),
    prompt  = require("./utils/prompt"),
    fhc     = require("./fhc"),
    fhcfg   = require("./fhcfg")

function alias(args,cb){
   if(args.length !==1 || args[0].indexOf("=")=== -1 )cb(alias.usage);
   var bits     = args[0].split("="),
       ali      = bits[0].trim(),
       guit     = bits[1].trim()
   //validation
   validateGuit(guit,function(err){
      if(err)return cb(err);
      validateAlias(ali,function(err){
        if(err)return cb(err);
        //all good
        var set = ini.set(ali,guit,"user");
        if(set === guit){
            ini.save(function (err) {
                if(err)return cb(err);
                return cb(null,"ok");
            });

        }
        else return cb("an error occurred setting the alias");
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
    var checkedVal;
    if(ali.length > 23) return cb("an alias must be less than 24 chars"); 

    if(isReserverd(ali)) return cb(ali + " is reserved");

    //check to see if the key is already used
    checkedVal  = ini.get(ali,"user");
    if(checkedVal){

        return prompt("the alias "+ali+" already exists. Override ? (y/n)","",false,function(er,val){
            if(er) return cb(er);
            if(val.toLowerCase() === "y"){
                return cb(null);
            }else{
                return cb("alias cancelled");
            }
        });
   }

    return cb(null);

};

/**
 *
 * @param alias string
 * attempts to find guit via its alias
 */
function getGuitByAlias(alias){

   return ini.get(alias);
};

function isReserverd (prop){

    for(var i = 0; i < alias.reserved.length; i++){

        if(alias.reserved[i] === prop){
            return true;
        }
    }
    return false;
};

function getAliasByGuit(guit){
    var props = ini.configList.list[ini.TRANS.user],
        key;
    for(key in props){
        if(props.hasOwnProperty(key) && isReserverd(key) === false){
            if(props[key] === guit) return key;
        }
    }
    return undefined;

};



