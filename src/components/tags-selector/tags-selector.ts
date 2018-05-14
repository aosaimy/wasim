import { EventEmitter, Component, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { TagsJSON, ConfigJSON } from '../../providers/config-json.class';
import { ConlluElement } from 'conllu-dao';

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

  @Input() currentTags :TagsJSON[] = []
  @Input() element : ConlluElement
  @Output() nextTags : EventEmitter<boolean> = new EventEmitter();
  // @Input("config") public _config : ConfigJSON
  // set config(argv){
  //   this._config = argv
  //   this.currentTags = this.getTags()
  // }
  // get config(){
  //   return this._config
  // }
  // @Input() hash : string = ""

  constructor() {
    // this.tagsRow = 0;
  }
  selectTag(tag:TagsJSON){
    if(this.element) this.element.xpostag = tag.tag
  }
}
