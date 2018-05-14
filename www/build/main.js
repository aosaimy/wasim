webpackJsonp([0],{

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConlluService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import { Sentence} from '../pages/annotate/conllu';

/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var ConlluService = (function () {
    function ConlluService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.data = {};
        this.options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ withCredentials: true });
        this.projects = {};
    }
    ConlluService.prototype.load = function (project, hash, pageid) {
        var _this = this;
        if (this.data[project + "-" + pageid]) {
            // already loaded data
            return Promise.resolve(this.data[project + "-" + pageid]);
        }
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            //    let opts:RequestOptionsArgs = {
            //    	headers : new Headers({
            //    		'Content-Type': 'application/json; charset=utf-8',
            //    		// 'Access-Control-Allow-Origin': 'http://localhost:8100'
            //    	}),
            //    	// 'body': JSON.stringify()
            // }
            _this.http.post(_this.myconfig.getValue("server") + "conllu_get", {
                "project": project,
                "hash": hash,
                "file": pageid,
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                // data = data;
                if (data.ok) {
                    //TODO view only if data.mode == "readonly"
                    _this.data[project + "-" + pageid] = data.file;
                    resolve(_this.data[project + "-" + pageid]);
                }
                else {
                    console.error(data.error);
                    reject(data.error);
                }
            });
        });
    };
    ConlluService.prototype.getList = function (project, hash, force_update) {
        var _this = this;
        if (force_update === void 0) { force_update = false; }
        if (!force_update && this.projects[project]) {
            return Promise.resolve(this.projects[project]);
        }
        // don't have the data yet
        return new Promise(function (resolve) {
            _this.http.post(_this.myconfig.getValue("server") + "conllu_list", {
                "project": project,
                "hash": hash,
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                // data = data;
                if (data.ok) {
                    _this.projects[project] = data;
                }
                resolve(data);
            });
        });
    };
    ConlluService.prototype.udpipe = function (project, hash, sentence, newFilename, language) {
        var _this = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            _this.http.post(_this.myconfig.getValue("server") + 'conllu_udpipe', {
                tokenizer: true,
                tagger: true,
                "project": project,
                "hash": hash,
                sentence: sentence,
                model: language,
                newFilename: newFilename,
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (data.ok)
                    resolve(data);
                else
                    reject(data.error);
            });
        });
    };
    ConlluService.prototype.save = function (project, hash, pageid, file) {
        var _this = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            //    let opts:RequestOptionsArgs = {
            //    	headers : new Headers({
            //    		'Content-Type': 'application/json; charset=utf-8',
            //    		// 'Access-Control-Allow-Origin': 'http://localhost:8100'
            //    	}),
            //    	// 'body': JSON.stringify()
            // }
            _this.http.post(_this.myconfig.getValue("server") + 'conllu_save', {
                "project": project,
                "hash": hash,
                "pageid": pageid,
                "data": file
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (data.ok) {
                    _this.data[project + "-" + pageid] = file;
                    if (_this.projects[project])
                        _this.projects[project].files.find(function (x) { return x.filename == pageid; }).firstline = file.split("\n")[0];
                    resolve(data);
                }
                else
                    reject(data.error);
            });
        });
    };
    ConlluService.prototype.remove = function (project, hash, pageid) {
        var _this = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            //    let opts:RequestOptionsArgs = {
            //    	headers : new Headers({
            //    		'Content-Type': 'application/json; charset=utf-8',
            //    		// 'Access-Control-Allow-Origin': 'http://localhost:8100'
            //    	}),
            //    	// 'body': JSON.stringify()
            // }
            _this.http.post(_this.myconfig.getValue("server") + 'conllu_remove', {
                "project": project,
                "hash": hash,
                "pageid": pageid,
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data);
                // data = data;
                if (data.ok)
                    resolve(data);
                // else
                // 	reject(data.error)
            });
        });
    };
    return ConlluService;
}());
ConlluService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__["a" /* ConfigurationService */]])
], ConlluService);

//# sourceMappingURL=conllu-service.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_json_class__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import { Config } from 'ionic-angular';




// import { Sentence} from '../pages/annotate/conllu';
// import 'rxjs/add/operator/map';
/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var desc = { "saveFile": "Convert to Conll then Save",
    "syncConllU": "Convert to Conll",
    "diactric": "Add a diactric",
    "nav": "Move next/prev Word",
    "undo": "Undo last action (move backward in action history)",
    "redo": "Move forward in action history",
    "segment": "Edit the form/Add new segments to the current word/Delete current segment",
    "tag": "Assign current segment a new tag",
    "tag_ma": "Ask a morphological analyser for help",
    "tag_morphofeatures": "Assign morphological features",
    "diac": "Mark the last character with a diacritic",
    "more": "Show more less-frequent tags" };
var ConfigService = (function () {
    function ConfigService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.config = {};
        this.rtls = ["arabic", "qac"];
        this.config.default = new __WEBPACK_IMPORTED_MODULE_3__config_json_class__["a" /* ConfigJSON */]();
    }
    ConfigService.prototype.load = function (project, hash) {
        var _this = this;
        if (this.config[project]) {
            // already loaded data
            return Promise.resolve(this.config[project]);
        }
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.getValue("server") + "get_config", {
                project: project,
                hash: hash
            }, new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ withCredentials: true }))
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.ok) {
                    var config = new __WEBPACK_IMPORTED_MODULE_3__config_json_class__["a" /* ConfigJSON */](data);
                    config.project = project;
                    config.hash = hash;
                    config.keyboardShortcuts.forEach(function (e) {
                        e.keys = [];
                        if (e.metaKey)
                            e.keys.push("⌘");
                        if (e.shiftKey)
                            e.keys.push("⇧");
                        if (e.altKey)
                            e.keys.push("⎇");
                        if (!e.code)
                            e.code = "";
                        var code = e.code
                            .replace(/^Key/, "")
                            .replace("ArrowLeft", "⇦")
                            .replace("ArrowRight", "⇨")
                            .replace("Enter", "⏎");
                        if (code)
                            e.keys.push(code);
                        var params = e.params ? e.params.join() : "";
                        if (e.code.indexOf("Digit") == 0)
                            params = "";
                        if (e.code.indexOf("F" + params) == 0)
                            params = "";
                        e.desc = desc[e.action + params] || desc[e.action] || e.action;
                    });
                    config.alltags.forEach(function (xx, i, arr) {
                        arr[i].mapFrom = arr[i].mapFrom || [""];
                    });
                    if (config.MfVsPos) {
                        config.alltags.forEach(function (xx, i, arr) {
                            arr[i].features = Object.keys(config.mf).filter(function (x) { return config.MfVsPos[x].indexOf(config.MfVsPos_upostag ? xx.mapToConllU : xx.tag) >= 0; });
                        });
                    }
                    else {
                        console.error("config['MF.vs.POS'] is missing");
                    }
                    config.allxtags = config.alltags.map(function (x) { return x.tag; });
                    // config.allutags = data.config.alltags.map(x=>x.mapToConllU).sort().filter(function(el,i,a){return i==a.indexOf(el);}) // sort and unique
                    config.tags = {};
                    config.alltags.forEach(function (x) { return config.tags["X:" + x.tag] = x; });
                    // config.allutags.forEach(x=>config.tags["U:"+x.tag]=x)
                    config.tags["X:_"] = { tag: "_", desc: "_" };
                    config.tags["U:_"] = { tag: "_", desc: "_" };
                    config.features = {};
                    Object.keys(config.mf).forEach(function (k) { return config.mf[k].forEach(function (v) { return config.features[k + "=" + v.tag] = v; }); });
                    _this.config[project] = config;
                    resolve(_this.config[project]);
                }
                else
                    // if(data.default)
                    // 	that.config.default = data.default
                    reject(data.error);
            });
        });
    };
    ConfigService.prototype.save = function (project, hash, config) {
        var _this = this;
        config = JSON.parse(JSON.stringify(config));
        delete config.hash;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.getValue("server") + "save_config", {
                project: project,
                hash: hash,
                config: config
            }, new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ withCredentials: true }))
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.ok) {
                    resolve();
                    config.isRtl = _this.isRtl(project);
                    _this.config[project] = config;
                }
                else
                    reject(data.error);
            });
        });
    };
    ConfigService.prototype.getConfig = function (project) {
        return this.config[project] ? this.config[project] : this.config.default;
    };
    ConfigService.prototype.isRtl = function (project) {
        if (this.getConfig(project).isRtl != undefined)
            return this.getConfig(project).isRtl;
        return this.rtls.indexOf(this.getConfig(project).language) >= 0;
    };
    return ConfigService;
}());
ConfigService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__["a" /* ConfigurationService */]])
], ConfigService);

//# sourceMappingURL=config-service.js.map

/***/ }),

/***/ 145:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 145;

/***/ }),

/***/ 188:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 188;

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import { Config } from 'ionic-angular';



/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var ProjectService = (function () {
    function ProjectService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ withCredentials: true });
        this.data = {};
        this.username = null;
        this._list = { ok: false, projects: [], error: "Not laoded yet." };
    }
    ProjectService.prototype.list = function () {
        var _this = this;
        if (this._list.ok) {
            return Promise.resolve(this._list);
        }
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.getValue("server") + "projects_list", {}, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data);
                // data = data;
                if (data.ok) {
                    _this.username = data.username;
                    _this._list = data;
                    resolve(data);
                }
                else
                    reject(data.error);
            }, function (error) {
                if (error.status != 200)
                    reject("Server is not working properly. url=" + _this.myconfig.getValue("server"));
            });
        });
    };
    ProjectService.prototype.login = function (username, password) {
        var _this = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.getValue("server") + "users_login", { username: username, password: password
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data);
                // data = data;
                if (data.ok) {
                    _this.username = username;
                    resolve(data);
                }
                else
                    reject(data.error);
            }, function (error) {
                if (error.status != 200)
                    reject("Server is not working properly. url=" + _this.myconfig.getValue("server"));
            });
        });
    };
    ProjectService.prototype.logout = function () {
        var _this = this;
        // don't have the data yet
        this.username = null;
        this._list = { ok: false, projects: [], error: "Not laoded yet." };
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.getValue("server") + "users_logout", {}, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                // console.log(data)
                // data = data;
                if (data.ok) {
                    resolve(data);
                }
                else
                    reject(data.error);
            }, function (error) {
                if (error.status != 200)
                    reject("Server is not working properly. url=" + _this.myconfig.getValue("server"));
            });
        });
    };
    ProjectService.prototype.create = function (project) {
        var _this = this;
        // var this = this
        // don't have the data yet
        return new Promise(function (resolve) {
            _this.http.post(_this.myconfig.getValue("server") + "projects_create", {
                // "security": security,
                "project": project,
            }, _this.options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                resolve(data);
            });
        });
    };
    return ProjectService;
}());
ProjectService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__["a" /* ConfigurationService */]])
], ProjectService);

//# sourceMappingURL=project-service.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnnotatePage; });
/* unused harmony export Highlight */
/* unused harmony export Stats */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_word_service__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_config_service__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_config_json_class__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_selectize_popover_page_selectize_popover_page__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_help_popover_help_popover__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__docs_docs__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__projects_projects__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_conllu_dao__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_conllu_dao___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_conllu_dao__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { InAppBrowser } from '@ionic-native/in-app-browser';




// import { GuidelinesService } from '../../providers/guidelines-service';


// import { HighlightComponent } from '../../components/highlight/highlight';
// import { GetFormPopoverComponent } from '../../components/get-form-popover/get-form-popover';
// import { GuiderComponent } from '../../components/guider/guider';






