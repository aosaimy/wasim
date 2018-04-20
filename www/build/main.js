webpackJsonp([0],{

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__projects_projects__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__annotate_annotate__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_config_service__ = __webpack_require__(34);
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
    function DocsPage(navCtrl, navParams, conlluService, myconfig, configService, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.conlluService = conlluService;
        this.myconfig = myconfig;
        this.configService = configService;
        this.toastCtrl = toastCtrl;
        this.uploader = new __WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload__["FileUploader"]({ url: this.myconfig.get("server") + "conllu_upload" });
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
        this.project = "";
        this.hash = "";
        this.newFilename = "";
        this.text = "";
        this.list = [];
        this.config = "";
        this.configErrors = "";
        if (!navParams.data.project) {
            navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__projects_projects__["a" /* ProjectsPage */]);
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
                    message: result.error,
                    duration: 3000,
                    position: "top"
                }).present();
        });
        this.configService.load(this.project, this.hash).then(function (s) {
            _this.config = JSON.stringify(_this.configService.getConfig(_this.project), null, 4);
        }).catch(function (x) {
            _this.config = JSON.stringify(_this.configService.getConfig(_this.project), null, 4);
        });
    }
    DocsPage.prototype.goto = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__annotate_annotate__["a" /* AnnotatePage */], {
            project: this.project,
            hash: this.hash,
            id: id,
        });
    };
    DocsPage.prototype.remove = function (id) {
        var _this = this;
        this.conlluService.remove(this.project, this.hash, id).then(function (s) {
            if (s.ok)
                _this.list.splice(_this.list.findIndex(function (x) { return x == id; }), 1);
        });
    };
    DocsPage.prototype.udpipe = function (sentence) {
        var _this = this;
        var that = this;
        this.conlluService.udpipe(this.project, this.hash, sentence, this.newFilename, this.configService.getConfig(this.project).language).then(function (result) {
            that.list.push({ filename: result.filename, firstline: result.firstline });
        }).catch(function (err) {
            _this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: "top"
            }).present();
        });
    };
    DocsPage.prototype.saveConfig = function () {
        var _this = this;
        try {
            this.configService.save(this.project, this.hash, JSON.parse(this.config)).then(function (e) {
                _this.toastCtrl.create({
                    message: "Config file has been updated successfully.",
                    duration: 3000,
                    position: "top"
                }).present();
            }).catch(function (e) {
                throw ({ message: e });
            });
        }
        catch (e) {
            console.dir(e);
            this.configErrors = e.message;
        }
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
    return DocsPage;
}());
DocsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-docs',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/'<!--\n  Generated template for the DocsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n    <ion-navbar>\n        <ion-title>إدارة المشروع: {{project}}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content padding>\n    <ion-grid>\n        <ion-row>\n            <ion-col col-12>\n                <ion-list>\n                    <ion-item *ngFor="let i of list">\n                        {{i.filename}}\n                        <ion-note>{{i.firstline}}</ion-note>\n                        <button ion-button outline item-end icon-left (click)="goto(i.filename)">اذهب</button>\n                        <a ion-button outline item-end icon-left href="{{myconfig.get(\'server\')}}conllu_download?project={{project}}&hash={{hash}}&&file={{i.filename}}">تحميل</a>\n                        <button ion-button outline item-end icon-left color="danger" (click)="remove(i.filename)">احذف</button>\n                    </ion-item>\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-card>\n                <ion-item>\n                    <!-- <ion-label >Text</ion-label> -->\n                    <ion-textarea [(ngModel)]="text" placeholder="Text you need to tokenize,tag"></ion-textarea>\n                </ion-item>\n                  <ion-item-divider>\n                  </ion-item-divider>\n                <ion-item>\n                    <ion-label fixed>اسم الملف</ion-label>\n                    <ion-input [(ngModel)]="newFilename"></ion-input>\n                    <button ion-button outline item-end icon-left (click)="udpipe(text)">اذهب</button>\n                </ion-item>\n            </ion-card>\n        </ion-row>\n        <ion-row ng2FileDrop (fileOver)="fileOverBase($event)" [uploader]="uploader" [ngClass]="{\'nv-file-over\': hasBaseDropZoneOver}">\n            <ion-card>\n                <ion-card-header>\n                    رفع الملفات\n                </ion-card-header>\n                <!--                 <table class="table">\n                    <thead>\n                        <tr>\n                            <th width="50%">Name</th>\n                            <th>Size</th>\n                            <th>Progress</th>\n                            <th>Status</th>\n                            <th>Actions</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n -->\n                <ion-list>\n                  <ion-item-divider>\n                    قائمة الملفات\n                  </ion-item-divider>\n\n                    <ion-item *ngFor="let item of uploader.queue">\n                        <ion-avatar item-start>\n                            <span *ngIf="item.isSuccess"><ion-icon name="cloud-done"></ion-icon></span>\n                            <span *ngIf="item.isCancel"><ion-icon name="trash"></ion-icon></span>\n                            <span *ngIf="item.isError"><ion-icon name="alert"></ion-icon></span> 1\n                        </ion-avatar>\n                        <h2>{{ item?.file?.name }}</h2>\n                        <p *ngIf="uploader.isHTML5">{{ item?.file?.size/1024/1024 | number:\'.2\' }} MB</p>\n                        <div *ngIf="uploader.isHTML5">\n                            <div class="progress" style="margin-bottom: 0;">\n                                <div class="progress-bar" role="progressbar" [ngStyle]="{ \'width\': item.progress + \'%\' }"></div>\n                            </div>\n                        </div>\n                        <ion-row>\n                            <ion-col>\n                                <button ion-button icon-left clear small (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">\n                                    <ion-icon name="cloud-upload"></ion-icon>\n                                    <div>Upload</div>\n                                </button>\n                                <button ion-button icon-left clear small (click)="item.cancel()" [disabled]="!item.isUploading">\n                                    <ion-icon name="undo"></ion-icon>\n                                    <div>Cancel</div>\n                                </button>\n                                <button ion-button icon-left clear small (click)="item.remove()">\n                                    <ion-icon name="trash"></ion-icon>\n                                    <div>Remove</div>\n                                </button>\n                            </ion-col>\n                        </ion-row>\n                    </ion-item>\n                </ion-list>\n                  <ion-item-divider>\n                    رفع ملف/ملفات جديدة\n                  </ion-item-divider>\n                    <button ion-button (click)="uploadbutton.click()" icon-only >\n                        <ion-icon name="cloud-upload"></ion-icon>\n                        <input #uploadbutton type="file" ng2FileSelect [uploader]="uploader" multiple style="display: none" />\n                    </button>\n\n            </ion-card>\n        </ion-row>\n        <ion-row>\n            <ion-card>\n                <ion-card-header>\n                    Configuration File\n                </ion-card-header>\n                <ion-card-content>\n                    <div [hidden]="!configErrors" class="configErrors">{{configErrors}}</div>\n                    <ion-textarea rows="15" [(ngModel)]="config"></ion-textarea>\n                    <button ion-button item-end (click)="saveConfig(i)">حفظ</button>\n                </ion-card-content>\n            </ion-card>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__["a" /* ConlluService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */],
        __WEBPACK_IMPORTED_MODULE_6__providers_config_service__["b" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]])
], DocsPage);

//# sourceMappingURL=docs.js.map

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConlluService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
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
        this.projects = {};
    }
    ConlluService.prototype.load = function (project, hash, pageid) {
        var _this = this;
        if (this.data[project + "-" + pageid]) {
            // already loaded data
            return Promise.resolve(this.data[project + "-" + pageid]);
        }
        var that = this;
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
            _this.http.post(_this.myconfig.get("server") + "conllu_get", {
                "project": project,
                "hash": hash,
                "file": pageid,
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                // data = data;
                if (data.ok) {
                    that.data[project + "-" + pageid] = data.file;
                    resolve(that.data[project + "-" + pageid]);
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
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve) {
            _this.http.post(_this.myconfig.get("server") + "conllu_list", {
                "project": project,
                "hash": hash,
            })
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
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            _this.http.post(_this.myconfig.get("server") + 'conllu_udpipe', {
                tokenizer: true,
                tagger: true,
                "project": project,
                "hash": hash,
                sentence: sentence,
                model: language,
                newFilename: newFilename,
            })
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
        var that = this;
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
            _this.http.post(_this.myconfig.get("server") + 'conllu_save', {
                "project": project,
                "hash": hash,
                "pageid": pageid,
                "data": file
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (data.ok) {
                    _this.data[project + "-" + pageid] = file;
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
        var that = this;
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
            _this.http.post(_this.myconfig.get("server") + 'conllu_remove', {
                "project": project,
                "hash": hash,
                "pageid": pageid,
            })
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
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]) === "function" && _b || Object])
], ConlluService);

var _a, _b;
//# sourceMappingURL=conllu-service.js.map

/***/ }),

/***/ 115:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 115;

/***/ }),

/***/ 157:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 157;

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
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




/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var ProjectService = (function () {
    function ProjectService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.data = {};
        this.list = { ok: false, projects: [], error: "Not laoded yet." };
    }
    ProjectService.prototype.getList = function (security) {
        var _this = this;
        if (this.list.ok) {
            return Promise.resolve(this.list);
        }
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.get("server") + "projects_list", {
                "security": security
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data);
                // data = data;
                if (data.ok) {
                    that.list = data;
                }
                resolve(data);
            }, function (error) {
                if (error.status != 200)
                    reject("Server is not working properly. url=" + _this.myconfig.get("server"));
            });
        });
    };
    ProjectService.prototype.create = function (security, project) {
        var _this = this;
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve) {
            _this.http.post(_this.myconfig.get("server") + "projects_create", {
                "security": security,
                "project": project,
            })
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
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]])
], ProjectService);

//# sourceMappingURL=project-service.js.map

/***/ }),

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnnotatePage; });
/* unused harmony export Highlight */
/* unused harmony export Stats */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AutofocusDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_word_service__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_config_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_selectize_popover_page_selectize_popover_page__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_help_popover_help_popover__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__docs_docs__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__projects_projects__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__conllu__ = __webpack_require__(208);
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









// import { SegmentorPopoverPageComponent } from '../../components/segmentor-popover-page/segmentor-popover-page';






