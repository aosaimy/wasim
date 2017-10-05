import { ConlluElement } from '../../pages/annotate/conllu';
import { Component, Input, ViewChild } from '@angular/core';
import { ViewController , NavParams } from 'ionic-angular';

@Component({
  selector: 'selectize-popover-page',
  templateUrl: 'selectize-popover-page.html'
})
export class SelectizePopoverPageComponent {

  element: ConlluElement = null;
  config = {mf:{},"MF.vs.POS":{}}
  myconfig = {}
  options = []
  // @ViewChild('myinput') myinput: FormGroup;
  @ViewChild('myselectize') myselectize: any;
  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {
    this.element = navParams.data.element
    this.config = navParams.data.config
    this.options = [].concat.apply([], Object.keys(this.config.mf)
      .filter(x=>this.config["MF.vs.POS"][x]
          .indexOf(this.config["MF.vs.POS_upostag"] ? this.element.upostag : this.element.xpostag) >= 0)
      .map(x=>this.config.mf[x]
        .map(i=>new Object({
          value: x+"="+i,
          title: x+"="+i,
          feature: x,
          val: i,
          custom_selectize_class: x,
        }))
      )
    )
    this.myconfig = this.selectize_config()
    console.log(this.myconfig)
  }
  ngAfterViewInit() {
    // this.myselectize.selectize.focus()
    setTimeout(() => {
      this.myselectize.selectize.focus()
      this.myselectize.selectize.shouldclose = true
    },500);
  }

  selectize_config = function(){
    var that = this
    if(this.options.length == 0 )
      this.options.push({
            value: "UNK",
            title: "UNK",
            feature: "UNK",
            val: "UNK",
            custom_selectize_class: "UNK",
          })
    return {
        maxItems: null,
        valueField: 'value',
        labelField: 'value',
        searchField: ['feature','val','title'],
        plugins: ['optgroup_columns'],
        options: this.options,
        optgroups: Object.keys(this.config.mf).map((x,i)=>new Object({
          $order: i,
          id: x,
          name: x
        })),
        onInitialize: function(){
          that.element.features.forEach(x=>{
            this.addItem(x.key+"="+x.value)
          })
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
        onItemAdd: function(value, $item) {
          Object.keys(this.options).filter(x=>this.options[x].feature == value.split("=")[0] && x != value).forEach(x=>this.removeOption(x))
          that.element.setFeature(value.split("=")[0],value.split("=")[1]);
          this.refreshOptions()
        },
        onItemRemove: function(value, $item) {
          var x = value.split("=")[0]
          that.config.mf[value.split("=")[0]].map(i=>new Object({
            value: x+"="+i,
            title: x+"="+i,
            feature: x,
            val: i,
            custom_selectize_class: x,
          }))
          .forEach(x=>this.addOption(x))
          that.element.setFeature(value.split("=")[0],null);
          this.refreshOptions()
        },
        create: false
      }
  }
}