/*
  Generated class for the Annotate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AnnotatePage = (function () {
    function AnnotatePage(navCtrl, popoverCtrl, navParams, 
        // public data: Data,
        // public http: Http,
        renderer, zone, events, wordservice, conlluService, configService, translateService, loadingCtrl, alertCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navParams = navParams;
        this.renderer = renderer;
        this.zone = zone;
        this.events = events;
        this.wordservice = wordservice;
        this.conlluService = conlluService;
        this.configService = configService;
        this.translateService = translateService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        /*
        Tags bar
        */
        this.tagsRow = 0;
        this.done = false;
        this.conlluEditorType = "info";
        this.config = new __WEBPACK_IMPORTED_MODULE_5__providers_config_json_class__["a" /* ConfigJSON */]();
        // conllu : ConllU = new ConllU().Document();
        this.log = [];
        this.doc = null;
        this.documentJson = {};
        this.project = "";
        this.hash = "";
        this.pageid = "";
        this.editable = false;
        // isConlluHidden = false
        this.copyElement = null;
        // @ViewChild('conllu-editor') conlluEditor: ConlluEditorComponent;
        this.highlight = new Highlight(this.events, this.zone);
        this._conlluRaw = "1-3 \u0648\u0639\u0646\u0647\u0627   _   _   _   _   _   _   _   _\n1   \u0648\u064E  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0\n2   \u0639\u064E\u0646\u0647\u0627   \u0639\u064E\u0646_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1\n3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2\n";
        this.stats = new Stats(this.events);
        this.preventKeyboard = false;
        // presentSegmentorFormPopover() {
        //   var popover = this.popoverCtrl.create(SegmentorPopoverPageComponent, {
        //     element: this.highlight.element,
        //     config: this.config
        //   });
        //   this.preventKeyboard = true
        //   popover.present({
        //   });
        //   popover.onDidDismiss(()=>{
        //     this.preventKeyboard = false
        //     this.saveForUndo()
        //   })
        // }
        this.showAlertMessage = false;
        this._info = null;
        this.searchResults = [];
        this.last_cretiera = {};
        this.wasReversed = false;
        this.currentTags = this.getTags();
        this.undoArr = [];
        this.redoArr = [];
        var loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        loading.present();
        if (!navParams.data.project) {
            //TODO change
            console.log("invalid params: ", navParams.data);
            navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_11__projects_projects__["b" /* ProjectsPage */]);
        }
        else {
            this.project = navParams.data.project;
            this.hash = navParams.data.hash;
            if (navCtrl.getViews().length == 0)
                navCtrl.insert(1, __WEBPACK_IMPORTED_MODULE_9__docs_docs__["b" /* DocsPage */], {
                    project: this.project,
                    hash: this.hash
                });
        }
        // on highlight change, scroll the ConllU Raw view and the main words view to proper location
        this.events.subscribe("highlight:change", function (element, scrollToConllRaw, scrollToElement) {
            // if(scrollToConllRaw)
            // setTimeout(() => {
            //   let highlight_element : any = document.querySelector("pre > .highlight");
            //   if(highlight_element){
            //     document.querySelector("pre").scrollTo(0, highlight_element.offsetTop-100)
            //   }
            // })
            if (scrollToConllRaw === void 0) { scrollToConllRaw = true; }
            if (scrollToElement === void 0) { scrollToElement = true; }
            if (scrollToElement)
                setTimeout(function () {
                    var sa = document.querySelector("#sentences");
                    var ea = document.querySelector("#sentences .element.highlight");
                    if (ea && sa)
                        sa.scrollTop = ea.offsetTop - sa.offsetTop - 150;
                }, 100);
        });
        if (!navParams.data.id && navCtrl.length() > 1) {
            navCtrl.pop();
        }
        else {
            this.pageid = navParams.data.id;
        }
        Promise.all([this.configService.load(this.project, this.hash), this.conlluService.load(this.project, this.hash, this.pageid)])
            .then(function (arr) {
            loading.dismiss();
            _this.config = arr[0]; //this.configService.getConfig(this.project)
            _this.currentTags = _this.getTags();
            _this.doc = new __WEBPACK_IMPORTED_MODULE_12_conllu_dao__["ConlluDocument"](_this.config);
            _this.conlluRaw = arr[1].trim();
            _this.done = /(\n|^)# done/.test(_this.conlluRaw);
            var match = _this.conlluRaw.match(/^# (?:done|notdone).*\|highlight=([^\|\n]*)/);
            setTimeout(function () {
                if (navParams.data.position) {
                    console.log("here", navParams.data.position);
                    _this.highlightElement(navParams.data.position.replace("-", ":"));
                }
                else if (match)
                    _this.highlightElement(match[1]);
                else
                    _this.highlightElement('S1:1');
            });
        }).catch(function (x) {
            _this.toastCtrl.create({
                message: _this.translateService.instant('Conllu File loading Error: ') + _this.translateService.instant(x),
                duration: 3000,
                position: "top"
            }).present();
            console.error('Conllu File loading Error: ', x);
            console.trace(x);
            loading.dismiss();
        });
    }
    Object.defineProperty(AnnotatePage.prototype, "conlluRaw", {
        get: function () {
            return this._conlluRaw;
        },
        set: function (argv) {
            this._conlluRaw = argv;
            this.log = [];
            // console.log("Here",this.conlluRaw)
            var that = this;
            this.doc.parse(this._conlluRaw, function (s) {
                that.log.push(s);
            }, false); //.toBrat(logger, true);
            // if(typeof highlightRef  == "string")
            // this.highlightElement(highlightRef)
            if (this.config.askMA)
                this.askMA();
            if (this.config.askMemMA)
                this.askMemMA();
            // console.log(JSON.parse(JSON.stringify(this.doc)))
            this.highlightElement(this.highlight.ref);
        },
        enumerable: true,
        configurable: true
    });
    AnnotatePage.prototype.logme = function (x) { console.log(x); };
    AnnotatePage.prototype.ngOnInit = function () {
        // this.config = this.configService.getConfig(this.project)
        // console.log('ngAfterViewInit AnnotatePage');
        // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
    };
    Object.defineProperty(AnnotatePage.prototype, "info", {
        get: function () {
            if (this._info)
                return this._info;
            var obj = {};
            if (!this.doc)
                return {};
            obj.sent_no = this.doc.sentences.length;
            obj.elem_no = this.doc.sentences.map(function (s) { return s.elements.length; }).reduce(function (p, c) { return p += c; }, 0);
            obj.tokens_no = this.doc.sentences.map(function (s) { return s.tokens().length; }).reduce(function (p, c) { return p += c; }, 0);
            obj.types_no = [].concat.apply([], this.doc.sentences.map(function (s) { return s.tokens().map(function (e) { return e.form; }); })).filter(function (e, i, arr) { return arr.indexOf(e) == i; }).length;
            obj.mwe_no = this.doc.sentences.map(function (s) { return s.elements.filter(function (el) { return el.isMultiword; }).length; }).reduce(function (p, c) { return p += c; }, 0);
            this._info = obj;
            return obj;
        },
        enumerable: true,
        configurable: true
    });
    AnnotatePage.prototype.addNote = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        if (event)
            event.preventDefault();
        var prompt = this.alertCtrl.create({
            title: this.translateService.instant('Note'),
            message: this.translateService.instant("Please enter the note to be saved on the element."),
            inputs: [
                {
                    name: 'note',
                    placeholder: this.translateService.instant('Title'),
                    value: this.highlight.element._miscs["NOTE"]
                },
            ],
            buttons: [
                {
                    text: this.translateService.instant('Save'),
                    handler: function (data) {
                        _this.highlight.element._miscs["NOTE"] = data.note.replace(/ /g, "_");
                        _this.syncConllU();
                    }
                }
            ]
        });
        prompt.present();
    };
    AnnotatePage.prototype.highlightElement = function (highlightRef) {
        if (highlightRef === void 0) { highlightRef = 'S1:1'; }
        highlightRef = highlightRef.replace(/^(S[0-9]+:[0-9]+)-[0-9]+$/, "$1");
        if (!/^S[0-9]+:[0-9]+$/.test(highlightRef)) {
            console.error("HighlightRef is not standard", highlightRef);
            highlightRef = 'S1:1';
        }
        var elem = this.doc.getElement(highlightRef);
        if (elem)
            this.events.publish('highlight:change', elem);
        else {
            console.error("highlighted non existing element", highlightRef);
            if (highlightRef != 'S1:1')
                this.highlightElement();
        }
    };
    AnnotatePage.prototype.search = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        if (event)
            event.preventDefault();
        var prompt = this.alertCtrl.create({
            title: this.translateService.instant('Search'),
            message: this.translateService.instant("Show previous taggings in corpus"),
            inputs: [
                {
                    name: 'form',
                    placeholder: this.translateService.instant('Word Form')
                },
            ],
            buttons: [
                {
                    text: this.translateService.instant('Search'),
                    handler: function (data) {
                        _this.wordservice.askMemMA(data.form, _this.config)
                            .then(function (elements) {
                            _this.viewElementsPopup(elements[0], null);
                        }).catch(function (s) {
                            _this.toastCtrl.create({
                                message: _this.translateService.instant('Error: ') + _this.translateService.instant(s),
                                duration: 3000,
                                position: "top"
                            }).present();
                            console.error('Error: ', s);
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    AnnotatePage.prototype.find = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        if (event)
            event.preventDefault();
        var prompt = this.alertCtrl.create({
            title: this.translateService.instant('Find'),
            message: this.translateService.instant("Find an element within this document"),
            inputs: [
                {
                    name: 'form',
                    placeholder: this.translateService.instant('Word Form'),
                    value: this.last_cretiera.form
                },
                {
                    name: 'xpos',
                    placeholder: this.translateService.instant('XPOS tag'),
                    value: this.last_cretiera.xpos
                },
                {
                    name: 'upos',
                    placeholder: this.translateService.instant('UPOS tag'),
                    value: this.last_cretiera.upos
                },
                {
                    name: 'feats',
                    placeholder: this.translateService.instant('Feat=Val'),
                    value: this.last_cretiera.feats
                },
                {
                    name: 'misc',
                    placeholder: this.translateService.instant('Misc=Val'),
                    value: this.last_cretiera.misc
                },
                {
                    name: 'lemma',
                    placeholder: this.translateService.instant('Lemma'),
                    value: this.last_cretiera.lemma
                },
            ],
        });
        if (this.copyElement)
            prompt.addButton({
                text: this.translateService.instant('Find and Replace All'),
                role: 'destructive',
                handler: function (cretiera) {
                    _this.last_cretiera = JSON.parse(JSON.stringify(cretiera));
                    if (!_this.copyElement) {
                        _this.toastCtrl.create({
                            message: _this.translateService.instant('No copied element'),
                            duration: 1000
                        }).present();
                    }
                    else {
                        _this.searchResults = _this.doc.find(cretiera);
                        _this.searchResults.forEach(function (e) {
                            if (e == _this.copyElement || e.parent == _this.copyElement)
                                return;
                            if (_this.copyElement.isMultiword) {
                                var c = e.changeWith(_this.copyElement);
                                c._miscs["FROM"] = "PASTE";
                            }
                            else
                                e.copy(_this.copyElement);
                        });
                    }
                }
            });
        prompt.addButton({
            text: this.translateService.instant('Find All'),
            handler: function (cretiera) {
                _this.last_cretiera = JSON.parse(JSON.stringify(cretiera));
                _this.searchResults = _this.doc.find(cretiera);
                if (_this.searchResults.length === 0) {
                    _this.toastCtrl.create({
                        message: _this.translateService.instant('No results were found'),
                        duration: 1000
                    }).present();
                }
                else {
                    _this.viewElementsPopup(_this.searchResults, null);
                }
            }
        });
        prompt.addButton({
            text: this.translateService.instant('Find All (Unique)'),
            handler: function (cretiera) {
                _this.last_cretiera = JSON.parse(JSON.stringify(cretiera));
                var uniq = {};
                _this.searchResults = _this.doc.find(cretiera).filter(function (e) {
                    if (uniq[e.toConllU(false)] === undefined) {
                        uniq[e.toConllU(false)] = true;
                        return true;
                    }
                    return false;
                });
                if (_this.searchResults.length === 0) {
                    _this.toastCtrl.create({
                        message: _this.translateService.instant('No results were found'),
                        duration: 1000
                    }).present();
                }
                else {
                    _this.viewElementsPopup(_this.searchResults, null);
                }
            }
        });
        prompt.addButton({
            text: this.translateService.instant('Find Next'),
            handler: function (cretiera) {
                _this.last_cretiera = JSON.parse(JSON.stringify(cretiera));
                _this.searchResults = _this.doc.find(cretiera);
                if (_this.searchResults.length === 0) {
                    _this.toastCtrl.create({
                        message: _this.translateService.instant('No results were found'),
                        duration: 1000
                    }).present();
                }
                else {
                    if (_this.highlight.element)
                        _this.highlight.element = _this.doc.sentences[0].elements[0];
                    _this.find_next(event);
                }
            }
        });
        prompt.present();
    };
    AnnotatePage.prototype.find_next = function (event, backward) {
        var _this = this;
        if (event === void 0) { event = null; }
        if (backward === void 0) { backward = false; }
        if (event)
            event.preventDefault();
        if (this.highlight.element == null)
            return;
        if (backward && !this.wasReversed || !backward && this.wasReversed) {
            this.wasReversed = !this.wasReversed;
            this.searchResults.reverse(); // warning in-place
        }
        var r = this.searchResults.find(function (e) {
            if (!backward && e.sentence._id < _this.highlight.element.sentence._id)
                return false;
            if (!backward && e.sentence._id == _this.highlight.element.sentence._id && parseInt(e._id) <= parseInt(_this.highlight.element._id))
                return false;
            if (backward && e.sentence._id > _this.highlight.element.sentence._id)
                return false;
            if (backward && e.sentence._id == _this.highlight.element.sentence._id && parseInt(e._id) >= parseInt(_this.highlight.element._id))
                return false;
            return true;
        });
        if (!r)
            return this.toastCtrl.create({
                message: this.translateService.instant('No more results were found'),
                duration: 1000
            }).present();
        // if(r.isMultiword)
        //   r = r.children[0]
        this.events.publish('highlight:change', r);
    };
    AnnotatePage.prototype.ionViewCanLeave = function () {
        var _this = this;
        if (this.showAlertMessage) {
            var alertPopup = this.alertCtrl.create({
                title: this.translateService.instant('Exit'),
                message: this.translateService.instant('Changes are not saved. Are you sure?'),
                buttons: [{
                        text: this.translateService.instant('Exit'),
                        handler: function () {
                            _this.showAlertMessage = false;
                            _this.navCtrl.pop();
                        }
                    },
                    {
                        text: this.translateService.instant('Stay'),
                        handler: function () {
                            // need to do something if the user stays?
                        }
                    }]
            });
            // Show the alert
            alertPopup.present();
            // Return false to avoid the page to be popped up
            return false;
        }
    };
    AnnotatePage.prototype.presentSelectizeFormPopover = function () {
        var _this = this;
        var options = Object.keys(this.config.mf).filter(function (x) { return _this.config.MfVsPos[x].indexOf(_this.config.MfVsPos_upostag ? _this.highlight.element.upostag : _this.highlight.element.xpostag) >= 0; });
        if (options.length > 0) {
            var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_6__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */], {
                element: this.highlight.element,
                config: this.config,
                options: options
            }, { cssClass: "selectizePopover" }); //,enableBackdropDismiss:false});
            this.preventKeyboard = true;
            popover.present({});
            popover.onDidDismiss(function (x) {
                _this.preventKeyboard = false;
                _this.saveForUndo();
            });
        }
        else {
            this.toastCtrl.create({
                message: this.translateService.instant('No morphological features is needed for this tag: ') + this.config.getXPosTag(this.highlight.element.xpostag).desc,
                duration: 3000,
                position: "top"
            }).present();
        }
    };
    AnnotatePage.prototype.presentHelpFormPopover = function () {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_8__components_help_popover_help_popover__["a" /* HelpPopoverComponent */], {
            config: this.config,
            project: this.project,
            hash: this.hash
        }, { cssClass: "helpPopover" });
        popover.present({});
    };
    AnnotatePage.prototype.mouseClick = function (e) {
        this.events.publish("stats", { action: "mouse", element: e });
    };
    AnnotatePage.prototype.keyboardShortcuts = function (e) {
        var highlighNode = document.querySelector(".highlight");
        if (e.target != document.querySelector("body")
            && e.target && e.target.className.indexOf("element") == -1) {
            if (e.code == "Escape") {
                this.events.publish("stats", { action: "keyboard", event: e });
                if (highlighNode)
                    this.renderer.invokeElementMethod(highlighNode, 'focus', []);
            }
            return;
        }
        if (this.preventKeyboard)
            return;
        if (!this.config)
            return false;
        if (e.code == "Escape")
            this.copyElement = null;
        var action = this.config.keyboardShortcuts
            .find(function (v) {
            return (v.code == e.code) &&
                // (v.key!=undefined && v.key == e.key) &&
                ((v.metaKey == true) == e.metaKey) &&
                ((v.shiftKey == true) == e.shiftKey) &&
                ((v.altKey == true) == e.altKey) &&
                ((v.ctrlKey == true) == e.ctrlKey) &&
                true;
        });
        if (action != null) {
            this.events.publish("stats", { action: "keyboard", event: e, code: action });
            this.doAction(action.action, action.params, e);
        }
        else
            this.events.publish("stats", { action: "keyboard", event: e });
    };
    AnnotatePage.prototype.tag_morphofeatures = function (e) {
        if (e === void 0) { e = null; }
        this.showAlertMessage = true;
        this.events.publish("stats", { action: "tag_morphofeatures", element: this.highlight.element });
        this.presentSelectizeFormPopover();
        if (e)
            e.preventDefault();
    };
    AnnotatePage.prototype.redo = function (e) {
        if (e === void 0) { e = null; }
        var x = this.redoArr.pop();
        if (!x) {
            console.warn("nothing to redo.");
            return false;
        }
        this.undoArr.push(this.conlluRaw);
        this.conlluRaw = x;
        if (e)
            e.preventDefault();
    };
    AnnotatePage.prototype.undo = function (e) {
        if (e === void 0) { e = null; }
        var x = this.undoArr.pop();
        if (!x) {
            console.warn("nothing to undo.", x);
            return false;
        }
        this.redoArr.push(this.conlluRaw);
        this.conlluRaw = x;
        if (e)
            e.preventDefault();
    };
    AnnotatePage.prototype.copy = function (e) {
        if (e === void 0) { e = null; }
        if (e)
            e.preventDefault();
        this.copyElement = this.highlight.element;
    };
    AnnotatePage.prototype.copyParent = function (e) {
        if (e === void 0) { e = null; }
        if (e)
            e.preventDefault();
        this.copyElement = this.highlight.element.parent;
    };
    AnnotatePage.prototype.paste = function (e) {
        if (e === void 0) { e = null; }
        if (!this.copyElement)
            return;
        if (this.copyElement.isMultiword) {
            var c = this.highlight.element.changeWith(this.copyElement);
            c._miscs["FROM"] = "PASTE";
            this.events.publish('highlight:change', c);
        }
        else
            this.highlight.element.copy(this.copyElement);
    };
    AnnotatePage.prototype.pasteMorphInfo = function (e) {
        if (e === void 0) { e = null; }
        if (this.copyElement)
            this.highlight.element.copyMorphInfo(this.copyElement);
    };
    AnnotatePage.prototype.new_sentence = function (e) {
        var _this = this;
        if (e === void 0) { e = null; }
        //TODO: this should be moved to conllu.ts
        if (!this.highlight.element)
            return;
        this.showAlertMessage = true;
        var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element);
        // check if last segment
        if (this.highlight.sentence.elements[eindex + 1]
            && this.highlight.element.parent != null
            && this.highlight.element.parent == this.highlight.sentence.elements[eindex + 1].parent) {
            //TODO show warning
            return;
        }
        var before = this.highlight.sentence.elements.slice(0, eindex + 1);
        var after = this.highlight.sentence.elements.slice(eindex + 1);
        if (after.length == 0) {
            // do reverse. join with next sentence
            if (!this.doc.sentences[sindex + 1])
                return;
            after = this.doc.sentences[sindex + 1].elements;
            after.forEach(function (e) {
                e.sentence = _this.highlight.sentence;
            });
            this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
            this.doc.sentences.splice(sindex + 1, 1);
            this.highlight.sentence.refix(true);
            this.doc.fixSentenceIds();
        }
        else {
            // sentence should be splitted
            this.highlight.sentence.elements = before;
            //re count the second sentence
            var counter_1 = 1;
            after.forEach(function (e) {
                if (!e.isMultiword)
                    e.id = "" + counter_1++;
                else {
                    var arr = e.id.split("-");
                    e.id = counter_1 + "-" + (counter_1 + parseInt(arr[1]) - parseInt(arr[0]));
                }
            });
            var sent = new __WEBPACK_IMPORTED_MODULE_12_conllu_dao__["ConlluSentence"]("new", after, [], this.doc);
            this.doc.sentences.splice(sindex + 1, 0, sent);
            this.doc.fixSentenceIds();
            // console.log(this.doc)
        }
        this.saveForUndo();
    };
    AnnotatePage.prototype.clone = function (e) {
        if (e === void 0) { e = null; }
        //TODO: this should be moved to conllu.ts
        if (!this.highlight.element)
            return;
        //TODO FIX many things
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element);
        var el = this.highlight.element.clone();
        this.highlight.sentence.elements.splice(eindex + 1, 0, el);
        if (this.highlight.element.parent) {
            el.parent = this.highlight.element.parent;
            el.parent.children.push(el);
            var arr = this.highlight.element.parent.id.split("-");
            el.parent.id = arr[0] + "-" + (parseInt(arr[1]) + 1);
        }
        else {
            var parent = new __WEBPACK_IMPORTED_MODULE_12_conllu_dao__["ConlluElement"]([parseInt(this.highlight.element.id) + "-" + (parseInt(this.highlight.element.id) + 1), this.highlight.element.form,
                "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], this.highlight.element.lineidx, this.highlight.element.line, this.highlight.sentence);
            parent.analysis = this.highlight.element.analysis;
            el.analysis = [];
            this.highlight.sentence.elements.splice(eindex, 0, parent);
            el.parent = parent;
            el.parent.children = [el, this.highlight.element];
            this.highlight.element.parent = parent;
        }
        // var counter = 1;
        // this.highlight.sentence.elements.forEach(e => {
        //   if (!e.isMultiword)
        //     e.id = "" + counter++;
        //   else {
        //     var arr = e.id.split("-")
        //     e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
        //   }
        // })
        this.highlight.sentence.refix();
        this.saveForUndo();
    };
    AnnotatePage.prototype.mark_misc = function (key, e) {
        this.showAlertMessage = true;
        this.highlight.element._miscs[key] = !this.highlight.element._miscs[key];
        this.saveForUndo();
    };
    AnnotatePage.prototype.delete = function (e) {
        //TODO: this should be moved to conllu.ts
        if (!this.highlight.element)
            return;
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element);
        //cannot delete whole word
        if (!this.highlight.element.parent)
            return;
        this.highlight.sentence.elements.splice(eindex, 1);
        var parent = this.highlight.element.parent;
        var arr = parent.id.split("-");
        //if it becomes one segment.. delete multiword line
        if (arr[0] == (parseInt(arr[1]) - 1) + "") {
            var mlindex = this.highlight.sentence.elements.indexOf(parent);
            this.highlight.sentence.elements.splice(mlindex, 1);
            this.highlight.element.parent = null;
        }
        else
            parent.id = arr[0] + "-" + (parseInt(arr[1]) - 1);
        var counter = 1;
        this.highlight.sentence.elements.forEach(function (e) {
            if (!e.isMultiword)
                e.id = "" + counter++;
            else {
                var arr = e.id.split("-");
                e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]));
            }
        });
        this.events.publish('highlight:change', this.highlight.sentence.elements[eindex]);
        // this.highlight.element = this.highlight.sentence.elements[eindex]
        this.saveForUndo();
    };
    AnnotatePage.prototype.tag_ma = function (analyses, e) {
        var _this = this;
        if (analyses === void 0) { analyses = []; }
        var el = this.highlight.element.parent || this.highlight.element;
        if (analyses.length == 0)
            analyses = el.analysis; //.filter((e,i)=>! this.viewMode || e._miscs["DOCID"]!==this.pageid && e._miscs["DOCID"]!==undefined)
        if (analyses) {
            var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */], {
                element: el,
                analyses: analyses,
                hash: this.hash,
                mode: "change",
                project: this.project,
                config: this.config
            }, { cssClass: "selectizePopover" });
            popover.present({});
            this.preventKeyboard = true;
            popover.onDidDismiss(function () {
                _this.preventKeyboard = false;
                _this.saveForUndo();
            });
        }
        else {
            this.toastCtrl.create({
                message: this.translateService.instant('No Analysis Found for this word: ') + el.form,
                duration: 3000,
                position: "top"
            }).present();
        }
        this.events.publish("stats", { action: "tag_ma", element: this.highlight.element });
        this.showAlertMessage = true;
    };
    AnnotatePage.prototype.viewElementsPopup = function (analyses, e) {
        var _this = this;
        if (analyses === void 0) { analyses = []; }
        if (e === void 0) { e = null; }
        if (analyses.length !== 0) {
            var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */], {
                analyses: analyses,
                hash: this.hash,
                project: this.project,
                mode: "view",
                config: this.config
            }, { cssClass: "selectizePopover" });
            popover.present({});
            this.preventKeyboard = true;
            popover.onDidDismiss(function () {
                _this.preventKeyboard = false;
                // this.saveForUndo()
            });
        }
        else {
            this.toastCtrl.create({
                message: this.translateService.instant('No Analysis Found'),
                duration: 3000,
                position: "top"
            }).present();
        }
        // this.events.publish("stats",{action:"tag_ma",element:this.highlight.element})
        this.showAlertMessage = true;
    };
    AnnotatePage.prototype.segment = function (e) {
        if (e === void 0) { e = null; }
        this.editable = true;
        this.preventKeyboard = false;
    };
    AnnotatePage.prototype.blurFormEditor = function (ev, elem) {
        this.preventKeyboard = false;
        this.editable = false;
        this.resize(ev);
    };
    AnnotatePage.prototype.resize = function (ev) {
        var int = 0.9;
        ev.target.style.width = ((ev.target.value.length + 1) * int) + 'vw';
    };
    AnnotatePage.prototype.keyupFormEditor = function (ev, elem) {
        this.resize(ev);
        if (ev.code == "Backspace") {
            //TODO: this should be moved to conllu.ts
            // TODO: name it: concat? merge?
            if (ev.target.selectionStart == 0 && ev.target.value == elem.form) {
                var cindex = elem.parent.children.indexOf(elem);
                if (cindex == 0)
                    return;
                var eindex = elem.sentence.elements.indexOf(elem);
                elem.sentence.elements.splice(eindex, 1);
                elem.parent.children.splice(cindex, 1);
                elem.parent.children[cindex - 1].form += elem.form;
                elem.sentence.refix(true);
            }
        }
        else if (ev.code == "ArrowLeft") {
            if (ev.target.selectionStart == ev.target.value.length && ev.target.value == elem.form) {
                console.log("here");
                this.nav("word_left");
            }
        }
        else if (ev.code == "Escape") {
            this.preventKeyboard = false;
            this.editable = false;
        }
        else if (ev.code == "ArrowRight") {
            if (ev.target.selectionStart == 0 && ev.target.value == elem.form) {
                console.log("here");
                this.nav("word_right");
            }
        }
        else if (ev.code == "Enter") {
            if (ev.target.value == elem.form) {
                // ev.target.blur()
                return;
            }
            // delete the node
            if (ev.target.value == "" && elem.parent != null) {
                var eindex = elem.sentence.elements.indexOf(elem);
                elem.sentence.elements.splice(eindex, 1);
                var cindex = elem.parent.children.indexOf(elem);
                elem.parent.children.splice(cindex, 1);
            }
            else {
                ev.target.value = ev.target.value.trim();
                var splits_1 = ev.target.value.split(" ");
                if (splits_1.length == 1) {
                    elem.form = ev.target.value;
                    // ev.target.blur()
                    return;
                }
                splits_1.forEach(function (form, i) {
                    var eindex = elem.sentence.elements.indexOf(elem);
                    if (i == 0) {
                        elem.form = form;
                        return;
                    }
                    var el = elem.clone();
                    el.form = form;
                    elem.sentence.elements.splice(eindex + i, 0, el);
                    if (elem.parent) {
                        el.parent = elem.parent;
                        // var cindex =elem.parent.children.indexOf(elem)
                        // console.log(cindex,i)
                        // console.log(elem.parent.children.map(e=>e.form))
                        // elem.parent.children.splice(cindex+i,0,el)
                        // elem.parent.id = elem.parent.children[0].id + "-" + (parseInt(elem.parent.children[0].id) + elem.parent.children.length-1)
                        // console.log(elem.parent.children.map(e=>e.form))
                    }
                    else {
                        var parent = new __WEBPACK_IMPORTED_MODULE_12_conllu_dao__["ConlluElement"]([parseInt(elem.id) + "-" + (parseInt(elem.id) + 1), splits_1.join(""),
                            "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], elem.lineidx, elem.line, elem.sentence);
                        parent.analysis = elem.analysis;
                        elem.sentence.elements.splice(eindex, 0, parent);
                        el.parent = parent;
                        // el.parent.children = [elem,el]
                        elem.parent = parent;
                    }
                });
            }
            // this.preventKeyboard = false
            // this.editable = false
            elem.sentence.refix(true);
            this.saveForUndo();
            ev.target.blur();
        }
    };
    AnnotatePage.prototype.doAction = function (action, params, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        switch (action) {
            case "nav":
                // console.log("doAction")
                this.nav(params[0], e);
                break;
            case "tag_morphofeatures":
                this.tag_morphofeatures(e);
                break;
            case "log":
                console.log(this.highlight.element);
                break;
            case "copy":
                this.copy(e);
                break;
            case "copyParent":
                this.copyParent(e);
                break;
            case "addNote":
                this.addNote(e);
                break;
            case "search":
                this.search(e);
                break;
            case "find":
                this.find(e);
                break;
            case "find_next":
                this.find_next(e);
                break;
            case "find_prev":
                this.find_next(e, true);
                break;
            case "paste":
                this.paste(e);
                break;
            case "pasteMorphInfo":
                this.pasteMorphInfo(e);
                break;
            case "undo":
                this.undo(e);
                break;
            case "redo":
                this.redo(e);
                break;
            case "new_sentence":
                this.new_sentence(e);
                break;
            case "tag_ma":
                this.tag_ma([], e);
                break;
            case "tag_ma_previous":
                var el2_1 = this.highlight.element.parent || this.highlight.element;
                var analyses = [].concat.apply([], this.doc.sentences
                    .filter(function (s) { return s._id <= el2_1.sentence._id; })
                    .map(function (s) { return s.tokens()
                    .filter(function (e) {
                    // parseInt(e.id.split("-")[0]) < parseInt(el2.id) &&
                    return e != el2_1 &&
                        e.form.replace(/[ًٌٍَُِّْ]/g, "") == el2_1.form.replace(/[ًٌٍَُِّْ]/g, "");
                }); }));
                this.tag_ma(analyses, e);
                e.preventDefault();
                break;
            case "edit_memMa":
                var el = this.highlight.element.parent || this.highlight.element;
                this.viewElementsPopup(el.analysis.filter(function (e, i) { return e._miscs["DOCID"] !== undefined && e._miscs["DOCID"] !== _this.pageid; }), e);
                break;
            case "segment":
                this.segment(e);
                break;
            case "diac":
                this.showAlertMessage = true;
                if (/[ًٌٍَُِْ]$/.test(this.highlight.element.form))
                    this.highlight.element.form = this.highlight.element.form.replace(/[ًٌٍَُِّْ]+$/, "");
                if (/ّ[ًٌٍَُِّْ]$/.test(this.highlight.element.form))
                    this.highlight.element.form = this.highlight.element.form.replace(/ّ[ًٌٍَُِّْ]+$/, "");
                this.highlight.element.form += params[0];
                this.saveForUndo();
                break;
            case "clone":
                this.clone(e);
                break;
            case "mark_misc":
                this.mark_misc(params[0], e);
                break;
            case "delete":
                this.delete(e);
                break;
            case "assignXTag":
                var fn = this.getTags()[params[0] - 1];
                if (fn) {
                    this.highlight.element.xpostag = fn.tag;
                    // this.highlight.element.upostag = this.config.alltags.find(x=>x.tag==fn.tag).mapToConllU
                    this.saveForUndo();
                }
                break;
            case "showOtherUTags":
                this.increaseTagsRow();
                break;
            case "assignSentenceTag":
                fn = this.config.sentenceTags[parseInt(params[0]) - 1];
                if (fn)
                    this.highlight.sentence.tag = fn.tag;
                this.saveForUndo();
                break;
            case "saveFile":
                this.saveFile(e);
                break;
            case "syncConllU":
                if (e)
                    e.preventDefault();
                this.syncConllU(e);
                break;
            case "validateConllu":
                if (e)
                    e.preventDefault();
                var doc = new __WEBPACK_IMPORTED_MODULE_12_conllu_dao__["ConlluDocument"](this.config);
                doc.parse(this.doc.toConllU(), function (s) { this.log.push(s); }, true);
                break;
            case "validate":
                if (e)
                    e.preventDefault();
                var issues = this.doc.validate();
                if (issues.length > 0)
                    this.toastCtrl.create({
                        message: this.translateService.instant('Several issues were found'),
                        duration: 3000,
                        position: "top"
                    }).present();
                else
                    this.toastCtrl.create({
                        message: this.translateService.instant('No issues were found'),
                        duration: 3000,
                        position: "top"
                    }).present();
                break;
            case "showCommands":
                if (e)
                    e.preventDefault();
                this.showCommands(e);
                break;
            default:
                // code...
                break;
        }
    };
    AnnotatePage.prototype.getTags = function () {
        return this.config.alltags.slice(this.tagsRow * 9, (this.tagsRow + 1) * 9).map(function (x, i) {
            x.fn = i + 1;
            return x;
        });
    };
    AnnotatePage.prototype.increaseTagsRow = function () {
        this.tagsRow++;
        this.currentTags = this.getTags();
        if (this.currentTags.length == 0) {
            this.tagsRow = 0;
            this.currentTags = this.getTags();
        }
    };
    AnnotatePage.prototype.showCommands = function (e) {
        var _this = this;
        console.log("showCommands");
        var alert = this.alertCtrl.create();
        alert.setTitle('List of Commands');
        this.config.keyboardShortcuts.forEach(function (e, i) {
            alert.addInput({
                type: 'radio',
                label: e.keys.length + e.keys.join("+") + " || " + e.action + (e.params && e.params.length > 0 ? " {" + e.params.join() + "} " : ""),
                value: i + "",
                checked: i == 0
            });
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: this.translateService.instant('OK'),
            handler: function (index) {
                _this.doAction(_this.config.keyboardShortcuts[index].action, _this.config.keyboardShortcuts[index].params, null);
            }
        });
        alert.present();
    };
    AnnotatePage.prototype.nav = function (direction, ev) {
        var _this = this;
        if (ev === void 0) { ev = null; }
        if (!this.highlight.element)
            return;
        var x = null;
        if (direction == "word_left")
            x = this.highlight.sentence.elements.find(function (x) { return !x.isMultiword && parseInt(x.id) == parseInt(_this.highlight.element.id) + 1; });
        else if (direction == "word_right")
            x = this.highlight.sentence.elements.find(function (x) { return !x.isMultiword && parseInt(x.id) == (parseInt(_this.highlight.element.id) - 1); });
        if (x) {
            this.events.publish('highlight:change', x);
        }
        else {
            var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
            var y = null;
            if (direction == "word_down")
                y = this.doc.sentences[sindex + 1];
            else if (direction == "word_up")
                y = this.doc.sentences[sindex - 1];
            if (!y)
                return;
            if (y.elements.length != 0) {
                this.events.publish('highlight:change', y.elements.filter(function (x) { return !x.isMultiword; })[0]);
                return;
            }
            this.highlight.sentence = y;
            this.nav(direction);
        }
        if (ev)
            ev.preventDefault();
    };
    AnnotatePage.prototype.saveFile = function (e, askToMarkIsDone) {
        var _this = this;
        if (e === void 0) { e = null; }
        if (askToMarkIsDone === void 0) { askToMarkIsDone = true; }
        if (e)
            e.preventDefault();
        // this.navCtrl.getActive().
        if (askToMarkIsDone && this.done) {
            this.doc.sentences[0].comments.unshift("# update " + this.stats.getLine(this.highlight.element));
            this.saveFile(null, false);
        }
        else if (askToMarkIsDone) {
            var alertPopup = this.alertCtrl.create({
                title: this.translateService.instant('Mark as done?'),
                message: this.translateService.instant('Do you want to mark it as done?'),
                buttons: [{
                        text: this.translateService.instant('Yes'),
                        handler: function () {
                            _this.doc.sentences[0].comments.unshift("# done " + _this.stats.getLine(_this.highlight.element));
                            _this.saveFile(null, false);
                        }
                    },
                    {
                        text: this.translateService.instant('No'),
                        handler: function () {
                            _this.doc.sentences[0].comments.unshift("# notdone " + _this.stats.getLine(_this.highlight.element));
                            _this.saveFile(null, false);
                        }
                    }]
            });
            alertPopup.present();
        }
        else {
            this._conlluRaw = this.doc.toConllU();
            this.conlluService.save(this.project, this.hash, this.pageid, this.conlluRaw).then(function (s) {
                _this.toastCtrl.create({
                    message: _this.translateService.instant('File was successfully saved. Status:' + (s.isDone ? "Done" : "Not Done")),
                    duration: 3000,
                    position: "top"
                }).present();
                _this.stats.start = new Date();
                _this.showAlertMessage = false;
            }).catch(function (reason) {
                _this.toastCtrl.create({
                    message: _this.translateService.instant('Error: ') + _this.translateService.instant(reason),
                    duration: 3000,
                    position: "top"
                }).present();
                console.error('Error: ', reason);
            });
        }
    };
    AnnotatePage.prototype.syncConllU = function (e) {
        if (e === void 0) { e = null; }
        this._conlluRaw = this.doc.toConllU();
        this.toastCtrl.create({
            message: this.translateService.instant('Conll-U representation has been updated'),
            duration: 3000,
            position: "top"
        }).present();
    };
    AnnotatePage.prototype.download = function () {
        //make sure there is a tab after each span
        // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
        // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
        // console.log(this.conlluRaw)
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        var filename = this.pageid;
        if (!/\.conllu$/.test(filename))
            filename += ".conllu";
        downloadAnchorNode.setAttribute("download", filename);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    AnnotatePage.prototype.saveForUndo = function (newConllRaw) {
        if (newConllRaw === void 0) { newConllRaw = null; }
        if (!this.config.sync)
            return false;
        this.undoArr.push(this.conlluRaw);
        if (newConllRaw) {
            this.conlluRaw = newConllRaw;
        }
        else
            this._conlluRaw = this.doc.toConllU();
        if (this.undoArr.length > this.config.undoSize)
            this.undoArr.shift();
    };
    // onConlluRawSpansChanged(c,r,row_index,index,e = null) {
    //   r[index]=e.target.innerText
    //   this.conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
    //     return i==row_index? r.join("\t") : rr
    //   }).join("\n")
    //
    // }
    // maResult = null
    AnnotatePage.prototype.askMA = function () {
        var _this = this;
        if (this.doc.sentences.length > 100) {
            this.toastCtrl.create({
                message: this.translateService.instant('Warning: Sentences would not be sent to morphological analyser because sentence number') + " > 100",
                duration: 3000,
                position: "top"
            }).present();
            return;
        }
        Promise.all(this.doc.sentences.map(function (s, i) {
            return _this.wordservice.askMA(s.tokens().map(function (e) { return e.form; }).join(" "), _this.config)
                .then(function (elements) {
                var counter = 1;
                s.elements.forEach(function (e) {
                    if (e.parent)
                        return;
                    // if(!this.maResult[i])
                    //   return console.error(i,this.maResult)
                    if (!e.analysis)
                        e.analysis = [];
                    if (elements[counter])
                        e.analysis = e.analysis.concat(elements[counter] || []);
                    // else
                    // console.log("askMA",e,elements,counter)
                    counter++;
                });
            });
        }))
            .catch(function (s) {
            _this.toastCtrl.create({
                message: _this.translateService.instant('Error: ') + _this.translateService.instant(s),
                duration: 3000,
                position: "top"
            }).present();
            console.error('Error: ', s);
        });
    };
    AnnotatePage.prototype.askMemMA = function () {
        var _this = this;
        if (this.doc.sentences.length > 100) {
            this.toastCtrl.create({
                message: this.translateService.instant('Warning: Sentences would not be sent to morphological analyser because sentence number') + " >100",
                duration: 5000,
                position: "top"
            }).present();
            return;
        }
        this.doc.sentences.forEach(function (s, i) {
            _this.wordservice.askMemMA(s.tokens().map(function (e) { return e.form; }).join(" "), _this.config)
                .then(function (elements) {
                var counter = 0;
                s.elements.forEach(function (e) {
                    if (e.parent)
                        return;
                    // if(!this.maResult[i])
                    //   return console.error(i,this.maResult)
                    if (elements[counter])
                        e.analysis = elements[counter].concat(e.analysis || []);
                    // else if(!Array.isArray(elements[counter]))
                    // console.log("askMemMA",e,elements,counter)
                    counter++;
                });
            }).catch(function (s) {
                _this.toastCtrl.create({
                    message: _this.translateService.instant('Error: ') + _this.translateService.instant(s),
                    duration: 3000,
                    position: "top"
                }).present();
                console.error('Error: ', s);
            });
        });
    };
    AnnotatePage.prototype.showStats = function () {
        this.stats.print();
    };
    return AnnotatePage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('lemma'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* RadioGroup */])
], AnnotatePage.prototype, "lemmaGroup", void 0);
AnnotatePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-annotate',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{\'FILE\' | translate}}: {{pageid}}</ion-title>\n    <ion-buttons end>\n      <button right ion-button icon-only (click)="presentHelpFormPopover($event)" tabindex="-1">\n        <ion-icon name="help"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' ion-button icon-only tabindex="-1" (click)="syncConllU()">\n        <ion-icon name="sync"></ion-icon>\n      </button>\n      <button small *ngIf="config?.debug" class=\'topbar_button\' icon-left ion-button icon-only tabindex="-1" (click)="showStats()">\n        <ion-icon name="print"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' [disabled]="undoArr.length==0" icon-left ion-button icon-only tabindex="-1" (click)="undo()">\n        <ion-icon name="undo"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' [disabled]="redoArr.length==0" icon-left ion-button icon-only tabindex="-1" (click)="redo()">\n        <ion-icon name="redo"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' icon-left ion-button icon-only tabindex="-1" (click)="saveFile()">\n        <ion-icon name="cloud-upload"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' icon-left ion-button icon-only tabindex="-1" (click)="download()">\n        <ion-icon name="cloud-download"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' icon-left ion-button icon-only tabindex="-1" (click)="find($event)">\n        <ion-icon name="glasses"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' icon-left ion-button icon-only tabindex="-1" (click)="search($event)">\n        <ion-icon name="search"></ion-icon>\n      </button>\n      <button small class=\'topbar_button\' icon-left right ion-button icon-only tabindex="-1" (click)="config.isConlluHidden=!config.isConlluHidden">\n        <ion-icon [name]="config.isConlluHidden? \'eye\':\'eye-off\'"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <ion-grid (window:keydown)="keyboardShortcuts($event)" style="height: 100%;">\n    <ion-row>\n      <ion-col col-12>\n        <ion-row>\n          <tags-selector *ngIf="highlight.element" [currentTags]="currentTags" [element]="highlight.element" (nextTags)="increaseTagsRow()"></tags-selector>\n        </ion-row>\n      </ion-col>\n    </ion-row>\n    <ion-row style="height: inherit;">\n      <ion-col col-lg-2 col-sm-3 col-12>\n        <ion-list *ngIf="highlight.element">\n          <button color="dark" outline block icon-left ion-button tabindex="-1" (click)="tag_morphofeatures()">\n            <ion-icon name="apps"></ion-icon>{{ \'Features\' | translate }} </button>\n          <button color="dark" outline block icon-left ion-button tabindex="-1" (click)="tag_ma()">\n            <ion-icon name="menu"></ion-icon>{{\'Analyser\' | translate}}</button>\n          <button color="dark" outline block icon-left ion-button tabindex="-1" (click)="addNote($event)">\n            <ion-icon name="create"></ion-icon> {{\'Note\' | translate}}\n          </button>\n          <ion-item *ngIf="highlight.element.parent">\n            <ion-label color="primary" stacked>{{\'Inflected Word Form\' | translate}}</ion-label>\n            <ion-input [(ngModel)]="highlight.element.parent.form" tabindex="2" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n          </ion-item>\n          <ion-item (click)="mark_misc(\'UNCLEAR\')">\n            <ion-label>{{\'Unclear?\' | translate}}</ion-label>\n            <ion-checkbox [(ngModel)]="highlight.element._miscs[\'UNCLEAR\']"></ion-checkbox>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary" stacked>{{\'Lemma\' | translate}}</ion-label>\n            <ion-input [(ngModel)]="highlight.element.lemma" tabindex="4" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n          </ion-item>\n          <ion-item *ngFor="let feat of highlight.element.features; let i=index">\n            <ion-label color="primary" stacked>{{config.getFeature(feat.key).desc}}</ion-label>\n            <ion-select [(ngModel)]="feat.value" interface="popover">\n              <ion-option *ngFor="let e of config.mf[feat.key];" [value]="e.tag">{{e.desc}}</ion-option>\n            </ion-select>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary" stacked>{{\'XPOS Tag\' | translate}}</ion-label>\n            <ion-select [(ngModel)]="highlight.element._xpostag" tabindex="2">\n              <ion-option *ngFor="let tag of config.alltags;" [value]="tag.tag">{{tag.tag}}: {{tag.desc}}</ion-option>\n            </ion-select>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary" stacked>{{\'UPOS Tag\' | translate}}</ion-label>\n            <ion-select [(ngModel)]="highlight.element.upostag">\n              <ion-option *ngFor="let tag of config.allutags;" [value]="tag.tag">{{tag.tag}}: {{tag.desc}}</ion-option>\n            </ion-select>\n          </ion-item>\n        </ion-list>\n        <guider *ngIf="config.askGuider && highlight.element" [element]="highlight.element" [config]="config" type="specialPos" [project]="project" [hash]="hash"> </guider>\n        <guider *ngIf="config.askGuider && highlight.element" [element]="highlight.element" [config]="config" type="specialSeg" [project]="project" [hash]="hash"> </guider>\n      </ion-col>\n      <ion-col *ngIf="config">\n        <ion-row justify-content-center *ngIf="highlight.sentence?._id>2">\n          <ion-icon name="more"></ion-icon>\n        </ion-row>\n        <ion-row id="sentences">\n          <div *ngFor="let sent of doc?.sentences | isNextSentence: highlight.sentence" class="sentence" [ngClass]="{\n              rtl:configService.isRtl(project)}">\n            <!-- [hidden]=""> -->\n            <div>{{sent.tag}}</div>\n            <div tabindex="{{elem == highlight.element ? 1 : -1}}" *ngFor="let elem of sent.elements ; let i = index" class="element" [ngClass]="{\n              isCompounds:elem.upostag==\'_\',\n              highlight: highlight.element !== null && (elem == highlight.element || elem.parent == highlight.element),\n              copied: (elem == copyElement || elem.parent == copyElement) && copyElement !== null,\n              rtl:config.isRtl,\n              unclear: elem._miscs[\'UNCLEAR\'],\n              newline2: i%config.rowlength==0,\n              isSeg: elem.isSeg > 0,\n              ADJ : elem.upostag == \'ADJ\',\n              ADP : elem.upostag == \'ADP\',\n              ADV : elem.upostag == \'ADV\',\n              CCONJ : elem.upostag == \'CCONJ\',\n              DET : elem.upostag == \'DET\',\n              NOUN : elem.upostag == \'NOUN\',\n              NUM : elem.upostag == \'NUM\',\n              PART : elem.upostag == \'PART\',\n              PRON : elem.upostag == \'PRON\',\n              PROPN : elem.upostag == \'PROPN\',\n              PUNCT : elem.upostag == \'PUNCT\',\n              SCONJ : elem.upostag == \'SCONJ\',\n              VERB : elem.upostag == \'VERB\',\n              X : elem.upostag == \'X\'\n               }" (click)="events.publish(\'highlight:change\',elem,true,false)" [hidden]="elem.isMultiword" (dblclick)="editable = true">\n              <input *ngIf="editable && elem == highlight.element;else other_content" class="formInput" value="{{elem.form}}" focus="true" (keydown)="keyupFormEditor($event,elem)" (blur)="blurFormEditor($event,elem)" (focus)="resize($event)" (keyup)="resize($event)" />\n              <ng-template #other_content>\n                <span class="form" #spanForm>{{elem.getForm()}}</span>\n                <span class="postag">{{config.useUD ? config.tags[\'U:\'+elem.upostag]?.desc : config.tags[\'X:\'+elem.xpostag]?.desc}}</span>\n                <span class="lemma">/{{elem.lemma}}/</span>\n                <span class="mf_missing" [hidden]="elem.morphFeatsMissing().length == 0">{{elem.morphFeatsMissing().length}}</span>\n              </ng-template>\n            </div>\n          </div>\n        </ion-row>\n        <ion-row justify-content-center *ngIf="highlight.sentence?._id<doc?.sentences?.length-1">\n          <ion-icon name="more"></ion-icon>\n        </ion-row>\n      </ion-col>\n      <ion-col col-lg-4 id="conlluColumn" *ngIf="!config.isConlluHidden">\n        <ion-segment [(ngModel)]="conlluEditorType" color="secondary">\n          <ion-segment-button value="textarea">\n            <ion-icon name="create"></ion-icon>\n          </ion-segment-button>\n          <ion-segment-button value="pretty">\n            <ion-icon name="menu"></ion-icon>\n          </ion-segment-button>\n          <ion-segment-button value="errors">\n            <ion-icon name="warning" color="danger"></ion-icon>\n            <ion-badge color="danger" [hidden]="log.length ==0">{{log.length}}</ion-badge>\n          </ion-segment-button>\n          <ion-segment-button value="info">\n            <ion-icon name="information-circle"></ion-icon>\n          </ion-segment-button>\n        </ion-segment>\n        <ion-row *ngIf="conlluEditorType==\'textarea\'">\n          <ion-textarea tabindex="-1" no-text-wrap id="conlluTextArea" [ngModel]="conlluRaw" (change)="conlluRaw = $event.target.value" style="font-size: 7pt; margin-top:0; width: 100%;"></ion-textarea>\n        </ion-row>\n        <ion-row *ngIf="conlluEditorType==\'errors\'">\n          <div *ngFor="let l of log">{{l}}</div>\n          <!-- <ion-textarea [ngModel]="log" id="errorTextArea" rows="7" cols="80" style="margin-top:0" disabled="disabled"> -->\n          <!-- </ion-textarea> -->\n        </ion-row>\n        <ion-row *ngIf="conlluEditorType==\'pretty\'">\n          <conllu-editor [filename]="project+\'-\'+pageid" [raw]="conlluRaw" [hid]="[highlight.element?._id,highlight.sentence?._id]" (highlightChange)="highlightElement($event)" (rawChange)="conlluRaw=$event"></conllu-editor>\n        </ion-row>\n        <ion-row *ngIf="conlluEditorType==\'info\'">\n          <ion-card>\n            <ion-card-header>\n              Document Information\n            </ion-card-header>\n            <ion-list>\n              <ion-item><ion-icon name="cart" item-start></ion-icon>Sent #: {{info.sent_no}}</ion-item>\n              <ion-item><ion-icon name="cart" item-start></ion-icon>Elem #: {{info.elem_no}}</ion-item>\n              <ion-item><ion-icon name="cart" item-start></ion-icon>Tokens #: {{info.tokens_no}}</ion-item>\n              <ion-item><ion-icon name="cart" item-start></ion-icon>Types #: {{info.types_no}}</ion-item>\n              <ion-item><ion-icon name="cart" item-start></ion-icon>Multi Word Tokens #: {{info.mwe_no}}</ion-item>\n            </ion-list>\n          </ion-card>\n        </ion-row>\n      </ion-col>\n    </ion-row>\n    <!-- no need to show the intermediate data representation -->\n    <!-- <div class="conllu-parse" data-visid="vis" data-inputid="input" data-parsedid="parsed" data-logid="log"> -->\n  </ion-grid>\n  <!-- </ion-list> -->\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* PopoverController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_2__providers_word_service__["a" /* WordService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__["a" /* ConlluService */],
        __WEBPACK_IMPORTED_MODULE_4__providers_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__["c" /* TranslateService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
], AnnotatePage);

var Highlight = (function () {
    function Highlight(events, zone) {
        var _this = this;
        this.events = events;
        this.zone = zone;
        this.sentence = null;
        this.element = null;
        this.ref = "S1:1";
        this.events.subscribe("highlight:change", function (element) {
            if (!element) {
                console.trace("Published an event highlight:change but element is undefined");
                return;
            }
            zone.run(function () {
                _this.element = element;
                _this.sentence = element.sentence;
                _this.ref = "S" + _this.sentence._id + ":" + _this.element._id;
            });
        });
    }
    return Highlight;
}());

var Stats = (function () {
    function Stats(events) {
        var _this = this;
        this.events = events;
        this.start = new Date();
        // homographs :
        this.all = [];
        this.events.subscribe("stats", function (obj) {
            _this.all.push(obj);
            // console.log(obj)
        });
    }
    Stats.prototype.getLine = function (element) {
        var a = this.getStatsFromAll();
        var d = new Date();
        return [
            "Time=" + this.secondsToHms(Math.abs(d.getTime() - this.start.getTime())),
            "from=" + this.start,
            "to=" + d,
            "T=" + Math.abs(d.getTime() - this.start.getTime()),
            "stats=" + Object.keys(a).map(function (s) { return s + "=" + a[s]; }).join("|"),
            "highlight=" + element.sentence.id + ":" + element.id,
        ].join("|");
    };
    Stats.prototype.print = function () {
        console.log(this.getStatsFromAll());
        console.log(this.getAll());
        var d = new Date();
        console.log(this.start, d, Math.abs(d.getTime() - this.start.getTime()));
    };
    Stats.prototype.getStatsFromAll = function () {
        var cats = {};
        this.all.forEach(function (e) { return cats[e.action] = cats[e.action] + 1 || 1; });
        return cats;
    };
    Stats.prototype.secondsToHms = function (d) {
        d = Number(d) / 1000;
        console.log(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    };
    Stats.prototype.getAll = function () {
        var cache = [];
        var x = JSON.parse(JSON.stringify(this.all, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }));
        cache = null; // Enable garbage collection
        return x;
    };
    return Stats;
}());

//# sourceMappingURL=annotate.js.map

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_conllu_dao__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_conllu_dao___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_conllu_dao__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import { Config } from 'ionic-angular';




/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var WordService = (function () {
    function WordService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.maResults = {};
        this.memMaResults = {};
    }
    WordService.prototype.askMA = function (sentence, config) {
        var _this = this;
        if (this.maResults[sentence]) {
            // already loaded data
            // console.log("already loaded data for sent=",sentence)
            return Promise.resolve(this.maResults[sentence]);
        }
        if (sentence == "")
            return Promise.resolve([]);
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            _this.http.post(_this.myconfig.getValue("server") + 'ma', { sentence: sentence })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (!data.ok) {
                    return reject(data.error);
                }
                /***
                ** MA Results
                ****/
                var doc = new __WEBPACK_IMPORTED_MODULE_4_conllu_dao__["ConlluDocument"](config);
                var parsed = doc.parse(data.rs.join("\n").trim(), function (x) {
                    return console.warn("Parsing Conllu Error of MA Results:", x);
                }, true);
                var result = [];
                if (parsed.sentences.length == 0)
                    return reject("No Analysis is returned. Check the server.");
                parsed.sentences[0].elements
                    .forEach(function (e) {
                    if (e.parent)
                        return;
                    var wid = e.children.length > 0 ? e.children[0]._miscs["WID"] : e._miscs["WID"];
                    if (!Array.isArray(result[wid]))
                        result[wid] = [];
                    result[wid].push(e);
                });
                _this.maResults[sentence] = result;
                /***
                ** MA Results
                ****/
                resolve(_this.maResults[sentence]);
            });
        });
    };
    WordService.prototype.askMemMA = function (sentence, config) {
        var _this = this;
        if (this.memMaResults[sentence]) {
            // already loaded data
            return Promise.resolve(this.memMaResults[sentence]);
        }
        if (sentence == "")
            return Promise.resolve([]);
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            _this.http.post(_this.myconfig.getValue("server") + 'memMa', {
                sentence: sentence,
                project: config.project,
                hash: config.hash,
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (!data.ok) {
                    return reject(data.error);
                }
                /***
                ** MA Results
                ****/
                var doc = new __WEBPACK_IMPORTED_MODULE_4_conllu_dao__["ConlluDocument"](config);
                var sentences = data.results.map(function (e) { return e.join("\n"); }).join("\n\n").trim();
                // console.log(sentences);
                var parsed = doc.parse(sentences, function (x) {
                    return console.warn("Parsing Conllu Error of MemMA Results:", x);
                }, true);
                // console.log(sentences)
                var result = [];
                if (parsed.sentences.length == 0)
                    return reject("No Analysis is returned.");
                parsed.sentences.forEach(function (sent, i) {
                    result[i] = sent.elements.filter(function (e) { return !e.parent; });
                });
                _this.memMaResults[sentence] = result;
                //  /***
                //  ** MA Results
                //  ****/
                resolve(_this.memMaResults[sentence]);
            });
        });
    };
    return WordService;
}());
WordService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__["a" /* ConfigurationService */]])
], WordService);