/*
  Generated class for the Annotate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AnnotatePage = (function () {
    function AnnotatePage(navCtrl, popoverCtrl, navParams, 
        // public data: Data,
        http, cdr, renderer, events, wordservice, conlluService, configService, loadingCtrl, alertCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navParams = navParams;
        this.http = http;
        this.cdr = cdr;
        this.renderer = renderer;
        this.events = events;
        this.wordservice = wordservice;
        this.conlluService = conlluService;
        this.configService = configService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        /*
        Tags bar
        */
        this.myEventEmitted = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.tagsRow = 0;
        this.config = null;
        // conllu : ConllU = new ConllU().Document();
        this.log = "";
        this.doc = null;
        this.documentJson = {};
        this.project = "";
        this.hash = "";
        this.pageid = "";
        this.editable = false;
        this.isConlluHidden = false;
        this.copyElement = null;
        this.highlight = new Highlight(this.events);
        this.conlluRaw = "1-3 \u0648\u0639\u0646\u0647\u0627   _   _   _   _   _   _   _   _\n1   \u0648\u064E  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0\n2   \u0639\u064E\u0646\u0647\u0627   \u0639\u064E\u0646_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1\n3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2\n";
        this.conlluRawSpans = this.getConlluRaw();
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
        this.undoArr = [];
        this.redoArr = [];
        this.maResult = null;
        var loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        loading.present();
        if (!navParams.data.project) {
            //TODO change
            navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_11__projects_projects__["a" /* ProjectsPage */]);
        }
        else {
            this.project = navParams.data.project;
            this.hash = navParams.data.hash;
            navCtrl.insert(1, __WEBPACK_IMPORTED_MODULE_10__docs_docs__["a" /* DocsPage */], {
                project: this.project,
                hash: this.hash
            });
        }
        // on highlight change, scroll the ConllU Raw view and the main words view to proper location
        this.events.subscribe("highlight:change", function (element) {
            setTimeout(function () {
                var highlight_element = document.querySelector("pre > .highlight");
                if (highlight_element) {
                    document.querySelector("pre").scrollTo(0, highlight_element.offsetTop - 100);
                }
            });
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
        this.configService.load(this.project, this.hash).then(function (s) {
            loading.dismiss();
            _this.config = _this.configService.getConfig(_this.project);
            _this.doc = new __WEBPACK_IMPORTED_MODULE_12__conllu__["a" /* ConlluDocument */](_this.config);
        }).catch(function (s) {
            _this.config = _this.configService.getConfig(_this.project);
            _this.undoArr = new Array(_this.config.undoSize || 5);
            _this.isConlluHidden = _this.config.isConlluHidden || false;
            _this.toastCtrl.create({
                message: 'Config loading Error: ' + s.error,
                duration: 3000,
                position: "top"
            }).present();
            console.error('Config loading Error: ' + s.error);
        });
        this.conlluService.load(this.project, this.hash, this.pageid).then(function (s) {
            _this.conlluRaw = s.trim();
            _this.conlluRawSpans = _this.getConlluRaw();
            _this.onConlluRawChanged();
        }).catch(function (x) {
            _this.toastCtrl.create({
                message: 'Conllu File loading Error: ' + x,
                duration: 3000,
                position: "top"
            }).present();
            console.error('Conllu File loading Error: ' + x);
            console.trace(x);
        });
    }
    AnnotatePage.prototype.logme = function (x) { console.log(x); };
    AnnotatePage.prototype.ngOnInit = function () {
        // this.config = this.configService.getConfig(this.project)
        // console.log('ngAfterViewInit AnnotatePage');
        // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
    };
    AnnotatePage.prototype.presentGetFormPopover = function () {
        var _this = this;
        var el = this.highlight.element.parent || this.highlight.element;
        if (el.analysis) {
            var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */], {
                element: el,
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
                message: 'No Analysis Found for this word: ' + el.form,
                duration: 3000,
                position: "top"
            }).present();
        }
    };
    AnnotatePage.prototype.ionViewCanLeave = function () {
        var _this = this;
        if (this.showAlertMessage) {
            var alertPopup = this.alertCtrl.create({
                title: 'Exit',
                message: 'Changes are not saved. Are you sure?',
                buttons: [{
                        text: 'Exit',
                        handler: function () {
                            _this.showAlertMessage = false;
                            _this.navCtrl.pop();
                        }
                    },
                    {
                        text: 'Stay',
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
                message: 'No morphological features is needed for this tag: ' + this.config.getXPosTag(this.highlight.element.xpostag).desc,
                duration: 3000,
                position: "top"
            }).present();
        }
    };
    AnnotatePage.prototype.presentHelpFormPopover = function () {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_9__components_help_popover_help_popover__["a" /* HelpPopoverComponent */], {
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
        // console.log(e)
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
        var action = this.config.keyboardShortcuts
            .filter(function (v) {
            return (v.code == e.code) &&
                // (v.key!=undefined && v.key == e.key) &&
                ((v.metaKey == true) == e.metaKey) &&
                ((v.shiftKey == true) == e.shiftKey) &&
                ((v.altKey == true) == e.altKey) &&
                ((v.ctrlKey == true) == e.ctrlKey) &&
                true;
        });
        if (action.length == 1) {
            this.events.publish("stats", { action: "keyboard", event: e, code: action });
            this.doAction(action[0].action, action[0].params, e);
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
        this.conlluRawSpans = this.getConlluRaw();
        this.onConlluRawChanged();
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
        this.conlluRawSpans = this.getConlluRaw();
        this.onConlluRawChanged();
        if (e)
            e.preventDefault();
    };
    AnnotatePage.prototype.copy = function (e) {
        if (e === void 0) { e = null; }
        this.copyElement = this.highlight.element;
    };
    AnnotatePage.prototype.paste = function (e) {
        if (e === void 0) { e = null; }
        if (this.copyElement)
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
            var counter = this.highlight.sentence.words(false).length + 1;
            after.forEach(function (e) {
                e.sentence = _this.highlight.sentence;
            });
            this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
            this.doc.sentences.splice(sindex + 1, 1);
            this.highlight.sentence.refix(true);
        }
        else {
            // sentence should be splitted
            this.highlight.sentence.elements = before;
            //re count the second sentence
            var counter_1 = 1;
            after.forEach(function (e) {
                if (!e.isMultiword())
                    e.id = "" + counter_1++;
                else {
                    var arr = e.id.split("-");
                    e.id = counter_1 + "-" + (counter_1 + parseInt(arr[1]) - parseInt(arr[0]));
                }
            });
            var sent = new __WEBPACK_IMPORTED_MODULE_12__conllu__["c" /* ConlluSentence */]("new", after, [], this.doc);
            this.doc.sentences.splice(sindex + 1, 0, sent);
            this.doc.fixSentenceIds();
            // console.log(this.doc)
        }
        this.saveForUndo();
    };
    AnnotatePage.prototype.clone = function (e) {
        if (e === void 0) { e = null; }
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
            var parent = new __WEBPACK_IMPORTED_MODULE_12__conllu__["b" /* ConlluElement */]([parseInt(this.highlight.element.id) + "-" + (parseInt(this.highlight.element.id) + 1), this.highlight.element.form,
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
        //   if (!e.isMultiword())
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
        if (!this.highlight.element)
            return;
        var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
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
            if (!e.isMultiword())
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
    AnnotatePage.prototype.tag_ma = function (e) {
        this.presentGetFormPopover();
        this.events.publish("stats", { action: "tag_ma", element: this.highlight.element });
        this.showAlertMessage = true;
    };
    AnnotatePage.prototype.segment = function (e) {
        if (e === void 0) { e = null; }
        this.editable = true;
        this.preventKeyboard = false;
    };
    AnnotatePage.prototype.blurFormEditor = function (ev, elem) {
        // this.preventKeyboard = false
        // this.editable = false
        this.resize(ev);
    };
    AnnotatePage.prototype.resize = function (ev) {
        var int = 0.9;
        ev.target.style.width = ((ev.target.value.length + 1) * int) + 'vw';
    };
    AnnotatePage.prototype.keyupFormEditor = function (ev, elem) {
        this.resize(ev);
        if (ev.code == "Backspace") {
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
                        var parent = new __WEBPACK_IMPORTED_MODULE_12__conllu__["b" /* ConlluElement */]([parseInt(elem.id) + "-" + (parseInt(elem.id) + 1), splits_1.join(""),
                            "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], elem.lineidx, elem.line, elem.sentence);
                        parent.analysis = elem.analysis;
                        elem.sentence.elements.splice(eindex, 0, parent);
                        el.parent = parent;
                        // el.parent.children = [elem,el]
                        elem.parent = parent;
                    }
                });
            }
            this.preventKeyboard = false;
            this.editable = false;
            elem.sentence.refix(true);
            this.saveForUndo();
            // ev.target.blur()
        }
    };
    AnnotatePage.prototype.doAction = function (action, params, e) {
        var that = this;
        var x;
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
                this.tag_ma(e);
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
                var fn_1 = this.myTags.getTags()[params[0] - 1];
                if (fn_1) {
                    this.highlight.element.xpostag = fn_1.tag;
                    this.highlight.element.upostag = this.config.alltags.find(function (x) { return x.tag == fn_1.tag; }).mapToConllU;
                }
                this.saveForUndo();
                break;
            case "showOtherUTags":
                this.myTags.increaseTagsRow();
                break;
            case "assignSentenceTag":
                fn_1 = this.config.sentenceTags[parseInt(params[0]) - 1];
                if (fn_1)
                    this.highlight.sentence.tag = fn_1.tag;
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
                // var that = this
                var doc = new __WEBPACK_IMPORTED_MODULE_12__conllu__["a" /* ConlluDocument */](this.config);
                doc.parse(this.doc.toConllU(), function (s) { this.log = this.log + s + '\n'; }, true);
                break;
            default:
                // code...
                break;
        }
    };
    AnnotatePage.prototype.nav = function (direction, ev) {
        var _this = this;
        if (ev === void 0) { ev = null; }
        if (!this.highlight.element)
            return;
        var x = null;
        if (direction == "word_left")
            x = this.highlight.sentence.elements.filter(function (x) { return !x.isMultiword() && parseInt(x.id) == parseInt(_this.highlight.element.id) + 1; })[0];
        else if (direction == "word_right")
            x = this.highlight.sentence.elements.filter(function (x) { return !x.isMultiword() && parseInt(x.id) == (parseInt(_this.highlight.element.id) - 1); })[0];
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
            if (y) {
                // this.highlight.sentence = y
                this.events.publish('highlight:change', y.elements.filter(function (x) { return !x.isMultiword(); })[0]);
            }
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
        if (askToMarkIsDone) {
            var alertPopup = this.alertCtrl.create({
                title: 'Mark as done?',
                message: 'Do you want to mark it as done?',
                buttons: [{
                        text: '(Y)es',
                        handler: function () {
                            _this.doc.sentences[0].comments.unshift("# done " + _this.stats.getLine(_this.highlight.element));
                            _this.saveFile(null, false);
                        }
                    },
                    {
                        text: '(N)o',
                        handler: function () {
                            _this.doc.sentences[0].comments.unshift("# notdone " + _this.stats.getLine(_this.highlight.element));
                            _this.saveFile(null, false);
                        }
                    }]
            });
            alertPopup.present();
        }
        else {
            this.conlluRaw = this.doc.toConllU();
            this.conlluRawSpans = this.getConlluRaw();
            this.conlluService.save(this.project, this.hash, this.pageid, this.conlluRaw).then(function (s) {
                _this.toastCtrl.create({
                    message: 'File was successfully saved',
                    duration: 3000,
                    position: "top"
                }).present();
                _this.showAlertMessage = false;
            }).catch(function (reason) {
                _this.toastCtrl.create({
                    message: 'Error: ' + reason,
                    duration: 3000,
                    position: "top"
                }).present();
                console.error('Error: ' + reason);
            });
        }
    };
    AnnotatePage.prototype.getConlluRaw = function (e) {
        if (e === void 0) { e = null; }
        var sentid = 1;
        return this.conlluRaw.split("\n").map(function (e) {
            if (e == "")
                sentid++;
            var elemid = e.split("\t")[0];
            elemid = /^[0-9-]/.test(elemid.trim()) ? elemid.trim() : "comment";
            return {
                sentid: sentid,
                elemid: elemid,
                elems: e.split("\t").map(function (ee) { return ee += "\t"; })
            };
        });
    };
    AnnotatePage.prototype.syncConllU = function (e) {
        if (e === void 0) { e = null; }
        this.conlluRaw = this.doc.toConllU();
        this.conlluRawSpans = this.getConlluRaw();
        this.toastCtrl.create({
            message: 'Conll-U representation has been updated.',
            duration: 3000,
            position: "top"
        }).present();
    };
    AnnotatePage.prototype.saveForUndo = function (newConllRaw) {
        if (newConllRaw === void 0) { newConllRaw = null; }
        if (!this.config.sync)
            return false;
        this.undoArr.push(this.conlluRaw);
        if (newConllRaw) {
            this.conlluRaw = newConllRaw;
            this.onConlluRawChanged();
        }
        else
            this.conlluRaw = this.doc.toConllU();
        this.conlluRawSpans = this.getConlluRaw();
        if (this.undoArr.length > this.config.undoSize)
            this.undoArr.shift();
    };
    AnnotatePage.prototype.onConlluRawSpansChanged = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        setTimeout(function () {
            e.target.childNodes.forEach(function (e) {
                if (e.innerText)
                    e.innerText = e.innerText.trim() + "\t";
            });
            // r[index]=e.target.innerText
            var conlluRaw = _this.conlluRaw.split("\n").map(function (rr, i) {
                return i == row_index ? e.target.innerText : rr;
            }).join("\n");
            // console.log(this.conlluRaw)
            if (document.activeElement.classList.contains("conllu-row"))
                return;
            _this.saveForUndo(conlluRaw);
        });
    };
    AnnotatePage.prototype.removeConlluRawRow = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        setTimeout(function () {
            // r[index]=e.target.innerText
            var conlluRaw = _this.conlluRaw.split("\n").filter(function (rr, i) {
                return i != row_index;
            }).join("\n");
            // if(document.activeElement.classList.contains("conllu-row"))
            //   return
            _this.saveForUndo(conlluRaw);
        });
    };
    AnnotatePage.prototype.addConlluRawRow = function (r, row_index, e) {
        var _this = this;
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        setTimeout(function () {
            // r[index]=e.target.innerText
            var ar = _this.conlluRaw.split("\n");
            ar.splice(row_index, 0, "# ");
            var conlluRaw = ar.join("\n");
            // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
            // console.log(this.conlluRaw)
            // console.log(document.activeElement)
            // if(document.activeElement.classList.contains("conllu-row"))
            // return
            _this.saveForUndo(conlluRaw);
        });
    };
    AnnotatePage.prototype.highlightConlluRawRow = function (r, row_index, e) {
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
        // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
        // console.log(this.conlluRaw)
        var sent = this.doc.sentences.find(function (e) { return e.id == 'S' + r.sentid; });
        if (!sent)
            return;
        var elem = sent.elements.find(function (e) { return e.id == r.elemid; });
        if (!elem)
            elem = sent.elements[0];
        if (elem.isMultiword())
            elem = elem.children[0];
        this.events.publish('highlight:change', elem);
    };
    AnnotatePage.prototype.downloadConlluRawRow = function (r, row_index, e) {
        if (e === void 0) { e = null; }
        //make sure there is a tab after each span
        // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
        // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
        // console.log(this.conlluRaw)
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", this.project + "-" + this.pageid);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    // onConlluRawSpansChanged(c,r,row_index,index,e = null) {
    //   r[index]=e.target.innerText
    //   this.conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
    //     return i==row_index? r.join("\t") : rr
    //   }).join("\n")
    //   this.onConlluRawChanged()
    // }
    AnnotatePage.prototype.onConlluRawChanged = function (e) {
        if (e === void 0) { e = null; }
        this.log = "";
        // console.log("Here",this.conlluRaw)
        var that = this;
        if (e) {
            this.conlluRaw = e.target.value;
        }
        var ref = this.conlluRaw.match(/^# (?:done|notdone).*\|highlight=([^\|\n]*)/);
        this.doc.parse(this.conlluRaw, function (s) {
            that.log = that.log + s + '\n';
        }, false); //.toBrat(logger, true);
        var hasHighlight = function (ref) {
            if (!ref)
                return false;
            ref = ref[1].split(":");
            var sent = this.doc.sentences.find(function (x) { return x.id == ref[0]; });
            if (!sent)
                return false;
            var elem = sent.elements.find(function (x) { return x.id == ref[1]; });
            if (!elem)
                return false;
            this.events.publish('highlight:change', elem);
            return true;
        };
        if (!hasHighlight.call(this, ref)) {
            var sentence = this.doc.sentences[0];
            if (sentence && this.doc.sentences[0].elements.filter(function (x) { return !x.isMultiword(); }).length > 0) {
                this.events.publish('highlight:change', this.doc.sentences[0].elements.filter(function (x) { return !x.isMultiword(); })[0]);
                // this.highlight.element = this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0]
            }
        }
        this.askMA();
        // console.log(JSON.parse(JSON.stringify(this.doc)))
    };
    AnnotatePage.prototype.askMA = function () {
        var _this = this;
        // console.log("asda")
        if (!this.maResult) {
            this.maResult = new Array(this.doc.sentences.length);
            this.doc.sentences.forEach(function (s, i) {
                //TODO REMOVE
                // if(i!=0)
                //   return
                _this.wordservice.load(s.tokens().map(function (e) { return e.form; }).join(" "), _this.config)
                    .then(function (elements) {
                    _this.maResult[i] = elements;
                    _this.assignMA(s, i);
                })
                    .catch(function (s) {
                    _this.toastCtrl.create({
                        message: 'Error: ' + s,
                        duration: 3000,
                        position: "top"
                    }).present();
                    console.error('Error: ' + s);
                });
            });
        }
        else
            this.doc.sentences.forEach(function (s, i) { return _this.assignMA(s, i); });
    };
    AnnotatePage.prototype.assignMA = function (s, i) {
        var _this = this;
        var counter = 1;
        s.elements.forEach(function (e) {
            if (e.parent)
                return;
            if (!_this.maResult[i])
                return console.error(i, _this.maResult);
            e.analysis = _this.maResult[i][counter];
            counter++;
        });
    };
    AnnotatePage.prototype.showStats = function () {
        this.stats.print();
    };
    return AnnotatePage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]) === "function" && _a || Object)
], AnnotatePage.prototype, "myEventEmitted", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('lemma'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* RadioGroup */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* RadioGroup */]) === "function" && _b || Object)
], AnnotatePage.prototype, "lemmaGroup", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myTags'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */]) === "function" && _c || Object)
], AnnotatePage.prototype, "myTags", void 0);
AnnotatePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-annotate',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>ترميز الملف: {{pageid}}</ion-title>\n    <ion-buttons end>\n      <button right ion-button icon-only (click)="presentHelpFormPopover($event)" tabindex="-1">\n        <ion-icon name="help"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <!-- <ion-list> -->\n  <!-- <ion-item *ngFor="">\n    <ion-avatar item-left>\n      <h1></h1>\n    </ion-avatar>\n    <h2>Finn</h2>\n    <h3>Don\'t Know What To Do!</h3>\n    <p>I\'ve had a pretty messed up day. If we just...</p>\n  </ion-item> -->\n  <ion-grid (window:keydown)="keyboardShortcuts($event)" (window:click)="mouseClick($event)" style="height: 100%;">\n    <ion-row>\n<!--       <ion-col style="display:none; margin: 0">\n        <div id="vis"></div>\n        <ion-textarea id="parsed" rows="10" cols="80"></ion-textarea>\n      </ion-col>\n -->      <ion-col col-12>\n        <ion-row>\n          <tags-selector *ngIf="config" #myTags [config]="config"></tags-selector>\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="syncConllU()">\n            <ion-icon name="sync"></ion-icon>\n          </button>\n          <button *ngIf="config?.debug" class=\'topbar_button\' icon-left ion-button tabindex="-1" (click)="showStats()">\n            <ion-icon name="print"></ion-icon>Stats</button>\n          <button class=\'topbar_button\' [disabled]="undoArr.length==0" icon-left ion-button tabindex="-1" (click)="undo()">\n            <ion-icon name="undo"></ion-icon> Undo\n          </button>\n          <button class=\'topbar_button\' [disabled]="redoArr.length==0" icon-left ion-button tabindex="-1" (click)="redo()">\n            <ion-icon name="redo"></ion-icon> Redo\n          </button>\n          <!-- <button class=\'topbar_button\' icon-left ion-button tabindex="-1" (click)="clone()"><ion-icon name="add"></ion-icon></button> -->\n          <!-- <button class=\'topbar_button\' icon-left ion-button tabindex="-1" (click)="delete()"><ion-icon name="remove"></ion-icon></button> -->\n          <button class=\'topbar_button\' icon-left ion-button tabindex="-1" (click)="saveFile()">\n            <ion-icon name="cloud-upload"></ion-icon> Save\n          </button>\n          <button class=\'topbar_button\' icon-left right ion-button tabindex="-1" (click)="isConlluHidden=!isConlluHidden">\n            Hide ConllU\n          </button>\n        </ion-row>\n        <!-- <ion-row>\n          <div *ngFor="let tag of sentenceTags;" class="tag" title="{{tag.desc}}" >\n              {{tag.tag}}\n              <span class="fn">F{{tag.fn}}</span>\n          </div>\n        </ion-row> -->\n      </ion-col>\n    </ion-row>\n    <ion-row style="height: inherit;">\n      <ion-col col-2>\n        <ion-row style="height: 95%;">\n          <ion-list *ngIf="highlight.element">\n            <!--         <ion-item>\n          <ion-label color="primary" stacked>Lemma</ion-label>\n          <ion-input [(ngModel)]="highlight.element.lemma"></ion-input>\n        </ion-item>-->\n            <ion-item>\n              <button icon-left ion-button tabindex="-1" (click)="tag_morphofeatures()">\n                <ion-icon name="apps"></ion-icon>Features</button>\n              <button icon-left ion-button tabindex="-1" (click)="tag_ma()">\n                <ion-icon name="menu"></ion-icon>Analyser</button>\n            </ion-item>\n            <!--           <ion-item>\n            <button class=\'topbar_button\' icon-left ion-button tabindex="-1" (click)="mark_misc(\'UNCLEAR\')">\n              <ion-icon name="warning"></ion-icon>Unclear</button>\n            <ion-badge item-end>{{highlight.element.id}}</ion-badge>\n          </ion-item>\n -->\n            <ion-item *ngIf="highlight.element.parent">\n              <ion-label color="primary" stacked>Inflected Word Form</ion-label>\n              <ion-input [(ngModel)]="highlight.element.parent.form" tabindex="2" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n            </ion-item>\n            <!--        <ion-item>\n          <ion-label color="primary" stacked>Token form</ion-label>\n          <ion-input [(ngModel)]="highlight.element.form" tabindex="3" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n        </ion-item>\n -->\n            <ion-item (click)="mark_misc(\'UNCLEAR\')">\n              <ion-label>Unclear?</ion-label>\n              <ion-checkbox [(ngModel)]="highlight.element._miscs[\'UNCLEAR\']"></ion-checkbox>\n            </ion-item>\n            <ion-item>\n              <ion-label color="primary" stacked>Lemma</ion-label>\n              <ion-input [(ngModel)]="highlight.element.lemma" tabindex="4" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n            </ion-item>\n            <ion-item *ngFor="let feat of highlight.element.features; let i=index">\n              <ion-label color="primary" stacked>{{feat.key}}</ion-label>\n              <ion-select [(ngModel)]="feat.value" interface="popover">\n                <ion-option *ngFor="let e of config.mf[feat.key];" [value]="e.tag">{{e.desc}}</ion-option>\n              </ion-select>\n              <!-- <ion-input class="featname" value="{{feat.value}}" tabindex="{{i+4}}"></ion-input> -->\n            </ion-item>\n            <ion-item>\n              <ion-label color="primary" stacked>XPOS Tag</ion-label>\n              <ion-select [(ngModel)]="highlight.element.xpostag" tabindex="2">\n                <ion-option *ngFor="let tag of config.alltags;" [value]="tag.tag">{{tag.tag}}: {{tag.desc}}</ion-option>\n              </ion-select>\n            </ion-item>\n            <ion-item>\n              <ion-label color="primary" stacked>UPOS Tag</ion-label>\n              <ion-select [(ngModel)]="highlight.element.upostag">\n                <ion-option *ngFor="let tag of config.allutags;" [value]="tag.tag">{{tag.tag}}: {{tag.desc}}</ion-option>\n              </ion-select>\n            </ion-item>\n          </ion-list>\n          <guider *ngIf="highlight.element" [element]="highlight.element" [config]="config" type="specialPos" [project]="project" [hash]="hash"> </guider>\n          <guider *ngIf="highlight.element" [element]="highlight.element" [config]="config" type="specialSeg" [project]="project" [hash]="hash"> </guider>\n        </ion-row>\n      </ion-col>\n      <ion-col id="sentences" *ngIf="config">\n        <!-- <p>Here\'s a validating visualizer. Visualization:</p> -->\n        <!-- <pre>{{documentJson}}</pre> -->\n        <div *ngFor="let sent of doc?.sentences" class="sentence" [ngClass]="{\n              rtl:configService.isRtl(project)}">\n          <div>{{sent.tag}}</div>\n          <div tabindex="{{elem == highlight.element ? 1 : -1}}" *ngFor="let elem of sent.elements | notmultitag ; let i = index" class="element" [ngClass]="{\n              isCompounds:elem.upostag==\'_\',\n              highlight: elem == highlight.element,\n              rtl:configService.isRtl(project),\n              unclear: elem._miscs[\'UNCLEAR\'],\n              newline2: i%config.rowlength==0,\n              isSeg: elem.isSeg > 0 }" (click)="events.publish(\'highlight:change\',elem)">\n            <input *ngIf="editable && elem == highlight.element" class="formInput" value="{{elem.form}}" [autofocus] (keydown)="keyupFormEditor($event,elem)" (blur)="blurFormEditor($event,elem)" (focus)="resize($event)" (keyup)="resize($event)" />\n            <span *ngIf="!editable || elem != highlight.element">\n              <span class="form" #spanForm>{{elem.getForm()}}</span>\n            <span class="postag">{{config.useUD ? config.tags[\'U:\'+elem.upostag]?.desc : config.tags[\'X:\'+elem.xpostag]?.desc}}</span>\n            <span class="mf_missing" [hidden]="elem.morphFeatsMissing().length == 0">{{elem.morphFeatsMissing().length}}</span>\n            </span>\n            <!-- <span *ngFor="let feat of elem.features()">\n                <span class="featname">{{feat[0]}}</span>\n                <span class="featname">{{feat[1]}}</span>\n              </span> -->\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-4 id="conlluColumn" [hidden]="isConlluHidden">\n        <!--         <ion-row *ngIf="editingMode" style="height: 95%;">\n          <ion-textarea tabindex="-1" no-text-wrap id="conlluTextArea" [ngModel]="conlluRaw" (change)="onConlluRawChanged($event)" style="font-size: 7pt; margin-top:0; width: 100%;"></ion-textarea>\n        </ion-row>\n -->\n        <ion-row *ngIf="log.length>0">\n          <ion-item>Error log:</ion-item>\n          <ion-textarea [ngModel]="log" id="errorTextArea" rows="7" cols="80" style="margin-top:0" disabled="disabled">\n          </ion-textarea>\n        </ion-row>\n        <ion-row style="height: 95%; position: relative">\n         <pre style="counter-reset: line;">\n<!--       --><div contenteditable="true" class="conllu-row" [ngClass]="{\n              highlight:highlight.sentence?.id==\'S\'+r.sentid && highlight.element?.id == r.elemid}" *ngFor="let r of conlluRawSpans; let i = index" (blur)="onConlluRawSpansChanged(r,i, $event)"><div class=\'actions\' contenteditable="false"><button tabindex="-1" ion-button small icon-only color="light" (click)="removeConlluRawRow(r,i,$event)"><ion-icon name="remove"></ion-icon></button><button tabindex="-1" ion-button small icon-only color="light" (click)="addConlluRawRow(r,i,$event)"><ion-icon name="add"></ion-icon></button><button tabindex="-1" ion-button small icon-only color="light" (click)="highlightConlluRawRow(r,i,$event)"><ion-icon name="checkmark"></ion-icon></button></div><code class="conllu-cell conllu-cell-{{ii}} begins-with-{{c[0]==\'#\'}}" *ngFor="let c of r.elems; let ii = index">{{c}}</code><!--  --></div>\n          <button tabindex="-1" ion-button class="downloadButton" small icon-only color="light" (click)="downloadConlluRawRow($event)"><ion-icon name="download"></ion-icon></button>\n\n<!-- --></pre>\n        </ion-row>\n      </ion-col>\n    </ion-row>\n    <!-- no need to show the intermediate data representation -->\n    <!-- <div class="conllu-parse" data-visid="vis" data-inputid="input" data-parsedid="parsed" data-logid="log"> -->\n  </ion-grid>\n  <!-- </ion-list> -->\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* PopoverController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* PopoverController */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _h || Object, typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]) === "function" && _j || Object, typeof (_k = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]) === "function" && _k || Object, typeof (_l = typeof __WEBPACK_IMPORTED_MODULE_3__providers_word_service__["a" /* WordService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_word_service__["a" /* WordService */]) === "function" && _l || Object, typeof (_m = typeof __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__["a" /* ConlluService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__["a" /* ConlluService */]) === "function" && _m || Object, typeof (_o = typeof __WEBPACK_IMPORTED_MODULE_5__providers_config_service__["b" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__providers_config_service__["b" /* ConfigService */]) === "function" && _o || Object, typeof (_p = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]) === "function" && _p || Object, typeof (_q = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _q || Object, typeof (_r = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]) === "function" && _r || Object])
], AnnotatePage);

