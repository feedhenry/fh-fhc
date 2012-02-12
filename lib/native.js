/**
 * Created by JetBrains WebStorm.
 * User: kelly
 * Date: 09/02/2012
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */

module.exports  = native;
native.usage    = "usage: fhc native config=<apple | android> app=<appid | alias> [dir=<PATH TO DIR TO WRIE FILE (CLI only)>]\n";
var fhc         = require("./fhc"),
    alias       = require("./alias"),
    common      = require("./common"),
    fs          = require("fs"),
    app         = require("./apps"),
    ini         = require("./utils/ini"),
    configs = {
        apple:  {write:"fhconfig.plist", read:"./lib/filetemplates/appleconfig.tpl"},
        android:{write:"fhconfig.xml",read:"./lib/filetemplates/androidconfig.tpl"}
    };


function native(args, cb) {
    var parsed;
    if (args.length < 2) return cb(native.usage);
    parsed = common.parseArgs(args);
    validateArgs(parsed,function (err) {
        if(err)return cb(err);
        //read config of the passed in app
        app(["read", parsed.app], function (err, data) {
            if (err)return cb(err);

            var configOpts  = {},
                domain      = ini.get("feedhenry"),
                parts       = (domain.indexOf(".") !== -1) ? domain.split(".") : [];

            configOpts.appinstid    = data.inst.guid;
            configOpts.guid         = data.app.guid;
            configOpts.type         = parsed.config.toLowerCase();
            //making assumption here that the domain is always the subdomain is there a better way?
            configOpts.domain       = parts[0].replace(/https?:\/{2}/g, "");
            configOpts.apiurl       = (domain.substr(domain.length - 1, 1) === "/") ? domain + "box/srv/1.1/" : domain + "/box/srv/1.1/";

            fillTemplate(configOpts, function (err, data) {
                if (err)return cb(err);
                if(parsed.dir){
                    fs.realpath(parsed.dir, function (err, path){
                        if(err) return cb(null, "Unable to resolve dir"+parsed.dir+"\n Config Contents:\n"+data);
                        var file = configs[parsed.config].write;
                        file = (path.substr(-1) === "/")?path+file : path+"/"+file;
                        fs.writeFile(file,data,"UTF-8",function (err,suc) {
                            if(err)return cb(null,"Unable to write file "+file+"\n Config Contents:\n"+data);
                            else return cb(null,"native config written to "+file);
                        });
                    });
                }else{
                    return cb(null,data);
                }
            });
        });
    });
}


function fillTemplate(args, cb) {

    var realPath = fs.realpathSync(configs[args.type].read);
    fs.readFile(realPath, "UTF-8", function (err, data) {
        var propkey;
        if (err)return cb(err);
        for (propkey in args) {
            if (args.hasOwnProperty(propkey)) {
                var regex = new RegExp("#" + propkey + "#");
                data = data.replace(regex, args[propkey]);
            }
        }
        return cb(null, data);
    });
}

function validateArgs(args,cb){
   var valid = true;
   valid = ('object' === typeof args);
   valid = (valid)?(args.app):valid;
   valid = (valid)?(args.config) :valid;

   if(! valid) return cb(native.usage);

    var currentSupport   = Object.keys(configs),
        supported        = false;
   for(var i = 0; i < currentSupport.length; i++){
       if(args.config.toLowerCase() === currentSupport[i]){
           supported = true;
           break;
       }
   }

    if(! supported)return cb(native.usage);
    return cb();

}