// export class WordAnalysis{
// 	rank : number = -1;
// 	gloss : string;
// 	diac : string;
// 	lemma : string;
// 	pos : string;
// 	score : number;
// 	segmentation : string;
// 	constructor(public o) {
// 		this.rank = o.rank;
// 		this.gloss = o.gloss;
// 		this.diac = o.diac;
// 		this.lemma = o.lemma;
// 		this.pos = o.pos;
// 		this.score = o.score;
// 		this.segmentation = o.segmentation;
// 	}
// }
// export class Word{
// 	id: number = 0;
// 	word: string = ""
// 	possibilities : WordAnalysis[] = []
// 	constructor(public o) {
// 		this.update(o)
// 	}
// 	update(o) {
// 		this.id = o.id
// 		this.word = o.word
// 		if(o.possibilities)
// 			o.possibilities.forEach(e=>this.possibilities.push(new WordAnalysis(e)))
// 	}
// 	diacsArr = [];
// 	diacs(){
// 		var that = this
// 		if(this.diacsArr.length == 0){
// 			this.possibilities.forEach((e,i,arr)=>{
// 				if(that.diacsArr.indexOf(e.diac)==-1)
// 					that.diacsArr.push(e.diac)
// 			})
// 		}
// 		return this.diacsArr;
// 	}
// 	lemmaArr = [];
// 	lemma(){
// 		var that = this
// 		if(this.lemmaArr.length == 0){
// 			this.possibilities.forEach((e,i,arr)=>{
// 				if(that.lemmaArr.filter(ee=>e.gloss == ee.gloss).length==0)
// 					that.lemmaArr.push({
// 						"lemma": e.lemma,
// 						"gloss": e.gloss.replace(/;/g,"\n"),
// 					})
// 			})
// 		}
// 		return this.lemmaArr;
// 	}
// }
//# sourceMappingURL=word-service.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectizePopoverPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_config_json_class__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SelectizePopoverPageComponent = (function () {
    function SelectizePopoverPageComponent(navParams, 
        // public data: Data,
        viewCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.element = null;
        this.config = new __WEBPACK_IMPORTED_MODULE_2__providers_config_json_class__["a" /* ConfigJSON */]();
        this.myconfig = {};
        this.options = [];
        this.selectize_config = function () {
            var that = this;
            // if(this.options.length == 0 )
            //   this.options.push({
            //         value: "UNK",
            //         title: "UNK",
            //         feature: "UNK",
            //         val: "UNK",
            //         custom_selectize_class: "UNK",
            //       })
            return {
                maxItems: null,
                valueField: 'value',
                labelField: 'title',
                searchField: ['feature', 'val', 'title'],
                plugins: ['optgroup_columns'],
                options: this.options,
                optgroups: Object.keys(this.config.mf).map(function (x, i) { return new Object({
                    $order: i,
                    id: x,
                    name: x
                }); }),
                onInitialize: function () {
                    var _this = this;
                    that.element.features.forEach(function (x) {
                        // console.log(x.key, x.value)
                        var item = that.options.find(function (xx) { return xx.feature == x.key && xx.val.tag == x.value; });
                        if (item)
                            _this.addItem(item.feature + "=" + item.val.tag);
                    });
                },
                onDropdownClose: function (e) {
                    // this.open() // USE ONLY for debugging
                    //   console.log(e)
                    //   // if(this.shouldclose)
                    //     // that.viewCtrl.dismiss()
                },
                optgroupValueField: 'id',
                optgroupLabelField: 'name',
                optgroupField: 'feature',
                lockOptgroupOrder: true,
                hideSelected: true,
                // closeAfterSelect: true,
                openOnFocus: true,
                onItemAdd: function (value, $item) {
                    var _this = this;
                    var item = that.options.find(function (x) { return x.value == value; });
                    Object.keys(this.options).filter(function (x) { return _this.options[x].feature == item.feature && x != value; }).forEach(function (x) { return _this.removeOption(x); });
                    that.element.setFeature(item.feature, item.val.tag);
                    if (that.config.onFeatSelect && that.config.onFeatSelect[that.element.upostag] && that.config.onFeatSelect[that.element.upostag][item.feature + "=" + item.val.tag])
                        that.config.onFeatSelect[that.element.upostag][item.feature + "=" + item.val.tag].forEach(function (x) {
                            if (that.element.features[x.split("=")[0]] == undefined)
                                _this.addItem(x);
                        });
                    this.refreshOptions();
                },
                onItemRemove: function (value, $item) {
                    var _this = this;
                    var x = value.split("=")[0];
                    that.config.mf[value.split("=")[0]].map(function (i) { return new Object({
                        value: x + "=" + i.tag,
                        title: x + "=" + i.desc,
                        feature: x,
                        val: i,
                        custom_selectize_class: x,
                    }); }).forEach(function (x) { return _this.addOption(x); });
                    that.element.setFeature(value.split("=")[0], null);
                    this.refreshOptions();
                },
                create: false
            };
        };
        this.element = navParams.data.element;
        this.config = navParams.data.config;
        this.options = [].concat.apply([], navParams.data.options.map(function (x) { return _this.config.mf[x]
            .map(function (i) { return new Object({
            value: x + "=" + i.tag,
            title: x + "=" + i.desc,
            feature: x,
            val: i,
            custom_selectize_class: x,
        }); }); }));
        this.myconfig = this.selectize_config();
        // console.log(this.options)
        // console.log(this.myconfig)
    }
    SelectizePopoverPageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // this.myselectize.selectize.focus()
        setTimeout(function () {
            _this.myselectize.selectize.focus();
            _this.myselectize.selectize.shouldclose = true;
        }, 500);
    };
    return SelectizePopoverPageComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myselectize'),
    __metadata("design:type", Object)
], SelectizePopoverPageComponent.prototype, "myselectize", void 0);
SelectizePopoverPageComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'selectize-popover-page',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/selectize-popover-page/selectize-popover-page.html"*/'<div style=\'height: 50vh;\'>\n  <concordance [element]="element" [config]="config"></concordance>\n	<ng-selectize #myselectize [config]="myconfig"></ng-selectize>\n</div>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/selectize-popover-page/selectize-popover-page.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], SelectizePopoverPageComponent);

