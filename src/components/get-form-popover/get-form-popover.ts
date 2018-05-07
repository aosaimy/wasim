import { Component } from '@angular/core';
import { ConlluElement } from 'conllu-dao';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GetFormPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'get-form-popover',
  templateUrl: 'get-form-popover.html'
})
export class GetFormPopoverComponent {

  element: ConlluElement = null;
  diacsOptions: any[] = [];
  rank = 1;
  selected = {form:""}

  // @ViewChild('diacs') diacsGroup: RadioGroup;

  constructor(private navParams: NavParams, public viewCtrl: ViewController) {
    this.element = navParams.data.element
    // this.diacsOptions = this.element.analysis.diacs()
    // this.diacsOptions = this.element.analysis.possibilities;
    // console.log(this.element.analysis.possibilities)
    console.log(this.diacsOptions)
    this.rank = this.diacsOptions.findIndex((val) => {
      return this.element.form == val.diac;
    })
  }

  mapObj = {
    "noun": "NOUN",
    "noun_prop" : "PROPN",
    "verb":"VERB",
    "adj":"ADJ",
    "adv":"ADV",
    "prep":"PART",
  }
  map(from){
    return this.mapObj[from] || from
  }
  onChange(ev) {
    if (ev.code == "Enter") {
      var newval = this.diacsOptions[this.rank]
      if (newval) {
        // this.element.form = newval.segmentation[this.element.isSeg] || newval.segmentation[0];
        if (newval.segmentation.length == 1){
          this.element.form = newval.segmentation[0]
        }
        else{
          newval.segmentation.forEach((seg, i) => {
            if (this.element.parent) {
              if (this.element.parent.children[i])
                this.element.parent.children[i].form = seg
            }
            else
              console.error("ERROR: Should have a parent:",this.element)
          })
        }
        this.element.lemma = newval.lemma;
        this.element.upostag = this.map(newval.pos);
      }
      // else
        // this.element.form = ev.target.value
      this.viewCtrl.dismiss()
    }
    if (ev.code == "ArrowDown") {
      ev.preventDefault()
      // var i = this.diacsOptions.findIndex((val) => {
      //   return this.rank == val.rank;
      // })
      // // var i = this.rank
      // var chosen = this.diacsOptions[i + 1 >= this.diacsOptions.length ? this.diacsOptions.length - 1 : i + 1]
      // this.element.form = chosen.diac
      // this.rank = chosen.rank
      this.rank = this.rank + 1 >= this.diacsOptions.length ? this.rank : this.rank + 1
    }
    if (ev.code == "ArrowUp") {
      ev.preventDefault()

      // var i = this.diacsOptions.findIndex((val) => {
      //   return this.rank == val.rank;
      // })
      // // var i = this.rank
      // var chosen = this.diacsOptions[i - 1 < 0 ? 0 : i - 1]
      // // this.element.form = chosen.diac
      // this.rank = chosen.rank

      this.rank = this.rank - 1 < 0 ? this.rank : this.rank - 1
    }
    if (ev.code == "Escape") {
      // this.viewCtrl.dismiss()
    }
    if (/F[0-9]/.test(ev.code)) {
      ev.preventDefault();
      console.log(ev.code)
      // this.element.form = this.element.analysis.diacs()[parseInt(ev.code.replace("F", "")) - 1]
    }
  }

}