var Highlight = (function () {
    function Highlight(events) {
        var _this = this;
        this.events = events;
        this.sentence = null;
        this.element = null;
        this.events.subscribe("highlight:change", function (element) {
            if (!element) {
                console.trace("Published an event highlight:change but element is undefined");
                return;
            }
            _this.element = element;
            _this.sentence = element.sentence;
        });
        this.events.subscribe("changeTag", function (tag) {
            _this.element.xpostag = tag.tag;
            _this.element.upostag = tag.mapToConllU;
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
        return ["from=" + this.start,
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

var AutofocusDirective = (function () {
    function AutofocusDirective(el) {
        this.el = el;
        this.focus = true;
    }
    AutofocusDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.focus) {
            //Otherwise Angular throws error: Expression has changed after it was checked.
            window.setTimeout(function () {
                _this.el.nativeElement.focus(); //For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
            });
        }
    };
    Object.defineProperty(AutofocusDirective.prototype, "autofocus", {
        set: function (condition) {
            this.focus = condition !== false;
        },
        enumerable: true,
        configurable: true
    });
    return AutofocusDirective;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], AutofocusDirective.prototype, "autofocus", null);
AutofocusDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
        selector: "[autofocus]"
    }),
    __metadata("design:paramtypes", [typeof (_s = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _s || Object])
], AutofocusDirective);

var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
//# sourceMappingURL=annotate.js.map

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordService; });
/* unused harmony export WordAnalysis */
/* unused harmony export Word */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_annotate_conllu__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var WordService = (function () {
    function WordService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.data = {};
    }
    WordService.prototype.load = function (sentence, config) {
        var _this = this;
        if (this.data[sentence]) {
            // already loaded data
            return Promise.resolve(this.data[sentence]);
        }
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            _this.http.post(_this.myconfig.get("server") + 'ma', { sentence: sentence })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (!data.ok) {
                    return resolve([]);
                }
                var doc = new __WEBPACK_IMPORTED_MODULE_4__pages_annotate_conllu__["a" /* ConlluDocument */](config);
                var parsed = doc.parse(data.rs.join("\n").trim(), function (x) {
                    return console.warn("Parsing Conllu Error of MA Results:", x);
                }, true);
                // console.log(parsed)
                // data = data;
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
                that.data[sentence] = result;
                resolve(that.data[sentence]);
            });
        });
    };
    return WordService;
}());
WordService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]])
], WordService);

var WordAnalysis = (function () {
    function WordAnalysis(o) {
        this.o = o;
        this.rank = -1;
        this.rank = o.rank;
        this.gloss = o.gloss;
        this.diac = o.diac;
        this.lemma = o.lemma;
        this.pos = o.pos;
        this.score = o.score;
        this.segmentation = o.segmentation;
    }
    return WordAnalysis;
}());

var Word = (function () {
    function Word(o) {
        this.o = o;
        this.id = 0;
        this.word = "";
        this.possibilities = [];
        this.diacsArr = [];
        this.lemmaArr = [];
        this.update(o);
    }
    Word.prototype.update = function (o) {
        var _this = this;
        this.id = o.id;
        this.word = o.word;
        if (o.possibilities)
            o.possibilities.forEach(function (e) { return _this.possibilities.push(new WordAnalysis(e)); });
    };
    Word.prototype.diacs = function () {
        var that = this;
        if (this.diacsArr.length == 0) {
            this.possibilities.forEach(function (e, i, arr) {
                if (that.diacsArr.indexOf(e.diac) == -1)
                    that.diacsArr.push(e.diac);
            });
        }
        return this.diacsArr;
    };
    Word.prototype.lemma = function () {
        var that = this;
        if (this.lemmaArr.length == 0) {
            this.possibilities.forEach(function (e, i, arr) {
                if (that.lemmaArr.filter(function (ee) { return e.gloss == ee.gloss; }).length == 0)
                    that.lemmaArr.push({
                        "lemma": e.lemma,
                        "gloss": e.gloss.replace(/;/g, "\n"),
                    });
            });
        }
        return this.lemmaArr;
    };
    return Word;
}());

