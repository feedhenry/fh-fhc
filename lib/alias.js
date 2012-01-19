module.exports = alias;
alias.getAlias = getGuitByAlias;
var apps    = require("./apps"),
    ini     = require("./utils/ini");

function alias(args,cb){

   if(args.length !==1 || args[0].indexOf("=")=== -1 )return cb("an alias should be in the form of <alias>=<guit>");
   var alias,guit,bits;
   bits     = args[0].split("=");
   alias    = bits[0].trim();
   guit     = bits[1].trim();


   validate(guit,cb);

   if(alias.length > 23)cb("an alias must be less than 24 chars");
   //valid guit set param in ini
    var where = ini.get("global") ? "global" : "user";
    ini.set(alias, guit, where);
    ini.save(function(err){
        if(err)cb(err);
        cb(null,"saved alias: "+alias+" guit:"+guit);
    });

};


function validate(guit,cb){
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

function getGuitByAlias(alias){
    console.log("looking for alias " + alias);
    var where = ini.get("global") ? "global" : "user";
    var val   = ini.get(alias,where);
    if(val)console.log("found value "+val);
    else console.log("no value found for alias");
    return ini.get(alias,where);
};

