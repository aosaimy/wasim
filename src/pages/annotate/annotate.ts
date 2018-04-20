import { ChangeDetectionStrategy, Renderer, Component, Output, ChangeDetectorRef, Input, ViewChild, EventEmitter } from '@angular/core';
import { Directive, ElementRef } from "@angular/core";
import { Events, ToastController, RadioGroup, AlertController, LoadingController, PopoverController, ViewController, NavController, NavParams } from 'ionic-angular';
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
// import { SegmentorPopoverPageComponent } from '../../components/segmentor-popover-page/segmentor-popover-page';
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
  editable = false
  isConlluHidden = false
  copyElement = null
  @ViewChild('myTags') myTags: TagsSelectorComponent;

  highlight: Highlight = new Highlight(this.events);

  conlluRaw = `1-3 وعنها   _   _   _   _   _   _   _   _
1   وَ  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0
2   عَنها   عَن_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1
3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2
`
  conlluRawSpans : {sentid: number,elemid: string,elems: string[]}[] = this.getConlluRaw()
  stats = new Stats(this.events)

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
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    loading.present();

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

    // on highlight change, scroll the ConllU Raw view and the main words view to proper location
    this.events.subscribe("highlight:change", (element)=>{
        setTimeout(() => {
          let highlight_element : any = document.querySelector("pre > .highlight");
          if(highlight_element){
            document.querySelector("pre").scrollTo(0, highlight_element.offsetTop-100)
          }
        })

        setTimeout(() => {
          var sa: any = document.querySelector("#sentences")
          var ea: any = document.querySelector("#sentences .element.highlight")
          if(ea && sa)
            sa.scrollTop = ea.offsetTop - sa.offsetTop - 150
        }, 100)

    })

    if (!navParams.data.id && navCtrl.length() >1){
      navCtrl.pop();
    }
    else{
      this.pageid = navParams.data.id;
    }

    this.configService.load(this.project, this.hash).then(s=>{
      loading.dismiss();
      this.config = this.configService.getConfig(this.project)
      this.doc = new ConlluDocument(this.config)
    }).catch(s=>{
      this.config = this.configService.getConfig(this.project)
      this.undoArr = new Array(this.config.undoSize || 5)
      this.isConlluHidden = this.config.isConlluHidden || false
      this.toastCtrl.create({
          message: 'Config loading Error: ' + s.error,
          duration: 3000,
          position: "top"
        }).present()
      console.error('Config loading Error: ' + s.error)
    })

    this.conlluService.load(this.project, this.hash, this.pageid).then(s => {
      this.conlluRaw = s.trim();
      this.conlluRawSpans = this.getConlluRaw()
      this.onConlluRawChanged();
    }).catch(x=>{
      this.toastCtrl.create({
          message: 'Conllu File loading Error: ' + x,
          duration: 3000,
          position: "top"
        }).present()
      console.error('Conllu File loading Error: ' + x)
      console.trace(x)
    });
  }
  logme(x){console.log(x)}
  ngOnInit() {
    // this.config = this.configService.getConfig(this.project)
    // console.log('ngAfterViewInit AnnotatePage');
    // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
  }
  preventKeyboard = false
  presentGetFormPopover() {
    let el = this.highlight.element.parent || this.highlight.element
    if(el.analysis){
      var popover = this.popoverCtrl.create(MASelectizePopoverPageComponent, {
        element: el,
        config: this.config
      },{cssClass:"selectizePopover"})
      popover.present({});
      this.preventKeyboard = true
      popover.onDidDismiss(()=>{
        this.preventKeyboard = false
        this.saveForUndo()
      })
    }
    else{
     this.toastCtrl.create({
        message: 'No Analysis Found for this word: ' + el.form,
        duration: 3000,
        position: "top"
      }).present()
    }
  }
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
    let options = Object.keys(this.config.mf).filter(x=>this.config.MfVsPos[x].indexOf(this.config.MfVsPos_upostag ? this.highlight.element.upostag : this.highlight.element.xpostag) >= 0)
    if(options.length > 0 ){
      let popover = this.popoverCtrl.create(SelectizePopoverPageComponent, {
        element: this.highlight.element,
        config: this.config,
        options: options
      },{cssClass:"selectizePopover"})//,enableBackdropDismiss:false});

      this.preventKeyboard = true
      popover.present({
      });
      popover.onDidDismiss(x=>{
        this.preventKeyboard = false
        this.saveForUndo()
      })
    }
    else{
     this.toastCtrl.create({
        message: 'No morphological features is needed for this tag: ' + this.config.getXPosTag(this.highlight.element.xpostag).desc,
        duration: 3000,
        position: "top"
      }).present()
   }
  }

  presentHelpFormPopover() {

    var popover = this.popoverCtrl.create(HelpPopoverComponent, {
      config: this.config,
      project : this.project,
      hash : this.hash
    },{cssClass:"helpPopover"});

    popover.present({
    });
  }
  mouseClick(e) {
    this.events.publish("stats",{action:"mouse",element:e})
  }
  keyboardShortcuts(e) {
    var highlighNode : any = document.querySelector(".highlight")
    // console.log(e)
    if (e.target != document.querySelector("body")
      && e.target && e.target.className.indexOf("element") == -1
      // && e.target && e.target.parentNode && highlighNode && e.target.parentNode.parentNode != highlighNode.parentNode.parentNode
      ){
      if(e.code == "Escape"){
        this.events.publish("stats",{action:"keyboard",event:e})
        if(highlighNode)
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
        this.conlluRawSpans = this.getConlluRaw()
        this.onConlluRawChanged()
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
        this.conlluRawSpans = this.getConlluRaw()
        this.onConlluRawChanged()
        if(e) e.preventDefault();
  }
  copy(e=null){
        this.copyElement = this.highlight.element
  }
  paste(e=null){
      if(this.copyElement)
          this.highlight.element.copy(this.copyElement)
  }
  pasteMorphInfo(e=null){
      if(this.copyElement)
          this.highlight.element.copyMorphInfo(this.copyElement)
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
          && this.highlight.element.parent == this.highlight.sentence.elements[eindex + 1].parent){
          //TODO show warning
          return;
        }

        var before = this.highlight.sentence.elements.slice(0, eindex + 1)
        var after = this.highlight.sentence.elements.slice(eindex + 1)
        if (after.length == 0) {
          // do reverse. join with next sentence
          if (!this.doc.sentences[sindex + 1])
            return
          after = this.doc.sentences[sindex + 1].elements

          let counter = this.highlight.sentence.words(false).length + 1;
          after.forEach(e => {
            e.sentence = this.highlight.sentence
          })
          this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
          this.doc.sentences.splice(sindex + 1, 1)
          this.highlight.sentence.refix(true)
        }
        else {
          // sentence should be splitted
          this.highlight.sentence.elements = before;

          //re count the second sentence
          let counter = 1;
          after.forEach(e => {
            if (!e.isMultiword())
              e.id = "" + counter++;
            else {
              var arr = e.id.split("-")
              e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
            }
          })
          var sent = new ConlluSentence("new", after, [],this.doc)
          this.doc.sentences.splice(sindex + 1, 0, sent)
          this.doc.fixSentenceIds()
          // console.log(this.doc)
        }
        this.saveForUndo()
      }
  clone(e=null){
    if (!this.highlight.element)
          return
    //TODO FIX many things
    var eindex = this.highlight.sentence.elements.indexOf(this.highlight.element)

    var el = this.highlight.element.clone()

    this.highlight.sentence.elements.splice(eindex + 1, 0, el)

    if (this.highlight.element.parent) {
      el.parent = this.highlight.element.parent
      el.parent.children.push(el)
      var arr = this.highlight.element.parent.id.split("-")
      el.parent.id = arr[0] + "-" + (parseInt(arr[1]) + 1)
    }
    else {
      var parent = new ConlluElement([parseInt(this.highlight.element.id) + "-" + (parseInt(this.highlight.element.id) + 1), this.highlight.element.form,
        "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], this.highlight.element.lineidx, this.highlight.element.line,this.highlight.sentence)
      parent.analysis = this.highlight.element.analysis
      el.analysis = []
      this.highlight.sentence.elements.splice(eindex, 0, parent)
      el.parent = parent;
      el.parent.children = [el,this.highlight.element]
      this.highlight.element.parent = parent
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
    this.saveForUndo()
  }
  mark_misc(key,e) {
    this.showAlertMessage = true;
    this.highlight.element._miscs[key] = ! this.highlight.element._miscs[key]
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
      if (!e.isMultiword())
        e.id = "" + counter++;
      else {
        var arr = e.id.split("-")
        e.id = counter + "-" + (counter + parseInt(arr[1]) - parseInt(arr[0]))
      }
    })
    this.events.publish('highlight:change', this.highlight.sentence.elements[eindex]);
    // this.highlight.element = this.highlight.sentence.elements[eindex]
    this.saveForUndo()
   }

  tag_ma(e) {
      this.presentGetFormPopover();
      this.events.publish("stats",{action:"tag_ma",element:this.highlight.element})
      this.showAlertMessage = true;
  }
  segment(e=null) {
    this.editable = true
    this.preventKeyboard = false
  }
  blurFormEditor(ev,elem){
    // this.preventKeyboard = false
    // this.editable = false
    this.resize(ev)
  }
  resize(ev) {
    var int = 0.9;
    ev.target.style.width = ((ev.target.value.length+1) * int) + 'vw'
  }
  keyupFormEditor(ev,elem){
    this.resize(ev)
    if (ev.code == "Backspace") {
      if(ev.target.selectionStart == 0 && ev.target.value == elem.form){
        let cindex =elem.parent.children.indexOf(elem)
        if(cindex==0)
          return
        let eindex = elem.sentence.elements.indexOf(elem)
        elem.sentence.elements.splice(eindex,1)
        elem.parent.children.splice(cindex,1)
        elem.parent.children[cindex-1].form += elem.form
        elem.sentence.refix(true);
      }
    }
    else if (ev.code == "ArrowLeft") {
      if(ev.target.selectionStart == ev.target.value.length && ev.target.value == elem.form){
        console.log("here")
        this.nav("word_left")
      }
    }
    else if (ev.code == "Escape") {
      this.preventKeyboard = false
      this.editable = false
    }
    else if (ev.code == "ArrowRight") {
      if(ev.target.selectionStart == 0 && ev.target.value == elem.form){
        console.log("here")
        this.nav("word_right")
      }
    }
    else if (ev.code == "Enter") {
      if(ev.target.value == elem.form){
        // ev.target.blur()
        return
      }
      // delete the node
      if(ev.target.value == "" && elem.parent != null){
        let eindex = elem.sentence.elements.indexOf(elem)
        elem.sentence.elements.splice(eindex,1)
        let cindex =elem.parent.children.indexOf(elem)
        elem.parent.children.splice(cindex,1)
      }
      // not empty
      else{
        ev.target.value = ev.target.value.trim()
        let splits = ev.target.value.split(" ")
        if(splits.length == 1){
          elem.form = ev.target.value
          // ev.target.blur()
          return
        }

        splits.forEach((form,i)=>{
          var eindex = elem.sentence.elements.indexOf(elem)
          if(i==0){
            elem.form = form
            return
          }
          var el = elem.clone()
          el.form = form
          elem.sentence.elements.splice(eindex + i, 0, el)

          if (elem.parent) {
            el.parent = elem.parent
            // var cindex =elem.parent.children.indexOf(elem)
            // console.log(cindex,i)
            // console.log(elem.parent.children.map(e=>e.form))
            // elem.parent.children.splice(cindex+i,0,el)
            // elem.parent.id = elem.parent.children[0].id + "-" + (parseInt(elem.parent.children[0].id) + elem.parent.children.length-1)
            // console.log(elem.parent.children.map(e=>e.form))
          }
          else {
            var parent = new ConlluElement([parseInt(elem.id) + "-" + (parseInt(elem.id) + 1), splits.join(""),
              "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], elem.lineidx, elem.line,elem.sentence)
            parent.analysis = elem.analysis
            elem.sentence.elements.splice(eindex, 0, parent)
            el.parent = parent;
            // el.parent.children = [elem,el]
            elem.parent = parent
          }
        })
      }
      this.preventKeyboard = false
      this.editable = false
      elem.sentence.refix(true);
      this.saveForUndo()
      // ev.target.blur()
    }
  }
  doAction(action,params,e) {
    var that = this;
    var x;
    switch (action) {
      case "nav":
      // console.log("doAction")
        this.nav(params[0],e)
        break;

      case "tag_morphofeatures":
        this.tag_morphofeatures(e)
        break

      case "log":
        console.log(this.highlight.element)
        break

      case "copy":
        this.copy(e)
        break

      case "paste":
        this.paste(e)
        break

      case "pasteMorphInfo":
        this.pasteMorphInfo(e)
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

      case "segment":
        this.segment(e)
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
          let fn = this.myTags.getTags()[params[0] - 1]
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
          fn = this.config.sentenceTags[parseInt(params[0]) - 1]
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
          // var that = this
          var doc = new ConlluDocument(this.config);
          doc.parse(this.doc.toConllU(),function(s){this.log = this.log + s + '\n'},true)
          break;

      default:
        // code...
        break;
    }
  }

  nav(direction,ev=null){
    if (!this.highlight.element)
      return;
    let x = null
    if(direction=="word_left")
      x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == parseInt(this.highlight.element.id) + 1)[0]
    else if(direction=="word_right")
      x = this.highlight.sentence.elements.filter(x => !x.isMultiword() && parseInt(x.id) == (parseInt(this.highlight.element.id) - 1))[0]

    if (x) {
      this.events.publish('highlight:change', x);
    }
    else{
      var sindex = this.doc.sentences.indexOf(this.highlight.sentence)
      var y = null
      if(direction=="word_down")
        y = this.doc.sentences[sindex + 1]
      else if(direction=="word_up")
        y = this.doc.sentences[sindex - 1]

      if (y) {
        // this.highlight.sentence = y
        this.events.publish('highlight:change', y.elements.filter(x => !x.isMultiword())[0])
      }
    }
    if(ev)
      ev.preventDefault();
  }
  saveFile(e=null,askToMarkIsDone=true){
    if(e) e.preventDefault();
    if(askToMarkIsDone){
      let alertPopup = this.alertCtrl.create({
          title: 'Mark as done?',
          message: 'Do you want to mark it as done?',
          buttons: [{
                  text: '(Y)es',
                  handler: () => {
                    this.doc.sentences[0].comments.unshift("# done "+this.stats.getLine(this.highlight.element))
                    this.saveFile(null,false)
                  }
              },
              {
                  text: '(N)o',
                  handler: () => {
                    this.doc.sentences[0].comments.unshift("# notdone "+this.stats.getLine(this.highlight.element))
                    this.saveFile(null,false)
                  }
              }]
      });
      alertPopup.present()
    }
    else{
      this.conlluRaw = this.doc.toConllU()
      this.conlluRawSpans = this.getConlluRaw()
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
        console.error('Error: ' + reason)
      })
    }
  }
  getConlluRaw(e=null){
    var sentid = 1
    return this.conlluRaw.split("\n").map(e=>{
      if(e=="")
        sentid++
      var elemid = e.split("\t")[0]
      elemid = /^[0-9-]/.test(elemid.trim()) ? elemid.trim() : "comment"
      return {
        sentid:sentid,
        elemid: elemid,
        elems: e.split("\t").map(ee=>ee+="\t")
      }
    })
  }
  syncConllU(e=null){
    this.conlluRaw = this.doc.toConllU()
    this.conlluRawSpans = this.getConlluRaw()
    this.toastCtrl.create({
      message: 'Conll-U representation has been updated.',
      duration: 3000,
      position: "top"
    }).present()
  }

  undoArr = []
  redoArr = []
  saveForUndo(newConllRaw=null){
    if(!this.config.sync)
      return false
    this.undoArr.push(this.conlluRaw)
    if(newConllRaw){
      this.conlluRaw = newConllRaw
      this.onConlluRawChanged()
    }
    else
      this.conlluRaw = this.doc.toConllU()
    this.conlluRawSpans = this.getConlluRaw()
    if(this.undoArr.length > this.config.undoSize)
      this.undoArr.shift()
  }
  onConlluRawSpansChanged(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      e.target.childNodes.forEach(e=>{
        if(e.innerText)
          e.innerText = e.innerText.trim()+"\t"
      })
      // r[index]=e.target.innerText
      let conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
        return i==row_index? e.target.innerText : rr
      }).join("\n")
      // console.log(this.conlluRaw)
      if(document.activeElement.classList.contains("conllu-row"))
        return
      this.saveForUndo(conlluRaw)
    })
  }
  removeConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      // r[index]=e.target.innerText
      let conlluRaw = this.conlluRaw.split("\n").filter((rr,i)=>{
        return i!=row_index
      }).join("\n")
      // if(document.activeElement.classList.contains("conllu-row"))
      //   return
      this.saveForUndo(conlluRaw)
    })
  }
  addConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      // r[index]=e.target.innerText
      var ar = this.conlluRaw.split("\n")
      ar.splice(row_index,0,"# ")
      let conlluRaw = ar.join("\n")
      // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
      // console.log(this.conlluRaw)
      // console.log(document.activeElement)
      // if(document.activeElement.classList.contains("conllu-row"))
        // return
      this.saveForUndo(conlluRaw)
    })
  }
  highlightConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
    // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
    // console.log(this.conlluRaw)
    let sent = this.doc.sentences.find(e=>e.id == 'S'+r.sentid)
    if(!sent)
      return
    let elem = sent.elements.find(e=>e.id == r.elemid)
    if(!elem)
      elem = sent.elements[0]
    if(elem.isMultiword())
      elem=elem.children[0]
    this.events.publish('highlight:change', elem)
  }
  downloadConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
    // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
    // console.log(this.conlluRaw)
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", this.project+"-"+this.pageid);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  // onConlluRawSpansChanged(c,r,row_index,index,e = null) {
  //   r[index]=e.target.innerText
  //   this.conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
  //     return i==row_index? r.join("\t") : rr
  //   }).join("\n")
  //   this.onConlluRawChanged()
  // }
  onConlluRawChanged(e = null) {
    this.log = ""
    // console.log("Here",this.conlluRaw)
    let that = this

    if (e){
      this.conlluRaw = e.target.value
    }
    let ref = this.conlluRaw.match(/^# (?:done|notdone).*\|highlight=([^\|\n]*)/)
    this.doc.parse(this.conlluRaw, function(s) {
      that.log = that.log + s + '\n';
    }, false)//.toBrat(logger, true);

    let hasHighlight = function(ref){
      if(!ref)
        return false
      ref = ref[1].split(":")
      let sent = this.doc.sentences.find(x=>x.id==ref[0])
      if(!sent)
        return false
       let elem = sent.elements.find(x=>x.id==ref[1])
      if(!elem)
        return false
      this.events.publish('highlight:change', elem)
      return true
    }
    if(!hasHighlight.call(this,ref)){
      let sentence = this.doc.sentences[0]
      if (sentence && this.doc.sentences[0].elements.filter(x => !x.isMultiword()).length > 0){
        this.events.publish('highlight:change', this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0])
        // this.highlight.element = this.doc.sentences[0].elements.filter(x => !x.isMultiword())[0]
      }
    }

    this.askMA()
    // console.log(JSON.parse(JSON.stringify(this.doc)))
  }
  maResult = null
  askMA(){
    // console.log("asda")
    if(!this.maResult){
      this.maResult = new Array(this.doc.sentences.length)
      this.doc.sentences.forEach((s,i) =>{
        //TODO REMOVE
        // if(i!=0)
        //   return
         this.wordservice.load(s.tokens().map(e => e.form).join(" "),this.config)
           .then((elements: ConlluElement[][]) => {
             this.maResult[i] = elements
             this.assignMA(s,i)
           })
                      .catch(s=>{
             this.toastCtrl.create({
                message: 'Error: ' + s,
                duration: 3000,
                position: "top"
              }).present()
            console.error('Error: ' + s)
           })
      }

      )

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
          return console.error(i,this.maResult)
        e.analysis = this.maResult[i][counter]
        counter++;
      })
  }


  showStats(){
    this.stats.print()
  }
}