//# sourceMappingURL=selectize-popover-page.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MASelectizePopoverPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_browser__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { AnnotatePage } from '../../pages/annotate/annotate';



// import { ConcordanceComponent } from '../../components/concordance/concordance';
var MASelectizePopoverPageComponent = (function () {
    // @ViewChild('diacs') diacsGroup: RadioGroup;
    function MASelectizePopoverPageComponent(navParams, events, viewCtrl, navCtrl, iab) {
        var _this = this;
        this.navParams = navParams;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.iab = iab;
        this.element = null;
        this.analyses = [];
        this.path = null;
        this.myconfig = {};
        this.config = null;
        this.project = "";
        this.hash = "";
        this.pageid = "";
        this.dismissed = false;
        this.options = [];
        this.diacsOptions = [];
        // rank = 1;
        this.selected = { form: "" };
        this.mode = "";
        this.selectize_config = function () {
            var that = this;
            // if(this.options.length == 0 )
            //   this.options.push({
            //         counter: 1,
            //         title: "UNK",
            //         feature: "UNK",
            //         val: "UNK",
            //         o: {},
            //         custom_selectize_class: "UNK",
            //       });
            return {
                maxItems: 1,
                valueField: 'value',
                labelField: 'title',
                searchField: ['lemma', 'value', 'title', 'forsearch'],
                // plugins: ['optgroup_columns'],
                options: this.options,
                // optgroups: Object.keys(this.config.mf).map((x,i)=>new Object({
                //   $order: i,
                //   id: x,
                //   name: x
                // })),
                onDropdownClose: function (e) {
                    // this.open() // USE ONLY for debugging
                },
                render: {
                    option: function (item, escape) {
                        var arr = item.lemma.split("±");
                        var lemma = arr[0]; //item.lemma.replace(/±.*/,"")
                        var gloss = "";
                        if (arr.length == 2)
                            gloss = arr[1].split(";").map(function (meaning) { return "<span class='meaning'>" + escape(meaning) + "</span>"; }).join(" ");
                        return "<div class=doc" + item.isMemMA + "\">\n                    <div class=\"counter\">" + escape(item.counter + 1) + "</div>\n                    <div class=\"title\">\n                        <div class=\"lemma\">[" + lemma.replace(/(^_|_$)/, "") + "]</div>\n                        <div class=\"by\">" + gloss + "</div>\n                    </div>\n                    <div class=\"elements\">" +
                            item.elements.map(function (e) {
                                return "<div class='element'><span class='form'>" + e.form + "</span><span class='pos'>" + that.config.getXPosTag(e.xpostag).desc + "</span><span class='morphfeats'>" +
                                    e.features.map(function (e) {
                                        // if(!that.config.features[e.key+"="+e.value]){
                                        //   console.error(e.key+"="+e.value, "not defined")
                                        //   return e.key+"="+e.value
                                        // }
                                        return "<span class='morphfeat " + e.key + "'>" + that.config.getFeature(e.key + "=" + e.value).desc + "</span>";
                                    }).join(" ") + "</span></div>";
                            }).join("")
                            + ("</div><a href=\"/#/annotate\">" + item.sent + "</a><span>" + (item.miscs.DOCID ? item.miscs.DOCID : "") + "</span>\n                </div>");
                    }
                },
                // optgroupValueField: 'id',
                // optgroupLabelField: 'name',
                // optgroupField: 'feature',
                // lockOptgroupOrder: true,
                // hideSelected: true,
                // closeAfterSelect: false,
                // openOnFocus: true,
                onItemAdd: function (value, $item) {
                    var el = that.analyses.find(function (val) {
                        return value == val.id;
                    });
                    if (that.mode == "view") {
                        if (el._miscs["DOCID"] !== this.pageid)
                            that.iab.create(['/#/annotate', that.project, that.hash, el._miscs["DOCID"], el._miscs["SENTID"] + "-" + el._miscs["ELEMID"]].join("/"));
                        else {
                            // if(el.isMultiword)
                            //   el = el.children[0]
                            that.events.publish('highlight:change', el);
                        }
                    }
                    else if (that.mode == "change") {
                        var c = that.element.changeWith(el);
                        // c._miscs["FROM_MA"]=true
                        [c].concat(c.children).forEach(function (cc) {
                            cc._miscs["FROM"] = "MA";
                            delete cc._miscs["SENT"];
                            delete cc._miscs["DOCID"];
                            delete cc._miscs["ELEMID"];
                            delete cc._miscs["SENTID"];
                            delete cc._miscs["WID"];
                        });
                        that.events.publish('highlight:change', c);
                        that.events.publish("stats", { action: "changeWith", element: c.parent || c });
                    }
                    that.viewCtrl.dismiss();
                },
                create: false
            };
        };
        this.config = navParams.data.config;
        this.analyses = navParams.data.analyses;
        this.element = navParams.data.element;
        this.project = navParams.data.project;
        this.pageid = navParams.data.pageid;
        this.hash = navParams.data.hash;
        this.mode = navParams.data.mode || "";
        this.path = navParams.data.path;
        if (this.analyses)
            this.options = this.analyses
                .map(function (e, i) { return new Object({
                value: e.id,
                counter: i,
                title: i,
                // score: e._miscs["SCORE"],
                lemma: (e.children.length > 0 ? e.children.map(function (ee) { return ee.lemma; }).join(" ") : e.lemma),
                isMemMA: e._miscs["DOCID"] !== undefined,
                miscs: e._miscs,
                sent: e._miscs["SENT"] ? e._miscs["SENT"].replace(/±/g, " ") : (_this.mode == "view" ? e.getContext().map(function (e) { return e.form; }).join(" ") : ""),
                elements: (e.children.length > 0 ? e.children : [e]),
                forsearch: (e.children.length > 0 ? e.children : [e]).map(function (e) {
                    return e.form + " " +
                        _this.config.getXPosTag(e.xpostag).desc + " " +
                        _this.config.getUPosTag(e.upostag).desc + " " +
                        e.features.map(function (e) { return _this.config.getFeature(e.key + "=" + e.value).desc; }).join(" ");
                }).join(" "),
                o: e,
            }); });
        else {
            this.options = [];
        }
        this.myconfig = this.selectize_config();
    }
    MASelectizePopoverPageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // this.myselectize.selectize.focus()
        setTimeout(function () {
            _this.myselectize.selectize.focus();
            _this.myselectize.selectize.okayToClose = true;
        }, 500);
        var allpop = document.querySelector(".popover-content").offsetHeight;
        var inp = document.querySelector(".selectize-input").offsetHeight;
        var ll = document.querySelector(".selectize-dropdown-content");
        ll.style.height = allpop - inp + "px";
        ll.style["max-height"] = allpop - inp + "px";
    };
    return MASelectizePopoverPageComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myselectize'),
    __metadata("design:type", Object)
], MASelectizePopoverPageComponent.prototype, "myselectize", void 0);
MASelectizePopoverPageComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'ma-selectize-popover-page',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/ma-selectize-popover-page/ma-selectize-popover-page.html"*/'<div>\n  <concordance [element]="element" [config]="config"></concordance>\n	<ng-selectize #myselectize [config]="myconfig"></ng-selectize>\n</div>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/ma-selectize-popover-page/ma-selectize-popover-page.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
], MASelectizePopoverPageComponent);

