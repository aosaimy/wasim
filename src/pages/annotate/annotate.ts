import { ChangeDetectionStrategy, Renderer, Component, Output, ChangeDetectorRef, Input, ViewChild, EventEmitter } from '@angular/core';
import { Events, ToastController, RadioGroup, AlertController, PopoverController, ViewController, NavController, NavParams } from 'ionic-angular';
import {
  FormControl,
} from '@angular/forms';

import { Http } from '@angular/http';
import { WordService } from '../../providers/word-service';
import { ConlluService } from '../../providers/conllu-service';
import { ConfigService } from '../../providers/config-service';
import { GuidelinesService } from '../../providers/guidelines-service';
import { SelectizePopoverPageComponent } from '../../components/selectize-popover-page/selectize-popover-page';
import { MASelectizePopoverPageComponent } from '../../components/ma-selectize-popover-page/ma-selectize-popover-page';
import { TagsSelectorComponent } from '../../components/tags-selector/tags-selector';
// import { HighlightComponent } from '../../components/highlight/highlight';
import { GetFormPopoverComponent } from '../../components/get-form-popover/get-form-popover';
import { GuiderComponent } from '../../components/guider/guider';
import { HelpPopoverComponent } from '../../components/help-popover/help-popover';
import { DocsPage } from '../docs/docs';
import { ProjectsPage } from '../projects/projects';
import { ConlluDocument, ConlluSentence, ConlluElement } from './conllu';
import 'rxjs/add/operator/map'

