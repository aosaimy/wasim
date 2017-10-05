webpackJsonp([0],{

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnnotatePage; });
/* unused harmony export Highlight */
/* unused harmony export Stats */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_word_service__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_config_service__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_selectize_popover_page_selectize_popover_page__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_help_popover_help_popover__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__docs_docs__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__projects_projects__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__conllu__ = __webpack_require__(203);
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














/*
  Generated class for the Annotate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AnnotatePage = (function () {
    function AnnotatePage(navCtrl, popoverCtrl, navParams, 
        // public data: Data,
        http, cdr, renderer, events, wordservice, conlluService, configService, alertCtrl, toastCtrl) {
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
        this.isConlluHidden = false;
        this.preventKeyboard = false;
        this.showAlertMessage = false;
        this.undoArr = [];
        this.redoArr = [];
        this.maResult = null;
        this.highlight = new Highlight(this.events);
        this.conlluRaw = "1-3 \u0648\u0639\u0646\u0647\u0627   _   _   _   _   _   _   _   _\n1   \u0648\u064E  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0\n2   \u0639\u064E\u0646\u0647\u0627   \u0639\u064E\u0646_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1\n3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2\n";
        this.stats = new Stats(this.events);
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
        if (!navParams.data.id) {
            navCtrl.pop();
        }
        else {
            this.pageid = navParams.data.id;
        }
        this.configService.load(this.project, this.hash).then(function (s) {
            _this.config = _this.configService.getConfig(_this.project);
            _this.doc = new __WEBPACK_IMPORTED_MODULE_12__conllu__["a" /* ConlluDocument */](_this.config, _this.events);
        }).catch(function (s) {
            _this.config = _this.configService.getConfig(_this.project);
            _this.undoArr = new Array(_this.config.undoSize || 5);
            _this.toastCtrl.create({
                message: 'Config loading Error: ' + s.error,
                duration: 3000,
                position: "top"
            }).present();
        });
        this.conlluService.load(this.project, this.hash, this.pageid).then(function (s) {
            _this.conlluRaw = s.trim();
            _this.onConlluRawChanged(null);
        }).catch(function (x) {
            _this.toastCtrl.create({
                message: 'Conllu File loading Error: ' + x,
                duration: 3000,
                position: "top"
            }).present();
        });
    }
    AnnotatePage.prototype.logme = function (x) { console.log(x); };
    AnnotatePage.prototype.ngOnInit = function () {
        // this.config = this.configService.getConfig(this.project)
        // console.log('ngAfterViewInit AnnotatePage');
        // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
        // this.jump(12)
    };
    AnnotatePage.prototype.getForm = function (elem) {
        // console.log(elem)
        if (!elem.parent)
            return elem.form;
        var prev = elem.parent.children[elem.isSeg - 1];
        if (prev) {
            prev = prev.form.replace(/[ًٌٍَُِّْ]*$/, "");
            prev = prev.charAt(prev.length - 1);
        }
        var next = elem.parent.children[elem.isSeg + 1];
        if (next)
            next = next.form.charAt(0);
        var meLast = elem.form.replace(/[ًٌٍَُِّْ]*$/, "");
        meLast = meLast.charAt(meLast.length - 1);
        var meFirst = elem.form.charAt(0);
        if (-elem.parent.isSeg == elem.isSeg + 1)
            return (this.isTatweel(prev, meFirst) ? "ـ" : "") + elem.form;
        else if (elem.isSeg == 0)
            return elem.form + (this.isTatweel(meLast, next) ? "ـ" : "");
        else
            return (this.isTatweel(prev, meFirst) ? "ـ" : "") +
                elem.form
                + (this.isTatweel(meLast, next) ? "ـ" : "");
    };
    AnnotatePage.prototype.isTatweel = function (first, second) {
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
    AnnotatePage.prototype.presentGetFormPopover = function () {
        var _this = this;
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_7__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */], {
            element: this.highlight.element.parent || this.highlight.element,
            config: this.config
        }, { cssClass: "selectizePopover" });
        this.preventKeyboard = true;
        popover.present({});
        popover.onDidDismiss(function () {
            _this.preventKeyboard = false;
            _this.saveForUndo();
        });
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
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_6__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */], {
            element: this.highlight.element,
            config: this.config
        }, { cssClass: "selectizePopover" }); //,enableBackdropDismiss:false});
        this.preventKeyboard = true;
        popover.present({});
        popover.onDidDismiss(function (x) {
            _this.preventKeyboard = false;
            _this.saveForUndo();
        });
    };
    AnnotatePage.prototype.presentHelpFormPopover = function () {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_9__components_help_popover_help_popover__["a" /* HelpPopoverComponent */], {});
        popover.present({});
    };
    AnnotatePage.prototype.mouseClick = function (e) {
        this.events.publish("stats", { action: "mouse", element: e });
    };
    AnnotatePage.prototype.keyboardShortcuts = function (e) {
        var highlighNode = document.querySelector(".highlight");
        if (e.target != document.querySelector("body") && e.target.parentNode.parentNode != highlighNode.parentNode.parentNode) {
            if (e.code == "Escape") {
                this.events.publish("stats", { action: "keyboard", event: e });
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
        this.onConlluRawChanged(null);
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
        this.onConlluRawChanged(null);
        if (e)
            e.preventDefault();
    };
    AnnotatePage.prototype.new_sentence = function (e) {
        if (e === void 0) { e = null; }
        if (!this.highlight.element)
            return;
        this.showAlertMessage = true;
        var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element);
        // check if last segment
        if (this.highlight.sentence.elements[eindex + 1]
            && this.highlight.element.parent != null
            && this.highlight.element.parent == this.highlight.sentence.elements[eindex + 1].parent)
            return;
        var before = this.highlight.sentence.elements.slice(0, eindex + 1);
        var after = this.highlight.sentence.elements.slice(eindex + 1);
        if (after.length == 0) {
            // do reverse. join with next sentence
            if (!this.doc.sentences[sindex + 1])
                return;
            after = this.doc.sentences[sindex + 1].elements;
            var counter = this.highlight.sentence.words(false).length + 1;
            after.forEach(function (e) {
                if (e.xpostag != "_")
                    e.id = "" + counter++;
                else {
                    var arr = e.id.split("-");
                    e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]));
                }
            });
            this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
            this.doc.sentences.splice(sindex + 1, 1);
        }
        else {
            this.highlight.sentence.elements = before;
            var counter = 1;
            after.forEach(function (e) {
                if (e.xpostag != "_")
                    e.id = "" + counter++;
                else {
                    var arr = e.id.split("-");
                    e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]));
                }
            });
            var sent = new __WEBPACK_IMPORTED_MODULE_12__conllu__["c" /* ConlluSentence */]("new", after, [], this.doc);
            this.doc.sentences.splice(sindex + 1, 0, sent);
            // console.log(this.doc)
        }
        this.saveForUndo();
    };
    AnnotatePage.prototype.clone = function (e) {
        if (e === void 0) { e = null; }
        if (!this.highlight.element)
            return;
        var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element);
        var el = this.highlight.element.clone();
        this.highlight.sentence.elements.splice(eindex + 1, 0, el);
        if (this.highlight.element.parent) {
            el.parent = this.highlight.element.parent;
            var arr = this.highlight.element.parent.id.split("-");
            el.parent.id = arr[0] + "-" + (parseInt(arr[1]) + 1);
        }
        else {
            var parent = new __WEBPACK_IMPORTED_MODULE_12__conllu__["b" /* ConlluElement */]([parseInt(this.highlight.element.id) + "-" + (parseInt(this.highlight.element.id) + 1), this.highlight.element.form,
                "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], this.highlight.element.lineidx, this.highlight.element.line, this.highlight.sentence);
            this.highlight.sentence.elements.splice(eindex, 0, parent);
            el.parent = parent;
            this.highlight.element.parent = parent;
        }
        var counter = 1;
        this.highlight.sentence.elements.forEach(function (e) {
            if (e.xpostag != "_")
                e.id = "" + counter++;
            else {
                var arr = e.id.split("-");
                e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]));
            }
        });
        this.highlight.sentence.refix();
        this.saveForUndo();
    };
    AnnotatePage.prototype.mark_misc = function (key, e) {
        this.showAlertMessage = true;
        this.highlight.element.miscs[key] = !this.highlight.element.miscs[key];
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
            if (e.xpostag != "_")
                e.id = "" + counter++;
            else {
                var arr = e.id.split("-");
                e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]));
            }
        });
        this.events.publish('highligh:change', this.highlight.sentence.elements[eindex]);
        // this.highlight.element = this.highlight.sentence.elements[eindex]
        this.saveForUndo();
    };
    AnnotatePage.prototype.tag_ma = function (e) {
        this.presentGetFormPopover();
        this.events.publish("stats", { action: "tag_ma", element: this.highlight.element });
        this.showAlertMessage = true;
    };
    AnnotatePage.prototype.doAction = function (action, params, e) {
        var that = this;
        var x;
        switch (action) {
            case "nav":
                if (!this.highlight.element)
                    break;
                if (params[0] == "word_left")
                    x = this.highlight.sentence.elements.filter(function (x) { return !x.isMultiword() && parseInt(x.id) == parseInt(that.highlight.element.id) + 1; })[0];
                else if (params[0] == "word_right")
                    x = this.highlight.sentence.elements.filter(function (x) { return !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) - 1); })[0];
                // else if(params[0]=="word_down")
                //   x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) + this.config.rowlength))[0]
                // else if(params[0]=="word_up")
                //   x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) - this.config.rowlength))[0]
                if (x) {
                    this.events.publish('highligh:change', x);
                    // this.highlight.element = x
                }
                else {
                    var sindex = this.doc.sentences.indexOf(this.highlight.sentence);
                    if (params[0] == "word_down")
                        var y = this.doc.sentences[sindex + 1];
                    else if (params[0] == "word_up")
                        var y = this.doc.sentences[sindex - 1];
                    if (y) {
                        // this.highlight.sentence = y
                        this.events.publish('highligh:change', y.elements.filter(function (x) { return !x.isMultiword(); })[0]);
                    }
                }
                setTimeout(function () {
                    var sa = document.querySelector("#sentences");
                    var ea = document.querySelector("#sentences .element.highlight");
                    if (ea && sa)
                        sa.scrollTop = ea.offsetTop - sa.offsetTop - 150;
                }, 100);
                if (e)
                    e.preventDefault();
                break;
            case "tag_morphofeatures":
                this.tag_morphofeatures(e);
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
                var fn = this.myTags.getTags()[params[0] - 1];
                if (fn) {
                    this.highlight.element.xpostag = fn.tag;
                    this.highlight.element.upostag = this.config.alltags.find(function (x) { return x.tag == fn.tag; }).mapToConllU;
                }
                this.saveForUndo();
                break;
            case "showOtherUTags":
                this.myTags.increaseTagsRow();
                break;
            case "assignSentenceTag":
                var fn = this.config.sentenceTags[parseInt(params[0]) - 1];
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
                var that = this;
                var doc = new __WEBPACK_IMPORTED_MODULE_12__conllu__["a" /* ConlluDocument */](this.config);
                doc.parse(this.doc.toConllU(), function (s) { return that.log = that.log + s + '\n'; }, true);
                break;
            default:
                // code...
                break;
        }
        this.jump(this.doc.getElementLine(this.highlight.element, this.highlight.sentence));
        // console.log(this.highlight.element)
    };
    AnnotatePage.prototype.saveFile = function (e) {
        var _this = this;
        if (e === void 0) { e = null; }
        if (e)
            e.preventDefault();
        this.conlluRaw = this.doc.toConllU();
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
        });
    };
    AnnotatePage.prototype.syncConllU = function (e) {
        if (e === void 0) { e = null; }
        this.conlluRaw = this.doc.toConllU();
        this.toastCtrl.create({
            message: 'Conll-U representation has been updated.',
            duration: 3000,
            position: "top"
        }).present();
    };
    AnnotatePage.prototype.saveForUndo = function () {
        if (!this.config.sync)
            return false;
        this.undoArr.push(this.conlluRaw);
        this.conlluRaw = this.doc.toConllU();
        if (this.undoArr.length > this.config.undoSize)
            this.undoArr.shift();
    };
    AnnotatePage.prototype.onConlluRawChanged = function (e) {
        if (e === void 0) { e = null; }
        this.log = "";
        // console.log("Here",this.conlluRaw)
        var that = this;
        if (e)
            this.conlluRaw = e.target.value;
        this.doc.parse(this.conlluRaw, function (s) {
            that.log = that.log + s + '\n';
        }, false); //.toBrat(logger, true);
        this.highlight.sentence = this.doc.sentences[0];
        if (this.highlight.sentence) {
            this.events.publish('highligh:change', this.doc.sentences[0].elements.filter(function (x) { return !x.isMultiword(); })[0]);
            // this.highlight.element = this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0]
        }
        if (e != "") {
            // this.cdr.detectChanges();
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
                return _this.wordservice.load(s.tokens().map(function (e) { return e.form; }).join(" "), _this.config)
                    .then(function (elements) {
                    _this.maResult[i] = elements;
                    _this.assignMA(s, i);
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
                console.error(i, _this.maResult);
            e.analysis = _this.maResult[i][counter];
            counter++;
        });
    };
    AnnotatePage.prototype.jump = function (line) {
        var ta = document.querySelector("#conlluTextArea textarea");
        //TODO: replace rows with a more realistic measure.
        //TODO: change color of current word
        var lineHeight = ta.clientHeight / parseInt(ta.getAttribute("rows"));
        var jump = (line - 1) * lineHeight;
        // console.log(ta)
        // console.log(jump,lineHeight, ta.clientHeight , ta.getAttribute("rows"))
        ta.scrollTop = jump;
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
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* RadioGroup */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* RadioGroup */]) === "function" && _b || Object)
], AnnotatePage.prototype, "lemmaGroup", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myTags'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */]) === "function" && _c || Object)
], AnnotatePage.prototype, "myTags", void 0);
AnnotatePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-annotate',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>ترميز الملف: {{pageid}}</ion-title>\n\n    <ion-buttons end>\n      <button right ion-button icon-only (click)="presentHelpFormPopover($event)" tabindex="-1">\n        <ion-icon name="more"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n\n</ion-header>\n\n\n<ion-content padding>\n<!-- <ion-list> -->\n  <!-- <ion-item *ngFor="">\n    <ion-avatar item-left>\n      <h1></h1>\n    </ion-avatar>\n    <h2>Finn</h2>\n    <h3>Don\'t Know What To Do!</h3>\n    <p>I\'ve had a pretty messed up day. If we just...</p>\n  </ion-item> -->\n\n<ion-grid (window:keydown)="keyboardShortcuts($event)" (window:click)="mouseClick($event)">\n  <ion-row>\n      <ion-col style="display:none; margin: 0">\n        <div id="vis"></div>\n        <ion-textarea id="parsed" rows="10" cols="80"></ion-textarea>\n      </ion-col>\n      <ion-col col-12>\n        <ion-row>\n          <tags-selector *ngIf="config" #myTags [config]="config"></tags-selector>\n\n\n          <!-- <button class=\'topbar_button\' ion-button tabindex="-1" (click)="syncConllU()"><ion-icon name="sync"></ion-icon></button> -->\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="showStats()"><ion-icon name="print"></ion-icon></button>\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="tag_morphofeatures()"><ion-icon name="apps"></ion-icon></button>\n\n          <button class=\'topbar_button\' [disabled]="undoArr.length==0" ion-button tabindex="-1" (click)="undo()"><ion-icon name="undo"></ion-icon></button>\n          <button class=\'topbar_button\' [disabled]="redoArr.length==0" ion-button tabindex="-1" (click)="redo()"><ion-icon name="redo"></ion-icon></button>\n\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="clone()"><ion-icon name="add"></ion-icon></button>\n\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="tag_ma()"><ion-icon name="menu"></ion-icon></button>\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="mark_misc(\'UNCLEAR\')"><ion-icon name="warning"></ion-icon></button>\n\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="delete()"><ion-icon name="remove"></ion-icon></button>\n\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="save()"><ion-icon name="cloud-upload"></ion-icon></button>\n          <button class=\'topbar_button\' ion-button tabindex="-1" (click)="isConlluHidden=!isConlluHidden"><ion-icon name="sync"></ion-icon></button>\n\n        </ion-row>\n\n        <!-- <ion-row>\n          <div *ngFor="let tag of sentenceTags;" class="tag" title="{{tag.desc}}" >\n              {{tag.tag}}\n              <span class="fn">F{{tag.fn}}</span>\n          </div>\n        </ion-row> -->\n      </ion-col>\n\n  </ion-row>\n  <ion-row>\n    <ion-col col-2>\n      <ion-list *ngIf="highlight.element">\n<!--         <ion-item>\n          <ion-label color="primary" stacked>Lemma</ion-label>\n          <ion-input [(ngModel)]="highlight.element.lemma"></ion-input>\n        </ion-item>\n -->\n        <ion-item *ngIf="highlight.element.parent">\n          <ion-label color="primary" stacked>الكلمة الكاملة</ion-label>\n          <ion-input [(ngModel)]="highlight.element.parent.form" tabindex="2" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n        </ion-item>\n       <ion-item>\n          <ion-label color="primary" stacked>الكلمة</ion-label>\n          <ion-input [(ngModel)]="highlight.element.form" tabindex="3" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n        </ion-item>\n\n       <ion-item>\n          <ion-label color="primary" stacked>قسم الكلام</ion-label>\n          <ion-select [(ngModel)]="highlight.element.xpostag">\n            <ion-option *ngFor="let tag of config.alltags;" [value]="tag.tag">{{tag.desc}}</ion-option>\n          </ion-select>\n        </ion-item>\n\n       <ion-item>\n          <ion-label color="primary" stacked>قسم الكلام العالمي</ion-label>\n          <ion-select [(ngModel)]="highlight.element.upostag">\n            <ion-option *ngFor="let tag of config.allutags;" [value]="tag">{{tag}}</ion-option>\n          </ion-select>\n        </ion-item>\n\n       <ion-item>\n          <ion-label color="primary" stacked>الجذع</ion-label>\n          <ion-input [(ngModel)]="highlight.element.lemma" tabindex="4" [ngClass]="{\n              rtl:configService.isRtl(project)}"></ion-input>\n        </ion-item>\n\n        <ion-item *ngFor="let feat of highlight.element.features; let i=index">\n            <ion-label color="primary" stacked>{{feat.key}}</ion-label>\n         <ion-select [(ngModel)]="feat.value" interface="popover">\n            <ion-option *ngFor="let e of config.mf[feat.key];" [value]="e">{{e}}</ion-option>\n          </ion-select>\n\n            <!-- <ion-input class="featname" value="{{feat.value}}" tabindex="{{i+4}}"></ion-input> -->\n        </ion-item>\n      </ion-list>\n      <guider *ngIf="highlight.element" [element]="highlight.element?.form" type="specialPos" [project]="project" [hash]="hash"> </guider>\n      <guider *ngIf="highlight.element" [element]="highlight.element?.form" type="specialSeg" [project]="project" [hash]="hash"> </guider>\n    </ion-col>\n    <ion-col id="sentences" *ngIf="config" >\n      <!-- <p>Here\'s a validating visualizer. Visualization:</p> -->\n      <!-- <pre>{{documentJson}}</pre> -->\n      <div *ngFor="let sent of doc?.sentences" class="sentence" [ngClass]="{\n              rtl:configService.isRtl(project)}">\n          <div>{{sent.tag}}</div>\n          <div tabindex="{{elem == highlight.element ? 1 : -1}}" *ngFor="let elem of sent.elements | notmultitag ; let i = index" class="element"\n            [ngClass]="{\n              isCompounds:elem.upostag==\'_\',\n              highlight: elem == highlight.element,\n              rtl:configService.isRtl(project),\n              unclear: elem.miscs[\'UNCLEAR\'],\n              newline2: i%config.rowlength==0,\n              isSeg: elem.isSeg > 0 }"\n            (click)="highlight.element = elem; highlight.sentence = sent"\n          >\n              <span class="form">{{getForm(elem)}}</span>\n              <span class="postag">{{config.useUD ? elem.upostag : elem.xpostag}}</span>\n              <span class="mf_missing" [hidden]="elem.morphFeatsMissing().length == 0">{{elem.morphFeatsMissing().length}}</span>\n              <!-- <span *ngFor="let feat of elem.features()">\n                <span class="featname">{{feat[0]}}</span>\n                <span class="featname">{{feat[1]}}</span>\n              </span> -->\n          </div>\n      </div>\n\n    </ion-col>\n    <ion-col col-4 id="conlluColumn" [hidden]="isConlluHidden">\n      <ion-row>\n        <ion-textarea tabindex="-1" no-text-wrap id="conlluTextArea" [ngModel]="conlluRaw" (change)="onConlluRawChanged($event)" style="font-size: 7pt; margin-top:0; width: 100%;"></ion-textarea>\n        </ion-row>\n        <ion-row>\n        <h2>Error log:</h2>\n        <ion-textarea [ngModel]="log" id="errorTextArea" rows="7" cols="80" style="margin-top:0" disabled="disabled">\n        </ion-textarea>\n      </ion-row>\n    </ion-col>\n  </ion-row>\n\n\n<!-- no need to show the intermediate data representation -->\n\n<!-- <div class="conllu-parse" data-visid="vis" data-inputid="input" data-parsedid="parsed" data-logid="log"> -->\n\n</ion-grid>\n<!-- </ion-list> -->\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/annotate/annotate.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* PopoverController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* PopoverController */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _h || Object, typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]) === "function" && _j || Object, typeof (_k = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]) === "function" && _k || Object, typeof (_l = typeof __WEBPACK_IMPORTED_MODULE_3__providers_word_service__["a" /* WordService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_word_service__["a" /* WordService */]) === "function" && _l || Object, typeof (_m = typeof __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__["a" /* ConlluService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_conllu_service__["a" /* ConlluService */]) === "function" && _m || Object, typeof (_o = typeof __WEBPACK_IMPORTED_MODULE_5__providers_config_service__["a" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__providers_config_service__["a" /* ConfigService */]) === "function" && _o || Object, typeof (_p = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _p || Object, typeof (_q = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]) === "function" && _q || Object])
], AnnotatePage);