//# sourceMappingURL=ma-selectize-popover-page.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpPopoverComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the HelpPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var HelpPopoverComponent = (function () {
    function HelpPopoverComponent(navParams, 
        // public data: Data,
        viewCtrl) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.shortcuts = [];
        this.config = null;
        this.config = navParams.data.config;
        this.shortcuts = this.config.keyboardShortcuts.map(function (e) {
            var params = e.params ? e.params.join() : "";
            if (e.code.indexOf("Digit") == 0)
                params = "";
            if (e.code.indexOf("F" + params) == 0)
                params = "";
            return [e.keys.join(" + "), e.desc || e.action, params];
        });
    }
    return HelpPopoverComponent;
}());
HelpPopoverComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'help-popover',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/'  <ion-card>\n  <ion-card-header>\n    {{\'Keyboard Shortcuts\' | translate}}\n  </ion-card-header>\n      <ion-list no-border>\n      <ion-item *ngFor="let sh of shortcuts">\n        <!-- <h2><button ion-button outline item-right icon-left>\n          {{sh[0]}}\n        </button></h2>\n        <p>{{sh[1]}}</p>\n -->\n        <!-- <ion-icon name=\'planet\' item-start></ion-icon> -->\n      <ion-note item-start>\n      {{sh[0]}}\n      </ion-note>\n      {{sh[1]}}\n      <ion-note item-end>\n      {{sh[2]}}\n      </ion-note>\n    </ion-item>\n\n      </ion-list>\n      </ion-card>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], HelpPopoverComponent);

