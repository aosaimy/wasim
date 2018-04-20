import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';
import {  ConfigJSON } from '../../providers/config-service';

/**
 * Generated class for the HelpPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'help-popover',
  templateUrl: 'help-popover.html'
})
export class HelpPopoverComponent {

  shortcuts : any[] = []
  desc = {"saveFile":"Convert to Conll then Save",
  "syncConllU":"Convert to Conll",
  "diactric":"Add a diactric",
  "nav":"Move next/prev Word",
  "undo":"Undo last action (move backward in action history)",
  "redo":"Move forward in action history",
  "segment":"Edit the form/Add new segments to the current word/Delete current segment",
  "tag":"Assign current segment a new tag",
  "tag_ma":"Ask a morphological analyser for help",
  "tag_morphofeatures":"Assign morphological features",
  "diac":"Mark the last character with a diacritic",
  "more":"Show more less-frequent tags"}
  config : ConfigJSON = null
  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {
    this.config = navParams.data.config
    this.shortcuts = this.config.keyboardShortcuts.map(e=>{
      let keys = []
      if(e.metaKey)
        keys.push("⌘")
      if(e.shiftKey)
        keys.push("⇧")
      if(e.altKey)
        keys.push("⎇")
      let params = e.params ? e.params.join() : ""
      if(e.code.indexOf("Digit") ==0)
        params = ""
      if(e.code.indexOf("F"+params) ==0)
        params = ""
      var code = e.code
        .replace(/^Key/,"")
        .replace("ArrowLeft","⇦")
        .replace("ArrowRight","⇨")
        .replace("Enter","⏎")
      keys.push(code)

      return [keys.join(" + "), this.desc[e.action+params] || this.desc[e.action] || e.action, params ]
    })
  }
}

