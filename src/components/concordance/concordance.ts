import { SimpleChanges, Component, Input } from '@angular/core';
import { Events, ToastController, ViewController, NavParams } from 'ionic-angular';
import { ConfigJSON } from '../../providers/config-json.class';

/**
 * Generated class for the GuiderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'concordance',
  templateUrl: 'concordance.html'
})

export class ConcordanceComponent {
  @Input() element
  elementIndex : number = 0
  @Input() config : ConfigJSON

  constructor(//private navParams: NavParams,
    // public events: Events,
    // public toastCtrl: ToastController,
    // public viewCtrl: ViewController
    ) {
  }
}