//# sourceMappingURL=help-popover.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuidelinesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// import { Sentence} from '../pages/annotate/conllu';

/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var GuidelinesService = (function () {
    function GuidelinesService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.guidelines = {
            loaded: false,
            specialPos: [],
            specialSeg: [],
        };
        this.guidelinesObj = {
            loaded: false,
            specialPos: {},
            specialSeg: {},
        };
    }
    GuidelinesService.prototype.load = function (project, hash) {
        var _this = this;
        if (this.guidelines.loaded) {
            // already loaded data
            return Promise.resolve(this.guidelines);
        }
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            //    let opts:RequestOptionsArgs = {
            //    	headers : new Headers({
            //    		'Content-Type': 'application/json; charset=utf-8',
            //    		// 'Access-Control-Allow-Origin': 'http://localhost:8100'
            //    	}),
            //    	// 'body': JSON.stringify()
            // }
            _this.http.post(_this.myconfig.getValue("server") + "guidelines", {
                project: project,
                hash: hash
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                // data = data;
                if (data.ok) {
                    data.guides.forEach(function (v) {
                        if (v.ok) {
                            _this.guidelines[v.type] = v.data;
                            _this.guidelinesObj[v.type] = {};
                            _this.guidelines[v.type] = _this.guidelines[v.type].map(function (x) {
                                x.form_normalized = x.form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g, "");
                                var options = {};
                                x.options.forEach(function (x) { return options[x.value] = x; });
                                _this.guidelinesObj[v.type][x.form_normalized] = options;
                                return x;
                            });
                        }
                    });
                    resolve(_this.guidelines);
                }
                else
                    reject(data.error);
            });
        });
    };
    GuidelinesService.prototype.get = function (type, form) {
        form = form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g, "");
        if (!this.guidelines[type])
            return {};
        return this.guidelines[type].filter(function (x) { return x.form_normalized == form; })[0] || {};
    };
    GuidelinesService.prototype.getObj = function (type, form) {
        form = form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g, "");
        if (!this.guidelines[type])
            return {};
        return this.guidelinesObj[type][form] || {};
    };
    return GuidelinesService;
}());
GuidelinesService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_configuration_service__["a" /* ConfigurationService */]])
], GuidelinesService);

//# sourceMappingURL=guidelines-service.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(277);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadConfiguration */
/* unused harmony export deepLinkConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_word_service__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_conllu_service__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_config_service__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_guidelines_service__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_project_service__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_components_module__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_in_app_browser__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pipes_not_multi_tag__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pipes_is_next_sentence__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_status_bar__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_splash_screen__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ng2_file_upload__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_angular2_focus__ = __webpack_require__(433);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_ionic_configuration_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























function loadConfiguration(configurationService) {
    return function () { return configurationService.load("assets/ionic.config.json"); };
}
var deepLinkConfig = {
    links: [
        { component: __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */], name: 'Annotate Page', segment: 'annotate/:project/:hash/:id/:position', defaultHistory: [__WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */], name: 'Annotate Page', segment: 'annotate/:project/:hash/:id', defaultHistory: [__WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__["b" /* DocsPage */], name: 'Documents Page', segment: 'docs/:project/:hash', defaultHistory: [__WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */], name: 'Projects Page', segment: 'projects', defaultHistory: [] }
    ]
};
// export function createTranslateLoader(http: Http) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */],
            __WEBPACK_IMPORTED_MODULE_14__pipes_not_multi_tag__["a" /* NotMultiTag */],
            __WEBPACK_IMPORTED_MODULE_15__pipes_is_next_sentence__["a" /* IsNextSentence */],
            __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__["b" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["a" /* LoginModal */],
            __WEBPACK_IMPORTED_MODULE_19_ng2_file_upload__["FileSelectDirective"],
            __WEBPACK_IMPORTED_MODULE_19_ng2_file_upload__["FileDropDirective"],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_20_angular2_focus__["a" /* FocusModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_16__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_10__components_components_module__["a" /* ComponentsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], { locationStrategy: 'hash' }, deepLinkConfig),
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_12__pages_docs_docs__["b" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["b" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_projects_projects__["a" /* LoginModal */],
            __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */]
        ],
        providers: [
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_21_ionic_configuration_service__["a" /* ConfigurationService */],
            {
                provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["APP_INITIALIZER"],
                useFactory: loadConfiguration,
                deps: [__WEBPACK_IMPORTED_MODULE_21_ionic_configuration_service__["a" /* ConfigurationService */]],
                multi: true
            },
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_18__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_4__providers_word_service__["a" /* WordService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_conllu_service__["a" /* ConlluService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_config_service__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_7__providers_guidelines_service__["a" /* GuidelinesService */],
            __WEBPACK_IMPORTED_MODULE_8__providers_project_service__["a" /* ProjectService */],
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_projects_projects__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(134);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








// Enable production mode unless running locally
// if (!/localhost/.test(document.location.host)) {
Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
// }
var MyApp = (function () {
    function MyApp(platform, 
        // public data: Data,
        _config, statusbar, translateService, storage, myconfig, splashscreen) {
        var _this = this;
        this.platform = platform;
        this._config = _config;
        this.statusbar = statusbar;
        this.translateService = translateService;
        this.storage = storage;
        this.myconfig = myconfig;
        this.splashscreen = splashscreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_projects_projects__["b" /* ProjectsPage */];
        this.initializeApp();
        var browserLang = this.translateService.getBrowserLang();
        var lang = this.myconfig.getValue('lang');
        var langs = this.myconfig.getValue('langs');
        this.translateService.addLangs(langs);
        this.translateService.setDefaultLang("en");
        storage.get("lang").then(function (s) { return _this.translateService.use(s); }).catch(function () {
            _this.translateService.use(lang ? lang : browserLang);
        });
        this.pages = [];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusbar.styleDefault();
            _this.splashscreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_configuration_service__["a" /* ConfigurationService */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigJSON; });
var desc = { "saveFile": "Convert to Conll then Save",
    "syncConllU": "Convert to Conll",
    "diactric": "Add a diactric",
    "nav": "Move next/prev Word",
    "undo": "Undo last action (move backward in action history)",
    "redo": "Move forward in action history",
    "segment": "Edit the form/Add new segments to the current word/Delete current segment",
    "tag": "Assign current segment a new tag",
    "tag_ma": "Ask a morphological analyser for help",
    "tag_morphofeatures": "Assign morphological features",
    "diac": "Mark the last character with a diacritic",
    "more": "Show more less-frequent tags" };
var ConfigJSON = (function () {
    function ConfigJSON(data) {
        /**
         * The remote repository to push changes of your project to. Please make sure that you have appropriate login
         */
        this.remote_repo = "";
        /**
         * The default view for the right panel of Conll-U view. Four possible values or null to hide it completely: "textarea, pretty, errors, info"
         */
        this.conlluEditorType = "pretty";
        /**
         * Wether a morphological analyser will be used.
         */
        this.askMA = false;
        /**
         * Wether the memory-based morphological analyser (from previous taggins) will be used.
         */
        this.askMemMA = false;
        /**
         * Wether online guideline will be used. Requires memory-based option to be true.
         */
        this.askGuider = false;
        /**
         * (Read-only) project name
         */
        this.project = "";
        /**
         * (Read-only) project name
         */
        this.hash = "";
        /**
         * the model name for UDPipe.
         */
        this.language = "qac";
        /**
         * (Read-only) tagset name
         */
        this.tagset = "";
        this.users = [];
        this.debug = false;
        this.keyboardShortcuts = [];
        this.MfVsPos = {};
        this.MfVsPos_upostag = true;
        this.concordanceWindow = 5;
        this.mf = {};
        this.isRtl = true;
        this.useUD = true;
        this.sync = true;
        this.alltags = [];
        this.allxtags = [];
        this.allutags = [];
        this.onFeatSelect = {};
        this.tags = {};
        this.sentenceTags = [];
        this.loaded = false;
        this.undoSize = 5;
        this.features = {};
        if (data) {
            this.remote_repo = data.config.remote_repo;
            this.language = data.config.language;
            this.tagset = data.config.tagset;
            this.useUD = data.config.useUD;
            this.isRtl = data.config.isRtl;
            this.sync = data.config.sync;
            this.undoSize = data.config.undoSize;
            this.users = data.config.users;
            this.keyboardShortcuts = data.config.keyboardShortcuts;
            this.conlluEditorType = data.config.conlluEditorType; //as ConlluEditorType
            this.askMA = data.config.askMA;
            this.askMemMA = data.config.askMemMA;
            this.askGuider = data.config.askGuider;
            this.onFeatSelect = data.config.onFeatSelect;
            this.MfVsPos = data.config["MF.vs.POS"] || data.config.MfVsPos;
            this.MfVsPos_upostag = data.config["MF.vs.POS_upostag"] || data.config.MfVsPos_upostag;
            this.mf = data.config.mf;
            this.sentenceTags = data.config.sentenceTags;
            this.allutags = data.config.allutags;
            this.alltags = data.config.alltags;
        }
    }
    ConfigJSON.prototype.getFeature = function (key) {
        return this.features[key] || { tag: "N/A:" + key, desc: "n/a:" + key };
    };
    // getFeatures(xpostag){
    //   return this.alltags.find(x=>x.tag==this.xpostag)
    // }
    ConfigJSON.prototype.getXPosTag = function (key) {
        return this.tags["X:" + key] || { tag: "N/A:" + key, desc: "n/a:" + key };
    };
    ConfigJSON.prototype.getUPosTag = function (key) {
        return this.tags["U:" + key] || { tag: "N/A:" + key, desc: "n/a:" + key };
    };
    return ConfigJSON;
}());

ConfigJSON.validation = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "definitions": {
        "ConlluEditorType": {
            "enum": [
                "errors",
                "info",
                "pretty",
                "textarea"
            ],
            "type": "string"
        },
        "KeyboardJSON": {
            "properties": {
                "action": {
                    "type": "string"
                },
                "altKey": {
                    "type": "boolean"
                },
                "code": {
                    "type": "string"
                },
                "ctrlKey": {
                    "type": "boolean"
                },
                "desc": {
                    "type": "string"
                },
                "keys": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "metaKey": {
                    "type": "boolean"
                },
                "params": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "shiftKey": {
                    "type": "boolean"
                }
            },
            "type": "object"
        },
        "TagsJSON": {
            "properties": {
                "count": {
                    "type": "number"
                },
                "desc": {
                    "type": "string"
                },
                "features": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "fn": {
                    "type": "number"
                },
                "mapFrom": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "mapToConllU": {
                    "type": "string"
                },
                "mf": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "tag": {
                    "type": "string"
                }
            },
            "type": "object"
        }
    },
    "properties": {
        "MfVsPos": {
            "properties": {},
            "type": "object"
        },
        "MfVsPos_upostag": {
            "default": true,
            "type": "boolean"
        },
        "alltags": {
            "default": [],
            "items": {
                "$ref": "#/definitions/TagsJSON"
            },
            "type": "array"
        },
        "allutags": {
            "default": [],
            "items": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "allxtags": {
            "default": [],
            "items": {
                "type": "string"
            },
            "type": "array"
        },
        "askGuider": {
            "default": false,
            "description": "Wether online guideline will be used. Requires memory-based option to be true.",
            "type": "boolean"
        },
        "askMA": {
            "default": false,
            "description": "Wether a morphological analyser will be used.",
            "type": "boolean"
        },
        "askMemMA": {
            "default": false,
            "description": "Wether the memory-based morphological analyser (from previous taggins) will be used.",
            "type": "boolean"
        },
        "concordanceWindow": {
            "default": 5,
            "type": "number"
        },
        "conlluEditorType": {
            "$ref": "#/definitions/ConlluEditorType",
            "description": "The default view for the right panel of Conll-U view. Four possible values or null to hide it completely: \"textarea, pretty, errors, info\""
        },
        "debug": {
            "default": false,
            "type": "boolean"
        },
        "features": {
            "additionalProperties": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "object"
        },
        "hash": {
            "default": "",
            "description": "(Read-only) project name",
            "type": "string"
        },
        "isRtl": {
            "default": true,
            "type": "boolean"
        },
        "keyboardShortcuts": {
            "default": [],
            "items": {
                "$ref": "#/definitions/KeyboardJSON"
            },
            "type": "array"
        },
        "language": {
            "default": "qac",
            "description": "the model name for UDPipe.",
            "type": "string"
        },
        "loaded": {
            "default": false,
            "type": "boolean"
        },
        "mf": {
            "properties": {},
            "type": "object"
        },
        "onFeatSelect": {
            "additionalProperties": {
                "additionalProperties": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "type": "object"
            },
            "type": "object"
        },
        "project": {
            "default": "",
            "description": "(Read-only) project name",
            "type": "string"
        },
        "remote_repo": {
            "default": "",
            "description": "The remote repository to push changes of your project to. Please make sure that you have appropriate login",
            "type": "string"
        },
        "sentenceTags": {
            "default": [],
            "items": {},
            "type": "array"
        },
        "sync": {
            "default": true,
            "type": "boolean"
        },
        "tags": {
            "additionalProperties": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "object"
        },
        "tagset": {
            "default": "",
            "description": "(Read-only) tagset name",
            "type": "string"
        },
        "undoSize": {
            "default": 5,
            "type": "number"
        },
        "useUD": {
            "default": true,
            "type": "boolean"
        },
        "users": {
            "default": [],
            "items": {
                "type": "string"
            },
            "type": "array"
        }
    },
    "type": "object"
};
//# sourceMappingURL=config-json.class.js.map

/***/ }),

/***/ 421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__selectize_popover_page_selectize_popover_page__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__concordance_concordance__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__guider_guider__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__help_popover_help_popover__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tags_selector_tags_selector__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__conllu_editor_conllu_editor__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_docs_docs__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ng_selectize__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ngx_translate_http_loader__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_http__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_storage__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_ang_jsoneditor__ = __webpack_require__(249);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_12__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
// let translate =
var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    return ComponentsModule;
}());
ComponentsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_2__selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_3__ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_5__guider_guider__["a" /* GuiderComponent */],
            __WEBPACK_IMPORTED_MODULE_6__help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_7__tags_selector_tags_selector__["a" /* TagsSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_4__concordance_concordance__["a" /* ConcordanceComponent */],
            __WEBPACK_IMPORTED_MODULE_9__pages_docs_docs__["a" /* ConfigModal */],
            __WEBPACK_IMPORTED_MODULE_8__conllu_editor_conllu_editor__["a" /* ConlluEditorComponent */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_14_ionic_angular__["f" /* IonicModule */],
            __WEBPACK_IMPORTED_MODULE_0__angular_common__["CommonModule"],
            __WEBPACK_IMPORTED_MODULE_16_ang_jsoneditor__["c" /* NgJsonEditorModule */],
            __WEBPACK_IMPORTED_MODULE_15__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                loader: {
                    provide: __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__["a" /* TranslateLoader */],
                    useFactory: (createTranslateLoader),
                    deps: [__WEBPACK_IMPORTED_MODULE_13__angular_http__["a" /* Http */]]
                }
            }),
            __WEBPACK_IMPORTED_MODULE_10_ng_selectize__["a" /* NgSelectizeModule */]
        ],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_2__selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_6__help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_9__pages_docs_docs__["a" /* ConfigModal */],
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_2__selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_3__ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_5__guider_guider__["a" /* GuiderComponent */],
            __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__["b" /* TranslateModule */],
            __WEBPACK_IMPORTED_MODULE_9__pages_docs_docs__["a" /* ConfigModal */],
            __WEBPACK_IMPORTED_MODULE_16_ang_jsoneditor__["c" /* NgJsonEditorModule */],
            __WEBPACK_IMPORTED_MODULE_6__help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_7__tags_selector_tags_selector__["a" /* TagsSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_4__concordance_concordance__["a" /* ConcordanceComponent */],
            __WEBPACK_IMPORTED_MODULE_8__conllu_editor_conllu_editor__["a" /* ConlluEditorComponent */]]
    })
], ComponentsModule);

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConcordanceComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_config_json_class__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the GuiderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var ConcordanceComponent = (function () {
    function ConcordanceComponent() {
        this.elementIndex = 0;
    }
    return ConcordanceComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ConcordanceComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__providers_config_json_class__["a" /* ConfigJSON */])
], ConcordanceComponent.prototype, "config", void 0);
ConcordanceComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'concordance',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/concordance/concordance.html"*/'<div style="text-align: center">\n<div *ngIf="element" class="sentence" [ngClass]="{rtl:config.isRtl}">\n  <div>{{element?.sentence.tag}}</div>\n  <div tabindex="{{elem == element ? 1 : -1}}" *ngFor="let elem of element?.sentence.elements ; let i = index" class="element" [hidden]="elem.isMultiword || i > element.sentence.elements.indexOf(element) + config.concordanceWindow || i < element.sentence.elements.indexOf(element) - config.concordanceWindow" [ngClass]="{\n              isCompounds: elem.upostag==\'_\',\n              highlight: elem == element,\n              rtl:config.isRtl,\n              unclear: elem._miscs[\'UNCLEAR\'],\n              isSeg: elem.isSeg > 0 }">\n    <span>\n          <span class="form">{{elem.getForm()}}</span>\n          <span class="postag">{{config.useUD ? config.tags[\'U:\'+elem.upostag]?.desc : config.tags[\'X:\'+elem.xpostag]?.desc}}</span>\n          <span class="mf_missing" [hidden]="elem.morphFeatsMissing().length == 0">{{elem.morphFeatsMissing().length}}</span>\n    </span>\n  </div>\n</div>\n</div>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/concordance/concordance.html"*/
    }),
    __metadata("design:paramtypes", [])
], ConcordanceComponent);

