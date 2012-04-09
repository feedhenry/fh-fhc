module.exports = server;
server.usage = ["",
				"fhc build app=<appId> domain=<domain> port=<port> package=<package>",
				"where domain is the domain where your the app is hosted",
				"'port' is not required, the default port is 8888",
				"'package' is not required, but is used to select the package directory to look in for files",
				""].join("\n");


var http = require("http"),
	https = require("https"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	common = require("./common"),
	mimeTypes = {
		js: "text/javascript",
		css: "text/css",
		html: "text/html",
		xml: "text/xml",
		txt: "text/plain"
	},
	defaultArgs = {
		baseDomain: {
			required: true,
			val: ".feedhenry.com"
		},
		port: {
			required: true,
			val: 8888
		},
		domain: {
			required: true
		},
		app: {
			required: true
		},
		package: {
			required: false
		}
	},
	lookupDirs = [
		'shared'
	],
	injection = {
		viewport: '<meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0" />',
		device: '<script src="fhext/js/container.js"></script>'
	};


http.ServerResponse.prototype.writeError = function(code, desc) {
	this.writeHead(code, {
		"Content-Type": mimeTypes.txt
	});
	this.end(desc + "\n");
}


function fileExists(uri, cb) {
	var lookupIndex = 0;

	(function checkPath(filename) {
		filename = path.join(process.cwd(), filename);

		path.exists(filename, function(exists) {
			if(!exists) {
				if(lookupIndex >= lookupDirs.length) {
					cb && cb(false);
				}
				else {
					checkPath(uri.replace("client/default", lookupDirs[lookupIndex++]));
				}
			}
			else {
				cb && cb(true, filename);
			}
		});	
	})(uri);
}


function validateArgs(args) {
	for(var i in defaultArgs) {
		var defaultArg = defaultArgs[i];
		if(args[i] === undefined) {

			if(defaultArg.required) {
				if(!defaultArg.val) {
					throw new Error("Missing '" + i + "' parameter")
				}
				else if(defaultArg.val) {
					args[i] = defaultArg.val;
				}
			}
		}
	}
}

function server(args, cb) {
	try{
		var argObj = common.parseArgs(args);
		validateArgs(argObj);
	} catch (x) {
		return cb("Error processing args: " + x + "\nUsage: " + server.usage);
	}


	if(argObj.package) {
		lookupDirs.push("client/" + argObj.package);
	}

	var domain = argObj.domain + argObj.baseDomain,
		browserScript = '<script src="https://' + domain + '/static/pec/script/studio/155-scripts.js"></script>',
		initialiseScript = 
		'<script>' +
		'$fhclient = $fh.init({' +
			'appMode:"debug",' +
			'checkDeliveryScheme:true,' +
			'debugCloudType:"fh",' +
			'debugCloudUrl: "https://' + domain + '",' +
			'deliveryScheme:"https://",' +
			'destination: {' +
				'inline:false,' +
				'name:"studio"' +
			'},' +
			'domain: "' + argObj.domain + '",' +
			'host: "' + domain + '",' +
			'nameserver:"https://ainm.feedhenry.com",' +
			'releaseCloudType:"fh",' +
			'releaseCloudUrl:"https://' + domain + '",' +
			'swagger_view:"Sju8tJFwM7kox_S1rr1wZ2PS",' +
			'urltag:"",' +
			'useSecureConnection:true,' +
			'user:{' +
				'id:"YqxcBngHv4nt3j1VstTjQj0X",' +
				'role:"sub"' +
			'},' +
			'widget:{' +
				'guid:"' + argObj.app + '",' +
				'inline:false,' +
				'instance: "' + argObj.app +'",' +
				'version:328' +
			'}' +
		'});' +
		'</script>';

	http.createServer(function handleRequest(request, response) {

		var requestParams = url.parse(request.url, true),
			uri = requestParams.pathname;

		if(request.method === "POST") {
			var proxyReq = https.request({
				path: uri,
				method: request.method,
				host: domain,
				headers: request.headers
			}, function(proxyRes) {
				response.writeHead(proxyRes.statusCode, proxyRes.headers);

				proxyRes.on("data", function(chunk) {
					response.write(chunk);
				});
				proxyRes.on("end", function() {
					response.end();
				});
			});

			request.on("data", function(chunk) {
				proxyReq.write(chunk);
			});

			request.on("end", function() {
				proxyReq.end();
			});
		}
		else {
			fileExists(uri, function(exists, filename) {
				if(!exists) {
					return response.writeError(404, "Not Found");
				}

				if (fs.statSync(filename).isDirectory()) 
					filename += '/index.html';

				fs.readFile(filename, "binary", function(err, file) {
					if(err) {
						return response.writeError(500, err);
					}

					response.writeHead(200,{
						"content-type": mimeTypes[filename.split(".").pop()] || mimeTypes.txt
					});
					if(filename.indexOf("index.html") > 0) {
						response.write(injection.viewport);
						response.write(requestParams.query.device !== undefined ? injection.device : browserScript);
						response.write(initialiseScript);
					}
					response.end(file, "binary");
				});
			});
		}

	}).listen(parseInt(argObj.port, 10));

	console.log("listening on port:", argObj.port);
	
}