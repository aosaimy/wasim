/**
This file is the server that handle requests via browser. it can be run by: node server.js
params: none
*/
var json_comments = require('json-comments');
var async = require('async');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var md5 = require('md5');
var multer = require('multer');
var fs = require('fs-extra');
var path = require('path');
var util = require('util');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
var uid = require('node-uuid');
var app = express();
var crypto = require('crypto');
var config = require('./config');
var http = require("http");
var conllu = require(config.resultConllU_path+"resultConllU")
var querystring = require('querystring')
// if(config.require && Array.isArray(config.require)){
//     config.required = {}
//     config.require.forEach(x=>config.required[x[0]] = require(x[1]))
// }

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

var user = "abobander"
var ma = require(config.ma.require)

// list = {
//     MT: "ATKS Tagger",
//     KH: "AlKhalil",
//     AR: "AraComLex",
//     EX: "Elixir",
//     MD: "Mada",
//     MA: "MadaAmira",
//     QA: "QAC",
//     Raw: "Raw",
//     BP: "buckwalter",
//     BJ: "javaBW",
//     ST: "stanford",
//     SW: "Sawalha",
//     MR: "MarMoT",
//     WP: "Sapa",
//     AM: "Amira",
//     FA: "Farasa",
// };

var dls = {
    inits: {
        initApp: function() {

            // Add headers
            app.use("/", express.static(path.join(__dirname, 'public')));
            app.use(function(req, res, next) {

              var allowedOrigins = [config.wasim_client_url, 'http://localhost', 'http://wasim.al-osaimy.com'];
              var origin = req.headers.origin;
              if(allowedOrigins.indexOf(origin) > -1){
                    // Website you wish to allow to connect
                   res.setHeader('Access-Control-Allow-Origin', origin);
              }


                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

                res.setHeader('Access-Control-Allow-Credentials', true);

                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                //res.setHeader('Access-Control-Allow-Credentials', true);

                // Pass to next layer of middleware
                next();
            });
            // app.use(bodyParser({limit: '50mb'}));
            app.use(bodyParser.urlencoded({
                limit: '50mb',
                extended: true
            }));
            app.use(bodyParser.json({limit: '50mb'}));
            app.use(function(err, req, res, next) {
                console.error(err.stack);
                res.status(500).send('Something broke!');
            });
            app.use(session({
                genid: function(req) {
                    return uid.v4(); // use UUIDs for session IDs
                },
                secret: 'as2d&f,',
                saveUninitialized: false,
                resave: false,
            }))
            app.use(multer({
              dest: config.uploadDir,
              rename: function (fieldname, filename) {
                return filename + Date.now();
              },
              onFileUploadStart: function (file) {
                console.log(file.originalname + ' is starting ...');
              },
              onFileUploadComplete: function (file) {
                console.log(file.fieldname + ' uploaded to  ' + file.path);
              }
            }).array('file',100));

            if(!config.port){
                console.error("config.port is not set");
                process.exit(1);
            }
            app.listen(config.port, x=> console.log("You can access Wasim API from http:://localhost:"+config.port))
        },
        initPosts: function() {
            //routes
            for (var i in dls.requests) {
                app.post('/' + i, dls.requests[i]);
            }
            for (var i in dls.requestsGet) {
                app.get('/' + i, dls.requestsGet[i]);
            }

        },
    },
    requestsGet: {
    },
    requests: {
        conllu: function(request, res) {
            var r = request.body;
            var argv = r//.argv
            if(fs.existsSync('/morpho/conllu/'+ r.sorah + "-" + r.ayah)){
                var d = fs.readFileSync('/morpho/conllu/'+ r.sorah + "-" + r.ayah,"utf8")
                return res.send({ok:true,data:d})
            }

            argv.f = "/morpho/output/unique/" + r.sorah + "-" + r.ayah + ".json"
            if(!fs.existsSync(argv.f))
                return res.send({ok:false,error:"No such file: "+r.sorah + "-" + r.ayah + ".json"})
            conllu.toConllu(argv,function(data){
                res.send({ok:true,data:data})
                fs.writeFile('/morpho/conllu/'+ r.sorah + "-" + r.ayah, data, (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
                });

            })
        },
        projects_list: function (request, res) {
            var r = request.body;
            var argv = r//.argv
            console.log(argv.security)
            if(argv.security != config.security)
                return res.json({ok:false,error: "wrong security code"})
            fs.readdir(path.join(config.wasim,user), function(err, items) {
                // for (var i=0; i<items.length; i++) {
                //     console.log(items[i]);
                // }
                return res.json({ok:true,projects: items.filter(x=>!/^\./.test(x)).map(i=>new Object({
                    project: i,
                    hash: md5(i+config.salt)
                }))})
            });
        },
        projects_create: function (request, res) {
            var r = request.body;
            var argv = r//.argv
            if(argv.security != config.security)
                return res.json({ok:false,error: "wrong security code"})
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name already exist"})
            }
            fs.mkdirSync(path.join(config.wasim,user,argv.project));
            var git = require('simple-git')(path.join(config.wasim,user,argv.project)).init()
            if(config.remote)
                git.addRemote("origin","git@al-osaimy.com:wasim.org/"+argv.project+".git",function(){
                    //TODO
                })
            else
                res.json({ok:true,project:argv.project, hash: md5(argv.project+config.salt)})
        },

        projects_remove: function (request, res) {
            var r = request.body;
            var argv = r//.argv
            if(argv.security != config.security)
                return res.json({ok:false,error: "wrong security code"})
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "path must be alphanumbers"})
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist"})
            }
            fs.fs.removeSync(fs.existsSync(path.join(config.wasim,user,argv.project)));
            res.json({ok:true,msg:"project has been successfuly deleted"})
        },
        conllu_list: function (request, res) {
            var r = request.body;
            var argv = r//.argv
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist"})
            }

            fs.readdir(path.join(config.wasim,user,argv.project), function(err, items) {
                // for (var i=0; i<items.length; i++) {
                    // console.log(items[i]);
                // }
                return res.json({ok:true,files: items.filter(x=>!/^\./.test(x))})
            });

        },
        conllu_get: function (request, res) {
            var r = request.body;
            var argv = r//.argv
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project,argv.file))){
                return res.json({ok:false,error: "file name does not exist"})
            }
            var file = fs.readFileSync(path.join(config.wasim,user,argv.project,argv.file),"utf8")
            return res.json({ok:true,file: file})
        },
        conllu_upload: function (req, res) {
            if(!req.headers.authorization){
                return res.json({ok:false,file: "no authorization header is set"})
            }
            var arr = req.headers.authorization.split(":")
            if(arr.length!=2){
                return res.json({ok:false,file: "authorization header is not set properly"})
            }
            if(md5(arr[0]+config.salt) !== arr[1]){
                return res.json({ok:false,file: "authorization hash is not correct"})
            }
            if(!/^[_0-9a-zA-Z]+$/.test(arr[0]))
                return res.json({ok:false,error: "path must be alphanumbers"})

            var files  = req.files
            files.forEach(f=>{
                console.log(path.join(f.destination+f.filename),path.join(config.wasim,user,arr[0],f.originalname))
                fs.renameSync(path.join(f.destination+f.filename),path.join(config.wasim,user,arr[0],f.originalname))
            })

            console.log("here",req.files)

            return res.json({ok:true,msg: "file has been uploaded successfuly"})
        },
        conllu_save: function(request, res) {
            var r = request.body;
            var argv = r//.argv
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project,argv.pageid))){
                return res.json({ok:false,error: "file name does not exist"})
            }
            fs.writeFile(path.join(config.wasim,user,argv.project,argv.pageid), r.data, (err) => {
              if (err) throw err;
              res.send({ok:true})

               var git = require('simple-git')(path.join(config.wasim,user,argv.project)).add(path.join(config.wasim,user,argv.project,argv.pageid)).commit("Automatic Save from Wasim")
               if(config.remote)
                    git.push("origin","master")
            });
        },
        conllu_remove: function(request, res) {
            var r = request.body;
            var argv = r//.argv
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist"})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project,argv.pageid))){
                return res.json({ok:false,error: "file name does not exist"})
            }
            fs.remove(path.join(config.wasim,user,argv.project,argv.pageid), (err) => {
              if (err) throw err;
              res.send({ok:true})

              var git = require('simple-git')(path.join(config.wasim,user,argv.project)).rm(path.join(config.wasim,user,argv.project,argv.pageid)).commit("Automatic Remove from Wasim")
              if(config.remote)
                    git.push("origin","master")



            });
        },

        conllu_udpipe: function (request, res) {
            var argv = request.body;
            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})
            if(!/^[_0-9a-zA-Z]+$/.test(argv.newFilename))
                return res.json({ok:false,error: "newFilename must be alphanumbers"})
            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct"})
            }
            var postData = querystring.stringify({
              'tokenizer': true,
              'tagger': true,
              'data': argv.sentence,
              'model': argv.model || undefined
            })
            console.log(querystring.stringify(postData))
            try{
              var req = http.request({
                  url: config.udpipe.url,
                  port: config.udpipe.port,
                  method: 'POST',
                  path: '/process',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-Length': Buffer.byteLength(postData)
                  }
              },function (ress) {
                  if (ress.statusCode != 200) {
                      console.error(ress.statusCode)
                  }
                  var response = []
                  ress.setEncoding('utf8');
                  ress.on('data', (chunk) => {
                      // console.log(`${chunk}`);
                      response.push(chunk)
                    });

                  ress.on('end',()=>{
                      try{
                          var result = JSON.parse(response.join(''))
                          fs.writeFile(path.join(config.wasim,user,argv.project,argv.newFilename), result.result)
                          return res.json({ok:true, filename: argv.newFilename})
                      }
                      catch(e){
                          return res.json({ok:false,error: "udpipe did not returned a proper JSON response."})
                      }

                  })
              })
              req.write(postData)
              req.end();
            }
            catch(e){
              return res.json({ok:false,error: "connection to udpipe failed.", details: e})
            }
        },
        guidelines: function(request, res) {
            var r = request.body;
            var argv = r//.argv
            var result = {}

            var guides = ["specialPos","specialSeg"].map(v=>{
                if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                    return {ok:false,error: "project name does not exist"}
                }
                if(! fs.existsSync(path.join(config.wasim,user,argv.project,"."+v+".json"))){
                    return {ok:false,error: "file name does not exist"}
                }
                r[v] = fs.readFileSync(path.join(config.wasim,user,argv.project,"."+v+".json"),"utf8")
                try{
                    return {ok:true,data:JSON.parse(r[v]),type:v}
                }
                catch(e){
                    console.error(path.join(config.wasim,user,argv.project,"."+v+".json", "is not proper JOSN formatted"))
                    return {ok:false,error:"Not proper JOSN formatted",type:v}
                }
            })
            return res.send({ok:true,guides:guides})
        },
        save_config: function(request, res) {
            var argv = request.body//.argv

            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct",default: config.defaultProjectConfig})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist",default: config.defaultProjectConfig})
            }
            var c = fs.writeFileSync(path.join(config.wasim,user,argv.project,".config.json"),JSON.stringify(argv.config,null,4), "utf8")
            return res.json({ok:true})
        },
        get_config: function(request, res) {
            var argv = request.body//.argv

            if(!/^[_0-9a-zA-Z]+$/.test(argv.project))
                return res.json({ok:false,error: "project must be alphanumbers"})

            if(md5(argv.project+config.salt) !== argv.hash){
                return res.json({ok:false,error: "project hash is not correct",default: config.defaultProjectConfig})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project))){
                return res.json({ok:false,error: "project name does not exist",default: config.defaultProjectConfig})
            }
            if(! fs.existsSync(path.join(config.wasim,user,argv.project,".config.json"))){
                return res.json({ok:false,error: "file name does not exist",default: config.defaultProjectConfig})
            }
            var c = fs.readFileSync(path.join(config.wasim,user,argv.project,".config.json"),"utf8")
            try{
                return res.json({ok:true,config:JSON.parse(c)})
            }
            catch(e){
                console.error(path.join(config.wasim,user,argv.project,"."+v+".json", "is not proper JOSN formatted"))
                return res.json({ok:false,error:"Not proper JOSN formatted",default: config.defaultProjectConfig})
            }
        },
        ma: function(request, res) {
            return ma.post(request,res)
        },
        download: function(request, res) {
            res.setHeader('Content-disposition', 'attachment; filename=download.json');
            res.setHeader('Content-type', 'text/json');
            res.send(request.body);
        },
    },
    func: {
        isInt: function(x) {
            return (typeof x === 'number' && (x % 1) === 0);
        },
    },
    init: function() {
        for (var i in dls.inits) {
            dls.inits[i].call();
        }
    }
};
dls.init();