//# sourceMappingURL=word-service.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConlluDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ConlluSentence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ConlluElement; });
/* unused harmony export Util */
/*
* @Filename:   conllu.ts
* @Author: abbander
Author: Sampo Pyysalo
* @Date:   2017-05-10 14:26:53
*/
// -*- Mode: JavaScript; tab-width: 4; indent-tabs-mode: nil; -*-
// vim:set ft=javascript ts=4 sw=4 sts=4 cindent:
/*
CoNLL-U format library for JavaScript.
Home: http://github.com/spyysalo/conllu.js
Format: http://universaldependencies.github.io/docs/format.html

Author: Sampo Pyysalo
License: MIT (http://opensource.org/licenses/MIT)
*/
var errors = [];
function reportError(error) {
    if (errors.indexOf(error) < 0) {
        console.error(error);
        errors.push(error);
    }
}
var ConlluDocument = (function () {
    // constructor(config, public events: Events=null) {
    function ConlluDocument(config) {
        /*
         * ConllU.ConlluDocument: represents CoNLL-U document
         */
        this.sentences = [];
        this.config = null;
        this.reset = function () {
            this.sentences = [];
            this.error = false;
            this.logger = function (s) { };
            this.strict = null; // pick heuristically
        };
        this.log = function (message) {
            this.logger(message);
        };
        this.logError = function (message) {
            this.log('error: ' + message);
            this.error = true;
        };
        this.toConllU = function () {
            var lines = [];
            for (var _i = 0, _a = this.sentences; _i < _a.length; _i++) {
                var sent = _a[_i];
                sent.toConllU(lines);
                lines.push("");
            }
            return lines.join("\n");
        };
        /* Parse CoNLL-U format, return ConlluDocument.
         * (see http://universaldependencies.github.io/docs/format.html)
         *
         * CoNLL-U files contain three types of lines:
         * 1.  Word lines
         * 2.  Blank lines marking sentence boundaries
         * 3.  Comment lines starting with a hash ("#")
         *
         * Each word line has the following format
         * 1.  ID: Word index, integer starting at 1 for each new sentence;
         *     may be a range for tokens with multiple words; may be a decimal
         *     number for empty nodes.
         * 2.  FORM: Word form or punctuation symbol.
         * 3.  LEMMA: Lemma or stem of word form.
         * 4.  UPOSTAG: Universal part-of-speech tag.
         * 5.  XPOSTAG: Language-specific part-of-speech tag; underscore
         *     if not available.
         * 6.  FEATS: List of morphological features from the Universal
         *     feature inventory or from a defined language-specific extension;
         *      underscore if not available.
         * 7.  HEAD: Head of the current token, which is either a value of ID
         *     or zero (0).
         * 8.  DEPREL: Universal Stanford dependency relation to the HEAD
         *     (root iff HEAD = 0) or a defined language-specific subtype
         *     of one.
         * 9.  DEPS: List of secondary dependencies (head-deprel pairs).
         * 10. MISC: Any other annotation.
         */
        this.parse = function (input, logger, strict) {
            // discard previous state, if any
            this.reset();
            if (logger !== undefined) {
                this.logger = logger;
            }
            if (strict !== undefined) {
                this.strict = strict;
            }
            // TODO: handle other newline formats
            var lines = input.split('\n');
            if (this.strict === null) {
                this.strict = Util.selectParsingMode(input, this.logger);
            }
            // select splitter to use for dividing the lines into fields.
            var splitter = Util.selectFieldSplitter(input, this.logger, this.strict);
            var //elements = [],
            // comments = [],
            beforeConlluSentence = true;
            var sId = 'S' + (this.sentences.length + 1);
            var currentSentence = new ConlluSentence(sId, [], [], this); //, currentSentence.elements, currentSentence.comments);
            var _loop_1 = function (idx) {
                that = this_1, line = lines[idx];
                logLineError = function (message) {
                    that.logError('line ' + (idx + 1) + ': ' + message + ' ("' + line + '")');
                    that.error = true;
                };
                if (Util.isComment(line)) {
                    if (beforeConlluSentence) {
                        currentSentence.comments.push(line);
                    }
                    else {
                        logLineError('comments must precede sentence, ignoring');
                    }
                    return "continue";
                }
                // non-comment, assume inside sentence until terminated by
                // blank line
                beforeConlluSentence = false;
                fields = splitter(line);
                if (fields.length === 0) {
                    // empty line, terminates sentence
                    if (currentSentence.elements.length !== 0) {
                        currentSentence.refix();
                        this_1.sentences.push(currentSentence);
                        var sId_1 = 'S' + (this_1.sentences.length + 1);
                        currentSentence = new ConlluSentence(sId_1, [], [], this_1); //, currentSentence.elements, currentSentence.comments);
                        // this.sentences.push(sentence);
                    }
                    else {
                        logLineError('empty sentence, ignoring');
                    }
                    // reset
                    // elements = [];
                    // comments = [];
                    beforeConlluSentence = true;
                    return "continue";
                }
                if (fields.length !== 10) {
                    logLineError('expected 10 fields, got ' + fields.length);
                    Util.repairFields(fields, this_1.logger);
                }
                element = new ConlluElement(fields, idx, line, currentSentence);
                issues = element.validate();
                for (var j = 0; j < issues.length; j++) {
                    logLineError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!element.repair(this_1.logger)) {
                        logLineError('repair failed, discarding line');
                        return "continue";
                    }
                }
                currentSentence.elements.push(element);
            };
            var this_1 = this, line, that, logLineError, fields, element, issues;
            for (var idx = 0; idx < lines.length; idx++) {
                _loop_1(idx);
            }
            // If elements is non-empty, last sentence ended without its
            // expected terminating empty line. Process, but warn if strict.
            // if (elements.length !== 0) {
            //     if (this.strict) {
            //         this.logError('missing blank line after last sentence');
            //     }
            //     var sId = 'S' + (this.sentences.length + 1);
            //     var sentence = new ConlluSentence(sId, elements, comments);
            //     sentence.document = this;
            //     this.sentences.push(sentence);
            //     // reset
            //     elements = [];
            //     comments = [];
            //     beforeConlluSentence = true;
            // }
            // If comments is non-empty, there were comments after the
            // terminating empty line. Warn and discard.
            if (currentSentence.comments.length !== 0 && currentSentence.elements.length == 0) {
                this.logError('comments may not occur after last sentence, ' +
                    'ignoring');
            }
            else {
                currentSentence.refix();
                this.sentences.push(currentSentence);
            }
            for (var i = 0; i < this.sentences.length; i++) {
                var sentence = this.sentences[i];
                var issues_1 = sentence.validate();
                for (var j = 0; j < issues_1.length; j++) {
                    this.logError(issues_1[j]);
                }
                if (issues_1.length !== 0) {
                    if (!sentence.repair(this.logger)) {
                        this.logError('repair failed, discarding sentence');
                        continue;
                    }
                }
            }
            // console.log(this)
            return this;
        };
        this.toBrat = function (logger, includeEmpty) {
            if (logger !== undefined) {
                this.logger = logger;
            }
            if (includeEmpty === undefined) {
                includeEmpty = false; // hide empty nodes by default
            }
            // merge brat data over all sentences
            var mergedBratData = {}, textOffset = 0;
            var categories = [
                'entities',
                'attributes',
                'relations',
                'comments',
                'styles',
                'sentlabels'
            ];
            for (var i = 0; i < categories.length; i++) {
                mergedBratData[categories[i]] = [];
            }
            mergedBratData['text'] = '';
            for (var i = 0; i < this.sentences.length; i++) {
                var sentence = this.sentences[i];
                var issues = sentence.validate();
                for (var j = 0; j < issues.length; j++) {
                    this.logError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!sentence.repair(this.logger)) {
                        this.logError('repair failed, discarding sentence');
                        continue;
                    }
                }
                sentence.setBaseOffset(textOffset !== 0 ? textOffset + 1 : 0);
                var bratData = sentence.toBrat(includeEmpty);
                // merge
                if (mergedBratData['text'].length !== 0) {
                    mergedBratData['text'] += '\n';
                    textOffset += 1;
                }
                mergedBratData['text'] += bratData['text'];
                textOffset += bratData['text'].length;
                for (var j = 0; j < categories.length; j++) {
                    var c = categories[j];
                    mergedBratData[c] = mergedBratData[c].concat(bratData[c]);
                }
            }
            // to avoid brat breakage on error, don't send empty text
            if (mergedBratData['text'].length === 0) {
                mergedBratData['text'] = '<EMPTY>';
            }
            mergedBratData['error'] = this.error;
            return mergedBratData;
        };
        this.config = config;
        this.reset();
    }
    ConlluDocument.prototype.mapTagToXpostag = function (from) {
        var f = this.config.alltags.find(function (x) { return x.tag == from || x.mapFrom.indexOf(from) >= 0; });
        if (f)
            return f.tag;
        reportError("tag is not mapped to Xpostag: " + from);
        return from;
    };
    ConlluDocument.prototype.fixSentenceIds = function () {
        this.sentences.forEach(function (s, i) {
            // console.log(s)
            var id_i = s.comments.findIndex(function (c) {
                return c.indexOf("# sent_id") == 0;
            });
            if (id_i >= 0)
                s.comments[id_i] = "# sent_id = " + (i + 1);
            else
                s.comments.push("# sent_id = " + (i + 1));
            s.id = 'S' + (i + 1);
            var text_i = s.comments.findIndex(function (c) {
                return c.indexOf("# text") == 0;
            });
            if (text_i >= 0)
                s.comments[text_i] = "# text = " + s.getText();
            else
                s.comments.push("# text = " + s.getText());
        });
    };
    ConlluDocument.prototype.mapTagToUpostag = function (from, from_ud) {
        var f = this.config.alltags.find(function (x) { return x.tag == from; });
        if (f)
            return f.mapToConllU;
        reportError("tag is not mapped to Upostag: " + from);
        return from_ud;
    };
    ConlluDocument.prototype.getElementLine = function (element, sentence) {
        var counter = 1;
        var result = 0;
        this.sentences.forEach(function (s) {
            s.elements.forEach(function (e) {
                if (s.id == sentence.id && e.id == element.id) {
                    result = counter;
                }
                counter++;
            });
            counter++;
        });
        return result;
    };
    return ConlluDocument;
}());