var Highlight = (function () {
    function Highlight(events) {
        var _this = this;
        this.events = events;
        this.sentence = null;
        this.element = null;
        this.events.subscribe("highligh:change", function (element) {
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
    Stats.prototype.print = function () {
        var cats = {};
        this.all.forEach(function (e) { return cats[e.action] = cats[e.action] + 1 || 1; });
        console.log(cats);
        console.log(this.all);
        var cache = [];
        console.log(JSON.parse(JSON.stringify(this.all, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        })));
        cache = null; // Enable garbage collection
        var d = new Date();
        console.log(this.start, d, Math.abs(d.getTime() - this.start.getTime()));
    };
    return Stats;
}());

var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
//# sourceMappingURL=annotate.js.map

/***/ }),

/***/ 102:
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
                else
                    reject(data.error);
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
    ConlluService.prototype.save = function (project, hash, pageid, data) {
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
                "data": data
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data);
                // data = data;
                if (data.ok)
                    resolve(data);
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
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */]])
], ConlluService);

//# sourceMappingURL=conllu-service.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigService; });
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
var ConfigService = (function () {
    function ConfigService(http, myconfig) {
        this.http = http;
        this.myconfig = myconfig;
        this.config = {
            "default": {
                "remote_repo": "",
                "language": "qac",
                "tagset": "",
                "rowlength": 7,
                "keyboardShortcuts": {},
                "MF.vs.POS": {},
                "mf": {},
                "alltags": [],
                "sentenceTags": [],
                "loaded": false
            }
        };
        this.rtls = ["arabic", "qac"];
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
                    if (data.config["MF.vs.POS"])
                        data.config.alltags.forEach(function (xx, i, arr) { return arr[i].mf = Object.keys(data.config.mf)
                            .filter(function (x) { return data.config["MF.vs.POS"][x]
                            .indexOf(data.config["MF.vs.POS_upostag"] ? xx.mapToConllU : xx.tag) >= 0; }); });
                    data.config.allxtags = data.config.alltags.map(function (x) { return x.tag; });
                    data.config.allutags = data.config.alltags.map(function (x) { return x.mapToConllU; }).sort().filter(function (el, i, a) { return i == a.indexOf(el); }); // sort and unique
                    that.config[project] = data.config;
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

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_file_upload_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__projects_projects__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__annotate_annotate__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_config_service__ = __webpack_require__(103);
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
            that.list.push(result.filename);
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
        selector: 'page-docs',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/'<!--\n  Generated template for the DocsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n    <ion-navbar>\n        <ion-title>إدارة المشروع: {{project}}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content padding>\n    <ion-grid>\n        <ion-row>\n            <ion-col col-12>\n                <ion-list>\n                    <ion-item *ngFor="let i of list">\n                        {{i}}\n                        <button ion-button outline item-end icon-left (click)="goto(i)">اذهب</button>\n                        <button ion-button outline item-end icon-left (click)="remove(i)">احذف</button>\n                    </ion-item>\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-card>\n                <ion-item>\n                    <!-- <ion-label >Text</ion-label> -->\n                    <ion-textarea [(ngModel)]="text" placeholder="Text you need to tokenize,tag"></ion-textarea>\n                </ion-item>\n                  <ion-item-divider>\n                  </ion-item-divider>\n                <ion-item>\n                    <ion-label fixed>اسم الملف</ion-label>\n                    <ion-input [(ngModel)]="newFilename"></ion-input>\n                    <button ion-button outline item-end icon-left (click)="udpipe(text)">اذهب</button>\n                </ion-item>\n            </ion-card>\n        </ion-row>\n        <ion-row ng2FileDrop (fileOver)="fileOverBase($event)" [uploader]="uploader" [ngClass]="{\'nv-file-over\': hasBaseDropZoneOver}">\n            <ion-card>\n                <ion-card-header>\n                    رفع الملفات\n                </ion-card-header>\n                <!--                 <table class="table">\n                    <thead>\n                        <tr>\n                            <th width="50%">Name</th>\n                            <th>Size</th>\n                            <th>Progress</th>\n                            <th>Status</th>\n                            <th>Actions</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n -->\n                <ion-list>\n                  <ion-item-divider>\n                    قائمة الملفات\n                  </ion-item-divider>\n\n                    <ion-item *ngFor="let item of uploader.queue">\n                        <ion-avatar item-start>\n                            <span *ngIf="item.isSuccess"><ion-icon name="cloud-done"></ion-icon></span>\n                            <span *ngIf="item.isCancel"><ion-icon name="trash"></ion-icon></span>\n                            <span *ngIf="item.isError"><ion-icon name="alert"></ion-icon></span> 1\n                        </ion-avatar>\n                        <h2>{{ item?.file?.name }}</h2>\n                        <p *ngIf="uploader.isHTML5">{{ item?.file?.size/1024/1024 | number:\'.2\' }} MB</p>\n                        <div *ngIf="uploader.isHTML5">\n                            <div class="progress" style="margin-bottom: 0;">\n                                <div class="progress-bar" role="progressbar" [ngStyle]="{ \'width\': item.progress + \'%\' }"></div>\n                            </div>\n                        </div>\n                        <ion-row>\n                            <ion-col>\n                                <button ion-button icon-left clear small (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">\n                                    <ion-icon name="cloud-upload"></ion-icon>\n                                    <div>Upload</div>\n                                </button>\n                                <button ion-button icon-left clear small (click)="item.cancel()" [disabled]="!item.isUploading">\n                                    <ion-icon name="undo"></ion-icon>\n                                    <div>Cancel</div>\n                                </button>\n                                <button ion-button icon-left clear small (click)="item.remove()">\n                                    <ion-icon name="trash"></ion-icon>\n                                    <div>Remove</div>\n                                </button>\n                            </ion-col>\n                        </ion-row>\n                    </ion-item>\n                </ion-list>\n                  <ion-item-divider>\n                    رفع ملف/ملفات جديدة\n                  </ion-item-divider>\n                    <button ion-button (click)="uploadbutton.click()" icon-only >\n                        <ion-icon name="cloud-upload"></ion-icon>\n                        <input #uploadbutton type="file" ng2FileSelect [uploader]="uploader" multiple style="display: none" />\n                    </button>\n\n            </ion-card>\n        </ion-row>\n        <ion-row>\n            <ion-card>\n                <ion-card-header>\n                    Configuration File\n                </ion-card-header>\n                <ion-card-content>\n                    <div [hidden]="!configErrors" class="configErrors">{{configErrors}}</div>\n                    <ion-textarea rows="15" [(ngModel)]="config"></ion-textarea>\n                    <button ion-button item-end (click)="saveConfig(i)">حفظ</button>\n                </ion-card-content>\n            </ion-card>\n        </ion-row>\n    </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/docs/docs.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__providers_conllu_service__["a" /* ConlluService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Config */],
        __WEBPACK_IMPORTED_MODULE_6__providers_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
], DocsPage);

//# sourceMappingURL=docs.js.map

/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_project_service__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__docs_docs__ = __webpack_require__(104);
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
        });
    };
    ProjectsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProjectPage');
    };
    return ProjectsPage;
}());
ProjectsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-projects',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/'<!--\n  Generated template for the ProjectsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>المشاريع</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding rtl>\n   <ion-card *ngIf="!validSecurity">\n   <ion-card-header>تسجيل الدخول كمدير</ion-card-header>\n   <ion-card-content>\n     <ion-item>\n      <ion-label fixed>رمز الدخول</ion-label>\n      <ion-input type="password" [(ngModel)]="security"></ion-input>\n      </ion-item>\n        <button ion-button (click)="securityChanged()">الدخول</button>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card *ngIf="validSecurity">\n  <ion-item-divider>\n    المشرايع الحالية\n  </ion-item-divider>\n  	<ion-list>\n    	<ion-item *ngFor="let p of projects">\n    		{{p.project}}\n    		<button ion-button outline item-end icon-left (click)="goto(p)">اذهب</button>\n    		<button ion-button outline item-end icon-left (click)="remove(p)">احذف</button>\n    	</ion-item>\n  	</ion-list>\n	<ion-item *ngIf=\'projects.length === 0\'>لا يوجد أي مشروع</ion-item>\n  <ion-item-divider>\n    مشروع جديد\n  </ion-item-divider>\n	<ion-item >\n	    <ion-label fixed>اسم المشروع</ion-label>\n	    <ion-input type="text" [(ngModel)]="new_project"></ion-input>\n		<button ion-button outline item-end icon-left (click)="create()">إنشاء</button>\n	</ion-item>\n  </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/pages/projects/projects.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_project_service__["a" /* ProjectService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
], ProjectsPage);

