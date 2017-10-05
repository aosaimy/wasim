import { Injectable, Pipe } from '@angular/core';
import { ConlluElement } from '../pages/annotate/conllu';

/*
  Generated class for the NotMultiTag pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'notmultitag',
  pure: false
})
@Injectable()
export class NotMultiTag {
  /*
    Takes a value and makes it lowercase.
   */
  transform(list: ConlluElement[]): any[] {
    return list.filter(item => !item.isMultiword());
  }
}
