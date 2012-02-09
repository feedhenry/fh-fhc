/**
 * Created by JetBrains WebStorm.
 * User: kelly
 * Date: 09/02/2012
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */

module.exports  = native;
native.usage    = "usage: fhc native config=<apple | android> app=<appid | alias> [dir=<DIR TO WRIE TO>]\n";
var fhc     = require("./fhc"),
    alias   = require("./alias"),
    common  = require("./common"),
    fs      = require("fs"),
    app     = require("./apps"),
    ini     = require("./utils/ini"),
    configs = {
        apple :{out:"fhconfig.plist", in:"./filetemplates/appleconfig.tpl"}
    };



function native(args,cb){
    var parsed;
    console.log(args);
    if(args.length < 2) return cb(native.usage);
    parsed = common.parseArgs(args);
    app(["read",parsed.app],function (err,data){
        if(err)return cb(err);

        var configOpts          = {},
            domain              = ini.get("feedhenry"),
            parts               = (domain.indexOf(".") !== -1)? domain.split(".") : [];

        configOpts.appinstid    = data.inst.guid;
        configOpts.guid         = data.app.guid;
        configOpts.type         = parsed.config;
        //making assumption here that the domain is always the subdomain is there a better way?
        configOpts.domain       = parts[0].replace(/https?:\/{2}/g,"");
        configOpts.apiurl       = (domain.substr(domain.length -1,1) === "/")?domain+"box/srv/1.1/":domain+"/box/srv/1.1/";

        fillTemplate(configOpts,cb);

        console.log(configOpts);

    });

    console.log(parsed);

};


function fillTemplate(args,cb){
    console.log(node.constants);
    console.log(fs.realpathSync(configs[args.type].in));

};



