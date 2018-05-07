/**
This file is the server that handle requests via browser. it can be run by: node server.js
params: none
*/
"use strict";
var json_comments = require('json-comments');
// json_comments = json_comments; // Just to pypass JSHint
require('source-map-support').install();
// var async = require('async');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var express = require('express');
var bodyParser = require('body-parser');
var md5 = require('md5');
var multer = require('multer');
var firstline = require('firstline')
var glob = require('glob')
// var fs = require('fs');
var fs = require('fs-extra');
var path = require('path');
var MemLexicon = require('./MemMa');

// var util = require('util');
// var exec = require('child_process').exec;
// var spawn = require('child_process').spawn;
// var spawnSync = require('child_process').spawnSync;
// var uid = require('uuid');
var app = express();
// var crypto = require('crypto');
var config = require('./config');
var http = require("http");
var conllu = require('sawaref-converters').conllu;
var querystring = require('querystring');
// if(config.require && Array.isArray(config.require)){
//     config.required = {}
//     config.require.forEach(x=>config.required[x[0]] = require(x[1]))
// }

// var LocalStorage = require('node-localstorage').LocalStorage
// var localStorage = new LocalStorage('./scratch');

// var user = "";
var ma = require(config.ma.require);

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
  memMA: {},
  projects: {},
  inits: [
    function() {
      //initHeaders
      // Add headers
      app.use(session({
          // genid: function() {
          //     return uid.v4(); // use UUIDs for session IDs
          // },
          secret: 'my express2 secret2',
          // cookie: {},
          // name: 'server-session-cookie-id',
          // saveUninitialized: false,
          cookie: { secure: false },
          // resave: false,
          store: new FileStore()
      }))
      app.use("/", express.static(path.join(__dirname, 'public')));
      app.use(function(req, res, next) {

        var allowedOrigins = [config.wasim_client_url, 'http://localhost','http://localhost:8101', 'http://a.localhost:8101', 'http://wasim.localhost', 'http://wasim-api.localhost', 'http://wasim.al-osaimy.com'];
        var origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
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
      app.use(bodyParser.json({ limit: '50mb' }));
      app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
        next = next // Just to pypass JSHint"
      });
      app.use(multer({
        dest: config.uploadDir,
        rename: function(fieldname, filename) {
          return filename + Date.now();
        },
        onFileUploadStart: function(file) {
          console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function(file) {
          console.log(file.fieldname + ' uploaded to  ' + file.path);
        }
      }).array('file', 100));

      if (!config.port) {
        console.error("config.port is not set");
        process.exit(1);
      }
      app.listen(config.port, () => console.log("You can access Wasim API from http:://localhost:" + config.port))
    },
    function() {
      //initRoutes
      //routes
      for (let i in dls.requests) {
        app.post('/' + i, dls.requests[i]);
      }
      for (let i in dls.requestsGet) {
        app.get('/' + i, dls.requestsGet[i]);
      }

    },
    function() {
      //initMemMA
      var items = fs.readdirSync(path.join(config.wasim))
      items.filter(e => e[0] != ".").forEach(x => {
        if (fs.existsSync(path.join(config.wasim, x, ".config.json"))) {
          dls.projects[x] = {
            config: json_comments.parse(fs.readFileSync(path.join(config.wasim, x, ".config.json"), "utf8"))
          }
          dls.projects[x].config.users = dls.projects[x].config.users || []

          dls.projects[x].config.users.forEach(u=>{
            config.users[u].projects = config.users[u].projects || []

            if(config.users[u].projects.indexOf(x)==-1)
              config.users[u].projects.push(x)
          })
          // console.log(dls.projects[x].config)
          if (fs.existsSync(path.join(config.wasim, x, ".specialPos.json")))
            dls.projects[x].specialPos = json_comments.parse(fs.readFileSync(path.join(config.wasim, x, ".specialPos.json"), "utf8"))
          if (fs.existsSync(path.join(config.wasim, x, ".specialSeg.json")))
            dls.projects[x].specialSeg = json_comments.parse(fs.readFileSync(path.join(config.wasim, x, ".specialSeg.json"), "utf8"))
          if (dls.projects[x].config.askMemMA) {
            dls.projects[x].memMA = new MemLexicon([config.wasim, x, ".done"], dls.projects[x].config, x)
            dls.projects[x].memMA.init()
          }
        } else {
          console.error("No Config File for this folder", x,". Ignoring.");
        }
      })
      config.users.admin.projects = Object.keys(dls.projects)
    },
  ],
  requestsGet: {
    conllu_download: function(request, res) {
      var r = request.query;
      var argv = r //.argv
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, argv.file))) {
        return res.json({ ok: false, error: "file name does not exist" })
      }
      var file = fs.readFileSync(path.join(config.wasim, /*user,*/ argv.project, argv.file), "utf8")
      res.setHeader('Content-Disposition', 'attachment; filename="' + argv.project + '-' + argv.file + '"');
      res.setHeader('content-type', 'text/conllu; charset=utf-8');
      return res.end(file)
    },
  },
  requests: {
    users_login: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      // console.log(argv.security)
      if (!config.users[argv.username])
        return res.json({ ok: false, error: "wrong username/password" })

      if (config.users[argv.username].password !== argv.password)
        return res.json({ ok: false, error: "wrong username/password" })
      request.session.username = argv.username
      request.session.username_hash = md5(argv.username)
      return res.json({ok: true})
    },
    users_logout: function(request, res) {
      request.session.regenerate(()=>{
        return res.json({ok: true})
      })

    },
    conllu: function(request, res) {
      var r = request.body;
      var argv = r; //.argv
      if (fs.existsSync('/morpho/conllu/' + r.sorah + "-" + r.ayah)) {
        var d = fs.readFileSync('/morpho/conllu/' + r.sorah + "-" + r.ayah, "utf8");
        return res.send({ ok: true, data: d });
      }

      argv.f = "/morpho/output/unique/" + r.sorah + "-" + r.ayah + ".json"
      if (!fs.existsSync(argv.f))
        return res.send({ ok: false, error: "No such file: " + r.sorah + "-" + r.ayah + ".json" })
      conllu.toConllu(argv, function(data) {
        res.send({ ok: true, data: data })
        fs.writeFile('/morpho/conllu/' + r.sorah + "-" + r.ayah, data, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });

      })
    },
    projects_list: function(request, res) {
      if (!request.session.username || md5(request.session.username) != request.session.username_hash )
        return res.json({ ok: false, error: "Not logged in" })
      config.users[request.session.username].projects = config.users[request.session.username].projects || []
      return res.json({
        ok: true,
        username: request.session.username,
        projects: config.users[request.session.username].projects.map(i => new Object({
          project: i,
          hash: md5(i + config.salt)
        }))
      })
    },
    projects_create: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!request.session.username || md5(request.session.username) != request.session.username_hash )
        return res.json({ ok: false, error: "Not logged in" })
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (dls.projects[argv.project] || fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name already exist" })
      }
      fs.mkdirSync(path.join(config.wasim, /*user,*/ argv.project));
      fs.writeFileSync(path.join(config.wasim, /*user,*/ argv.project, ".config.json"), JSON.stringify(config.defaultProjectConfig, null, 4), "utf8")
      config.users[request.session.username].projects.push(argv.project)
      dls.projects[argv.project] = {config: config.defaultProjectConfig}
      var git = require('simple-git')(path.join(config.wasim, /*user,*/ argv.project)).init()
      if (config.remote_repo)
        git.addRemote("origin", config.remote_repo, function() {
          //TODO
        })
      res.json({ ok: true, project: argv.project, hash: md5(argv.project + config.salt) })
    },

    projects_remove: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!request.session.username || md5(request.session.username) != request.session.username_hash )
        return res.json({ ok: false, error: "Not logged in" })
      // if (argv.security != config.security)
      //   return res.json({ ok: false, error: "wrong security code" })
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "path must be alphanumbers" })
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      fs.removeSync(fs.existsSync(path.join(config.wasim, /*user,*/ argv.project)));
      res.json({ ok: true, msg: "project has been successfuly deleted" })
    },
    conllu_list: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      glob(path.join(config.wasim, /*user,*/ argv.project)+"/*", {nodir:true}, function(err, items) {

      // fs.readdir(path.join(config.wasim, /*user,*/ argv.project), function(err, items) {
        // for (let i=0; i<items.length; i++) {
        // console.log(items[i]);
        // }
        items = items.filter(x => !/^\./.test(x))
        // console.log(path.join(config.wasim, /*user,*/ argv.project),items)
        Promise.all(items.map(x => firstline(x))).then(y => {
          return res.json({
            ok: true,
            files: items.map((x, i) => new Object({ filename: path.basename(x), firstline: y[i] }))
          })
        })
      });
    },
    conllu_get: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, argv.file)))
        if (fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, ".done", argv.file))) {
          let file = fs.readFileSync(path.join(config.wasim, /*user,*/ argv.project, ".done", argv.file), "utf8")
          return res.json({ ok: true, file: file, mode: "readonly" })
        }
      else {
        console.log("not exist:", path.join(config.wasim, /*user,*/ argv.project, ".done", argv.file))
        return res.json({ ok: false, error: "file name does not exist" })
      }
      let file = fs.readFileSync(path.join(config.wasim, /*user,*/ argv.project, argv.file), "utf8")
      return res.json({ ok: true, file: file })
    },
    conllu_upload: function(req, res) {
      if (!req.headers.authorization) {
        return res.json({ ok: false, file: "no authorization header is set" })
      }
      var arr = req.headers.authorization.split(":")
      if (arr.length != 2) {
        return res.json({ ok: false, file: "authorization header is not set properly" })
      }
      if (md5(arr[0] + config.salt) !== arr[1]) {
        return res.json({ ok: false, file: "authorization hash is not correct" })
      }
      if (!/^[_0-9a-zA-Z]+$/.test(arr[0]))
        return res.json({ ok: false, error: "path must be alphanumbers" })

      var files = req.files
      files.forEach(f => {
        console.log(path.join(f.destination + f.filename), path.join(config.wasim, /*user,*/ arr[0], f.originalname))
        fs.renameSync(path.join(f.destination + f.filename), path.join(config.wasim, /*user,*/ arr[0], f.originalname))
      })

      console.log("here", req.files)

      return res.json({ ok: true, msg: "file has been uploaded successfuly" })
    },
    conllu_save: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, argv.pageid))) {
        return res.json({ ok: false, error: "file name does not exist" })
      }
      let isDone = /(\n|^)# done/.test(r.data)
      if (true)
        fs.writeFile(path.join(config.wasim, /*user,*/ argv.project, argv.pageid), r.data, (err) => {
          if (err) throw err;
          res.send({ ok: true, isDone: isDone })
          var git = require('simple-git')(path.join(config.wasim, /*user,*/ argv.project)).add(path.join(config.wasim, /*user,*/ argv.project, argv.pageid)).commit("Automatic Save from Wasim")
          if (config.remote_repo)
          git.push("origin", "master")

          if (isDone && !fs.existsSync(path.join(config.wasim, /*user,*/ argv.project,".done", argv.pageid)))
            fs.symlink(path.join(config.wasim, /*user,*/ argv.project, argv.pageid),
              path.join(config.wasim, /*user,*/ argv.project, ".done", argv.pageid),
              function(err) {
                if (err){
                    console.error(err)
                  throw new Error("error in symlink")
                }
              })
        })
      else
        res.send({ ok: false, error: "Saving is stopped for debugging" })

    },
    conllu_remove: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist" })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, argv.pageid))) {
        return res.json({ ok: false, error: "file name does not exist" })
      }
      fs.remove(path.join(config.wasim, /*user,*/ argv.project, argv.pageid), (err) => {
        if (err) throw err;
        res.send({ ok: true })

        var git = require('simple-git')(path.join(config.wasim, /*user,*/ argv.project)).rm(path.join(config.wasim, /*user,*/ argv.project, argv.pageid)).commit("Automatic Remove from Wasim")
        if (config.remote_repo)
          git.push("origin", "master")



      });
    },

    conllu_udpipe: function(request, res) {
      var argv = request.body;
      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })
      if (!/^[_0-9a-zA-Z]+$/.test(argv.newFilename))
        return res.json({ ok: false, error: "newFilename must be alphanumbers" })
      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct" })
      }
      var postData = querystring.stringify({
        'tokenizer': true,
        'tagger': true,
        'data': argv.sentence,
        'model': argv.model || undefined
      })
      var req = http.request({
        url: config.udpipe.url,
        port: config.udpipe.port,
        method: 'POST',
        path: '/process',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, function(ress) {
        var response = []
        ress.setEncoding('utf8');
        ress.on('data', (chunk) => {
          // console.log(`${chunk}`);
          response.push(chunk)
        });

        if (ress.statusCode == 400) {

          return res.json({ ok: false, error: "Model chosen is not available" })
        }
        if (ress.statusCode != 200) {
          console.error("Error: Response Code != 200: Code=", ress.statusCode, "Response", response)
          return res.json({ ok: false, error: "Error: Response Code != 200: Code="+ ress.statusCode+ "Response"+ response })
        }

        ress.on('end', () => {
          try {
            var result = JSON.parse(response.join(''))
            fs.writeFile(path.join(config.wasim, /*user,*/ argv.project, argv.newFilename), result.result)
            let firstline = result.result.split("\n")[0]
            return res.json({ ok: true, filename: argv.newFilename, firstline: firstline })
          } catch (e) {
            console.error("error", e, response);
            return res.json({ ok: false, error: "udpipe did not returned a proper JSON response." })
          }

        })
      })
      req.write(postData)
      req.on("error",()=>{
        return res.json({ ok: false, error: "udpipe is not responsding to requests." })
      });
      req.end();
    },
    guidelines: function(request, res) {
      var r = request.body;
      var argv = r //.argv
      // var result = {}
      if (!dls.projects[argv.project])
        return res.send({ ok: false, error: "project name does not exist" })

      var guides = ["specialPos", "specialSeg"].map(v => {
        if (dls.projects[argv.project][v])
          return { ok: true, data: dls.projects[argv.project][v], type: v }
        else
          return { ok: false, type: v }
      })
      //   if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, "." + v + ".json"))) {
      //     return { ok: false, error: "file name does not exist" }
      //   }
      //   r[v] = fs.readFileSync(path.join(config.wasim, /*user,*/ argv.project, "." + v + ".json"), "utf8")
      //   try {
      // return { ok: true, data: JSON.parse(r[v]), type: v }
      //   } catch (e) {
      //     console.error(path.join(config.wasim, /*user,*/ argv.project, "." + v + ".json", "is not proper JOSN formatted"))
      //     return { ok: false, error: "Not proper JOSN formatted", type: v }
      //   }
      // })
      return res.send({ ok: true, guides: guides })
    },
    save_config: function(request, res) {
      var argv = request.body //.argv

      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct", default: config.defaultProjectConfig })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist", default: config.defaultProjectConfig })
      }
      //delete
      Object.keys(config.users).map(u=>config.users[u]).forEach(u=>config.users[u].projects= config.users[u].projects.filter(x=>x!=argv.project))
      //add
      argv.config.users.filter(u=>config.users[u]).forEach(u=>config.users[u].projects.push(argv.project))

      dls.projects[argv.project].config = argv.config
      fs.writeFileSync(path.join(config.wasim, /*user,*/ argv.project, ".config.json"), JSON.stringify(argv.config, null, 4), "utf8")
      return res.json({ ok: true })
    },
    get_config: function(request, res) {
      var argv = request.body //.argv

      if (!/^[_0-9a-zA-Z]+$/.test(argv.project))
        return res.json({ ok: false, error: "project must be alphanumbers" })

      if (md5(argv.project + config.salt) !== argv.hash) {
        return res.json({ ok: false, error: "project hash is not correct", default: config.defaultProjectConfig })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project))) {
        return res.json({ ok: false, error: "project name does not exist", default: config.defaultProjectConfig })
      }
      if (!fs.existsSync(path.join(config.wasim, /*user,*/ argv.project, ".config.json"))) {
        fs.writeFileSync(path.join(config.wasim, /*user,*/ argv.project, ".config.json"), JSON.stringify(config.defaultProjectConfig, null, 4), "utf8")
        return res.json({ ok: false, error: "Config file does not exist in the project folder! Fixed. Please reload.", default: config.defaultProjectConfig })
      }
      var c = fs.readFileSync(path.join(config.wasim, /*user,*/ argv.project, ".config.json"), "utf8")
      try {
        return res.json({ ok: true, config: json_comments.parse(c) })
      } catch (e) {
        console.error(path.join(config.wasim, /*user,*/ argv.project, ".config.json", "is not proper JOSN formatted"))
        return res.json({ ok: false, error: "Not proper JOSN formatted", default: config.defaultProjectConfig })
      }
    },
    memMa: function(request, res) {
      var argv = request.body //.argv
      if (!dls.projects[argv.project] )
        return res.send({ ok: false, error: "project name does not exist" })
      if (!dls.projects[argv.project].memMA )
        return res.send({ ok: false, error: "project is not indexed" })
      res.send({ ok: true, results: dls.projects[argv.project].memMA.get(argv.sentence) })
      // var data = request.body;
      // let results = data.sentence.split(" ").map((x) => {
      //   let form = x.replace(/[ًٌٍَُِّْ]/g, "")
      //   if (dls.memLexicon[form] === undefined){
      //       let sent = new conlluParser.ConlluSentence("-1", [], [], dls.doc)
      //       sent.comments.push("# sentid=" + "-1" + " " + form)
      //       dls.memLexicon[form] =  sent.toConllU().join("\n").split("\n")
      //       return dls.memLexicon[form]
      //   }
      //   return dls.memLexicon[form]
      //   // let elems = [].concat.apply([], dls.memLexicon[form].map(e => {
      //   //   if (e.isMultiword())
      //   //     return [e, ...e.children]
      //   //   return [e]
      //   // }))
      //   // let sent = new conlluParser.ConlluSentence(i, elems, [], doc)
      //   // sent.comments.push("# sentid=" + i)
      //   // sent.refix(true)
      //   // return sent.toConllU().join("\n").split("\n")

      // })
      // res.send({ ok: true, results:results })
    },
    ma: function(request, res) {
      return ma.post(request, res)
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
    for (let i in dls.inits) {
      dls.inits[i].call();
    }
  }
};
dls.init();
process.on('SIGTERM', ()=> {
  console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
  // start graceul shutdown here
  process.exit()
})
process.on('SIGINT', ()=> {
  console.info('Got SIGINT from keyboard. Graceful shutdown start', new Date().toISOString())
  fs.writeFileSync('./users.json',JSON.stringify(config.users,null,4),"utf8")
  // start graceul shutdown here
  process.exit()
})
