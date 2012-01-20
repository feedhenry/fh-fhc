module.exports  = alias;
alias.getAlias  = getGuitByAlias;
alias.usage     = "\nfhc alias <alias>=<guit>";
var apps    = require("./apps"),
    ini     = require("./utils/ini"),
    prompt  = require("./utils/prompt"),
    fhc     = require("./fhc");

function alias(args,cb){
    console.log(fhc);
   if(args.length !==1 || args[0].indexOf("=")=== -1 )return cb(alias.usage);
   var alias,guit,bits;
   bits     = args[0].split("=");
   alias    = bits[0].trim();
   guit     = bits[1].trim();


   validateGuit(guit,cb);
   validateAlias(alias,cb);


   //valid guit set param in ini
    var where = ini.get("global") ? "global" : "user";
    ini.set(alias, guit, where);
    ini.save(function(err){
        if(err)cb(err);
        cb(null,"saved alias: "+alias+" guit:"+guit);
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
    if(err)cb(err);
    var max = data.list.length, app = {};
    for(var i = 0; i < max; i++){
        if(data.list[i].id === guit) return;
    }
    //not found so no app
    cb("invalid app id. Not in your list of apps");

  });
};

function validateAlias(alias, cb){

    if(alias.length > 23)cb("an alias must be less than 24 chars");
    //reserved words
    var reserved = ["feedhenry","_password","cookie","username"];
    for(var i = 0; i < reserved.length; i++){
        if(reserved[i]=== alias)return cb(alias+" is a reserved word");
    }
    //check to see if the key is already used
    var where = ini.get("global") ? "global" : "user";
    var val   = ini.get(alias,where);
    if(val)prompt("blah","asdsd", false, function (d){
        console.log(d);
    } );
}

/**
 *
 * @param alias string
 * attempts to find guit via its alias
 */
function getGuitByAlias(alias){
    console.log("looking for alias " + alias);
    var where = ini.get("global") ? "global" : "user";
    var val   = ini.get(alias,where);
    if(val)console.log("found value "+val);
    else console.log("no value found for alias");
    return ini.get(alias,where);
};

