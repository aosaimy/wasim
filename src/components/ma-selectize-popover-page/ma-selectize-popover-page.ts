import { ConlluElement } from '../../pages/annotate/conllu';
import { Component, Input, ViewChild } from '@angular/core';
import { ViewController , NavParams } from 'ionic-angular';

@Component({
  selector: 'ma-selectize-popover-page',
  templateUrl: 'ma-selectize-popover-page.html'
})
export class MASelectizePopoverPageComponent {

  element: ConlluElement = null;
  myconfig = {}
  config = null
  options = []
  // @ViewChild('myinput') myinput: FormGroup;
  @ViewChild('myselectize') myselectize: any;
  diacsOptions: any[] = [];
  // rank = 1;
  selected = {form:""}

  // @ViewChild('diacs') diacsGroup: RadioGroup;

  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {

    this.config = navParams.data.config
    this.element = navParams.data.element
    console.log(this.element.analysis)
    if(this.element.analysis)
      this.options = this.element.analysis
          .map((e,i)=>new Object({
            value: e.id,
            counter: i,
            title: i + ":" +e.lemma,
            // score: e.miscs["SCORE"],
            lemma: (e.children.length > 0 ? e.children.map(ee=>ee.lemma).join("") : e.lemma),
            elements: (e.children.length > 0 ? e.children : [e]),
            forsearch: (e.children.length > 0 ? e.children : [e]).map(e=>e.form+" "+e.xpostag+" "+e.upostag).join(" "),
            o: e,
          }))
     else
       this.options = []
    this.myconfig = this.selectize_config()
  }
  ngAfterViewInit() {
    // this.myselectize.selectize.focus()
    setTimeout(() => {
      this.myselectize.selectize.focus()
      this.myselectize.selectize.okayToClose = true
    },500);
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
                return '<div>' +
                    '<div class="title">' +
                        '<span class="counter">' + escape(item.counter) + '</span>' +
                        '<span class="by">' + escape(item.lemma) + '</span>' +
                    '</div>' +
                    '<ul class="elements">' + 
                    item.elements.map(e=>{
                      return "<li><div class='element'><div class='form'>"+e.form+"</div><div class='pos'>"+e.xpostag+"</div><div class='morphfeats'>"+
                      e.features.map(e=>`<span class='morphfeat ${e.key}'>`+e.value+"</span>")+"</div></div></li>"
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
        onItemAdd: function(value, $item) {
          var el = that.element.analysis.find(val=>{
            return value == val.id
          })
         that.element.changeWith(el);
         that.viewCtrl.dismiss()
        },
        create: false
      }
  }
}