var ConlluSentence = (function () {
    function ConlluSentence(sentenceId, elements, comments, document) {
        if (elements === void 0) { elements = []; }
        if (comments === void 0) { comments = []; }
        var _this = this;
        /*
         * ConllU.ConlluSentence: represents CoNLL-U sentence
         */
        this.id = "";
        this.document = null;
        this.elements = [];
        this.comments = [];
        this.baseOffset = 0;
        this.tag = "";
        this.toConllU = function (lines) {
            for (var _i = 0, _a = this.comments; _i < _a.length; _i++) {
                var com = _a[_i];
                lines.push(com);
            }
            for (var _b = 0, _c = this.elements; _b < _c.length; _b++) {
                var elem = _c[_b];
                lines.push(elem.toConllU());
            }
            return lines;
        };
        // set offset of first character in sentence (for standoff
        // generation)
        this.setBaseOffset = function (baseOffset) {
            this.baseOffset = baseOffset;
        };
        this.dependencies = function () {
            var dependencies = [];
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                dependencies = dependencies.concat(element.dependencies());
            }
            return dependencies;
        };
        this.words = function (includeEmpty) {
            return this.elements.filter(function (e) {
                return (e.isWord() || (includeEmpty && e.isEmptyNode()));
            });
        };
        this.multiwords = function () {
            return this.elements.filter(function (e) {
                return e.isMultiword();
            });
        };
        // return words with possible modifications for visualization with
        // brat
        this.bratWords = function (includeEmpty) {
            var words = this.words(includeEmpty);
            for (var i = 0; i < words.length; i++) {
                if (Util.isRtl(words[i].form)) {
                    words[i] = Util.deepCopy(words[i]);
                    words[i].form = Util.rtlFix(words[i].form);
                }
            }
            return words;
        };
        // return tokens with possible modifications for visualization
        // with brat
        this.bratTokens = function () {
            var tokens = this.tokens();
            for (var i = 0; i < tokens.length; i++) {
                tokens[i] = Util.deepCopy(tokens[i]);
                tokens[i].form = Util.rtlFix(tokens[i].form);
            }
            return tokens;
        };
        // return the text of the sentence for visualization with brat
        this.bratText = function (includeEmpty) {
            var words = this.bratWords(includeEmpty);
            var tokens = this.bratTokens();
            var wordText = words.map(function (w) { return w.form; }).join(' ');
            var tokenText = tokens.map(function (w) { return w.form; }).join(' ');
            var combinedText = wordText;
            if (wordText != tokenText) {
                combinedText += '\n' + tokenText;
            }
            return combinedText;
        };
        // return the annotated text spans of the sentence for visualization
        // with brat.
        this.bratSpans = function (includeEmpty) {
            var spans = [], offset = this.baseOffset;
            // create an annotation for each word
            var words = this.bratWords(includeEmpty);
            for (var i = 0; i < words.length; i++) {
                var length = words[i].form.length;
                spans.push([this.id + '-T' + words[i].id, words[i].upostag,
                    [[offset, offset + length]]]);
                offset += length + 1;
            }
            return spans;
        };
        // return attributes of sentence annotations for visualization
        // with brat.
        this.bratAttributes = function (includeEmpty) {
            var words = this.words(includeEmpty);
            // create attributes for word features
            var attributes = [], aidseq = 1;
            for (var i = 0; i < words.length; i++) {
                var word = words[i], tid = this.id + '-T' + word.id;
                var nameVals = word.features;
                for (var j = 0; j < nameVals.length; j++) {
                    var name = nameVals[j].key, value = nameVals[j].value;
                    attributes.push([this.id + '-A' + aidseq++, name, tid, value]);
                }
            }
            return attributes;
        };
        // return relations for sentence dependencies for visualization
        // with brat.
        this.bratRelations = function (includeEmpty) {
            var dependencies = this.dependencies();
            var relations = [];
            for (var i = 0; i < dependencies.length; i++) {
                var dep = dependencies[i];
                relations.push([this.id + '-R' + i, dep[2],
                    [['arg1', this.id + '-T' + dep[1]],
                        ['arg2', this.id + '-T' + dep[0]]]]);
            }
            return relations;
        };
        // return comments (notes) on sentence annotations for
        // visualization with brat.
        this.bratComments = function (includeEmpty) {
            var words = this.words(includeEmpty);
            // TODO: better visualization for LEMMA, XPOSTAG, and MISC.
            var comments = [];
            for (var i = 0; i < words.length; i++) {
                var word = words[i], tid = this.id + '-T' + word.id, label = 'AnnotatorNotes';
                comments.push([tid, label, 'Lemma: ' + word.lemma]);
                if (word.xpostag !== '_') {
                    comments.push([tid, label, 'Xpostag: ' + word.xpostag]);
                }
                if (word.misc !== '_') {
                    comments.push([tid, label, 'Misc: ' + word.misc]);
                }
            }
            return comments;
        };
        // Return styles on sentence annotations for visualization with
        // brat. Note: this feature is an extension of both the CoNLL-U
        // comment format and the basic brat data format.
        this.bratStyles = function (includeEmpty) {
            var styles = [], wildcards = [];
            for (var i = 0; i < this.comments.length; i++) {
                var comment = this.comments[i];
                var m = comment.match(/^(\#\s*visual-style\s+)(.*)/);
                if (!m) {
                    continue;
                }
                var styleSpec = m[2];
                // Attempt to parse as a visual style specification. The
                // expected format is "REF<SPACE>STYLE", where REF
                // is either a single ID (for a span), a space-separated
                // ID1 ID2 TYPE triple (for a relation), or a special
                // wildcard value like "arcs", and STYLE is either
                // a colon-separated key-value pair or a color.
                m = styleSpec.match(/^([^\t]+)\s+(\S+)\s*$/);
                if (!m) {
                    // TODO: avoid console.log
                    console.warn('warning: failed to parse: "' + comment + '"');
                    continue;
                }
                var reference = m[1], style = m[2];
                // split style into key and value, adding a key to
                // color-only styles as needed for the reference type.
                var key, value;
                m = style.match(/^(\S+):(\S+)$/);
                if (m) {
                    key = m[1];
                    value = m[2];
                }
                else {
                    value = style;
                    if (reference === 'arcs' || reference.indexOf(' ') !== -1) {
                        key = 'color';
                    }
                    else {
                        key = 'bgColor';
                    }
                }
                // store wildcards for separate later processing
                if (reference.match(/^(nodes|arcs)$/)) {
                    wildcards.push([reference, key, value]);
                    continue;
                }
                // adjust every ID in reference for brat
                if (reference.indexOf(' ') === -1) {
                    reference = this.id + '-T' + reference;
                }
                else {
                    reference = reference.split(' ');
                    reference[0] = this.id + '-T' + reference[0];
                    reference[1] = this.id + '-T' + reference[1];
                }
                styles.push([reference, key, value]);
            }
            // for expanding wildcards, first determine which words / arcs
            // styles have already been set, and then add the style to
            // everything that hasn't.
            var setStyle = {};
            for (var i = 0; i < styles.length; i++) {
                setStyle[styles[i][0].concat([styles[i][1]])] = true;
            }
            for (var i = 0; i < wildcards.length; i++) {
                var reference_1 = wildcards[i][0], key_1 = wildcards[i][1], value_1 = wildcards[i][2];
                if (reference_1 === 'nodes') {
                    var words = this.words(includeEmpty);
                    for (var j = 0; j < words.length; j++) {
                        var r = this.id + '-T' + words[j].id;
                        if (!setStyle[r.concat(key_1)]) {
                            styles.push([r, key_1, value_1]);
                            setStyle[r.concat(key_1)] = true;
                        }
                    }
                }
                else if (reference_1 === 'arcs') {
                    var deps = this.dependencies();
                    for (var j = 0; j < deps.length; j++) {
                        var rr = [this.id + '-T' + deps[j][1],
                            this.id + '-T' + deps[j][0],
                            deps[j][2]];
                        if (!setStyle[rr.concat([key_1]).join("")]) {
                            styles.push([rr, key_1, value_1]);
                            setStyle[rr.concat([key_1]).join("")] = true;
                        }
                    }
                }
                else {
                    reportError('internal error');
                }
            }
            return styles;
        };
        // Return label of sentence for visualization with brat, or null
        // if not defined. Note: this feature is an extension of both the
        // CoNLL-U comment format and the basic brat data format.
        this.bratLabel = function () {
            var label = null;
            for (var i = 0; i < this.comments.length; i++) {
                var comment = this.comments[i];
                var m = comment.match(/^(\#\s*sentence-label\b)(.*)/);
                if (!m) {
                    continue;
                }
                label = m[2].trim();
            }
            return label;
        };
        // Return representation of sentence in brat embedded format (see
        // http://brat.nlplab.org/embed.html).
        // If includeEmpty is truthy, include empty nodes in the representation.
        // Note: "styles" is an extension, not part of the basic format.
        this.toBrat = function (includeEmpty) {
            var text = this.bratText(includeEmpty);
            var spans = this.bratSpans(includeEmpty);
            var attributes = this.bratAttributes(includeEmpty);
            var relations = this.bratRelations(includeEmpty);
            var comments = this.bratComments(includeEmpty);
            var styles = this.bratStyles(includeEmpty);
            var labels = [this.bratLabel()];
            return {
                'text': text,
                'entities': spans,
                'attributes': attributes,
                'relations': relations,
                'comments': comments,
                'styles': styles,
                'sentlabels': labels,
            };
        };
        this.elementById = function () {
            var elementById = {};
            for (var i = 0; i < this.elements.length; i++) {
                elementById[this.elements[i].id] = this.elements[i];
            }
            return elementById;
        };
        this.addError = function (issue, element, issues) {
            issues.push('line ' + (element.lineidx + 1) + ': ' + issue + ' ("' + element.line + '")');
        };
        // Check validity of the sentence. Return list of strings
        // representing issues found in validation (empty list if none).
        this.validate = function () {
            var issues = [];
            this.validateUniqueIds(issues);
            this.validateWordSequence(issues);
            this.validateMultiwordSequence(issues);
            this.validateEmptyNodeSequence(issues);
            this.validateReferences(issues);
            return issues;
        };
        // Check for presence of ID duplicates
        this.validateUniqueIds = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var elementById = {};
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (elementById[element.id] !== undefined) {
                    this.addError('non-unique ID "' + element.id + '"', element, issues);
                }
                elementById[element.id] = element;
            }
            return issues.length === initialIssueCount;
        };
        // Check validity of word ID sequence (should be 1,2,3,...)
        this.validateWordSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var expectedId = 1;
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isMultiword() || element.isEmptyNode()) {
                    continue; // only check simple word sequence here
                }
                if (parseInt(element.id, 10) !== expectedId) {
                    this.addError('word IDs should be 1,2,3,..., ' +
                        'expected ' + expectedId + ', got ' + element.id, element, issues);
                }
                expectedId = parseInt(element.id, 10) + 1;
            }
            return issues.length === initialIssueCount;
        };
        // Check that multiword token ranges are valid
        this.validateMultiwordSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var expectedId = 1;
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isMultiword() && element.rangeFrom() !== expectedId) {
                    this.addError('multiword tokens must appear before ' +
                        'first word in their range', element, issues);
                }
                else {
                    expectedId = parseInt(element.id, 10) + 1;
                }
            }
            return issues.length === initialIssueCount;
        };
        this.validateEmptyNodeSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var previousWordId = '0'; // TODO check https://github.com/UniversalDependencies/docs/issues/382
            var nextEmptyNodeId = 1;
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isWord()) {
                    previousWordId = element.id;
                    nextEmptyNodeId = 1;
                }
                else if (element.isEmptyNode()) {
                    var expectedId = previousWordId + '.' + nextEmptyNodeId;
                    if (element.id !== expectedId) {
                        this.addError('empty node IDs should be *.1, *.2, ... ' +
                            'expected ' + expectedId + ', got ' + element.id, element, issues);
                    }
                    nextEmptyNodeId++;
                }
            }
            return issues.length === initialIssueCount;
        };
        // Check validity of ID references in HEAD and DEPS.
        this.validateReferences = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var elementById = this.elementById();
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                // validate HEAD
                if (!element.validHeadReference(elementById)) {
                    this.addError('HEAD is not valid ID: "' + element.head + '"', element, issues);
                }
                // validate DEPS
                var elemDeps = element.dependencies(true);
                for (var j = 0; j < elemDeps.length; j++) {
                    var head = elemDeps[j][1];
                    if (head !== '0' && elementById[head] === undefined) {
                        this.addError('invalid ID "' + head + '" in DEPS', element, issues);
                    }
                }
            }
            return issues.length === initialIssueCount;
        };
        this.repair = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            if (!this.validateUniqueIds()) {
                this.repairUniqueIds(log);
            }
            if (!this.validateWordSequence()) {
                this.repairWordSequence(log);
            }
            if (!this.validateMultiwordSequence()) {
                this.repairMultiwordSequence(log);
            }
            if (!this.validateEmptyNodeSequence()) {
                this.repairEmptyNodeSequence(log);
            }
            if (!this.validateReferences()) {
                this.repairReferences(log);
            }
            var issues = this.validate();
            return issues.length === 0;
        };
        this.repairUniqueIds = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            var elementById = {}, filtered = [];
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (elementById[element.id] === undefined) {
                    elementById[element.id] = element;
                    filtered.push(element);
                }
                else {
                    log('repair: remove element with duplicate ID "' + element.id + '"');
                }
            }
            this.elements = filtered;
            return true;
        };
        this.repairWordSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairWordSequence()');
            return true;
        };
        this.repairMultiwordSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairMultiwordSequence()');
            return true;
        };
        this.repairEmptyNodeSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairEmptyNodeSequence()');
            return true;
        };
        this.repairReferences = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            var elementById = this.elementById();
            for (var i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                // repair HEAD if not valid
                if (!element.validHeadReference(elementById)) {
                    log('repair: blanking invalid HEAD');
                    element.head = null;
                }
                // repair DEPS if not valid
                if (element.deps === '_') {
                    continue;
                }
                var deparr = element.deps.split('|'), filtered = [];
                for (var j = 0; j < deparr.length; j++) {
                    var dep = deparr[j];
                    var m = dep.match(Util.dependencyRegex);
                    if (m) {
                        var head = m[1], deprel = m[2];
                        if (head === '0' || elementById[head] !== undefined) {
                            filtered.push(dep);
                        }
                        else {
                            log('repair: removing invalid ID from DEPS');
                            this.error = true;
                        }
                    }
                    else {
                        reportError('internal error: repairReferences(): ' +
                            'invalid DEPS');
                    }
                }
                if (filtered.length === 0) {
                    element.deps = '_';
                }
                else {
                    element.deps = filtered.join('|');
                }
            }
            return true;
        };
        this.id = sentenceId;
        this.document = document;
        this.comments = comments;
        this.baseOffset = 0;
        this.elements = elements;
        this.elements.forEach(function (e) {
            e.sentence = _this;
        });
        // this.refix()
    }
    ;
    ConlluSentence.prototype.refix = function (keepParentRelations) {
        if (keepParentRelations === void 0) { keepParentRelations = false; }
        // Fix the id, isSeg, parent, children according to the ID values.
        // Needed after editing elements of one sentence.
        // param: keepParentRelations: when true will respect parent relation. Only Id, children and isSeg is updated.
        var from = -1, to = -2;
        var parent;
        var counter = 1;
        this.elements = this.elements.map(function (e) {
            if (e.isMultiword()) {
                if (!keepParentRelations) {
                    // isSeg is updated later
                    from = parseInt(e.id.split("-")[0]);
                    to = parseInt(e.id.split("-")[1]);
                    if (from == to)
                        return null;
                    e.isSeg = -(to - from) - 1;
                    parent = e;
                }
                e.parent = null;
                e.children.length = 0;
                return e;
            }
            else {
                e.id = "" + counter++;
                if (!keepParentRelations) {
                    if (parseInt(e.id) >= from && parseInt(e.id) <= to) {
                        e.isSeg = parseInt(e.id) - from;
                        if (!keepParentRelations)
                            e.parent = parent;
                        e.parent.children.push(e);
                        e.parent.id = e.parent.children[0].id + "-" + (parseInt(e.parent.children[0].id) + e.parent.children.length - 1);
                    }
                }
                else if (e.parent) {
                    e.parent.children.push(e);
                    e.isSeg = parseInt(e.id) - parseInt(e.parent.children[0].id);
                    e.parent.isSeg = -(parseInt(e.parent.children[e.parent.children.length - 1].id) - parseInt(e.parent.children[0].id)) - 1;
                    if (-e.parent.isSeg != e.parent.children.length)
                        console.error("Not the same", -e.parent.isSeg, e.parent.children.length);
                    e.parent.id = e.parent.children[0].id + "-" + (parseInt(e.parent.children[0].id) + e.parent.children.length - 1);
                }
            }
            return e;
        }).filter(function (e) { return e != null; });
    };
    ConlluSentence.prototype.getText = function () {
        return this.tokens().map(function (e) { return e.form; }).join(" ");
    };
    ConlluSentence.prototype.tokens = function () {
        // extract token sequence by omitting word IDs that are
        // included in a multiword token range.
        var multiwords = this.multiwords();
        var inRange = {};
        for (var i = 0; i < multiwords.length; i++) {
            var mw = multiwords[i];
            for (var j = mw.rangeFrom(); j <= mw.rangeTo(); j++) {
                inRange[j] = true;
            }
        }
        return this.elements.filter(function (e) {
            return e.isToken(inRange);
        });
    };
    ;
    return ConlluSentence;
}());

