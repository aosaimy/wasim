import { ConlluElement } from '../../pages/annotate/conllu';
import { Component, Input, ViewChild } from '@angular/core';
import { Events, ViewController , NavParams } from 'ionic-angular';
import { ConfigJSON } from '../../providers/config-service';
import { ConcordanceComponent } from '../../components/concordance/concordance';

@Component({
  selector: 'ma-selectize-popover-page',
  templateUrl: 'ma-selectize-popover-page.html'
})
export class MASelectizePopoverPageComponent {

  element: ConlluElement = null;
  myconfig = {}
  config : ConfigJSON = null
  options = []
  // @ViewChild('myinput') myinput: FormGroup;
  @ViewChild('myselectize') myselectize: any;
  diacsOptions: any[] = [];
  // rank = 1;
  selected = {form:""}

  // @ViewChild('diacs') diacsGroup: RadioGroup;

  constructor(private navParams: NavParams,
    // public data: Data,
    public events: Events,
    public viewCtrl: ViewController) {

    this.config = navParams.data.config
    this.element = navParams.data.element
    if(this.element.analysis)
      this.options = this.element.analysis
          .map((e,i)=>new Object({
            value: e.id,
            counter: i,
            title: i,
            // score: e._miscs["SCORE"],
            lemma: (e.children.length > 0 ? e.children.map(ee=>ee.lemma).join("") : e.lemma),
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
    if(this.options.length == 0 )
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
              var lemma = item.lemma.replace(/±.*/,"")
                return '<div>' +
                    '<div class="counter">' + escape(item.counter+1) + '</div>' +
                    '<div class="title">' +
                        '<div class="lemma">[' + lemma.replace(/(^_|_$)/,"") + ']</div>' +
                        '<div class="by">' + item.lemma.replace(/.*±/,"").split(";").map(meaning=>"<span class='meaning'>"+escape(meaning)+"</span>").join(" ") + '</div>' +
                    '</div>' +
                    '<div class="elements">' +
                    item.elements.map(e=>{
                      return "<div class='element'><span class='form'>"+e.form+"</span><span class='pos'>"+that.config.getXPosTag(e.xpostag).desc+"</span><span class='morphfeats'>"+
                      e.features.map(e=>{
                        // if(!that.config.features[e.key+"="+e.value]){
                        //   console.error(e.key+"="+e.value, "not defined")
                        //   return e.key+"="+e.value
                        // }
                        return `<span class='morphfeat ${e.key}'>`+that.config.getFeature(e.key+"="+e.value).desc+"</span>"
                      }).join(" ")+"</span></div>"
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
        onItemAdd: function(value, $item) {
          var el = that.element.analysis.find(val=>{
            return value == val.id
          })
         let c = that.element.changeWith(el);
        that.events.publish('highlight:change', c);
        that.events.publish("stats",{action:"changeWith",element:c.parent || c})

         that.viewCtrl.dismiss()
        },
        create: false
      }
  }
}
