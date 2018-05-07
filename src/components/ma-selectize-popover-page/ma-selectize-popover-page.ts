import { ConlluElement } from 'conllu-dao';
// import { AnnotatePage } from '../../pages/annotate/annotate';
import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events, ViewController, NavController, NavParams } from 'ionic-angular';
import { ConfigJSON } from '../../providers/config-service';
// import { ConcordanceComponent } from '../../components/concordance/concordance';

@Component({
  selector: 'ma-selectize-popover-page',
  templateUrl: 'ma-selectize-popover-page.html'
})
export class MASelectizePopoverPageComponent {

  element: ConlluElement = null;
  analyses: ConlluElement[] = [];
  path: string = null;
  myconfig = {}
  config : ConfigJSON = null
  project = ""
  hash = ""
  pageid = ""
  dismissed = false
  options = []
  // @ViewChild('myinput') myinput: FormGroup;
  @ViewChild('myselectize') myselectize: any;
  diacsOptions: any[] = [];
  // rank = 1;
  selected = {form:""}
  mode :string = ""

  // @ViewChild('diacs') diacsGroup: RadioGroup;

  constructor(private navParams: NavParams,public events: Events,public viewCtrl: ViewController, public navCtrl: NavController,public iab: InAppBrowser) {

    this.config = navParams.data.config
    this.analyses = navParams.data.analyses
    this.element = navParams.data.element
    this.project = navParams.data.project
    this.pageid = navParams.data.pageid
    this.hash = navParams.data.hash
    this.mode = navParams.data.mode || ""
    this.path = navParams.data.path
    if(this.analyses)
      this.options = this.analyses
          .map((e,i)=>new Object({
            value: e.id,
            counter: i,
            title: i,
            // score: e._miscs["SCORE"],
            lemma: (e.children.length > 0 ? e.children.map(ee=>ee.lemma).join(" ") : e.lemma),
            isMemMA: e._miscs["DOCID"]!==undefined,
            miscs: e._miscs,
            sent: e._miscs["SENT"]?e._miscs["SENT"].replace(/±/g," "): (this.mode == "view" ?e.getContext().map(e=>e.form).join(" "):""),
            elements: (e.children.length > 0 ? e.children : [e]),
            forsearch: (e.children.length > 0 ? e.children : [e]).map(e=>
              e.form+" "+
                this.config.getXPosTag(e.xpostag).desc+" "+
                this.config.getUPosTag(e.upostag).desc+" "+
                e.features.map(e=>this.config.getFeature(e.key+"="+e.value).desc).join(" ")
              ).join(" "),
            o: e,
          }))
     else{
       this.options = []
     }
    this.myconfig = this.selectize_config()
  }
  ngAfterViewInit() {
    // this.myselectize.selectize.focus()
    setTimeout(() => {
      this.myselectize.selectize.focus()
      this.myselectize.selectize.okayToClose = true
    },500);
    var allpop = (document.querySelector(".popover-content") as HTMLElement).offsetHeight
    var inp = (document.querySelector(".selectize-input") as HTMLElement).offsetHeight
    var ll = document.querySelector(".selectize-dropdown-content") as HTMLElement
    ll.style.height = allpop - inp + "px"
    ll.style["max-height"] = allpop - inp + "px"
  }

  selectize_config = function(){
    var that : MASelectizePopoverPageComponent = this
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
        searchField: ['lemma','value','title','forsearch'],
        // plugins: ['optgroup_columns'],
        options: this.options,
        // optgroups: Object.keys(this.config.mf).map((x,i)=>new Object({
        //   $order: i,
        //   id: x,
        //   name: x
        // })),
        onDropdownClose : function(e){
          // this.open() // USE ONLY for debugging
        },
        render: {
            option: function(item, escape) {
              var arr = item.lemma.split("±")
              var lemma = arr[0]//item.lemma.replace(/±.*/,"")
              var gloss=""
              if(arr.length==2)
                gloss = arr[1].split(";").map(meaning=>"<span class='meaning'>"+escape(meaning)+"</span>").join(" ")

                return `<div class=doc${item.isMemMA}">
                    <div class="counter">${escape(item.counter+1)}</div>
                    <div class="title">
                        <div class="lemma">[${lemma.replace(/(^_|_$)/,"")}]</div>
                        <div class="by">${gloss}</div>
                    </div>
                    <div class="elements">`+
                    item.elements.map(e=>{
                      return `<div class='element'><span class='form'>${e.form}</span><span class='pos'>${that.config.getXPosTag(e.xpostag).desc}</span><span class='morphfeats'>`+
                      e.features.map(e=>{
                        // if(!that.config.features[e.key+"="+e.value]){
                        //   console.error(e.key+"="+e.value, "not defined")
                        //   return e.key+"="+e.value
                        // }
                        return `<span class='morphfeat ${e.key}'>${that.config.getFeature(e.key+"="+e.value).desc}</span>`
                      }).join(" ")+"</span></div>"
                    }).join("")
                    + `</div><a href="/#/annotate">${item.sent}</a><span>${item.miscs.DOCID?item.miscs.DOCID:""}</span>
                </div>`;
            }
        },
        // optgroupValueField: 'id',
        // optgroupLabelField: 'name',
        // optgroupField: 'feature',
        // lockOptgroupOrder: true,
        // hideSelected: true,
        // closeAfterSelect: false,
        // openOnFocus: true,
        onItemAdd: function(value, $item) {
          var el = that.analyses.find(val=>{
            return value == val.id
          })
          if(that.mode == "view"){
            if(el._miscs["DOCID"]!==this.pageid)
              that.iab.create(['/#/annotate',that.project,that.hash,el._miscs["DOCID"],el._miscs["SENTID"]+"-"+el._miscs["ELEMID"]].join("/"));
            else{
              // if(el.isMultiword)
              //   el = el.children[0]
              that.events.publish('highlight:change', el);
            }

          }else if(that.mode == "change"){
            let c = that.element.changeWith(el);
            // c._miscs["FROM_MA"]=true
            [c,...c.children].forEach(cc=>{
              cc._miscs["FROM"]="MA"
              delete cc._miscs["SENT"]
              delete cc._miscs["DOCID"]
              delete cc._miscs["ELEMID"]
              delete cc._miscs["SENTID"]
              delete cc._miscs["WID"]
            })

            that.events.publish('highlight:change', c);
            that.events.publish("stats",{action:"changeWith",element:c.parent || c})
        }
           that.viewCtrl.dismiss()
        },
        create: false
      }
  }
}
