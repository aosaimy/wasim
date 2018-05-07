import { ConlluElement } from 'conllu-dao';
import { Component, ViewChild } from '@angular/core';
import { ViewController , NavParams } from 'ionic-angular';
import { ConfigJSON } from '../../providers/config-service';

@Component({
  selector: 'selectize-popover-page',
  templateUrl: 'selectize-popover-page.html'
})
export class SelectizePopoverPageComponent {

  element: ConlluElement = null;
  config: ConfigJSON = new ConfigJSON()
  myconfig = {}
  public options = []
  // @ViewChild('myinput') myinput: FormGroup;
  @ViewChild('myselectize') myselectize: any;
  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {
    this.element = navParams.data.element
    this.config = navParams.data.config
    this.options = [].concat.apply([],navParams.data.options.map(x=>this.config.mf[x]
        .map(i=>new Object({
          value: x+"="+i.tag,
          title: x+"="+i.desc,
          feature: x,
          val: i,
          custom_selectize_class: x,
        }))
      )
    )
    this.myconfig = this.selectize_config()
    // console.log(this.options)
    // console.log(this.myconfig)
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
            // console.log(x.key, x.value)
            var item = that.options.find(xx=>xx.feature == x.key && xx.val.tag == x.value)
            if(item)
              this.addItem(item.feature+"="+item.val.tag)
          })
        },
        onDropdownClose : function(e){
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
        onItemAdd: function(value, $item) {
          var item = that.options.find(x=>x.value == value)
          Object.keys(this.options).filter(x=>this.options[x].feature == item.feature && x != value).forEach(x=>this.removeOption(x))

          that.element.setFeature(item.feature,item.val.tag);
          if(that.config.onFeatSelect && that.config.onFeatSelect[that.element.upostag] && that.config.onFeatSelect[that.element.upostag][item.feature+"="+item.val.tag])
            that.config.onFeatSelect[that.element.upostag][item.feature+"="+item.val.tag].forEach(x=>{
              if(that.element.features[x.split("=")[0]] == undefined)
                this.addItem(x)
            })
          this.refreshOptions()
        },
        onItemRemove: function(value, $item) {
          var x = value.split("=")[0]
          that.config.mf[value.split("=")[0]].map(i=>new Object({
            value: x+"="+i.tag,
            title: x+"="+i.desc,
            feature: x,
            val: i,
            custom_selectize_class: x,
          })).forEach(x=>this.addOption(x))
          that.element.setFeature(value.split("=")[0],null);
          this.refreshOptions()
        },
        create: false
      }
  }
}