//# sourceMappingURL=concordance.js.map

/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuiderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_guidelines_service__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_json_class__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the GuiderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var GuiderComponent = (function () {
    function GuiderComponent(navParams, guidelinesService, events, toastCtrl, viewCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.guidelinesService = guidelinesService;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.viewCtrl = viewCtrl;
        this.project = "";
        this.hash = "";
        this.options = [];
        // this.config = navParams.data.config
        this.guidelinesService.load(navParams.data.project, navParams.data.hash).then(function (x) {
            // this.guidelinesService.load("hadiths","d14274111536eed778f6b8a648115aa8").then(x=>{
        }).catch(function (x) {
            _this.toastCtrl.create({
                message: 'No guider is found: ' + x,
                duration: 3000,
                position: "top"
            }).present();
        });
    }
    GuiderComponent.prototype.toggle = function (e) {
        e.showDetails = e.showDetails || false;
        this.events.publish("stats", { action: "showGuider:toggle", elements: e });
        e.showDetails = !e.showDetails;
    };
    GuiderComponent.prototype.get = function () {
        return this.options;
    };
    GuiderComponent.prototype.show = function () {
        return this.options && this.options.length > 0;
    };
    GuiderComponent.prototype.assign = function (element, option) {
        element.xpostag = option.value;
        // console.log(element,option)
    };
    GuiderComponent.prototype.ngOnChanges = function (changes) {
        this.options = this.guidelinesService.get(this.type, this.element.form).options;
        if (this.options)
            this.options.forEach(function (e) { return e.showDetails = false; });
        if (this.show())
            this.events.publish("stats", { action: "showGuider", elements: this.element });
    };
    return GuiderComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], GuiderComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], GuiderComponent.prototype, "type", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], GuiderComponent.prototype, "project", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], GuiderComponent.prototype, "hash", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__providers_config_json_class__["a" /* ConfigJSON */])
], GuiderComponent.prototype, "config", void 0);
GuiderComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'guider',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/'<ion-list *ngIf="show()">\n  <ion-item-divider color="light">{{element?.form}}</ion-item-divider>\n  <ion-item *ngFor="let e of this.options">\n    <h2>\n      <ion-badge color="secondary" item-start>{{e.percentage}}</ion-badge>\n      {{config.getXPosTag(e.value).desc}}\n      <button ion-button (click)="toggle(e)" icon-only tabindex="-1">\n        <ion-icon name="eye" [hidden]="e.showDetails"></ion-icon>\n        <ion-icon name="eye-off" [hidden]="!e.showDetails"></ion-icon>\n      </button>\n      <button ion-button (click)="assign(element,e)" icon-only tabindex="-1"> <ion-icon name="checkmark"></ion-icon></button>\n    </h2>\n    <p *ngIf="e.showDetails">\n      <span style="display: block;" *ngFor="let ex of e.examples">{{ex}}</span>\n    </p>\n  </ion-item>\n</ion-list>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_guidelines_service__["a" /* GuidelinesService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], GuiderComponent);

//# sourceMappingURL=guider.js.map

/***/ }),

/***/ 424:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TagsSelectorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_conllu_dao__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_conllu_dao___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_conllu_dao__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the TagsSelectorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var TagsSelectorComponent = (function () {
    // @Input("config") public _config : ConfigJSON
    // set config(argv){
    //   this._config = argv
    //   this.currentTags = this.getTags()
    // }
    // get config(){
    //   return this._config
    // }
    // @Input() hash : string = ""
    function TagsSelectorComponent() {
        this.currentTags = [];
        this.nextTags = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        // this.tagsRow = 0;
    }
    TagsSelectorComponent.prototype.selectTag = function (tag) {
        if (this.element)
            this.element.xpostag = tag.tag;
    };
    return TagsSelectorComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], TagsSelectorComponent.prototype, "currentTags", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_conllu_dao__["ConlluElement"])
], TagsSelectorComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], TagsSelectorComponent.prototype, "nextTags", void 0);
TagsSelectorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'tags-selector',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/'<button color="secondary" style="direction: rtl" ion-button *ngFor="let tag of currentTags;" small class="tag" title="{{tag.desc}}" (click)="selectTag(tag)" tabindex="-1">\n  <span class=\'tag-num\'>{{tag.fn}}-</span>{{tag.desc}}\n</button>\n\n<button small ion-button style="direction: rtl" color="secondary" class="tag" title="Press 0 for more tags" (click)="this.nextTags.emit(true)" tabindex="-1">\n  <span class=\'tag-num\'>0</span>{{\'MORE\' | translate}}\n</button>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/,
        inputs: ['config']
    }),
    __metadata("design:paramtypes", [])
], TagsSelectorComponent);

//# sourceMappingURL=tags-selector.js.map

/***/ }),

/***/ 425:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConlluEditorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Generated class for the ConlluEditorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var ConlluEditorComponent = (function () {
    function ConlluEditorComponent(renderer) {
        this.renderer = renderer;
        this.conlluRawSpansSubset = [{}];
        this._conlluRaw = "";
        this.eid = -1;
        this.sid = -1;
        this.start = 1;
        this.conlluRawChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.highlighElementChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.conlluRawSpans = this.getConlluRaw();
    }
    Object.defineProperty(ConlluEditorComponent.prototype, "conlluRaw", {
        get: function () {
            return this._conlluRaw || "";
        },
        set: function (argv) {
            var _this = this;
            if (argv !== undefined) {
                this._conlluRaw = argv;
                this.conlluRawSpans = this.getConlluRaw();
                this.conlluRawSpansSubset = this.conlluRawSpans.filter(function (e) { return e.sentid === _this.sid; });
                this.start = this.conlluRawSpansSubset[0] ? this.conlluRawSpansSubset[0].line : 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConlluEditorComponent.prototype, "hid", {
        set: function (hid) {
            var _this = this;
            this.eid = hid[0];
            this.sid = hid[1];
            if (this.eid && this.sid)
                setTimeout(function () {
                    var highlight_element = document.querySelector("conllu-editor pre > .highlight");
                    if (highlight_element) {
                        document.querySelector("conllu-editor").scrollTo(0, highlight_element.offsetTop - 100);
                    }
                });
            if (this.conlluRawSpans) {
                this.conlluRawSpansSubset = this.conlluRawSpans.filter(function (e) { return e.sentid === _this.sid; });
                this.start = this.conlluRawSpansSubset[0] ? this.conlluRawSpansSubset[0].line : 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    ConlluEditorComponent.prototype.onConlluRawSpansChanged = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        setTimeout(function () {
            e.target.childNodes.forEach(function (e) {
                if (e.nodeName != "CODE")
                    return;
                if (e.innerText)
                    e.innerText = e.innerText.trim() + "\t";
            });
            // r[index]=e.target.innerText
            var conlluRaw = _this.conlluRaw.split("\n").map(function (rr, i) {
                return i == row_index ? e.target.innerText.trim() : rr;
            }).join("\n");
            // console.log(this.conlluRaw)
            if (document.activeElement.classList.contains("conllu-row"))
                return;
            _this.conlluRawChange.emit(conlluRaw);
            _this.highlighElementChange.emit('S' + r.sentid + ':' + r.elemid);
            // this.saveForUndo(conlluRaw)
            // this.highlightElement('S'+r.sentid+':'+r.elemid)
        });
    };
    ConlluEditorComponent.prototype.removeConlluRawRow = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        if (e && window.getSelection().baseOffset != 0)
            return;
        this.conlluRaw = this.conlluRaw.split("\n").filter(function (rr, i) {
            return i != row_index;
        }).join("\n");
        setTimeout(function () { return e ? _this.focus(row_index, e) : ""; });
        this.conlluRawChange.emit(this.conlluRaw);
    };
    ConlluEditorComponent.prototype.addConlluRawRow = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        if (e)
            e.preventDefault();
        var ar = this.conlluRaw.split("\n");
        ar.splice(row_index, 0, "# ");
        this.conlluRaw = ar.join("\n");
        setTimeout(function () { return e ? _this.focus(row_index, e) : ""; });
        this.conlluRawChange.emit(this.conlluRaw);
    };
    ConlluEditorComponent.prototype.focus = function (row_index, e) {
        if (e === void 0) { e = null; }
        // var current =
        var highlighNode = document.querySelector("div.conllu-row-" + row_index);
        console.log(highlighNode);
        if (highlighNode)
            this.renderer.invokeElementMethod(highlighNode, 'focus', []);
        // else
        // console.log("Not found",current)
    };
    ConlluEditorComponent.prototype.downloadConlluRawRow = function () {
        //make sure there is a tab after each span
        // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
        // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
        // console.log(this.conlluRaw)
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        var filename = this.filename;
        if (!/\.conllu$/.test(filename))
            filename += ".conllu";
        downloadAnchorNode.setAttribute("download", filename);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    ConlluEditorComponent.prototype.getConlluRaw = function (e) {
        if (e === void 0) { e = null; }
        var sentid = 1;
        return this.conlluRaw.replace(/\n{3,}/g, "\n\n").split("\n").map(function (e, i) {
            if (e == "")
                sentid++;
            var elemid = e.split("\t")[0];
            elemid = /^[0-9-]/.test(elemid.trim()) ? elemid.trim() : "comment";
            return {
                sentid: sentid,
                elemid: elemid,
                line: i,
                elems: e.split("\t") //.map(ee=>ee+="\t")
            };
        });
    };
    return ConlluEditorComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ConlluEditorComponent.prototype, "filename", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("raw"),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], ConlluEditorComponent.prototype, "conlluRaw", null);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], ConlluEditorComponent.prototype, "hid", null);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])('rawChange'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], ConlluEditorComponent.prototype, "conlluRawChange", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])('highlightChange'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], ConlluEditorComponent.prototype, "highlighElementChange", void 0);
ConlluEditorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'conllu-editor',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/conllu-editor/conllu-editor.html"*/'<!-- Generated template for the ConlluEditorComponent component -->\n<pre [style.counter-reset]="\'line \'+ start">\n<!--       --><div contenteditable="true" class="conllu-row conllu-row-{{i}}" [ngClass]="{\n              highlight:sid==r.sentid && eid == r.elemid}" *ngFor="let r of conlluRawSpansSubset; let i = index" (focus)="highlighElementChange.emit(\'S\'+r.sentid+\':\'+r.elemid)" (blur)="onConlluRawSpansChanged(r,i, $event)" (keydown.enter)="addConlluRawRow(r,i+1,$event)" (keydown.arrowup)="focus(i-1,$event)" (keydown.arrowdown)="focus(i+1,$event)" (keyup.backspace)="removeConlluRawRow(r,i,$event)"><code class="conllu-cell conllu-cell-{{ii}} begins-with-{{c[0]==\'#\'}}" *ngFor="let c of r.elems; let ii = index">{{c}}</code><!--  --></div>\n          <div class="downloadButton"><button tabindex="-1" ion-button small icon-only color="light" (click)="downloadConlluRawRow($event)"><ion-icon name="download"></ion-icon></button>\n<button tabindex="-1" ion-button class="downloadButton" small icon-only color="light" (click)="downloadConlluRawRow($event)"><ion-icon name="download"></ion-icon></button></div>\n\n<!-- --></pre>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/conllu-editor/conllu-editor.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
], ConlluEditorComponent);

//# sourceMappingURL=conllu-editor.js.map

/***/ }),

/***/ 431:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotMultiTag; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/*
  Generated class for the NotMultiTag pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var NotMultiTag = (function () {
    function NotMultiTag() {
    }
    /*
      Takes a value and makes it lowercase.
     */
    NotMultiTag.prototype.transform = function (list) {
        return list.filter(function (item) { return !item.isMultiword; });
    };
    return NotMultiTag;
}());
NotMultiTag = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'notmultitag',
        pure: false
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], NotMultiTag);

//# sourceMappingURL=not-multi-tag.js.map

/***/ }),

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IsNextSentence; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/*
  Generated class for the NotMultiTag pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var IsNextSentence = (function () {
    function IsNextSentence() {
        /*
          Takes a value and makes it lowercase.
         */
        this.windowSize = 1;
    }
    IsNextSentence.prototype.transform = function (list, highlight) {
        var _this = this;
        // let ii = parseInt(index)
        if (list == null)
            return [];
        if (highlight == null)
            highlight = list[0];
        return list.filter(function (sent) { return highlight._id <= sent._id + _this.windowSize && highlight._id >= sent._id - _this.windowSize; });
    };
    return IsNextSentence;
}());
IsNextSentence = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'isNextSentence',
        pure: false
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], IsNextSentence);