var ConlluElement = (function () {
    // represents CoNLL-U word or multiword token
    function ConlluElement(fields, lineidx, line, sentence) {
        /*
         * ConllU.Element: represents CoNLL-U word or multiword token
         */
        this.id = "";
        this.form = "";
        this.lemma = "";
        this.upostag = "";
        this._xpostag = "";
        // private feats : string = "";
        this.head = "";
        this.deprel = "";
        this.deps = "";
        this._miscs = {};
        this.lineidx = "";
        this.line = "";
        this.isSeg = -1;
        this.parent = null;
        this.children = [];
        this.features = [];
        this.sentence = null;
        this.copy = function (from) {
            this.form = from.form;
            this.lemma = from.lemma;
            this.upostag = from.upostag;
            this.xpostag = from.xpostag;
            this.feats = from.feats;
            this.head = from.head;
            this.deprel = from.deprel;
            this.deps = from.deps;
            this.misc = from.misc;
        };
        this.copyMorphInfo = function (from) {
            this.upostag = from.upostag;
            this.xpostag = from.xpostag;
            this.feats = from.feats;
            this.head = from.head;
            this.deprel = from.deprel;
            this.deps = from.deps;
            this.misc = from.misc;
        };
        this.morphFeatsMissing = function () {
            var _this = this;
            var tag = this.sentence.document.config.alltags.find(function (x) { return x.tag == _this.xpostag; });
            if (!tag) {
                // reportError("tag was not found!", this.xpostag)
                return [];
            }
            else if (!tag.features) {
                reportError("tag has no list of possible morph feats!" + this.xpostag);
                return [];
            }
            else
                return tag.features.filter(function (x) { return !_this.features.find(function (y) { return y.key == x; }); });
        };
        this.changeWith = function (el) {
            var _this = this;
            if (el.parent) {
                reportError("ERROR: changeWith cannot be used with a child element");
                el = el.parent;
            }
            // parent vs. parent
            var i = this.sentence.elements.findIndex(function (x) { return x == _this; });
            if (el.children.length > 0) {
                // Array.prototype.splice.apply(this.sentence.elements,[i,1,el].concat(el.children))
                var c = el.cloneParent();
                // c now has elements where first is parent and rest is children
                var parent = c[0];
                parent.analysis = this.analysis;
                c.forEach(function (e) {
                    e.sentence = _this.sentence;
                    if (e != parent)
                        e.parent = parent;
                    e._miscs["FROM_MA"] = true;
                });
                // if(this.sentence.document.events){
                //     this.sentence.document.events.publish('highlight:change', c[1]);
                //     this.sentence.document.events.publish("stats",{action:"changeWith",elements:c})
                // }
                Array.prototype.splice.apply(this.sentence.elements, [i, 1 + this.children.length].concat(c));
                this.sentence.refix(true);
                return c[1];
            }
            else {
                var c_1 = el.clone();
                c_1.analysis = this.analysis;
                c_1.sentence = this.sentence;
                c_1._miscs["FROM_MA"] = true;
                this.sentence.elements.splice(i, 1 + this.children.length, c_1);
                // if(this.sentence.document.events){
                //     this.sentence.document.events.publish('highlight:change', c);
                //     this.sentence.document.events.publish("stats",{action:"changeWith",element:c})
                // }
                this.sentence.refix(true);
                return c_1;
            }
        };
        this.clone = function () {
            var e = new ConlluElement([this.id, this.form,
                this.lemma,
                this.upostag,
                this.xpostag,
                this.feats,
                this.head,
                this.deprel,
                this.deps,
                this.misc], this.lineidx, this.line, this.sentence);
            // e.analysis = this.analysis
            return e;
        };
        this.cloneParent = function () {
            var all = [];
            var parent = this.clone();
            return [parent].concat(this.children.map(function (e) {
                e.parent = parent;
                return e.clone();
            }));
        };
        this.toConllU = function () {
            var line = [this.id,
                this.form,
                this.lemma,
                this.upostag,
                this.xpostag,
                this.feats,
                this.head,
                this.deprel,
                this.deps,
                this.misc];
            return line.join("\t");
        };
        // constraints that hold for all fields
        this.validateField = function (field, name, issues, allowSpace) {
            name = (name !== undefined ? name : 'field');
            issues = (issues !== undefined ? issues : []);
            if (allowSpace === undefined) {
                allowSpace = false;
            }
            if (field === undefined) {
                issues.push('invalid ' + name);
                return false;
            }
            else if (field.length === 0) {
                issues.push(name + ' must not be empty: "' + field + '"');
                return false;
            }
            else if (Util.hasSpace(field) && !allowSpace) {
                issues.push(name + ' must not contain space: "' + field + '"');
                return false;
            }
            else {
                return true;
            }
        };
        this.validateId = function (id, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(id, 'ID', issues)) {
                return false;
            }
            else if (id.match(/^\d+$/)) {
                if (id === '0') {
                    issues.push('ID indices must start from 1: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (id.match(/^(\d+)-(\d+)$/)) {
                var m = id.match(/^(\d+)-(\d+)$/);
                if (!m) {
                    reportError('internal error');
                    return false;
                }
                var start = parseInt(m[1], 10), end = parseInt(m[2], 10);
                if (end < start) {
                    issues.push('ID ranges must have start <= end: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (id.match(/^(\d+)\.(\d+)$/)) {
                m = id.match(/^(\d+)\.(\d+)$/);
                if (!m) {
                    reportError('internal error');
                    return false;
                }
                var iPart = parseInt(m[1], 10), fPart = parseInt(m[2], 10);
                if (iPart == 0 || fPart == 0) {
                    issues.push('ID indices must start from 1: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                issues.push('ID must be integer, range, or decimal: "' + id + '"');
                return false;
            }
        };
        this.validateForm = function (form, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(form, 'FORM', issues, true)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateLemma = function (lemma, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(lemma, 'LEMMA', issues, true)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateUpostag = function (upostag, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(upostag, 'UPOSTAG', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateXpostag = function (xpostag, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(xpostag, 'XPOSTAG', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateFeats = function (feats, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(feats, 'FEATS', issues)) {
                return false;
            }
            else if (feats === '_') {
                return true;
            }
            var initialIssueCount = issues.length;
            var featarr = feats.split('|');
            var featmap = {};
            var prevName = null;
            for (var i = 0; i < featarr.length; i++) {
                var feat = featarr[i];
                var m = feat.match(Util.featureRegex);
                if (!m) {
                    // TODO more descriptive issue
                    issues.push('invalid FEATS entry: "' + feat + '"');
                    continue;
                }
                var name = m[1], valuestr = m[2];
                if (prevName !== null &&
                    name.toLowerCase() < prevName.toLowerCase()) {
                    issues.push('features must be ordered alphabetically ' +
                        '(case-insensitive): "' + name + '" < "' + prevName + '"');
                    var noIssue = false;
                }
                prevName = name;
                var values = valuestr.split(',');
                var valuemap = {}, validValues = [];
                for (var j = 0; j < values.length; j++) {
                    var value = values[j];
                    var m_1 = value.match(Util.featureValueRegex);
                    if (!m_1) {
                        issues.push('invalid FEATS value: "' + value + '"');
                        continue;
                    }
                    if (valuemap[value] !== undefined) {
                        issues.push('duplicate feature value: "' + value + '"');
                        continue;
                    }
                    valuemap[value] = true;
                    validValues.push(value);
                }
                if (featmap[name] !== undefined) {
                    issues.push('duplicate feature name: "' + name + '"');
                    continue;
                }
                if (validValues.length !== 0) {
                    featmap[name] = validValues;
                }
            }
            return issues.length === initialIssueCount;
        };
        this.validateHead = function (head, issues) {
            issues = (issues !== undefined ? issues : []);
            // TODO: consider checking that DEPREL is "root" iff HEAD is 0.
            if (head === null) {
                return true; // exceptional case for ConlluElement.repair()
            }
            else if (!this.validateField(head, 'HEAD', issues)) {
                return false;
            }
            else if (this.isEmptyNode() && head === '_') {
                return true; // underscore permitted for empty nodes.
            }
            else if (head === '_') {
                return true; // AboBander Only
            }
            else if (!head.match(/^\d+$/)) {
                issues.push('HEAD must be an ID or zero: "' + head + '"');
                return false;
            }
            else {
                return true;
            }
        };
        this.validateDeprel = function (deprel, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(deprel, 'DEPREL', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateDeps = function (deps, issues) {
            issues = (issues !== undefined ? issues : []);
            // TODO: consider checking that deprel is "root" iff head is 0.
            if (!this.validateField(deps, 'DEPS', issues)) {
                return false;
            }
            else if (deps === '_') {
                return true;
            }
            var deparr = deps.split('|');
            var prevHead = null;
            // TODO: don't short-circuit on first error
            for (var i = 0; i < deparr.length; i++) {
                var dep = deparr[i];
                var m = dep.match(/^(\d+(?:\.\d+)?):(\S+)$/);
                if (!m) {
                    // TODO more descriptive issue
                    issues.push('invalid DEPS: "' + deps + '"');
                    return false;
                }
                var head = m[1], deprel = m[2];
                if (prevHead !== null &&
                    parseFloat(head) < parseFloat(prevHead)) {
                    issues.push('DEPS must be ordered by head index');
                    return false;
                }
                prevHead = head;
            }
            return true;
        };
        this.validateMisc = function (misc, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(misc, 'MISC', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validHeadReference = function (elementById) {
            return (this.head === '_' || this.head === null || this.head === '0' ||
                elementById[this.head] !== undefined);
        };
        this.isWord = function () {
            // word iff ID is an integer
            return !!this.id.match(/^\d+$/);
        };
        this.isMultiword = function () {
            return !!this.id.match(/^\d+-\d+$/);
        };
        this.isEmptyNode = function () {
            return !!this.id.match(/^\d+\.\d+$/);
        };
        this.rangeFrom = function () {
            return parseInt(this.id.match(/^(\d+)-\d+$/)[1], 10);
        };
        this.rangeTo = function () {
            return parseInt(this.id.match(/^\d+-(\d+)$/)[1], 10);
        };
        this.isToken = function (inRange) {
            // token iff multiword or not included in a multiword range
            return this.isMultiword() || !inRange[this.id];
        };
        // return list of (DEPENDENT, HEAD, DEPREL) lists
        this.dependencies = function (skipHead) {
            skipHead = (skipHead !== undefined ? skipHead : false);
            var elemDeps = [];
            if (!skipHead && this.head !== '_' && this.head !== null) {
                elemDeps.push([this.id, this.head, this.deprel]);
            }
            if (this.deps != '_') {
                var deparr = this.deps.split('|');
                for (var i = 0; i < deparr.length; i++) {
                    var dep = deparr[i];
                    var m = dep.match(Util.dependencyRegex);
                    if (m) {
                        elemDeps.push([this.id, m[1], m[2]]);
                    }
                    else {
                        reportError('internal error: dependencies(): invalid DEPS ' +
                            this.deps);
                    }
                }
            }
            return elemDeps;
        };
        // Check validity of the element. Return list of strings
        // representing issues found in validation (empty list if none).
        this.validate = function () {
            var issues = [];
            this.validateId(this.id, issues);
            this.validateForm(this.form, issues);
            // multiword tokens (elements with range IDs) are (locally) valid
            // iff all remaining fields (3-10) contain just an underscore.
            if (this.isMultiword()) {
                if (this.lemma != '_' ||
                    this.upostag != '_' ||
                    this.xpostag != '_' ||
                    this.feats != '_' ||
                    this.head != '_' ||
                    this.deprel != '_' ||
                    this.deps != '_' //||
                ) {
                    issues.push('non-underscore field for multiword token');
                }
                return issues;
            }
            // if we're here, not a multiword token.
            this.validateLemma(this.lemma, issues);
            this.validateUpostag(this.upostag, issues);
            this.validateXpostag(this.xpostag, issues);
            this.validateFeats(this.feats, issues);
            this.validateHead(this.head, issues);
            this.validateDeprel(this.deprel, issues);
            this.validateDeps(this.deps, issues);
            this.validateMisc(this.misc, issues);
            return issues;
        };
        // Attempt to repair a non-valid element. Return true iff the
        // element is valid following repair, false otherwise.
        this.repair = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            if (!this.validateId(this.id)) {
                return false; // can't be helped
            }
            if (!this.validateForm(this.form)) {
                log('repair: blanking invalid FORM');
                this.form = '<ERROR>';
            }
            if (this.isMultiword()) {
                // valid as long as everything is blank
                this.lemma = '_';
                this.upostag = '_';
                this.xpostag = '_';
                this.feats = '_';
                this.head = '_';
                this.deprel = '_';
                this.deps = '_';
                this.misc = '_';
                return true;
            }
            // if we're here, not a multiword token.
            if (!this.validateLemma(this.lemma)) {
                log('repair: blanking invalid LEMMA');
                this.lemma = '<ERROR>';
            }
            if (!this.validateUpostag(this.upostag)) {
                log('repair: blanking invalid UPOSTAG');
                this.upostag = '_'; // TODO: not valid
            }
            if (!this.validateXpostag(this.xpostag)) {
                log('repair: blanking invalid XPOSTAG');
                this.xpostag = '_';
            }
            if (!this.validateFeats(this.feats)) {
                log('repair: blanking invalid FEATS ' + this.toConllU());
                this.feats = '_';
            }
            if (!this.validateHead(this.head)) {
                log('repair: blanking invalid HEAD');
                this.head = null; // note: exceptional case
            }
            if (!this.validateDeprel(this.deprel)) {
                log('repair: blanking invalid DEPREL');
                this.deprel = '_'; // TODO: not valid
            }
            if (!this.validateDeps(this.deps)) {
                log('repair: blanking invalid DEPS');
                this.deps = '_';
            }
            if (!this.validateMisc(this.misc)) {
                log('repair: blanking invalid MISC');
                this.misc = '_';
            }
            var issues = this.validate();
            return issues.length === 0;
        };
        this.sentence = sentence;
        this.id = fields[0];
        this.form = fields[1];
        this.lemma = fields[2];
        this.upostag = fields[3];
        this.feats = fields[5];
        this.xpostag = fields[4];
        this.head = fields[6];
        this.deprel = fields[7];
        this.deps = fields[8];
        this.misc = fields[9];
        this.lineidx = lineidx;
        this.line = line;
    }
    Object.defineProperty(ConlluElement.prototype, "xpostag", {
        get: function () {
            return this._xpostag;
        },
        set: function (argv) {
            var _this = this;
            if (this.isMultiword()) {
                this._xpostag = "_";
                return;
            }
            this._xpostag = this.sentence.document.mapTagToXpostag(argv);
            this.upostag = this.sentence.document.mapTagToUpostag(this._xpostag, this.upostag);
            // remove feats
            var tag = this.sentence.document.config.alltags.find(function (x) { return x.tag == _this._xpostag; });
            if (!tag)
                return;
            else if (Array.isArray(tag.features)) {
                this.features = this.features.filter(function (x) { return tag.features.indexOf(x.key) >= 0; });
                // this.features = tag.features.map(x=>this.features.find(y=>y.key==x)||x).map(x=>typeof x =="string" ?{key:x,value:"_"}:x)
                // console.log(this.features)
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConlluElement.prototype, "misc", {
        get: function () {
            var _this = this;
            return Object.keys(this._miscs).map(function (key) {
                return _this._miscs[key] ? key + "=" + _this._miscs[key] : undefined;
            }).filter(function (x) { return x != undefined; }).sort().join("|") || "_";
        },
        set: function (args) {
            var _this = this;
            this._miscs = {};
            if (args == undefined)
                return;
            if (args == "_")
                return;
            args.split("|").forEach(function (text) {
                var arr = text.split("=");
                _this._miscs[arr[0]] = arr[1];
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConlluElement.prototype, "feats", {
        get: function () {
            return this.features.map(function (v) {
                return v.key + "=" + v.value;
            }).sort().join("|") || "_";
        },
        set: function (args) {
            this.features = [];
            if (args == undefined)
                return;
            if (args == "_")
                return;
            // args.split("|").forEach(text => {
            //     var arr = text.split("=")
            //     this.features.push({key:arr[0],value:arr[1]})
            // })
            var featarr = args.split('|');
            for (var i = 0; i < featarr.length; i++) {
                var feat = featarr[i];
                var m = feat.match(Util.featureRegex);
                if (!m) {
                    continue;
                }
                var name = m[1], valuestr = m[2];
                var values = valuestr.split(',');
                for (var j = 0; j < values.length; j++) {
                    var value = values[j];
                    var m_2 = value.match(Util.featureValueRegex);
                    if (!m_2) {
                        continue;
                    }
                    this.features.push({ key: name, value: value });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ConlluElement.prototype.setFeature = function (key, value) {
        var i = this.features.findIndex(function (x) { return x.key == key; });
        if (i >= 0)
            if (value)
                this.features[i].value = value;
            else
                this.features.splice(i, 1);
        else
            this.features.push({ key: key, value: value });
    };
    ConlluElement.prototype.getForm = function () {
        // console.log(elem)
        if (!this.parent)
            return this.form;
        var prev = this.parent.children[this.isSeg - 1];
        var prevStr = "";
        if (prev) {
            prevStr = prev.form.replace(/[ًٌٍَُِّْ]*$/, "");
            prevStr = prevStr.charAt(prevStr.length - 1);
        }
        var next = this.parent.children[this.isSeg + 1];
        var nextStr = "";
        if (next)
            nextStr = next.form.charAt(0);
        var meLast = this.form.replace(/[ًٌٍَُِّْ]*$/, "");
        meLast = meLast.charAt(meLast.length - 1);
        var meFirst = this.form.charAt(0);
        if (-this.parent.isSeg == this.isSeg + 1)
            return (Util.isTatweel(prevStr, meFirst) ? "ـ" : "") + this.form;
        else if (this.isSeg == 0)
            return this.form + (Util.isTatweel(meLast, nextStr) ? "ـ" : "");
        else
            return (Util.isTatweel(prevStr, meFirst) ? "ـ" : "") +
                this.form
                + (Util.isTatweel(meLast, nextStr) ? "ـ" : "");
    };
    return ConlluElement;
}());

var Util = (function () {
    function Util() {
    }
    Util.isTatweel = function (first, second) {
        if (!first || !second)
            return false;
        if (first == "ـ" && second == "ـ")
            return false;
        if ("دذاءؤرىةإأآو_".indexOf(first) >= 0)
            return false;
        else if ("ء_".indexOf(second) >= 0)
            return false;
        else {
            return true;
        }
    };
    return Util;
}());

Util.repairFields = function (fields, logger) {
    if (logger === undefined) {
        logger = Util.nullLogger;
    }
    if (fields.length > 10) {
        logger('repair: discarding fields > 10');
        fields = fields.slice(0, 10);
    }
    else {
        logger('repair: filling in empty ("_") for missing fields');
        for (var m = 0; m < 10 - fields.length; m++) {
            fields.push('_');
        }
    }
};
Util.strictFieldSplitter = function (line) {
    // strict CoNLL format parsing: only split on TAB, no extra space.
    if (line.length === 0) {
        return [];
    }
    else {
        return line.split('\t');
    }
};
Util.looseFieldSplitter = function (line) {
    // loose CoNLL format parsing: split on any space sequence, trim
    // surrounding space.
    line = line.trim();
    if (line.length === 0) {
        return [];
    }
    else {
        return line.split(/\s+/);
    }
};
Util.selectParsingMode = function (conll, log) {
    // return whether to use strict mode parsing
    // very simple heuristic: any TABs in the input trigger
    // strict parsing, loose only if none present.
    if (conll.indexOf('\t') !== -1) {
        log('note: TAB found, parsing CoNLL-U in strict mode.');
        return true;
    }
    else {
        log('note: no TAB found, parsing CoNLL-U in loose mode.');
        return false;
    }
};
Util.selectFieldSplitter = function (conll, log, strict) {
    // return function to use for dividing lines into fields.
    if (strict) {
        return Util.strictFieldSplitter;
    }
    else {
        return Util.looseFieldSplitter;
    }
};
Util.isComment = function (line) {
    return line.length !== 0 && line[0] === '#';
};
Util.hasSpace = function (s) {
    return !!s.match(/\s/);
};
Util.nullLogger = function (message) {
    return null;
};
/*
 * Return true iff given string only contains characters from a
 * right-to-left Unicode block and is not empty.
 */
Util.isRtl = function (s) {
    // range from http://stackoverflow.com/a/14824756
    return !!s.match(/^[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]+$/);
};
/*
 * Return given token with possible modifications to accommodate
 * issues in brat rendering of right-to-left text
 * (https://github.com/UniversalDependencies/docs/issues/52)
 */
Util.rtlFix = function (s) {
    var prefix = '\u02D1', suffix = '\u02D1';
    if (Util.isRtl(s)) {
        s = prefix + s + suffix;
    }
    return s;
};
/*
 * Return a deep copy of the given object. Note: not particularly
 * efficient, and all fields must be serializable for this to work
 * correctly.
 */
Util.deepCopy = function (o) {
    return JSON.parse(JSON.stringify(o));
};
/*
 * Regular expressions for various parts of the format.
 * See https://github.com/UniversalDependencies/docs/issues/33
 */
// match single (feature, value[s]) pair in FEATS
Util.featureRegex = /^([A-Z0-9][a-zA-Z0-9]*(?:\[[a-z0-9]+\])?)=(_|[A-Z0-9][a-zA-Z0-9]*(?:,[A-Z0-9][a-zA-Z0-9]*)*)$/;
// match single feature value in FEATS
Util.featureValueRegex = /^([A-Z0-9][a-zA-Z0-9]*|_)$/;
// match single (head, deprel) pair in DEPS
Util.dependencyRegex = /^(\d+(?:\.\d+)?):(.*)$/;
//# sourceMappingURL=conllu.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectizePopoverPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_config_service__ = __webpack_require__(34);
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
        this.config = new __WEBPACK_IMPORTED_MODULE_2__providers_config_service__["a" /* ConfigJSON */]();
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
                // onDropdownClose : function(e){
                //   console.log(e)
                //   // if(this.shouldclose)
                //     // that.viewCtrl.dismiss()
                // },
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
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], SelectizePopoverPageComponent);

//# sourceMappingURL=selectize-popover-page.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MASelectizePopoverPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MASelectizePopoverPageComponent = (function () {
    // @ViewChild('diacs') diacsGroup: RadioGroup;
    function MASelectizePopoverPageComponent(navParams, 
        // public data: Data,
        events, viewCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.element = null;
        this.myconfig = {};
        this.config = null;
        this.options = [];
        this.diacsOptions = [];
        // rank = 1;
        this.selected = { form: "" };
        this.selectize_config = function () {
            var that = this;
            if (this.options.length == 0)
                this.options.push({
                    counter: 1,
                    title: "UNK",
                    feature: "UNK",
                    val: "UNK",
                    o: {},
                    custom_selectize_class: "UNK",
                });
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
                        var lemma = item.lemma.replace(/±.*/, "");
                        return '<div>' +
                            '<div class="counter">' + escape(item.counter + 1) + '</div>' +
                            '<div class="title">' +
                            '<div class="lemma">[' + lemma.replace(/(^_|_$)/, "") + ']</div>' +
                            '<div class="by">' + item.lemma.replace(/.*±/, "").split(";").map(function (meaning) { return "<span class='meaning'>" + escape(meaning) + "</span>"; }).join(" ") + '</div>' +
                            '</div>' +
                            '<div class="elements">' +
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
                            + '</div>' +
                            '</div>';
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
                    var el = that.element.analysis.find(function (val) {
                        return value == val.id;
                    });
                    var c = that.element.changeWith(el);
                    that.events.publish('highlight:change', c);
                    that.events.publish("stats", { action: "changeWith", element: c.parent || c });
                    that.viewCtrl.dismiss();
                },
                create: false
            };
        };
        this.config = navParams.data.config;
        this.element = navParams.data.element;
        if (this.element.analysis)
            this.options = this.element.analysis
                .map(function (e, i) { return new Object({
                value: e.id,
                counter: i,
                title: i,
                // score: e._miscs["SCORE"],
                lemma: (e.children.length > 0 ? e.children.map(function (ee) { return ee.lemma; }).join("") : e.lemma),
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
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]) === "function" && _c || Object])
], MASelectizePopoverPageComponent);

var _a, _b, _c;
//# sourceMappingURL=ma-selectize-popover-page.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TagsSelectorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
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
    function TagsSelectorComponent(navParams, 
        // public data: Data,
        // private configService: ConfigService,
        events, toastCtrl, viewCtrl) {
        this.navParams = navParams;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.viewCtrl = viewCtrl;
        this.tagsRow = 0;
        this.currentTags = [];
        // @Input() hash : string = ""
        this.allTags = [];
        this.tagsRow = 0;
    }
    TagsSelectorComponent.prototype.ngOnInit = function () {
        this.allTags = this.config.alltags;
        this.currentTags = this.getTags();
    };
    TagsSelectorComponent.prototype.getTags = function () {
        var counter = 1;
        return this.allTags.slice(this.tagsRow * 9, (this.tagsRow + 1) * 9).map(function (x) {
            x.fn = counter++;
            return x;
        });
    };
    TagsSelectorComponent.prototype.increaseTagsRow = function () {
        this.tagsRow++;
        this.currentTags = this.getTags();
        if (this.currentTags.length == 0) {
            this.tagsRow = 0;
            this.currentTags = this.getTags();
        }
    };
    TagsSelectorComponent.prototype.selectTag = function (tag) {
        this.events.publish("changeTag", tag);
    };
    return TagsSelectorComponent;
}());
TagsSelectorComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'tags-selector',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/'<button color="secondary" ion-button *ngFor="let tag of currentTags;" class="tag" title="{{tag.desc}}" (click)="selectTag(tag)" tabindex="-1">\n  {{tag.desc}}\n  <ion-badge >{{tag.fn}}</ion-badge>\n</button>\n\n<button ion-button color="secondary" class="tag" title="Press 0 for more tags" (click)="increaseTagsRow()" tabindex="-1">\n  More\n  <ion-badge >0</ion-badge>\n</button>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/,
        inputs: ['config']
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], TagsSelectorComponent);

//# sourceMappingURL=tags-selector.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpPopoverComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
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
        var _this = this;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.shortcuts = [];
        this.desc = { "saveFile": "Convert to Conll then Save",
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
        this.config = null;
        this.config = navParams.data.config;
        this.shortcuts = this.config.keyboardShortcuts.map(function (e) {
            var keys = [];
            if (e.metaKey)
                keys.push("⌘");
            if (e.shiftKey)
                keys.push("⇧");
            if (e.altKey)
                keys.push("⎇");
            var params = e.params ? e.params.join() : "";
            if (e.code.indexOf("Digit") == 0)
                params = "";
            if (e.code.indexOf("F" + params) == 0)
                params = "";
            var code = e.code
                .replace(/^Key/, "")
                .replace("ArrowLeft", "⇦")
                .replace("ArrowRight", "⇨")
                .replace("Enter", "⏎");
            keys.push(code);
            return [keys.join(" + "), _this.desc[e.action + params] || _this.desc[e.action] || e.action, params];
        });
    }
    return HelpPopoverComponent;
}());
HelpPopoverComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'help-popover',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/'  <ion-card>\n  <ion-card-header>\n    Keyboard Shortcuts\n  </ion-card-header>\n      <ion-list no-border>\n      <ion-item *ngFor="let sh of shortcuts">\n        <!-- <h2><button ion-button outline item-right icon-left>\n          {{sh[0]}}\n        </button></h2>\n        <p>{{sh[1]}}</p>\n -->\n        <!-- <ion-icon name=\'planet\' item-start></ion-icon> -->\n      <ion-note item-start>\n      {{sh[0]}}\n      </ion-note>\n      {{sh[1]}}\n      <ion-note item-end>\n      {{sh[2]}}\n      </ion-note>\n    </ion-item>\n\n      </ion-list>\n      </ion-card>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], HelpPopoverComponent);

//# sourceMappingURL=help-popover.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuidelinesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
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
    }
    GuidelinesService.prototype.load = function (project, hash) {
        var _this = this;
        if (this.guidelines.loaded) {
            // already loaded data
            return Promise.resolve(this.guidelines);
        }
        var that = this;
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
            _this.http.post(_this.myconfig.get("server") + "guidelines", {
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
                            that.guidelines[v.type] = v.data;
                            _this.guidelines[v.type] = _this.guidelines[v.type].map(function (x) {
                                x.form_normalized = x.form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g, "");
                                return x;
                            });
                        }
                    });
                    resolve(that.guidelines);
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
    return GuidelinesService;
}());
GuidelinesService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]])
], GuidelinesService);

//# sourceMappingURL=guidelines-service.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(235);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export deepLinkConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_word_service__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_conllu_service__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_config_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_guidelines_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_project_service__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_tags_selector_tags_selector__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_guider_guider__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_concordance_concordance__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_help_popover_help_popover__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_docs_docs__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pipes_not_multi_tag__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__angular_http__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_storage__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_status_bar__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_splash_screen__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_ng_selectize__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_ng2_file_upload__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25_ng2_file_upload__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// import { Data } from './data';








// import { SegmentorPopoverPageComponent } from '../components/segmentor-popover-page/segmentor-popover-page';





// import { HighlightComponent } from '../components/highlight/highlight';









// import { Storage } from '@ionic/storage';
// let storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__hadiths' })// optional config);
// export function provideData() {
//   return new Data(storage)// optional config);
// }
// export function provideStorage() {
// return storage;
// }
var wasim_config = {
    server: "http://localhost:7878/",
    // udpipe: "http://localhost:1441/",
    locationStrategy: 'hash',
};
var deepLinkConfig = {
    links: [
        // { component: AnnotatePage, name: 'Annotate Page', segment: '',defaultHistory: [ ] },
        { component: __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */], name: 'Annotate Page', segment: 'annotate/:project/:hash/:id', defaultHistory: [__WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__["a" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_17__pages_docs_docs__["a" /* DocsPage */], name: 'Documents Page', segment: 'docs/:project/:hash', defaultHistory: [__WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__["a" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__["a" /* ProjectsPage */], name: 'Projects Page', segment: 'projects', defaultHistory: [] }
    ]
};
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
            __WEBPACK_IMPORTED_MODULE_19__pipes_not_multi_tag__["a" /* NotMultiTag */],
            __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__["a" /* GetFormPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            // SegmentorPopoverPageComponent,
            __WEBPACK_IMPORTED_MODULE_12__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_16__components_help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_17__pages_docs_docs__["a" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__["a" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_25_ng2_file_upload__["FileSelectDirective"],
            __WEBPACK_IMPORTED_MODULE_25_ng2_file_upload__["FileDropDirective"],
            __WEBPACK_IMPORTED_MODULE_14__components_guider_guider__["a" /* GuiderComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_concordance_concordance__["a" /* ConcordanceComponent */],
            __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["b" /* AutofocusDirective */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_20__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_24_ng_selectize__["a" /* NgSelectizeModule */],
            __WEBPACK_IMPORTED_MODULE_21__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], wasim_config, deepLinkConfig)
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_17__pages_docs_docs__["a" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_projects_projects__["a" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__["a" /* GetFormPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            //SegmentorPopoverPageComponent,
            __WEBPACK_IMPORTED_MODULE_16__components_help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */]
        ],
        providers: [
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] },
            // Data,
            __WEBPACK_IMPORTED_MODULE_22__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_23__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_4__providers_word_service__["a" /* WordService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_conllu_service__["a" /* ConlluService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_config_service__["b" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_7__providers_guidelines_service__["a" /* GuidelinesService */],
            __WEBPACK_IMPORTED_MODULE_8__providers_project_service__["a" /* ProjectService */],
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_projects_projects__ = __webpack_require__(53);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import { Data } from './data';
// Enable production mode unless running locally
// if (!/localhost/.test(document.location.host)) {
Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
// }
var MyApp = (function () {
    function MyApp(platform, 
        // public data: Data,
        _config, statusbar, splashscreen) {
        this.platform = platform;
        this._config = _config;
        this.statusbar = statusbar;
        this.splashscreen = splashscreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_projects_projects__["a" /* ProjectsPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetFormPopoverComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
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
 * Generated class for the GetFormPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var GetFormPopoverComponent = (function () {
    // @ViewChild('diacs') diacsGroup: RadioGroup;
    function GetFormPopoverComponent(navParams, viewCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.element = null;
        this.diacsOptions = [];
        this.rank = 1;
        this.selected = { form: "" };
        this.mapObj = {
            "noun": "NOUN",
            "noun_prop": "PROPN",
            "verb": "VERB",
            "adj": "ADJ",
            "adv": "ADV",
            "prep": "PART",
        };
        this.element = navParams.data.element;
        // this.diacsOptions = this.element.analysis.diacs()
        // this.diacsOptions = this.element.analysis.possibilities;
        // console.log(this.element.analysis.possibilities)
        console.log(this.diacsOptions);
        this.rank = this.diacsOptions.findIndex(function (val) {
            return _this.element.form == val.diac;
        });
    }
    GetFormPopoverComponent.prototype.map = function (from) {
        return this.mapObj[from] || from;
    };
    GetFormPopoverComponent.prototype.onChange = function (ev) {
        var _this = this;
        if (ev.code == "Enter") {
            var newval = this.diacsOptions[this.rank];
            if (newval) {
                // this.element.form = newval.segmentation[this.element.isSeg] || newval.segmentation[0];
                if (newval.segmentation.length == 1) {
                    this.element.form = newval.segmentation[0];
                }
                else {
                    newval.segmentation.forEach(function (seg, i) {
                        if (_this.element.parent) {
                            if (_this.element.parent.children[i])
                                _this.element.parent.children[i].form = seg;
                        }
                        else
                            console.error("ERROR: Should have a parent:", _this.element);
                    });
                }
                this.element.lemma = newval.lemma;
                this.element.upostag = this.map(newval.pos);
            }
            // else
            // this.element.form = ev.target.value
            this.viewCtrl.dismiss();
        }
        if (ev.code == "ArrowDown") {
            ev.preventDefault();
            // var i = this.diacsOptions.findIndex((val) => {
            //   return this.rank == val.rank;
            // })
            // // var i = this.rank
            // var chosen = this.diacsOptions[i + 1 >= this.diacsOptions.length ? this.diacsOptions.length - 1 : i + 1]
            // this.element.form = chosen.diac
            // this.rank = chosen.rank
            this.rank = this.rank + 1 >= this.diacsOptions.length ? this.rank : this.rank + 1;
        }
        if (ev.code == "ArrowUp") {
            ev.preventDefault();
            // var i = this.diacsOptions.findIndex((val) => {
            //   return this.rank == val.rank;
            // })
            // // var i = this.rank
            // var chosen = this.diacsOptions[i - 1 < 0 ? 0 : i - 1]
            // // this.element.form = chosen.diac
            // this.rank = chosen.rank
            this.rank = this.rank - 1 < 0 ? this.rank : this.rank - 1;
        }
        if (ev.code == "Escape") {
            // this.viewCtrl.dismiss()
        }
        if (/F[0-9]/.test(ev.code)) {
            ev.preventDefault();
            console.log(ev.code);
            // this.element.form = this.element.analysis.diacs()[parseInt(ev.code.replace("F", "")) - 1]
        }
    };
    return GetFormPopoverComponent;
}());
GetFormPopoverComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'get-form-popover',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/get-form-popover/get-form-popover.html"*/'<ion-input (keyup)="onChange($event)" class="form_input" value="{{this.element.form}}" autofocus></ion-input>\n  <ion-list radio-group [(ngModel)]="rank" #diacs>\n      <ion-list-header>\n        Diacritization\n      </ion-list-header>\n        <ion-item radio-group *ngFor="let option of diacsOptions" [(ngModel)]="rank">\n          <ion-label>{{option.diac}}\n            <div class="segmentation">\n              <span *ngFor="let seg of option.segmentation">{{seg}}</span>\n            </div>\n            <span>{{option.gloss}}</span>\n            <span>{{map(option.pos)}}</span>\n          </ion-label>\n          <ion-radio value="{{option.rank}}"></ion-radio>\n        </ion-item>\n  </ion-list>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/get-form-popover/get-form-popover.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], GetFormPopoverComponent);

//# sourceMappingURL=get-form-popover.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuiderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_guidelines_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_config_service__ = __webpack_require__(34);
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
        this.showDetails = false;
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
            this.options.forEach(function (e) { return e.showDetails = true; });
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
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__providers_config_service__["a" /* ConfigJSON */])
], GuiderComponent.prototype, "config", void 0);
GuiderComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'guider',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/'<ion-list *ngIf="show()">\n  <ion-item-divider color="light">{{element?.form}}</ion-item-divider>\n  <ion-item *ngFor="let e of this.options">\n    <h2>\n      <ion-badge color="secondary" item-start>{{e.percentage}}</ion-badge>\n      {{config.getXPosTag(e.value).desc}}\n      <button ion-button (click)="toggle(e)" icon-only tabindex="-1">\n        <ion-icon name="eye" [hidden]="e.showDetails"></ion-icon>\n        <ion-icon name="eye-off" [hidden]="!e.showDetails"></ion-icon>\n      </button>\n      <button ion-button (click)="assign(element,e)" icon-only tabindex="-1"> <ion-icon name="checkmark"></ion-icon></button>\n    </h2>\n    <p *ngIf="e.showDetails">\n      <span style="display: block;" *ngFor="let ex of e.examples">{{ex}}</span>\n    </p>\n  </ion-item>\n</ion-list>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_guidelines_service__["a" /* GuidelinesService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], GuiderComponent);

//# sourceMappingURL=guider.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConcordanceComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_config_service__ = __webpack_require__(34);
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
    function ConcordanceComponent(navParams, events, toastCtrl, viewCtrl) {
        this.navParams = navParams;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.viewCtrl = viewCtrl;
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
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__providers_config_service__["a" /* ConfigJSON */])
], ConcordanceComponent.prototype, "config", void 0);
ConcordanceComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'concordance',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/concordance/concordance.html"*/'<div style="text-align: center">\n<div *ngIf="element" class="sentence" [ngClass]="{rtl:config.isRtl}">\n  <div>{{element?.sentence.tag}}</div>\n  <div tabindex="{{elem == element ? 1 : -1}}" *ngFor="let elem of element?.sentence.elements ; let i = index" class="element" [hidden]="elem.isMultiword() || i > element.sentence.elements.indexOf(element) + config.concordanceWindow || i < element.sentence.elements.indexOf(element) - config.concordanceWindow" [ngClass]="{\n              isCompounds: elem.upostag==\'_\',\n              highlight: elem == element,\n              rtl:config.isRtl,\n              unclear: elem._miscs[\'UNCLEAR\'],\n              isSeg: elem.isSeg > 0 }">\n    <span>\n          <span class="form">{{elem.getForm()}}</span>\n          <span class="postag">{{config.useUD ? config.tags[\'U:\'+elem.upostag]?.desc : config.tags[\'X:\'+elem.xpostag]?.desc}}</span>\n          <span class="mf_missing" [hidden]="elem.morphFeatsMissing().length == 0">{{elem.morphFeatsMissing().length}}</span>\n    </span>\n  </div>\n</div>\n</div>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/concordance/concordance.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
], ConcordanceComponent);

//# sourceMappingURL=concordance.js.map

/***/ }),

/***/ 293:
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
        return list.filter(function (item) { return !item.isMultiword(); });
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

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ConfigService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
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

var ConfigJSON = (function () {
    function ConfigJSON() {
        this.remote_repo = "";
        this.language = "qac";
        this.tagset = "";
        this.rowlength = 7;
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

var ConfigService = (function () {
    function ConfigService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.config = {};
        this.rtls = ["arabic", "qac"];
        this.config.default = new ConfigJSON();
    }
    ConfigService.prototype.load = function (project, hash) {
        var _this = this;
        if (this.config[project]) {
            // already loaded data
            return Promise.resolve(this.config[project]);
        }
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.get("server") + "get_config", {
                project: project,
                hash: hash
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.ok) {
                    var config = new ConfigJSON();
                    config.remote_repo = data.config.remote_repo;
                    config.language = data.config.language;
                    config.tagset = data.config.tagset;
                    config.useUD = data.config.useUD;
                    config.rowlength = data.config.rowlength;
                    config.isRtl = data.config.isRtl;
                    config.sync = data.config.sync;
                    config.undoSize = data.config.undoSize;
                    config.keyboardShortcuts = data.config.keyboardShortcuts;
                    config.onFeatSelect = data.config.onFeatSelect;
                    config.MfVsPos = data.config["MF.vs.POS"];
                    config.MfVsPos_upostag = data.config["MF.vs.POS_upostag"];
                    config.mf = data.config.mf;
                    config.sentenceTags = data.config.sentenceTags;
                    config.allutags = data.config.allutags;
                    data.config.alltags.forEach(function (xx, i, arr) {
                        arr[i].mapFrom = arr[i].mapFrom || "";
                    });
                    if (data.config["MF.vs.POS"]) {
                        config.MfVsPos = data.config["MF.vs.POS"];
                        data.config.alltags.forEach(function (xx, i, arr) {
                            arr[i].features = Object.keys(data.config.mf).filter(function (x) { return data.config["MF.vs.POS"][x].indexOf(data.config["MF.vs.POS_upostag"] ? xx.mapToConllU : xx.tag) >= 0; });
                        });
                    }
                    else {
                        console.error("config['MF.vs.POS'] is missing");
                    }
                    config.alltags = data.config.alltags;
                    config.allxtags = data.config.alltags.map(function (x) { return x.tag; });
                    // data.config.allutags = data.config.alltags.map(x=>x.mapToConllU).sort().filter(function(el,i,a){return i==a.indexOf(el);}) // sort and unique
                    config.tags = {};
                    config.alltags.forEach(function (x) { return config.tags["X:" + x.tag] = x; });
                    // config.allutags.forEach(x=>config.tags["U:"+x.tag]=x)
                    config.tags["X:_"] = { tag: "_", desc: "_" };
                    config.tags["U:_"] = { tag: "_", desc: "_" };
                    config.features = {};
                    Object.keys(data.config.mf).forEach(function (k) { return data.config.mf[k].forEach(function (v) { return config.features[k + "=" + v.tag] = v; }); });
                    that.config[project] = config;
                    resolve(that.config[project]);
                }
                else if (data.default)
                    that.config.default = data.default;
                reject(data);
            });
        });
    };
    ConfigService.prototype.save = function (project, hash, config) {
        var _this = this;
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.myconfig.get("server") + "save_config", {
                project: project,
                hash: hash,
                config: config
            })
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
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]])
], ConfigService);