//# sourceMappingURL=projects.js.map

/***/ }),

/***/ 116:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 116;

/***/ }),

/***/ 158:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 158;

/***/ }),

/***/ 202:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_annotate_conllu__ = __webpack_require__(203);
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
        return new Promise(function (resolve) {
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
                var parsed = doc.parse(data.rs.join("\n"), function (x) {
                    return console.warn("parsing Conllu error", x);
                }, true);
                // console.log(parsed) 
                // data = data;
                var result = [];
                parsed.sentences[0].elements
                    .forEach(function (e) {
                    if (e.parent)
                        return;
                    var wid = e.children.length > 0 ? e.children[0].miscs["WID"] : e.miscs["WID"];
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

/***/ 203:
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
var ConlluDocument = (function () {
    function ConlluDocument(config, events) {
        if (events === void 0) { events = null; }
        this.events = events;
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
            for (var idx = 0; idx < lines.length; idx++) {
                var line = lines[idx], that = this;
                var logLineError = function (message) {
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
                    continue;
                }
                // non-comment, assume inside sentence until terminated by
                // blank line
                beforeConlluSentence = false;
                var fields = splitter(line);
                if (fields.length === 0) {
                    // empty line, terminates sentence
                    if (currentSentence.elements.length !== 0) {
                        currentSentence.refix();
                        this.sentences.push(currentSentence);
                        var sId = 'S' + (this.sentences.length + 1);
                        currentSentence = new ConlluSentence(sId, [], [], this); //, currentSentence.elements, currentSentence.comments);
                        // this.sentences.push(sentence);
                    }
                    else {
                        logLineError('empty sentence, ignoring');
                    }
                    // reset
                    // elements = [];
                    // comments = [];
                    beforeConlluSentence = true;
                    continue;
                }
                if (fields.length !== 10) {
                    logLineError('expected 10 fields, got ' + fields.length);
                    Util.repairFields(fields, this.logger);
                }
                var element = new ConlluElement(fields, idx, line, currentSentence);
                var issues = element.validate();
                for (var j = 0; j < issues.length; j++) {
                    logLineError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!element.repair(this.logger)) {
                        logLineError('repair failed, discarding line');
                        continue; // failed, ignore line
                    }
                }
                currentSentence.elements.push(element);
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
        console.error("tag is not mapped to Xpostag: ", from);
        return from;
    };
    ConlluDocument.prototype.mapTagToUpostag = function (from, from_ud) {
        var f = this.config.alltags.find(function (x) { return x.tag == from; });
        if (f)
            return f.mapToConllU;
        console.error("tag is not mapped to Upostag: ", from);
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
                var reference = wildcards[i][0], key = wildcards[i][1], value = wildcards[i][2];
                if (reference === 'nodes') {
                    var words = this.words(includeEmpty);
                    for (var j = 0; j < words.length; j++) {
                        var r = this.id + '-T' + words[j].id;
                        if (!setStyle[r.concat(key)]) {
                            styles.push([r, key, value]);
                            setStyle[r.concat(key)] = true;
                        }
                    }
                }
                else if (reference === 'arcs') {
                    var deps = this.dependencies();
                    for (var j = 0; j < deps.length; j++) {
                        var rr = [this.id + '-T' + deps[j][1],
                            this.id + '-T' + deps[j][0],
                            deps[j][2]];
                        if (!setStyle[rr.concat([key]).join("")]) {
                            styles.push([rr, key, value]);
                            setStyle[rr.concat([key]).join("")] = true;
                        }
                    }
                }
                else {
                    console.error('internal error');
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
                        console.error('internal error: repairReferences(): ' +
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
    ConlluSentence.prototype.refix = function () {
        var from, to;
        var parent;
        this.elements = this.elements.map(function (e) {
            // if (e.upostag == "_") {
            if (e.isMultiword()) {
                from = parseInt(e.id.split("-")[0]);
                to = parseInt(e.id.split("-")[1]);
                e.isSeg = -(to - from) - 1;
                parent = e;
                parent.children.length = 0;
                return e;
            }
            else if (parseInt(e.id) >= from && parseInt(e.id) <= to) {
                e.isSeg = parseInt(e.id) - from;
                e.parent = parent;
                parent.children.push(e);
            }
            return e;
        });
    };
    ConlluSentence.prototype.reorder = function () {
        var from, to;
        var parent;
        var counter = 1;
        var range = 0;
        this.elements = this.elements.map(function (e) {
            if (e.isMultiword()) {
                from = parseInt(e.id.split("-")[0]);
                to = parseInt(e.id.split("-")[1]);
                range = to - from;
                e.id = counter + "-" + (counter + range);
                return e;
            }
            else {
                e.id = "" + counter++;
                return e;
            }
        });
        this.refix();
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
        this.miscs = {};
        this.lineidx = "";
        this.line = "";
        this.isSeg = -1;
        this.parent = null;
        this.children = [];
        this.features = [];
        this.sentence = null;
        this.setFeature = function (key, value) {
            var i = this.features.findIndex(function (x) { return x.key == key; });
            if (i >= 0)
                if (value)
                    this.features[i].value = value;
                else
                    this.features.splice(i, 1);
            else
                this.features.push({ key: key, value: value });
        };
        this.copyme = function (from, to) {
        };
        this.morphFeatsMissing = function () {
            var _this = this;
            var config = this.sentence.document.config.alltags.find(function (x) { return x.tag == _this.xpostag; });
            if (!config) {
                // console.error("tag was not found!", this.xpostag)
                return [];
            }
            else if (!config.mf) {
                console.error("tag has no list of possible morph feats!", this.xpostag, config);
                return [];
            }
            else
                return config.mf.filter(function (x) { return !_this.features.find(function (y) { return y.key == x; }); });
        };
        this.changeWith = function (el) {
            var _this = this;
            if (el.parent) {
                console.error("ERROR: changeWith cannot be used with a child element");
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
                    e.miscs["FROM_MA"] = true;
                });
                if (this.sentence.document.events) {
                    this.sentence.document.events.publish('highligh:change', c[1]);
                    this.sentence.document.events.publish("stats", { action: "changeWith", elements: c });
                }
                Array.prototype.splice.apply(this.sentence.elements, [i, 1 + this.children.length].concat(c));
            }
            else {
                var c = el.clone();
                c.analysis = this.analysis;
                c.sentence = this.sentence;
                c.miscs["FROM_MA"] = true;
                this.sentence.elements.splice(i, 1 + this.children.length, c);
                if (this.sentence.document.events) {
                    this.sentence.document.events.publish('highligh:change', c);
                    this.sentence.document.events.publish("stats", { action: "changeWith", element: c });
                }
            }
            this.sentence.reorder();
            // console.log(this.sentence.elements)
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
                    console.error('internal error');
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
                    console.error('internal error');
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
                    var m = value.match(Util.featureValueRegex);
                    if (!m) {
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
                        console.error('internal error: dependencies(): invalid DEPS', this.deps);
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
                log('repair: blanking invalid FEATS');
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
        this.xpostag = fields[4];
        this.feats = fields[5];
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
            if (this.isMultiword()) {
                this._xpostag = "_";
                return;
            }
            this._xpostag = this.sentence.document.mapTagToXpostag(argv);
            this.upostag = this.sentence.document.mapTagToUpostag(this._xpostag, this.upostag);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConlluElement.prototype, "misc", {
        get: function () {
            var _this = this;
            return Object.keys(this.miscs).map(function (key) {
                return _this.miscs[key] ? key + "=" + _this.miscs[key] : undefined;
            }).filter(function (x) { return x != undefined; }).sort().join("|") || "_";
        },
        set: function (args) {
            var _this = this;
            this.miscs = {};
            if (args == undefined)
                return;
            if (args == "_")
                return;
            args.split("|").forEach(function (text) {
                var arr = text.split("=");
                _this.miscs[arr[0]] = arr[1];
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
                    var m = value.match(Util.featureValueRegex);
                    if (!m) {
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
    return ConlluElement;
}());

var Util = (function () {
    function Util() {
    }
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
Util.featureRegex = /^([A-Z0-9][a-zA-Z0-9]*(?:\[[a-z0-9]+\])?)=([A-Z0-9][a-zA-Z0-9]*(?:,[A-Z0-9][a-zA-Z0-9]*)*)$/;
// match single feature value in FEATS
Util.featureValueRegex = /^[A-Z0-9][a-zA-Z0-9]*$/;
// match single (head, deprel) pair in DEPS
Util.dependencyRegex = /^(\d+(?:\.\d+)?):(.*)$/;
//# sourceMappingURL=conllu.js.map

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectizePopoverPageComponent; });
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


var SelectizePopoverPageComponent = (function () {
    function SelectizePopoverPageComponent(navParams, 
        // public data: Data,
        viewCtrl) {
        var _this = this;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.element = null;
        this.config = { mf: {}, "MF.vs.POS": {} };
        this.myconfig = {};
        this.options = [];
        this.selectize_config = function () {
            var that = this;
            if (this.options.length == 0)
                this.options.push({
                    value: "UNK",
                    title: "UNK",
                    feature: "UNK",
                    val: "UNK",
                    custom_selectize_class: "UNK",
                });
            return {
                maxItems: null,
                valueField: 'value',
                labelField: 'value',
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
                        _this.addItem(x.key + "=" + x.value);
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
                    Object.keys(this.options).filter(function (x) { return _this.options[x].feature == value.split("=")[0] && x != value; }).forEach(function (x) { return _this.removeOption(x); });
                    that.element.setFeature(value.split("=")[0], value.split("=")[1]);
                    this.refreshOptions();
                },
                onItemRemove: function (value, $item) {
                    var _this = this;
                    var x = value.split("=")[0];
                    that.config.mf[value.split("=")[0]].map(function (i) { return new Object({
                        value: x + "=" + i,
                        title: x + "=" + i,
                        feature: x,
                        val: i,
                        custom_selectize_class: x,
                    }); })
                        .forEach(function (x) { return _this.addOption(x); });
                    that.element.setFeature(value.split("=")[0], null);
                    this.refreshOptions();
                },
                create: false
            };
        };
        this.element = navParams.data.element;
        this.config = navParams.data.config;
        this.options = [].concat.apply([], Object.keys(this.config.mf)
            .filter(function (x) { return _this.config["MF.vs.POS"][x]
            .indexOf(_this.config["MF.vs.POS_upostag"] ? _this.element.upostag : _this.element.xpostag) >= 0; })
            .map(function (x) { return _this.config.mf[x]
            .map(function (i) { return new Object({
            value: x + "=" + i,
            title: x + "=" + i,
            feature: x,
            val: i,
            custom_selectize_class: x,
        }); }); }));
        this.myconfig = this.selectize_config();
        console.log(this.myconfig);
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
        selector: 'selectize-popover-page',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/selectize-popover-page/selectize-popover-page.html"*/'<div style=\'height: 50vh;\'>\n	<ng-selectize #myselectize [config]="myconfig"></ng-selectize>\n</div>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/selectize-popover-page/selectize-popover-page.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
], SelectizePopoverPageComponent);

//# sourceMappingURL=selectize-popover-page.js.map

/***/ }),

/***/ 205:
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
        viewCtrl) {
        this.navParams = navParams;
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
                        return '<div>' +
                            '<div class="title">' +
                            '<span class="counter">' + escape(item.counter) + '</span>' +
                            '<span class="by">' + escape(item.lemma) + '</span>' +
                            '</div>' +
                            '<ul class="elements">' +
                            item.elements.map(function (e) {
                                return "<li><div class='element'><div class='form'>" + e.form + "</div><div class='pos'>" + e.xpostag + "</div><div class='morphfeats'>" +
                                    e.features.map(function (e) { return "<span class='morphfeat " + e.key + "'>" + e.value + "</span>"; }) + "</div></div></li>";
                            }).join("")
                            + '</ul>' +
                            '</div>';
                    }
                },
                // optgroupValueField: 'id',
                // optgroupLabelField: 'name',
                // optgroupField: 'feature',
                // lockOptgroupOrder: true,
                // hideSelected: true,
                // closeAfterSelect: false,
                openOnFocus: true,
                onItemAdd: function (value, $item) {
                    var el = that.element.analysis.find(function (val) {
                        return value == val.id;
                    });
                    that.element.changeWith(el);
                    that.viewCtrl.dismiss();
                },
                create: false
            };
        };
        this.config = navParams.data.config;
        this.element = navParams.data.element;
        console.log(this.element.analysis);
        if (this.element.analysis)
            this.options = this.element.analysis
                .map(function (e, i) { return new Object({
                value: e.id,
                counter: i,
                title: i + ":" + e.lemma,
                // score: e.miscs["SCORE"],
                lemma: (e.children.length > 0 ? e.children.map(function (ee) { return ee.lemma; }).join("") : e.lemma),
                elements: (e.children.length > 0 ? e.children : [e]),
                forsearch: (e.children.length > 0 ? e.children : [e]).map(function (e) { return e.form + " " + e.xpostag + " " + e.upostag; }).join(" "),
                o: e,
            }); });
        else
            this.options = [];
        this.myconfig = this.selectize_config();
    }
    MASelectizePopoverPageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // this.myselectize.selectize.focus()
        setTimeout(function () {
            _this.myselectize.selectize.focus();
            _this.myselectize.selectize.okayToClose = true;
        }, 500);
    };
    return MASelectizePopoverPageComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myselectize'),
    __metadata("design:type", Object)
], MASelectizePopoverPageComponent.prototype, "myselectize", void 0);
MASelectizePopoverPageComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'ma-selectize-popover-page',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/ma-selectize-popover-page/ma-selectize-popover-page.html"*/'<div style=\'height: 50vh;\'>\n	<button ion-button (click)="viewCtrl.dismiss()"><ion-icon name="close"></ion-icon></button>\n	<ng-selectize #myselectize [config]="myconfig"></ng-selectize>\n</div>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/ma-selectize-popover-page/ma-selectize-popover-page.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
], MASelectizePopoverPageComponent);

//# sourceMappingURL=ma-selectize-popover-page.js.map

/***/ }),