//# sourceMappingURL=is-next-sentence.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProjectsPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_project_service__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__docs_docs__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(134);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the ProjectsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ProjectsPage = (function () {
    // public validSecurity  = false
    function ProjectsPage(navCtrl, navParams, alertCtrl, projectService, storage, myconfig, translateService, modalCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.projectService = projectService;
        this.storage = storage;
        this.myconfig = myconfig;
        this.translateService = translateService;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        // public security = ""
        this.projects = [];
        this.new_project = "";
        this.list();
    }
    ProjectsPage.prototype.create = function () {
        var _this = this;
        this.projectService.create(this.new_project)
            .then(function (result) {
            if (result.ok) {
                _this.projects.push({
                    project: result.project,
                    hash: result.hash,
                });
                // this.storage.set("project_hash_"+result.project,result.hash);
            }
        }).catch(function (e) {
            _this.toastCtrl.create({
                message: _this.translateService.instant(e.error),
                duration: 3000,
                position: "top"
            }).present();
        });
    };
    ProjectsPage.prototype.goto = function (project) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__docs_docs__["b" /* DocsPage */], {
            project: project.project,
            hash: project.hash,
        });
    };
    ProjectsPage.prototype.logout = function () {
        var _this = this;
        this.projectService.logout();
        this.projects = [];
        var loginModal = this.modalCtrl.create(LoginModal, {}, {
            enableBackdropDismiss: false
        });
        loginModal.present();
        loginModal.onDidDismiss(function () { _this.list(); });
    };
    ProjectsPage.prototype.lang = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        var prompt = this.alertCtrl.create({
            title: this.translateService.instant('Language Change'),
            // message: this.translateService.instant("Please the language code"),
            inputs: this.translateService.getLangs().map(function (e) { return new Object({
                name: 'lang',
                type: 'radio',
                label: e,
                checked: e == _this.translateService.currentLang,
                value: e
            }); }),
            buttons: [
                {
                    text: this.translateService.instant('Change Langugaue'),
                    handler: function (data) {
                        _this.translateService.use(data);
                        _this.storage.get("lang").then(function (e) { return console.log(e); });
                        _this.storage.set("lang", data);
                    }
                }
            ]
        }).present();
    };
    ProjectsPage.prototype.list = function () {
        var _this = this;
        this.projectService.list().then(function (result) {
            _this.projects = result.projects;
            // this.validSecurity = true
            // this.storage.set("security",this.security);
            if (result.projects.length == 0) {
                _this.toastCtrl.create({
                    message: _this.translateService.instant("There is no projects created yet. Please create one now."),
                    duration: 3000,
                    position: "top"
                }).present();
            }
        }).catch(function (error) {
            _this.toastCtrl.create({
                message: _this.translateService.instant(error),
                duration: 3000,
                position: "top"
            }).present();
            var loginModal = _this.modalCtrl.create(LoginModal, {}, {
                enableBackdropDismiss: false
            });
            loginModal.present();
            loginModal.onDidDismiss(function () { _this.list(); });
        });
    };
    ProjectsPage.prototype.ionViewDidLoad = function () {
    };
    return ProjectsPage;
}());
ProjectsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-projects',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{\'PROJECTS TITLE\' | translate}}</ion-title>\n    <ion-buttons end>\n      <button *ngIf="projectService.username!=null" right ion-button icon-only (click)="logout($event)" tabindex="-1">\n        <ion-icon name="log-out"></ion-icon>\n      </button>\n      <button *ngIf="projectService.username!=null" right ion-button icon-only (click)="profile($event)" tabindex="-1">\n        <ion-icon name="contact"></ion-icon>\n      </button>\n      <button right ion-button icon-only (click)="lang($event)" tabindex="-1">\n        <ion-icon name="settings"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding rtl>\n  <ion-card>\n  <ion-item-divider>\n    {{\'CURRENT PROJECTS\' | translate}}\n  </ion-item-divider>\n  	<ion-list>\n    	<ion-item *ngFor="let p of projects">\n    		{{p.project}}\n    		<button ion-button outline item-end icon-left (click)="goto(p)">{{\'GO\' | translate}}</button>\n    		<button color="danger" ion-button outline item-end icon-left (click)="remove(p)">{{\'DELETE\' | translate}}</button>\n    	</ion-item>\n  	</ion-list>\n	<ion-item *ngIf=\'projects.length === 0\'>{{\'NO PROJECT IS FOUND\' | translate}}</ion-item>\n  <ion-item-divider>\n    {{\'NEW PROJECT\' | translate}}\n  </ion-item-divider>\n	<ion-item >\n	    <ion-label fixed>{{\'PROJECT NAME\' | translate}}</ion-label>\n	    <ion-input type="text" [(ngModel)]="new_project"></ion-input>\n		<button ion-button outline item-end icon-left (click)="create()">{{\'CREATE NEW PROJECT\' | translate}}</button>\n	</ion-item>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2__providers_project_service__["a" /* ProjectService */],
        __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_5_ionic_configuration_service__["a" /* ConfigurationService */],
        __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
], ProjectsPage);

var LoginModal = (function () {
    function LoginModal(viewCtrl, params, translateService, projectService, toastCtrl) {
        this.viewCtrl = viewCtrl;
        this.translateService = translateService;
        this.projectService = projectService;
        this.toastCtrl = toastCtrl;
        this.username = "";
        this.password = "";
        // console.log('UserId', params.get('userId'));
        this.username = this.projectService.username;
    }
    LoginModal.prototype.login = function () {
        var _this = this;
        this.projectService.login(this.username, this.password)
            .then(function (result) {
            _this.viewCtrl.dismiss({ username: _this.username });
        })
            .catch(function (e) {
            _this.toastCtrl.create({
                message: _this.translateService.instant(e),
                duration: 3000,
                position: "top"
            }).present();
        });
    };
    return LoginModal;
}());
LoginModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-login',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/projects/login.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{\'LOGIN PAGE TITLE\' | translate}}</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding rtl>\n  <ion-card *ngIf="!validSecurity">\n    <ion-card-header>{{\'LOGIN MODAL TITLE\' | translate}}</ion-card-header>\n    <ion-card-content>\n      <form (ngSubmit)="login()">\n        <ion-item>\n          <ion-label fixed>{{\'USERNAME\' | translate}}</ion-label>\n          <ion-input [(ngModel)]="username" name="username"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label fixed>{{\'PASSWORD\' | translate}}</ion-label>\n          <ion-input type="password" [(ngModel)]="password" name="password"></ion-input>\n        </ion-item>\n        <button type="submit" ion-button block>{{\'LOGIN\' | translate}}</button>\n      </form>\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/projects/login.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_project_service__["a" /* ProjectService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
], LoginModal);

//# sourceMappingURL=projects.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DocsPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_configuration_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_file_upload_ng2_file_upload__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_file_upload_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_file_upload_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__projects_projects__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__annotate_annotate__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_config_service__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_config_json_class__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ang_jsoneditor__ = __webpack_require__(249);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
 * Generated class for the DocsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var DocsPage = (function () {
    // public config :ConfigJSON = ""
    function DocsPage(navCtrl, navParams, conlluService, myconfig, configService, modalCtrl, translateService, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.conlluService = conlluService;
        this.myconfig = myconfig;
        this.configService = configService;
        this.modalCtrl = modalCtrl;
        this.translateService = translateService;
        this.toastCtrl = toastCtrl;
        this.uploader = new __WEBPACK_IMPORTED_MODULE_3_ng2_file_upload_ng2_file_upload__["FileUploader"]({ url: this.myconfig.getValue("server") + "conllu_upload" });
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
        this.project = "";
        this.hash = "";
        this.newFilename = "";
        this.text = "";
        this.list = [];
        if (!navParams.data.project) {
            navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__projects_projects__["b" /* ProjectsPage */]);
        }
        else {
            this.project = navParams.data.project;
            this.hash = navParams.data.hash;
        }
        var that = this;
        this.uploader.authToken = this.project + ":" + this.hash;
        this.uploader.onSuccessItem = function (item) {
            that.list.push(item.file.name);
        };
        conlluService.getList(this.project, this.hash).then(function (result) {
            if (result.ok)
                _this.list = result.files;
            else
                _this.toastCtrl.create({
                    message: _this.translateService.instant(result.error),
                    duration: 3000,
                    position: "top"
                }).present();
        });
    }
    DocsPage.prototype.goto = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__annotate_annotate__["a" /* AnnotatePage */], {
            project: this.project,
            hash: this.hash,
            id: id,
        });
    };
    DocsPage.prototype.remove = function (filename) {
        var _this = this;
        this.conlluService.remove(this.project, this.hash, filename).then(function (s) {
            if (s.ok)
                _this.list.splice(_this.list.findIndex(function (x) { return x.filename == filename; }), 1);
        });
    };
    DocsPage.prototype.udpipe = function (sentence) {
        var _this = this;
        var that = this;
        this.conlluService.udpipe(this.project, this.hash, sentence, this.newFilename, this.configService.getConfig(this.project).language).then(function (result) {
            that.list.push({ filename: result.filename, firstline: result.firstline });
        }).catch(function (err) {
            _this.toastCtrl.create({
                message: _this.translateService.instant(err),
                duration: 3000,
                position: "top"
            }).present();
        });
    };
    DocsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DocsPage');
    };
    DocsPage.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    DocsPage.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    DocsPage.prototype.openConfig = function () {
        var loginModal = this.modalCtrl.create(ConfigModal, {
            project: this.project,
            hash: this.hash,
        }, {
            enableBackdropDismiss: true
        });
        loginModal.present();
        // loginModal.onDidDismiss(()=>{this.list()})
    };
    return DocsPage;
}());
DocsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-docs',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/'<!--\n  Generated template for the DocsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>{{\'MANAGE PROJECT\' | translate}}: {{project}}</ion-title>\n    <ion-buttons end>\n      <button right ion-button icon-only (click)="openConfig()" tabindex="-1">\n        <ion-icon name="settings"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <ion-grid>\n    <ion-row>\n      <ion-col col-12>\n        <ion-list>\n          <ion-item *ngFor="let i of list">\n            {{i.filename}}\n            <ion-note>{{i.firstline}}</ion-note>\n            <button ion-button outline item-end icon-left (click)="goto(i.filename)">{{\'GO\' | translate}}</button>\n            <a ion-button outline item-end icon-left href="{{myconfig.getValue(\'server\')}}conllu_download?project={{project}}&hash={{hash}}&&file={{i.filename}}">{{\'DOWNLOAD\' | translate}}</a>\n            <button ion-button outline item-end icon-left color="danger" (click)="remove(i.filename)">{{\'DELETE\' | translate}}</button>\n          </ion-item>\n        </ion-list>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-card>\n        <ion-item>\n          <!-- <ion-label >Text</ion-label> -->\n          <ion-textarea [(ngModel)]="text" placeholder="Text you need to tokenize,tag"></ion-textarea>\n        </ion-item>\n        <ion-item-divider>\n        </ion-item-divider>\n        <ion-item>\n          <ion-label fixed>{{\'FILENAME\' | translate}}</ion-label>\n          <ion-input [(ngModel)]="newFilename"></ion-input>\n          <button ion-button outline item-end icon-left (click)="udpipe(text)">{{\'GO\' | translate}}</button>\n        </ion-item>\n      </ion-card>\n    </ion-row>\n    <ion-row ng2FileDrop (fileOver)="fileOverBase($event)" [uploader]="uploader" [ngClass]="{\'nv-file-over\': hasBaseDropZoneOver}">\n      <ion-card>\n        <ion-card-header>\n          {{\'UPLOADING FILES\' | translate}}\n        </ion-card-header>\n        <!--                 <table class="table">\n                    <thead>\n                        <tr>\n                            <th width="50%">Name</th>\n                            <th>Size</th>\n                            <th>Progress</th>\n                            <th>Status</th>\n                            <th>Actions</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n -->\n        <ion-list>\n          <ion-item-divider>\n            {{\'FILE LIST\' | translate}}\n          </ion-item-divider>\n          <ion-item *ngFor="let item of uploader.queue">\n            <ion-avatar item-start>\n              <span *ngIf="item.isSuccess"><ion-icon name="cloud-done"></ion-icon></span>\n              <span *ngIf="item.isCancel"><ion-icon name="trash"></ion-icon></span>\n              <span *ngIf="item.isError"><ion-icon name="alert"></ion-icon></span> 1\n            </ion-avatar>\n            <h2>{{ item?.file?.name }}</h2>\n            <p *ngIf="uploader.isHTML5">{{ item?.file?.size/1024/1024 | number:\'.2\' }} MB</p>\n            <div *ngIf="uploader.isHTML5">\n              <div class="progress" style="margin-bottom: 0;">\n                <div class="progress-bar" role="progressbar" [ngStyle]="{ \'width\': item.progress + \'%\' }"></div>\n              </div>\n            </div>\n            <ion-row>\n              <ion-col>\n                <button ion-button icon-left clear small (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">\n                  <ion-icon name="cloud-upload"></ion-icon>\n                  <div>{{\'Upload\' | translate}}</div>\n                </button>\n                <button ion-button icon-left clear small (click)="item.cancel()" [disabled]="!item.isUploading">\n                  <ion-icon name="undo"></ion-icon>\n                  <div>{{\'Cancel\' | translate}}</div>\n                </button>\n                <button ion-button icon-left clear small (click)="item.remove()">\n                  <ion-icon name="trash"></ion-icon>\n                  <div>{{\'Remove\' | translate}}</div>\n                </button>\n              </ion-col>\n            </ion-row>\n          </ion-item>\n        </ion-list>\n        <ion-item-divider>\n          {{\'UPLOAD A NEW FILE(S)\' | translate}}\n        </ion-item-divider>\n        <button ion-button (click)="uploadbutton.click()" icon-only>\n          <ion-icon name="cloud-upload"></ion-icon>\n          <input #uploadbutton type="file" ng2FileSelect [uploader]="uploader" multiple style="display: none" />\n        </button>\n      </ion-card>\n    </ion-row>\n  </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__["a" /* ConlluService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_configuration_service__["a" /* ConfigurationService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
], DocsPage);


var ConfigModal = (function () {
    function ConfigModal(params, translateService, toastCtrl, configService) {
        var _this = this;
        this.translateService = translateService;
        this.toastCtrl = toastCtrl;
        this.configService = configService;
        // get config (){
        //   return this._config;
        // }
        // set config (argv){
        //   // this.configStr = JSON.stringify(argv,null,4)
        //   this._config =argv
        // }
        // configStr : string = ""
        this.project = "";
        this.hash = "";
        this.configErrors = "";
        // console.log('UserId', params.get('userId'));
        this.project = params.data.project;
        this.hash = params.data.hash;
        this.editorOptions = new __WEBPACK_IMPORTED_MODULE_10_ang_jsoneditor__["b" /* JsonEditorOptions */]();
        this.editorOptions.schema = __WEBPACK_IMPORTED_MODULE_9__providers_config_json_class__["a" /* ConfigJSON */].validation;
        this.editorOptions.modes = ['code', 'tree']; // set all allowed modes
        this.configService.load(this.project, this.hash).then(function (s) {
            _this.config = s;
        }).catch(function (x) {
            // this.config = JSON.stringify(this.configService.getConfig(this.project),null,4)
        });
    }
    ConfigModal.prototype.saveConfig = function () {
        var _this = this;
        try {
            this.configService.save(this.project, this.hash, this.editor.get()).then(function (e) {
                // this.configService.save(this.project, this.hash,JSON.parse(this.configStr)).then(e=>{
                _this.toastCtrl.create({
                    message: _this.translateService.instant("Config file has been updated successfully."),
                    duration: 3000,
                    position: "top"
                }).present();
            }).catch(function (e) {
                console.dir(e);
                _this.toastCtrl.create({
                    message: _this.translateService.instant(e),
                    duration: 3000,
                    position: "top"
                }).present();
                _this.configErrors = e;
            });
        }
        catch (e) {
            console.dir(e);
            this.configErrors = e.message;
        }
    };
    return ConfigModal;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_10_ang_jsoneditor__["a" /* JsonEditorComponent */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_10_ang_jsoneditor__["a" /* JsonEditorComponent */])
], ConfigModal.prototype, "editor", void 0);
ConfigModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-login',
        // styleUrls: ['./app.component.css'],
        template: "\n  <ion-header>\n  <ion-navbar>\n    <ion-title>{{'Configuration File' | translate}}</ion-title>\n    <ion-buttons end>\n      <button right ion-button icon-only (click)=\"saveConfig()\" tabindex=\"-1\">\n        <ion-icon name=\"cloud-upload\"></ion-icon>\n      </button>\n    </ion-buttons>\n\n  </ion-navbar>\n</ion-header>\n<ion-content padding rtl>\n<json-editor [style.height.%]=\"90\" [options]=\"editorOptions\" [data]=\"config\"></json-editor>\n                    <div [hidden]=\"!configErrors\" class=\"configErrors\">{{configErrors}}</div>\n                    <!--<textarea [style.height.%]=\"90\" [style.width.%]=\"100\" [(ngModel)]=\"configStr\"></textarea>-->\n                    <!--<button ion-button item-end (click)=\"saveConfig(i)\">{{'SAVE' | translate}}</button>-->\n                    </ion-content>\n",
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_8__providers_config_service__["a" /* ConfigService */]])
], ConfigModal);

//# sourceMappingURL=docs.js.map

/***/ })

},[263]);
//# sourceMappingURL=main.js.map