import { NgZone, Renderer, Component, Input, ViewChild, EventEmitter, Directive } from '@angular/core';
import { Events, ToastController, RadioGroup, AlertButton, AlertController, LoadingController, PopoverController, NavController, NavParams } from 'ionic-angular';
// import { InAppBrowser } from '@ionic-native/in-app-browser';

import { WordService } from '../../providers/word-service';
import { ConlluService } from '../../providers/conllu-service';
import { ConfigService} from '../../providers/config-service';
import { TagsJSON, ConfigJSON} from '../../providers/config-json.class';
// import { GuidelinesService } from '../../providers/guidelines-service';
import { SelectizePopoverPageComponent } from '../../components/selectize-popover-page/selectize-popover-page';
import { MASelectizePopoverPageComponent } from '../../components/ma-selectize-popover-page/ma-selectize-popover-page';
// import { SegmentorPopoverPageComponent } from '../../components/segmentor-popover-page/segmentor-popover-page';
import { TagsSelectorComponent } from '../../components/tags-selector/tags-selector';
// import { HighlightComponent } from '../../components/highlight/highlight';
// import { GetFormPopoverComponent } from '../../components/get-form-popover/get-form-popover';
// import { GuiderComponent } from '../../components/guider/guider';
import { HelpPopoverComponent } from '../../components/help-popover/help-popover';
import { DocsPage } from '../docs/docs';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsPage } from '../projects/projects';
import { ConlluDocument, ConlluSentence, ConlluElement } from 'conllu-dao'
import 'rxjs/add/operator/map'