/*
  Generated class for the Annotate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-annotate',
  templateUrl: 'annotate.html',

  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotatePage {

  /*
  Tags bar
  */
  @Output() public myEventEmitted: EventEmitter<any> = new EventEmitter();
  tagsRow = 0;
  config = null
  // sentenceTags: { tag: string, desc: string, fn: number }[] = null

  @ViewChild('lemma') lemmaGroup: RadioGroup;

  // conllu : ConllU = new ConllU().Document();
  log = "";
  doc= null;
  documentJson = {}
  project = ""
  hash = ""
  pageid = ""
  isConlluHidden = false
  @ViewChild('myTags') myTags: TagsSelectorComponent;

  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    public navParams: NavParams,
    // public data: Data,
    public http: Http,
    private cdr: ChangeDetectorRef,
    private renderer:Renderer,
    public events: Events,
    private wordservice: WordService,
    private conlluService: ConlluService,
    private configService: ConfigService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    if (!navParams.data.project){
      //TODO change
      navCtrl.setRoot(ProjectsPage)
    }
    else{
      this.project = navParams.data.project;
      this.hash = navParams.data.hash;
      navCtrl.insert(1,DocsPage,{
        project : this.project,
        hash : this.hash
      })
    }
    if (!navParams.data.id && navCtrl.length() >1){
      navCtrl.pop();
    }
    else{
      this.pageid = navParams.data.id;
    }

    this.configService.load(this.project, this.hash).then(s=>{
      this.config = this.configService.getConfig(this.project)
      this.doc = new ConlluDocument(this.config,this.events)
    }).catch(s=>{
      this.config = this.configService.getConfig(this.project)
      this.undoArr = new Array(this.config.undoSize || 5)
      this.toastCtrl.create({
          message: 'Config loading Error: ' + s.error,
          duration: 3000,
          position: "top"
        }).present()
    })

    this.conlluService.load(this.project, this.hash, this.pageid).then(s => {
      this.conlluRaw = s.trim();
      this.onConlluRawChanged(null);
    }).catch(x=>{
      this.toastCtrl.create({
          message: 'Conllu File loading Error: ' + x,
          duration: 3000,
          position: "top"
        }).present()
    });
  }
  logme(x){console.log(x)}
  ngOnInit() {
    // this.config = this.configService.getConfig(this.project)
    // console.log('ngAfterViewInit AnnotatePage');
    // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
    // this.jump(12)
  }
  getForm(elem) {
    // console.log(elem)
    if (!elem.parent)
      return elem.form

    var prev = elem.parent.children[elem.isSeg - 1]
    if (prev) {
      prev = prev.form.replace(/[ًٌٍَُِّْ]*$/, "")
      prev = prev.charAt(prev.length - 1)
    }
    var next = elem.parent.children[elem.isSeg + 1]
    if (next)
      next = next.form.charAt(0)
    var meLast = elem.form.replace(/[ًٌٍَُِّْ]*$/, "")
    meLast = meLast.charAt(meLast.length - 1)
    var meFirst = elem.form.charAt(0)

    if (-elem.parent.isSeg == elem.isSeg + 1)
      return (this.isTatweel(prev, meFirst) ? "ـ" : "") + elem.form
    else if (elem.isSeg == 0)
      return elem.form + (this.isTatweel(meLast, next) ? "ـ" : "")
    else
      return (this.isTatweel(prev, meFirst) ? "ـ" : "") +
        elem.form
        + (this.isTatweel(meLast, next) ? "ـ" : "")
  }
  isTatweel(first, second) {
    if (!first || !second)
      return false
    if (first == "ـ" && second == "ـ")
      return false
    if ("دذاءؤرىةإأآو_".indexOf(first) >= 0)
      return false
    else if ("ء_".indexOf(second) >= 0)
      return false
    else {
      return true
    }
  }
  preventKeyboard = false
  presentGetFormPopover() {
    var popover = this.popoverCtrl.create(MASelectizePopoverPageComponent, {
      element: this.highlight.element.parent || this.highlight.element,
      config: this.config
    },{cssClass:"selectizePopover"});
    this.preventKeyboard = true
    popover.present({
    });
    popover.onDidDismiss(()=>{
      this.preventKeyboard = false
      this.saveForUndo()
    })
  }
  showAlertMessage = false;
  ionViewCanLeave() {
    if(this.showAlertMessage) {
        let alertPopup = this.alertCtrl.create({
            title: 'Exit',
            message: 'Changes are not saved. Are you sure?',
            buttons: [{
                    text: 'Exit',
                    handler: () => {
                      this.showAlertMessage = false;
                      this.navCtrl.pop();
                    }
                },
                {
                    text: 'Stay',
                    handler: () => {
                        // need to do something if the user stays?
                    }
                }]
        });

        // Show the alert
        alertPopup.present();

        // Return false to avoid the page to be popped up
        return false;
    }
}


  presentSelectizeFormPopover() {

    var popover = this.popoverCtrl.create(SelectizePopoverPageComponent, {
      element: this.highlight.element,
      config: this.config
    },{cssClass:"selectizePopover"})//,enableBackdropDismiss:false});

    this.preventKeyboard = true
    popover.present({
    });
    popover.onDidDismiss(x=>{
      this.preventKeyboard = false
      this.saveForUndo()
    })
  }

  presentHelpFormPopover() {

    var popover = this.popoverCtrl.create(HelpPopoverComponent, {
    });

    popover.present({
    });
  }
  mouseClick(e) {
    this.events.publish("stats",{action:"mouse",element:e})
  }
  keyboardShortcuts(e) {
    var highlighNode : any = document.querySelector(".highlight")
    if (e.target != document.querySelector("body") && e.target.parentNode.parentNode != highlighNode.parentNode.parentNode){
      if(e.code == "Escape"){
        this.events.publish("stats",{action:"keyboard",event:e})
        this.renderer.invokeElementMethod(highlighNode, 'focus', []);
      }
      return
    }

    if (this.preventKeyboard)
      return
    if(!this.config)
      return false
    var action = this.config.keyboardShortcuts
      .filter(v=>{
        return (v.code == e.code) &&
               // (v.key!=undefined && v.key == e.key) &&
               ((v.metaKey==true) == e.metaKey) &&
               ((v.shiftKey==true) == e.shiftKey) &&
               ((v.altKey==true) == e.altKey) &&
               ((v.ctrlKey==true) == e.ctrlKey) &&
               true
      })
    if(action.length == 1){
      this.events.publish("stats",{action:"keyboard",event:e, code:action})
      this.doAction(action[0].action, action[0].params,e)
    }
    else
      this.events.publish("stats",{action:"keyboard",event:e})
  }
  tag_morphofeatures(e=null){
        this.showAlertMessage = true;
        this.events.publish("stats",{action:"tag_morphofeatures",element:this.highlight.element})
        this.presentSelectizeFormPopover()
        if(e) e.preventDefault();
  }
  redo(e=null){
        var x = this.redoArr.pop()
        if(!x){
          console.warn("nothing to redo.")
          return false
        }
        this.undoArr.push(this.conlluRaw)
        this.conlluRaw = x;
        this.onConlluRawChanged(null)
        if(e) e.preventDefault();
  }
  undo(e=null){
         var x = this.undoArr.pop()
        if(!x){
          console.warn("nothing to undo.",x)
          return false
        }
        this.redoArr.push(this.conlluRaw)
        this.conlluRaw = x;
        this.onConlluRawChanged(null)
        if(e) e.preventDefault();
  }
  new_sentence(e=null){
            if (!this.highlight.element)
          return;
        this.showAlertMessage = true;
        var sindex = this.doc.sentences.indexOf(this.highlight.sentence)
        var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element)

        // check if last segment
        if (this.highlight.sentence.elements[eindex + 1]
          && this.highlight.element.parent != null
          && this.highlight.element.parent == this.highlight.sentence.elements[eindex + 1].parent)
          return;

        var before = this.highlight.sentence.elements.slice(0, eindex + 1)
        var after = this.highlight.sentence.elements.slice(eindex + 1)
        if (after.length == 0) {
          // do reverse. join with next sentence
          if (!this.doc.sentences[sindex + 1])
            return
          after = this.doc.sentences[sindex + 1].elements

          var counter = this.highlight.sentence.words(false).length + 1;
          after.forEach(e => {
            if (e.xpostag != "_")
              e.id = "" + counter++;
            else {
              var arr = e.id.split("-")
              e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
            }
          })
          this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
          this.doc.sentences.splice(sindex + 1, 1)
        }
        else {
          this.highlight.sentence.elements = before;
          var counter = 1;
          after.forEach(e => {
            if (e.xpostag != "_")
              e.id = "" + counter++;
            else {
              var arr = e.id.split("-")
              e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
            }
          })
          var sent = new ConlluSentence("new", after, [],this.doc)
          this.doc.sentences.splice(sindex + 1, 0, sent)
          // console.log(this.doc)
        }
        this.saveForUndo()
      }
  clone(e=null){
    if (!this.highlight.element)
          return
    var sindex = this.doc.sentences.indexOf(this.highlight.sentence)
    var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element)

    var el = this.highlight.element.clone()

    this.highlight.sentence.elements.splice(eindex + 1, 0, el)

    if (this.highlight.element.parent) {
      el.parent = this.highlight.element.parent
      var arr = this.highlight.element.parent.id.split("-")
      el.parent.id = arr[0] + "-" + (parseInt(arr[1]) + 1)
    }
    else {
      var parent = new ConlluElement([parseInt(this.highlight.element.id) + "-" + (parseInt(this.highlight.element.id) + 1), this.highlight.element.form,
        "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], this.highlight.element.lineidx, this.highlight.element.line,this.highlight.sentence)

      this.highlight.sentence.elements.splice(eindex, 0, parent)
      el.parent = parent;
      this.highlight.element.parent = parent
    }

    var counter = 1;
    this.highlight.sentence.elements.forEach(e => {
      if (e.xpostag != "_")
        e.id = "" + counter++;
      else {
        var arr = e.id.split("-")
        e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
      }
    })
    this.highlight.sentence.refix();
    this.saveForUndo()
  }
  mark_misc(key,e) {
            this.showAlertMessage = true;
        this.highlight.element.miscs[key] = ! this.highlight.element.miscs[key]
        this.saveForUndo()
  }
  delete(e) {
    if (!this.highlight.element)
          return;
    var sindex = this.doc.sentences.indexOf(this.highlight.sentence)
    var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element)

    //cannot delete whole word
    if (!this.highlight.element.parent)
      return
    this.highlight.sentence.elements.splice(eindex, 1)

    var parent = this.highlight.element.parent
    var arr = parent.id.split("-")

    //if it becomes one segment.. delete multiword line
    if (arr[0] == (parseInt(arr[1]) - 1) + "") {
      var mlindex = this.highlight.sentence.elements.indexOf(parent)
      this.highlight.sentence.elements.splice(mlindex, 1)
      this.highlight.element.parent = null
    }
    else
      parent.id = arr[0] + "-" + (parseInt(arr[1]) - 1)

    var counter = 1;
    this.highlight.sentence.elements.forEach(e => {
      if (e.xpostag != "_")
        e.id = "" + counter++;
      else {
        var arr = e.id.split("-")
        e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
      }
    })
    this.events.publish('highligh:change', this.highlight.sentence.elements[eindex]);
    // this.highlight.element = this.highlight.sentence.elements[eindex]
    this.saveForUndo()
   }

  tag_ma(e) {
      this.presentGetFormPopover();
      this.events.publish("stats",{action:"tag_ma",element:this.highlight.element})
      this.showAlertMessage = true;
  }
  doAction(action,params,e) {
    var that = this;
    var x;
    switch (action) {
      case "nav":
        if (!this.highlight.element)
          break;
        if(params[0]=="word_left")
          x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == parseInt(that.highlight.element.id) + 1)[0]
        else if(params[0]=="word_right")
          x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) - 1))[0]
        // else if(params[0]=="word_down")
        //   x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) + this.config.rowlength))[0]
        // else if(params[0]=="word_up")
        //   x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(that.highlight.element.id) - this.config.rowlength))[0]
        if (x) {
          this.events.publish('highligh:change', x);
          // this.highlight.element = x
        }
        else{
          var sindex = this.doc.sentences.indexOf(this.highlight.sentence)
          if(params[0]=="word_down")
            var y = this.doc.sentences[sindex + 1]
          else if(params[0]=="word_up")
            var y = this.doc.sentences[sindex - 1]

          if (y) {
            // this.highlight.sentence = y
            this.events.publish('highligh:change', y.elements.filter(x => !x.isMultiword())[0])
          }
        }
        setTimeout(() => {
          var sa: any = document.querySelector("#sentences")
          var ea: any = document.querySelector("#sentences .element.highlight")
          if(ea && sa)
            sa.scrollTop = ea.offsetTop - sa.offsetTop - 150
        }, 100)

        if(e)
          e.preventDefault();
        break;

      case "tag_morphofeatures":
        this.tag_morphofeatures(e)
        break

      case "undo":
        this.undo(e)
        break

      case "redo":
        this.redo(e)
        break

      case "new_sentence":
        this.new_sentence(e)
        break;

      case "tag_ma":
        this.tag_ma(e)
        break;

      case "diac":
        this.showAlertMessage = true;
        if (/[ًٌٍَُِْ]$/.test(this.highlight.element.form))
          this.highlight.element.form = this.highlight.element.form.replace(/[ًٌٍَُِّْ]+$/, "");
        if (/ّ[ًٌٍَُِّْ]$/.test(this.highlight.element.form))
          this.highlight.element.form = this.highlight.element.form.replace(/ّ[ًٌٍَُِّْ]+$/, "");

        this.highlight.element.form += params[0];
        this.saveForUndo()
        break;
      case "clone":
        this.clone(e)
        break
      case "mark_misc":
        this.mark_misc(params[0],e)
        break
      case "delete":
        this.delete(e)
        break

      case "assignXTag":
          var fn = this.myTags.getTags()[params[0] - 1]
          if (fn){
            this.highlight.element.xpostag = fn.tag;
            this.highlight.element.upostag = this.config.alltags.find(x=>x.tag==fn.tag).mapToConllU
          }
          this.saveForUndo()
          break

      case "showOtherUTags":
          this.myTags.increaseTagsRow()
          break;

      case "assignSentenceTag":
          var fn = this.config.sentenceTags[parseInt(params[0]) - 1]
          if(fn)
            this.highlight.sentence.tag = fn.tag
          this.saveForUndo()
          break;

      case "saveFile":
          this.saveFile(e)
          break;
      case "syncConllU":
          if(e) e.preventDefault();
          this.syncConllU(e)
          break;

      case "validateConllu":
          if(e) e.preventDefault();
          var that = this
          var doc = new ConlluDocument(this.config);
          doc.parse(this.doc.toConllU(),s=>that.log = that.log + s + '\n',true)
          break;

      default:
        // code...
        break;
    }


    this.jump(this.doc.getElementLine(this.highlight.element, this.highlight.sentence))
    // console.log(this.highlight.element)
  }

  saveFile(e=null){
    if(e) e.preventDefault();
    this.conlluRaw = this.doc.toConllU()
    this.conlluService.save(this.project, this.hash, this.pageid, this.conlluRaw).then(s => {
      this.toastCtrl.create({
        message: 'File was successfully saved',
        duration: 3000,
        position: "top"
      }).present()
      this.showAlertMessage = false;
    }).catch(reason => {
      this.toastCtrl.create({
        message: 'Error: ' + reason,
        duration: 3000,
        position: "top"
      }).present()
    })
  }
  syncConllU(e=null){
    this.conlluRaw = this.doc.toConllU()
    this.toastCtrl.create({
      message: 'Conll-U representation has been updated.',
      duration: 3000,
      position: "top"
    }).present()
  }

  undoArr = []
  redoArr = []
  saveForUndo(){
    if(!this.config.sync)
      return false
    this.undoArr.push(this.conlluRaw)
    this.conlluRaw = this.doc.toConllU()
    if(this.undoArr.length > this.config.undoSize)
      this.undoArr.shift()
  }
  onConlluRawChanged(e = null) {
    this.log = ""
    // console.log("Here",this.conlluRaw)
    var that = this

    if (e)
      this.conlluRaw = e.target.value

    this.doc.parse(this.conlluRaw, function(s) {
      that.log = that.log + s + '\n';
    }, false)//.toBrat(logger, true);

    this.highlight.sentence = this.doc.sentences[0]
    if (this.highlight.sentence){
      this.events.publish('highligh:change', this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0])
      // this.highlight.element = this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0]
    }

    if (e != "") { // only detectChanges when input value is changes
      // this.cdr.detectChanges();
    }
    this.askMA()
    // console.log(JSON.parse(JSON.stringify(this.doc)))
  }
  maResult = null
  askMA(){
    // console.log("asda")
    if(!this.maResult){
      this.maResult = new Array(this.doc.sentences.length)
      this.doc.sentences.forEach((s,i) =>
         this.wordservice.load(s.tokens().map(e => e.form).join(" "),this.config)
           .then((elements: ConlluElement[][]) => {
             this.maResult[i] = elements
             this.assignMA(s,i)
           }))
    }
    else
      this.doc.sentences.forEach((s,i) => this.assignMA(s,i))
  }
  assignMA(s,i){
      var counter = 1
      s.elements.forEach(e => {
        if(e.parent)
          return
        if(!this.maResult[i])
          console.error(i,this.maResult)
        e.analysis = this.maResult[i][counter]
        counter++;
      })
  }

  jump(line) {

    var ta = document.querySelector("#conlluTextArea textarea")
    //TODO: replace rows with a more realistic measure.
    //TODO: change color of current word
    var lineHeight = ta.clientHeight / parseInt(ta.getAttribute("rows"));
    var jump = (line - 1) * lineHeight;
    // console.log(ta)
    // console.log(jump,lineHeight, ta.clientHeight , ta.getAttribute("rows"))
    ta.scrollTop = jump;
  }

  highlight: Highlight = new Highlight(this.events);

  conlluRaw = `1-3 وعنها   _   _   _   _   _   _   _   _
1   وَ  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0
2   عَنها   عَن_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1
3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2
`
  stats = new Stats(this.events)
  showStats(){
    this.stats.print()
  }
}

export class Highlight {
  sentence: ConlluSentence = null
  element: ConlluElement = null

  constructor(public events:Events){
    this.events.subscribe("highligh:change", (element)=>{
        this.element = element
        this.sentence = element.sentence
    })
    this.events.subscribe("changeTag", (tag)=>{
        this.element.xpostag = tag.tag
        this.element.upostag = tag.mapToConllU

    })
  }
}

export class Stats {
  start : Date = new Date()
  // homographs :
  all = []
  constructor(public events:Events){

    this.events.subscribe("stats", (obj)=>{
      this.all.push(obj)
        // console.log(obj)
    })
  }
  print(){
    var cats = {}
    this.all.forEach(e=>cats[e.action]=cats[e.action]+1 || 1)
    console.log(cats)
    console.log(this.all)
    var cache = [];
    console.log(JSON.parse(JSON.stringify(this.all, function(key, value) {
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
    var d = new Date()
    console.log(this.start, d, Math.abs(d.getTime() - this.start.getTime()))
  }
}
