import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';

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

  shortcuts = [["⌘ + S", "Convert to Conll then Save"],
  ["⌘ + ⇧ + S", "Convert to Conll"],
  ["Q, W, E, R, A, S, W, X", "Add a diactric"],
  ["⇦,⇨", "Move next/prev Word"],
  ["⇦,⇨", "Move next/prev Word"],
  ["⌘ + U", "Undo last action"],
  ["+/-", "Add a new segment to the current word/Delete current segment"],
  ["1-9", "Assign current segment a new tag"],
  ["0", "Show more less-frequent tags"],]
  constructor(private navParams: NavParams,
    // public data: Data,
    public viewCtrl: ViewController) {
  }
}