export class Highlight {
  sentence: ConlluSentence = null
  element: ConlluElement = null

  constructor(public events:Events){
    this.events.subscribe("highlight:change", (element)=>{
      if(!element){
        console.trace("Published an event highlight:change but element is undefined")
        return
      }

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
  getLine(element: ConlluElement){
    var a = this.getStatsFromAll()
    var d = new Date()
    return ["from="+this.start,
    "to="+d,
    "T="+Math.abs(d.getTime() - this.start.getTime()),
    "stats="+Object.keys(a).map(s=>s+"="+a[s]).join("|"),
    "highlight="+element.sentence.id+":"+element.id,
    ].join("|")
  }
  print(){
    console.log(this.getStatsFromAll())
    console.log(this.getAll());
    var d = new Date()
    console.log(this.start, d, Math.abs(d.getTime() - this.start.getTime()))
  }
  getStatsFromAll(){
    var cats = {}
    this.all.forEach(e=>cats[e.action]=cats[e.action]+1 || 1)
    return cats;
  }
  getAll(){
    var cache = [];
    var x= JSON.parse(JSON.stringify(this.all, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }))
    cache = null; // Enable garbage collection
    return x
  }
}




@Directive({
    selector: "[autofocus]"
})
export class AutofocusDirective
{
    private focus = true;

    constructor(private el: ElementRef)
    {
    }

    ngOnInit()
    {
        if (this.focus)
        {
            //Otherwise Angular throws error: Expression has changed after it was checked.
            window.setTimeout(() =>
            {
                this.el.nativeElement.focus(); //For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
            });
        }
    }

    @Input() set autofocus(condition: boolean)
    {
        this.focus = condition !== false;
    }
}
