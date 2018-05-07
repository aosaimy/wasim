import { Injectable, Pipe } from '@angular/core';
import { ConlluSentence } from 'conllu-dao';


/*
  Generated class for the NotMultiTag pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'isNextSentence',
  pure: false
})
@Injectable()
export class IsNextSentence {
  /*
    Takes a value and makes it lowercase.
   */
   windowSize= 1
  transform(list: ConlluSentence[], highlight: ConlluSentence): any[] {
    // let ii = parseInt(index)
    if(list==null)
      return []
    if(highlight==null)
      highlight = list[0]
    return list.filter(sent => highlight._id <= sent._id +this.windowSize && highlight._id >= sent._id -this.windowSize);
  }
}