/***/ 206:
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
        selector: 'tags-selector',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/'<button color="secondary" ion-button *ngFor="let tag of currentTags;" class="tag" title="{{tag.desc}}" (click)="selectTag(tag)">\n  {{tag.tag}}\n  <ion-badge >{{tag.fn}}</ion-badge>\n</button>\n\n<button ion-button color="secondary" class="tag" title="Press 0 for more tags" (click)="increaseTagsRow()">\n  More\n  <span class="fn">0</span>\n</button>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/tags-selector/tags-selector.html"*/,
        inputs: ['config']
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
], TagsSelectorComponent);

//# sourceMappingURL=tags-selector.js.map

/***/ }),

/***/ 207:
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
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.shortcuts = [["⌘ + S", "Convert to Conll then Save"],
            ["⌘ + ⇧ + S", "Convert to Conll"],
            ["Q, W, E, R, A, S, W, X", "Add a diactric"],
            ["⇦,⇨", "Move next/prev Word"],
            ["⇦,⇨", "Move next/prev Word"],
            ["⌘ + U", "Undo last action"],
            ["+/-", "Add a new segment to the current word/Delete current segment"],
            ["1-9", "Assign current segment a new tag"],
            ["0", "Show more less-frequent tags"],];
    }
    return HelpPopoverComponent;
}());
HelpPopoverComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'help-popover',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/'  <ion-card>\n  <ion-card-header>\n    Keyboard Shortcuts\n  </ion-card-header>\n      <ion-item *ngFor="let sh of shortcuts">\n        <h2><button ion-button outline item-right icon-left>\n          {{sh[0]}}\n        </button></h2>\n        <p>{{sh[1]}}</p>\n      </ion-item>\n      \n      </ion-card>\n'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/help-popover/help-popover.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
], HelpPopoverComponent);

