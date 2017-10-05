import { Component, Input } from '@angular/core';
import { Events, ToastController, ViewController , NavParams } from 'ionic-angular';
import { ConfigService } from '../../providers/config-service';

/**
 * Generated class for the TagsSelectorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tags-selector',
  templateUrl: 'tags-selector.html',
  inputs: ['config']
})
export class TagsSelectorComponent {

	tagsRow = 0;
	currentTags = []
	// alltags: { tag: string, desc: string, count: number, fn?: number }[] = this.config.alltags
	// @Input() configService :ConfigService
  // @Input("config") config //= {"asda":"asd"}
  public config
  // @Input() hash : string = ""

  allTags = []
  constructor(private navParams: NavParams,
    // public data: Data,
    // private configService: ConfigService,
    private events: Events,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
    this.tagsRow = 0;
  }
  ngOnInit(){
    this.allTags = this.config.alltags
    this.currentTags = this.getTags()
  }
  getTags() {
    var counter = 1;
    return this.allTags.slice(this.tagsRow * 9, (this.tagsRow + 1) * 9).map(x => {
      x.fn = counter++;
      return x
    });
  }
  increaseTagsRow() {
    this.tagsRow++;
    this.currentTags = this.getTags()
    if(this.currentTags.length == 0){
      this.tagsRow = 0
      this.currentTags = this.getTags()
    }

  }
  selectTag(tag){
    this.events.publish("changeTag",tag);
  }
}
