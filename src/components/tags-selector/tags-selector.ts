import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { ConfigJSON } from '../../providers/config-service';

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
  @Input("config") public _config : ConfigJSON
  set config(argv){
    this._config = argv
    this.currentTags = this.getTags()
  }
  get config(){
    return this._config
  }
  // @Input() hash : string = ""

  constructor(private events: Events) {
    this.tagsRow = 0;
  }
  getTags() {
    return this.config.alltags.slice(this.tagsRow * 9, (this.tagsRow + 1) * 9).map((x,i) => {
      x.fn = i+1;
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