//# sourceMappingURL=config-service.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_project_service__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__docs_docs__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(213);
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
    function ProjectsPage(navCtrl, navParams, projectService, storage, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.projectService = projectService;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
        this.security = "";
        this.projects = [];
        this.validSecurity = false;
        this.new_project = "";
        this.storage.get("security").then(function (v) {
            _this.security = v;
            if (_this.security) {
                _this.validSecurity = true;
                _this.securityChanged();
            }
        });
    }
    ProjectsPage.prototype.create = function () {
        var _this = this;
        this.projectService.create(this.security, this.new_project)
            .then(function (result) {
            if (result.ok) {
                _this.projects.push({
                    project: result.project,
                    hash: result.hash,
                });
                _this.storage.set("project_hash_" + result.project, result.hash);
            }
            else
                _this.toastCtrl.create({
                    message: result.error,
                    duration: 3000,
                    position: "top"
                }).present();
        });
    };
    ProjectsPage.prototype.goto = function (project) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__docs_docs__["a" /* DocsPage */], {
            project: project.project,
            hash: project.hash,
        });
    };
    ProjectsPage.prototype.securityChanged = function () {
        var _this = this;
        this.projectService.getList(this.security).then(function (result) {
            if (result.ok) {
                _this.projects = result.projects;
                _this.validSecurity = true;
                _this.storage.set("security", _this.security);
                if (result.projects.length == 0) {
                    _this.toastCtrl.create({
                        message: "There is no projects created yet. Please create one now.",
                        duration: 3000,
                        position: "top"
                    }).present();
                }
            }
            else
                _this.toastCtrl.create({
                    message: result.error,
                    duration: 3000,
                    position: "top"
                }).present();
        }).catch(function (error) {
            _this.toastCtrl.create({
                message: error,
                duration: 3000,
                position: "top"
            }).present();
        });
    };
    ProjectsPage.prototype.ionViewDidLoad = function () {
    };
    return ProjectsPage;
}());
ProjectsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-projects',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/'<!--\n  Generated template for the ProjectsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>المشاريع</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding rtl>\n   <ion-card *ngIf="!validSecurity">\n   <ion-card-header>تسجيل الدخول كمدير</ion-card-header>\n   <ion-card-content>\n     <ion-item>\n      <ion-label fixed>رمز الدخول</ion-label>\n      <ion-input type="password" [(ngModel)]="security"></ion-input>\n      </ion-item>\n        <button ion-button (click)="securityChanged()">الدخول</button>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card *ngIf="validSecurity">\n  <ion-item-divider>\n    المشاريع الحالية\n  </ion-item-divider>\n  	<ion-list>\n    	<ion-item *ngFor="let p of projects">\n    		{{p.project}}\n    		<button ion-button outline item-end icon-left (click)="goto(p)">اذهب</button>\n    		<button ion-button outline item-end icon-left (click)="remove(p)">احذف</button>\n    	</ion-item>\n  	</ion-list>\n	<ion-item *ngIf=\'projects.length === 0\'>لا يوجد أي مشروع</ion-item>\n  <ion-item-divider>\n    مشروع جديد\n  </ion-item-divider>\n	<ion-item >\n	    <ion-label fixed>اسم المشروع</ion-label>\n	    <ion-input type="text" [(ngModel)]="new_project"></ion-input>\n		<button ion-button outline item-end icon-left (click)="create()">إنشاء</button>\n	</ion-item>\n  </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_project_service__["a" /* ProjectService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]])
], ProjectsPage);

//# sourceMappingURL=projects.js.map

/***/ })

},[216]);
//# sourceMappingURL=main.js.map