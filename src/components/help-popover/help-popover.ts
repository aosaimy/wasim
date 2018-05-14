import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';
import {  ConfigJSON } from '../../providers/config-json.class';

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
  config : ConfigJSON = null
  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {
    this.config = navParams.data.config
    this.shortcuts = this.config.keyboardShortcuts.map(e=>{
      let params = e.params ? e.params.join() : ""
      if(e.code.indexOf("Digit") ==0)
        params = ""
      if(e.code.indexOf("F"+params) ==0)
        params = ""

      return [e.keys.join(" + "), e.desc || e.action, params ]
    })
  }
}