/*
  Generated class for the Annotate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-annotate',
  templateUrl: 'annotate.html',
  // changeDetection: ChangeDetectionStrategy.Default
})
export class AnnotatePage {

  /*
  Tags bar
  */
  tagsRow = 0;
  done=false
  conlluEditorType = "info"
  config = new ConfigJSON()
  // sentenceTags: { tag: string, desc: string, fn: number }[] = null

  @ViewChild('lemma') lemmaGroup: RadioGroup;

  // conllu : ConllU = new ConllU().Document();
  log :string[] = [];
  doc= null;
  documentJson = {}
  project = ""
  hash = ""
  pageid = ""
  editable = false
  // isConlluHidden = false
  copyElement = null
  // @ViewChild('conllu-editor') conlluEditor: ConlluEditorComponent;

  highlight: Highlight = new Highlight(this.events,this.zone);

  _conlluRaw = `1-3 وعنها   _   _   _   _   _   _   _   _
1   وَ  _   conj    conj    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-0
2   عَنها   عَن_1   prep    prep    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-1
3   _   _   3fs_pron    3fs_pron    _   0   _   _   ANALSIS#=1/1|TOOL=MA|ID=1-2
`
  get conlluRaw(){
    return this._conlluRaw
  }
  set conlluRaw(argv){
    this._conlluRaw = argv
    this.log = []
    // console.log("Here",this.conlluRaw)
    let that = this

    this.doc.parse(this._conlluRaw, function(s) {
      that.log.push(s);
    }, false)//.toBrat(logger, true);
    // if(typeof highlightRef  == "string")
      // this.highlightElement(highlightRef)
    if(this.config.askMA)
      this.askMA()
    if(this.config.askMemMA)
      this.askMemMA()
    // console.log(JSON.parse(JSON.stringify(this.doc)))
    this.highlightElement(this.highlight.ref)
  }
  stats = new Stats(this.events)

  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    public navParams: NavParams,
    // public data: Data,
    // public http: Http,
    public renderer:Renderer,
    public zone: NgZone,
    public events: Events,
    private wordservice: WordService,
    private conlluService: ConlluService,
    private configService: ConfigService,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    loading.present();

    if (!navParams.data.project){
      //TODO change
      console.log("invalid params: ",navParams.data)
      navCtrl.setRoot(ProjectsPage)
    }
    else{
      this.project = navParams.data.project;
      this.hash = navParams.data.hash;
      if(navCtrl.getViews().length==0)
        navCtrl.insert(1,DocsPage,{
          project : this.project,
          hash : this.hash
        })
    }

    // on highlight change, scroll the ConllU Raw view and the main words view to proper location
    this.events.subscribe("highlight:change", (element,scrollToConllRaw=true,scrollToElement=true)=>{
      // if(scrollToConllRaw)
        // setTimeout(() => {
        //   let highlight_element : any = document.querySelector("pre > .highlight");
        //   if(highlight_element){
        //     document.querySelector("pre").scrollTo(0, highlight_element.offsetTop-100)
        //   }
        // })

      if(scrollToElement)
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

    Promise.all([this.configService.load(this.project, this.hash),this.conlluService.load(this.project, this.hash, this.pageid)])
    .then(arr=>{
      loading.dismiss();
      this.config = arr[0]//this.configService.getConfig(this.project)
      this.currentTags = this.getTags()
      this.doc = new ConlluDocument(this.config)
      this.conlluRaw = arr[1].trim();
      this.done = /(\n|^)# done/.test(this.conlluRaw)
      let match = this.conlluRaw.match(/^# (?:done|notdone).*\|highlight=([^\|\n]*)/)

      setTimeout(()=>{
        if(navParams.data.position){
          console.log("here",navParams.data.position)
          this.highlightElement(navParams.data.position.replace("-",":"))
        }
        else if(match)
          this.highlightElement(match[1])
        else
          this.highlightElement('S1:1')
      })
    }).catch(x=>{
      this.toastCtrl.create({
          message: this.translateService.instant('Conllu File loading Error: ') + this.translateService.instant(x),
          duration: 3000,
          position: "top"
        }).present()
      console.error('Conllu File loading Error: ', x)
      console.trace(x)
      loading.dismiss()
    });
  }
  logme(x){console.log(x)}
  ngOnInit() {
    // this.config = this.configService.getConfig(this.project)
    // console.log('ngAfterViewInit AnnotatePage');
    // this.renderer.invokeElementMethod(document.querySelector(".highlight"), 'focus', []);
  }
  preventKeyboard = false
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

  _info = null
  get info() {
    if(this._info)
      return this._info
    let obj :any = {}
    if(!this.doc)
      return {}
    obj.sent_no = this.doc.sentences.length
    obj.elem_no = this.doc.sentences.map(s=>s.elements.length).reduce((p,c)=>p+=c,0)
    obj.tokens_no = this.doc.sentences.map(s=>s.tokens().length).reduce((p,c)=>p+=c,0)
    obj.types_no = [].concat(...this.doc.sentences.map(s=>s.tokens().map(e=>e.form))).filter((e,i,arr)=>arr.indexOf(e)==i).length
    obj.mwe_no = this.doc.sentences.map(s=>s.elements.filter(el=>el.isMultiword).length).reduce((p,c)=>p+=c,0)
    this._info = obj
    return obj
  }
  addNote(event=null) {
    if(event)
      event.preventDefault()
    let prompt = this.alertCtrl.create({
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
          handler: data => {
            this.highlight.element._miscs["NOTE"] = data.note.replace(/ /g,"_")
            this.syncConllU()
          }
        }
      ]
    });
    prompt.present();
  }
  highlightElement(highlightRef='S1:1') {
    highlightRef = highlightRef.replace(/^(S[0-9]+:[0-9]+)-[0-9]+$/,"$1")
    if(!/^S[0-9]+:[0-9]+$/.test(highlightRef)){
      console.error("HighlightRef is not standard",highlightRef)
      highlightRef = 'S1:1'
    }

    let elem = this.doc.getElement(highlightRef)
    if(elem)
      this.events.publish('highlight:change', elem)
    else{
      console.error("highlighted non existing element",highlightRef)
      if(highlightRef!='S1:1')
        this.highlightElement()
    }
  }
  search(event=null) {
    if(event)
      event.preventDefault()
    let prompt = this.alertCtrl.create({
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
          handler: data => {
            this.wordservice.askMemMA(data.form,this.config)
           .then((elements: ConlluElement[][]) => {
             this.viewElementsPopup(elements[0],null)
            }).catch(s=>{
             this.toastCtrl.create({
                message: this.translateService.instant('Error: ') + this.translateService.instant(s),
                duration: 3000,
                position: "top"
              }).present()
            console.error('Error: ' , s)
           })
          }
        }
      ]
    });
    prompt.present();
  }
  searchResults = []
  last_cretiera : any = {}

  find(event=null){
    if(event)
      event.preventDefault()
    let prompt = this.alertCtrl.create({
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
    if(this.copyElement)
      prompt.addButton({
          text: this.translateService.instant('Find and Replace All'),
          role: 'destructive',
          handler: cretiera => {
              this.last_cretiera = JSON.parse(JSON.stringify(cretiera))
              if(!this.copyElement){
                 this.toastCtrl.create({
                  message: this.translateService.instant('No copied element'),
                  duration: 1000
                }).present()
              }
              else {
                this.searchResults = this.doc.find(cretiera)
                this.searchResults.forEach(e=>{
                  if(e==this.copyElement || e.parent==this.copyElement)
                    return
                  if(this.copyElement.isMultiword){
                    let c= e.changeWith(this.copyElement)
                    c._miscs["FROM"]="PASTE"
                  }
                   else
                     e.copy(this.copyElement)
                })
              }
          }
        })
    prompt.addButton({
      text: this.translateService.instant('Find All'),
      handler: cretiera => {
          this.last_cretiera = JSON.parse(JSON.stringify(cretiera))
          this.searchResults = this.doc.find(cretiera)
          if(this.searchResults.length === 0){
            this.toastCtrl.create({
              message: this.translateService.instant('No results were found'),
              duration: 1000
            }).present()
          }
          else {
            this.viewElementsPopup(this.searchResults,null)
          }
      }
    });
    prompt.addButton({
      text: this.translateService.instant('Find All (Unique)'),
      handler: cretiera => {
          this.last_cretiera = JSON.parse(JSON.stringify(cretiera))
          let uniq = {}
          this.searchResults = this.doc.find(cretiera).filter(e=>{
            if(uniq[e.toConllU(false)]===undefined){
              uniq[e.toConllU(false)] = true
              return true
            }
            return false
          })
          if(this.searchResults.length === 0){
            this.toastCtrl.create({
              message: this.translateService.instant('No results were found'),
              duration: 1000
            }).present()
          }
          else {
            this.viewElementsPopup(this.searchResults,null)
          }
      }
    });
    prompt.addButton({
      text: this.translateService.instant('Find Next'),
      handler: cretiera => {
          this.last_cretiera = JSON.parse(JSON.stringify(cretiera))
          this.searchResults = this.doc.find(cretiera)
          if(this.searchResults.length === 0){
            this.toastCtrl.create({
              message: this.translateService.instant('No results were found'),
              duration: 1000
            }).present()
          }
          else {
            if(this.highlight.element)
              this.highlight.element = this.doc.sentences[0].elements[0]
            this.find_next(event)
          }
      }
    });
    prompt.present();
  }

  wasReversed = false
  find_next(event=null,backward=false){
    if(event)
      event.preventDefault()
    if(this.highlight.element==null)
      return
    if(backward && !this.wasReversed || !backward && this.wasReversed){
      this.wasReversed = ! this.wasReversed
      this.searchResults.reverse() // warning in-place
    }
    let r = this.searchResults.find(e=>{
      if(!backward && e.sentence._id < this.highlight.element.sentence._id)
        return false
      if(!backward && e.sentence._id == this.highlight.element.sentence._id && parseInt(e._id) <= parseInt(this.highlight.element._id))
        return false
      if(backward && e.sentence._id > this.highlight.element.sentence._id)
        return false
      if(backward && e.sentence._id == this.highlight.element.sentence._id && parseInt(e._id) >= parseInt(this.highlight.element._id))
        return false
      return true
    })
    if(!r)
        return this.toastCtrl.create({
          message: this.translateService.instant('No more results were found'),
          duration: 1000
        }).present()
    // if(r.isMultiword)
    //   r = r.children[0]

    this.events.publish('highlight:change', r);
  }

  ionViewCanLeave() {
    if(this.showAlertMessage) {
        let alertPopup = this.alertCtrl.create({
            title: this.translateService.instant('Exit'),
            message: this.translateService.instant('Changes are not saved. Are you sure?'),
            buttons: [{
                    text: this.translateService.instant('Exit'),
                    handler: () => {
                      this.showAlertMessage = false;
                      this.navCtrl.pop();
                    }
                },
                {
                    text: this.translateService.instant('Stay'),
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
      })
      popover.onDidDismiss(x=>{
        this.preventKeyboard = false
        this.saveForUndo()
      })
    }
    else{
     this.toastCtrl.create({
        message: this.translateService.instant('No morphological features is needed for this tag: ') + this.config.getXPosTag(this.highlight.element.xpostag).desc,
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
    })
  }
  mouseClick(e) {
    this.events.publish("stats",{action:"mouse",element:e})
  }
  keyboardShortcuts(e) {
    var highlighNode : any = document.querySelector(".highlight")
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
    if(e.code == "Escape")
      this.copyElement = null

    var action = this.config.keyboardShortcuts
      .find(v=>{
        return (v.code == e.code) &&
               // (v.key!=undefined && v.key == e.key) &&
               ((v.metaKey==true) == e.metaKey) &&
               ((v.shiftKey==true) == e.shiftKey) &&
               ((v.altKey==true) == e.altKey) &&
               ((v.ctrlKey==true) == e.ctrlKey) &&
               true
      })
    if(action != null){
      this.events.publish("stats",{action:"keyboard",event:e, code:action})
      this.doAction(action.action, action.params,e)
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

        if(e) e.preventDefault();
  }
  copy(e=null){
    if(e)
      e.preventDefault()
      this.copyElement = this.highlight.element
  }
  copyParent(e=null){
    if(e)
      e.preventDefault()
    this.copyElement = this.highlight.element.parent
  }
  paste(e=null){
      if(!this.copyElement)
        return
      if(this.copyElement.isMultiword){
          let c= this.highlight.element.changeWith(this.copyElement)
          c._miscs["FROM"]="PASTE"
          this.events.publish('highlight:change', c);
      }
      else
          this.highlight.element.copy(this.copyElement)
  }
  pasteMorphInfo(e=null){
      if(this.copyElement)
          this.highlight.element.copyMorphInfo(this.copyElement)
  }
  new_sentence(e=null){
      //TODO: this should be moved to conllu.ts
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

          after.forEach(e => {
            e.sentence = this.highlight.sentence
          })
          this.highlight.sentence.elements = this.highlight.sentence.elements.concat(after);
          this.doc.sentences.splice(sindex + 1, 1)
          this.highlight.sentence.refix(true)
          this.doc.fixSentenceIds()
        }
        else {
          // sentence should be splitted
          this.highlight.sentence.elements = before;

          //re count the second sentence
          let counter = 1;
          after.forEach(e => {
            if (!e.isMultiword)
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
      //TODO: this should be moved to conllu.ts
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
    //   if (!e.isMultiword)
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
      //TODO: this should be moved to conllu.ts
    if (!this.highlight.element)
          return;
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
      if (!e.isMultiword)
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

  tag_ma(analyses: ConlluElement[] =[],e) {
      let el = this.highlight.element.parent || this.highlight.element
      if(analyses.length==0)
        analyses=el.analysis//.filter((e,i)=>! this.viewMode || e._miscs["DOCID"]!==this.pageid && e._miscs["DOCID"]!==undefined)

      if(analyses){
        var popover = this.popoverCtrl.create(MASelectizePopoverPageComponent, {
          element: el,
          analyses: analyses,
          hash: this.hash,
          mode: "change",
          project: this.project,
          config: this.config
        },{cssClass:"selectizePopover"})
        popover.present({})
        this.preventKeyboard = true
        popover.onDidDismiss(()=>{
          this.preventKeyboard = false
          this.saveForUndo()
        })
      }
      else{
       this.toastCtrl.create({
          message: this.translateService.instant('No Analysis Found for this word: ') + el.form,
          duration: 3000,
          position: "top"
        }).present()
      }
      this.events.publish("stats",{action:"tag_ma",element:this.highlight.element})
      this.showAlertMessage = true;
  }
  viewElementsPopup(analyses : ConlluElement[] = [], e=null) {
      if(analyses.length !== 0){
        var popover = this.popoverCtrl.create(MASelectizePopoverPageComponent, {
          analyses: analyses,
          hash: this.hash,
          project: this.project,
          mode: "view",
          config: this.config
        },{cssClass:"selectizePopover"})
        popover.present({})
        this.preventKeyboard = true
        popover.onDidDismiss(()=>{
          this.preventKeyboard = false
          // this.saveForUndo()
        })
      }
      else{
       this.toastCtrl.create({
          message: this.translateService.instant('No Analysis Found'),
          duration: 3000,
          position: "top"
        }).present()
      }
      // this.events.publish("stats",{action:"tag_ma",element:this.highlight.element})
      this.showAlertMessage = true;
  }
  segment(e=null) {
    this.editable = true
    this.preventKeyboard = false
  }
  blurFormEditor(ev,elem){
    this.preventKeyboard = false
    this.editable = false
    this.resize(ev)
  }
  resize(ev) {
    var int = 0.9;
    ev.target.style.width = ((ev.target.value.length+1) * int) + 'vw'
  }
  keyupFormEditor(ev,elem){
    this.resize(ev)
    if (ev.code == "Backspace") {
      //TODO: this should be moved to conllu.ts
      // TODO: name it: concat? merge?
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
      // this.preventKeyboard = false
      // this.editable = false
      elem.sentence.refix(true);
      this.saveForUndo()
      ev.target.blur()
    }
  }
  doAction(action,params,e=null) {
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

      case "copyParent":
        this.copyParent(e)
        break

      case "addNote":
        this.addNote(e)
        break

      case "search":
        this.search(e)
        break

      case "find":
        this.find(e)
        break

      case "find_next":
        this.find_next(e)
        break

      case "find_prev":
        this.find_next(e,true)
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
        this.tag_ma([],e)
        break;

      case "tag_ma_previous":
        let el2 = this.highlight.element.parent || this.highlight.element
        let analyses = [].concat.apply([], this.doc.sentences
          .filter(s=>s._id <= el2.sentence._id)
          .map(s=>s.tokens()
             .filter(e=>
               // parseInt(e.id.split("-")[0]) < parseInt(el2.id) &&
               e!=el2 &&
               e.form.replace(/[ًٌٍَُِّْ]/g,"") == el2.form.replace(/[ًٌٍَُِّْ]/g,""))))
        this.tag_ma(analyses,e)
        e.preventDefault()
        break;

      case "edit_memMa":
        let el = this.highlight.element.parent || this.highlight.element
        this.viewElementsPopup(el.analysis.filter((e,i)=>e._miscs["DOCID"]!==undefined && e._miscs["DOCID"]!==this.pageid),e)
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
          let fn = this.getTags()[params[0] - 1]
          if (fn){
            this.highlight.element.xpostag = fn.tag;
            // this.highlight.element.upostag = this.config.alltags.find(x=>x.tag==fn.tag).mapToConllU
            this.saveForUndo()
          }
          break

      case "showOtherUTags":
          this.increaseTagsRow()
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
          var doc = new ConlluDocument(this.config);
          doc.parse(this.doc.toConllU(),function(s){this.log.push(s)},true)
          break;

      case "validate":
          if(e) e.preventDefault();
          let issues = this.doc.validate()
          if(issues.length > 0 )
            this.toastCtrl.create({
              message: this.translateService.instant('Several issues were found'),
              duration: 3000,
              position: "top"
            }).present()
          else
            this.toastCtrl.create({
              message: this.translateService.instant('No issues were found'),
              duration: 3000,
              position: "top"
            }).present()


          break;

      case "showCommands":
          if(e) e.preventDefault();
          this.showCommands(e)
          break;

      default:
        // code...
        break;
    }
  }
  currentTags :TagsJSON[] = this.getTags()
  getTags() : TagsJSON[] {
    return this.config.alltags.slice(this.tagsRow * 9, (this.tagsRow + 1) * 9).map((x,i) => {
      x.fn = i+1;
      return x
    });
  }
  increaseTagsRow() {
    this.tagsRow++;
    this.currentTags = this.getTags()
    if(this.currentTags.length == 0){
      this.tagsRow = 0
      this.currentTags = this.getTags()
    }
  }

  showCommands(e){
    console.log("showCommands")
    let alert = this.alertCtrl.create();
    alert.setTitle('List of Commands');

    this.config.keyboardShortcuts.forEach((e,i)=>{
      alert.addInput({
        type: 'radio',
        label: e.keys.length + e.keys.join("+")+" || "+e.action + (e.params && e.params.length >0 ? " {"+e.params.join()+"} ":""),
        value: i+"",
        checked: i==0
      });
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: this.translateService.instant('OK'),
      handler: index => {
        this.doAction(this.config.keyboardShortcuts[index].action,this.config.keyboardShortcuts[index].params,null);
      }
    });
    alert.present();
  }
  nav(direction,ev=null){
    if (!this.highlight.element)
      return;
    let x = null
    if(direction=="word_left")
      x = this.highlight.sentence.elements.find(x => !x.isMultiword && parseInt(x.id) == parseInt(this.highlight.element.id) + 1)
    else if(direction=="word_right")
      x = this.highlight.sentence.elements.find(x => !x.isMultiword && parseInt(x.id) == (parseInt(this.highlight.element.id) - 1))
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

      if (!y)
        return;

      if(y.elements.length!=0){
          this.events.publish('highlight:change', y.elements.filter(x => !x.isMultiword)[0])
          return
      }

      this.highlight.sentence = y
      this.nav(direction)
    }
    if(ev)
      ev.preventDefault();
  }
  saveFile(e=null,askToMarkIsDone=true){
    if(e) e.preventDefault();
    // this.navCtrl.getActive().
    if(askToMarkIsDone && this.done){
      this.doc.sentences[0].comments.unshift("# update "+this.stats.getLine(this.highlight.element))
      this.saveFile(null,false)
    } else if(askToMarkIsDone){
      let alertPopup = this.alertCtrl.create({
          title: this.translateService.instant('Mark as done?'),
          message: this.translateService.instant('Do you want to mark it as done?'),
          buttons: [{
                  text: this.translateService.instant('Yes'),
                  handler: () => {
                    this.doc.sentences[0].comments.unshift("# done "+this.stats.getLine(this.highlight.element))
                    this.saveFile(null,false)
                  }
              },
              {
                  text: this.translateService.instant('No'),
                  handler: () => {
                    this.doc.sentences[0].comments.unshift("# notdone "+this.stats.getLine(this.highlight.element))
                    this.saveFile(null,false)
                  }
              }]
      });
      alertPopup.present()
    } else{
      this._conlluRaw = this.doc.toConllU()
      this.conlluService.save(this.project, this.hash, this.pageid, this.conlluRaw).then(s => {
        this.toastCtrl.create({
          message: this.translateService.instant('File was successfully saved. Status:'+(s.isDone? "Done" : "Not Done")),
          duration: 3000,
          position: "top"
        }).present()
        this.stats.start = new Date()
        this.showAlertMessage = false;
      }).catch(reason => {
        this.toastCtrl.create({
          message: this.translateService.instant('Error: ') + this.translateService.instant(reason),
          duration: 3000,
          position: "top"
        }).present()
        console.error('Error: ' , reason)
      })
    }
  }

  syncConllU(e=null){
    this._conlluRaw = this.doc.toConllU()
    this.toastCtrl.create({
      message: this.translateService.instant('Conll-U representation has been updated'),
      duration: 3000,
      position: "top"
    }).present()
  }
  download() {
    //make sure there is a tab after each span
    // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
    // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
    // console.log(this.conlluRaw)
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    let filename = this.pageid
    if(!/\.conllu$/.test(filename))
      filename+= ".conllu"
    downloadAnchorNode.setAttribute("download", filename);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  undoArr = []
  redoArr = []
  saveForUndo(newConllRaw=null){
    if(!this.config.sync)
      return false
    this.undoArr.push(this.conlluRaw)
    if(newConllRaw){
      this.conlluRaw = newConllRaw
    }
    else
      this._conlluRaw = this.doc.toConllU()
    if(this.undoArr.length > this.config.undoSize)
      this.undoArr.shift()
  }
  // onConlluRawSpansChanged(c,r,row_index,index,e = null) {
  //   r[index]=e.target.innerText
  //   this.conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
  //     return i==row_index? r.join("\t") : rr
  //   }).join("\n")
  //
  // }
  // maResult = null
  askMA(){
    if(this.doc.sentences.length > 100){
      this.toastCtrl.create({
                message: this.translateService.instant('Warning: Sentences would not be sent to morphological analyser because sentence number')+" > 100",
                duration: 3000,
                position: "top"
              }).present()
      return
    }

      Promise.all(this.doc.sentences.map((s,i) =>
            this.wordservice.askMA(s.tokens().map(e => e.form).join(" "),this.config)
             .then((elements: ConlluElement[][]) => {
               var counter = 1
              s.elements.forEach(e => {
                if(e.parent)
                  return
                // if(!this.maResult[i])
                //   return console.error(i,this.maResult)
                if(!e.analysis)
                  e.analysis = []
                if(elements[counter])
                  e.analysis = e.analysis.concat(elements[counter] || [])
                // else
                  // console.log("askMA",e,elements,counter)
                counter++;
              })
            })
       ))
      .catch(s=>{
             this.toastCtrl.create({
                message: this.translateService.instant('Error: ') + this.translateService.instant(s),
                duration: 3000,
                position: "top"
              }).present()
            console.error('Error: ' , s)
           })
  }

  askMemMA(){
    if(this.doc.sentences.length > 100){
      this.toastCtrl.create({
                message: this.translateService.instant('Warning: Sentences would not be sent to morphological analyser because sentence number')+" >100",
                duration: 5000,
                position: "top"
              }).present()
      return
    }
      this.doc.sentences.forEach((s,i) =>{
         this.wordservice.askMemMA(s.tokens().map(e => e.form).join(" "),this.config)
           .then((elements: ConlluElement[][]) => {
             var counter = 0
            s.elements.forEach(e => {
              if(e.parent)
                return
              // if(!this.maResult[i])
              //   return console.error(i,this.maResult)
              if(elements[counter])
                e.analysis = elements[counter].concat(e.analysis || [])
              // else if(!Array.isArray(elements[counter]))
                // console.log("askMemMA",e,elements,counter)
              counter++;
            })
            }).catch(s=>{
             this.toastCtrl.create({
                message: this.translateService.instant('Error: ') + this.translateService.instant(s),
                duration: 3000,
                position: "top"
              }).present()
            console.error('Error: ' , s)
           })
      })
  }


  showStats(){
    this.stats.print()
  }
}

export class Highlight {
  sentence: ConlluSentence = null
  element: ConlluElement = null
  ref: string = "S1:1"

  constructor(public events:Events, public zone: NgZone){
    this.events.subscribe("highlight:change", (element)=>{
      if(!element){
        console.trace("Published an event highlight:change but element is undefined")
        return
      }
      zone.run(() =>{
        this.element = element
        this.sentence = element.sentence
        this.ref = "S"+this.sentence._id+":"+this.element._id
      })
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
    return [
    "Time="+this.secondsToHms(Math.abs(d.getTime() - this.start.getTime())),
    "from="+this.start,
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
  secondsToHms(d) {
    d = Number(d)/1000;
    console.log(d)

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
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