//# sourceMappingURL=help-popover.js.map

/***/ }),

/***/ 212:
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
        console.log('Hello WordService Provider');
    }
    ProjectService.prototype.getList = function (security) {
        var _this = this;
        if (this.list.ok) {
            return Promise.resolve(this.list);
        }
        var that = this;
        // don't have the data yet
        return new Promise(function (resolve) {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_word_service__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_conllu_service__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_config_service__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_guidelines_service__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_project_service__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_tags_selector_tags_selector__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_guider_guider__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_help_popover_help_popover__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_docs_docs__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pipes_not_multi_tag__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__angular_http__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_storage__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_ng_selectize__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_ng2_file_upload__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__config__ = __webpack_require__(299);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// import { Data } from './data';












// import { HighlightComponent } from '../components/highlight/highlight';










// import { Storage } from '@ionic/storage';
// let storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__hadiths' })// optional config);
// export function provideData() {
//   return new Data(storage)// optional config);
// }
// export function provideStorage() {
// return storage;
// }
var deepLinkConfig = {
    links: [
        // { component: AnnotatePage, name: 'Annotate Page', segment: '',defaultHistory: [ ] },
        { component: __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */], name: 'Annotate Page', segment: 'annotate/:project/:hash/:id', defaultHistory: [__WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__["a" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_16__pages_docs_docs__["a" /* DocsPage */], name: 'Documents Page', segment: 'docs/:project/:hash', defaultHistory: [__WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__["a" /* ProjectsPage */]] },
        { component: __WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__["a" /* ProjectsPage */], name: 'Projects Page', segment: 'projects', defaultHistory: [] }
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
            __WEBPACK_IMPORTED_MODULE_18__pipes_not_multi_tag__["a" /* NotMultiTag */],
            __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__["a" /* GetFormPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_12__components_tags_selector_tags_selector__["a" /* TagsSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_16__pages_docs_docs__["a" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__["a" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_24_ng2_file_upload__["FileSelectDirective"],
            __WEBPACK_IMPORTED_MODULE_24_ng2_file_upload__["FileDropDirective"],
            __WEBPACK_IMPORTED_MODULE_14__components_guider_guider__["a" /* GuiderComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_19__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_23_ng_selectize__["a" /* NgSelectizeModule */],
            __WEBPACK_IMPORTED_MODULE_20__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], __WEBPACK_IMPORTED_MODULE_25__config__["a" /* myconfig */], deepLinkConfig)
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_16__pages_docs_docs__["a" /* DocsPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_projects_projects__["a" /* ProjectsPage */],
            __WEBPACK_IMPORTED_MODULE_13__components_get_form_popover_get_form_popover__["a" /* GetFormPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_10__components_selectize_popover_page_selectize_popover_page__["a" /* SelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_11__components_ma_selectize_popover_page_ma_selectize_popover_page__["a" /* MASelectizePopoverPageComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_help_popover_help_popover__["a" /* HelpPopoverComponent */],
            __WEBPACK_IMPORTED_MODULE_9__pages_annotate_annotate__["a" /* AnnotatePage */]
        ],
        providers: [
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] },
            // Data,
            __WEBPACK_IMPORTED_MODULE_21__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_22__ionic_native_splash_screen__["a" /* SplashScreen */],
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

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_annotate_annotate__ = __webpack_require__(101);
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
var MyApp = (function () {
    function MyApp(platform, 
        // public data: Data, 
        _config, statusbar, splashscreen) {
        this.platform = platform;
        this._config = _config;
        this.statusbar = statusbar;
        this.splashscreen = splashscreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_annotate_annotate__["a" /* AnnotatePage */];
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
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
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
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
        // this.guidelinesService.load(this.project,this.hash).then(x=>{
        this.guidelinesService.load("hadiths", "d14274111536eed778f6b8a648115aa8").then(function (x) {
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
    GuiderComponent.prototype.ngOnChanges = function (changes) {
        this.options = this.guidelinesService.get(this.type, this.element).options;
        if (this.show())
            this.events.publish("stats", { action: "showGuider", elements: this.element });
    };
    return GuiderComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
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
GuiderComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'guider',template:/*ion-inline-start:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/'<ion-card *ngIf="show()">\n        <ion-card-header>\n          {{element}}\n        </ion-card-header>\n\n        <ion-card-content >\n            <div *ngFor="let e of this.options" >\n                <button ion-button (click)="toggle(e)">\n                  {{e.value}}  \n                  <ion-badge color="secondary" item-end>{{e.percentage}}</ion-badge>\n                </button>\n\n              <div *ngIf="e.showDetails">\n                <div *ngFor="let ex of e.examples">{{ex}}</div>\n              </div>\n              </div>\n        </ion-card-content>\n\n    </ion-card>'/*ion-inline-end:"/Users/abbander/Leeds/Wasim/src/components/guider/guider.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_guidelines_service__["a" /* GuidelinesService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
], GuiderComponent);

//# sourceMappingURL=guider.js.map

/***/ }),

/***/ 292:
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

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return myconfig; });
var myconfig = {
    server: "http://localhost:7878/",
    // udpipe: "http://localhost:1441/",
    locationStrategy: 'hash',
};
//# sourceMappingURL=config.js.map

/***/ })

},[216]);
//# sourceMappingURL=main.js.map