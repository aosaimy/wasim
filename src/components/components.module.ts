import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectizePopoverPageComponent } from './selectize-popover-page/selectize-popover-page';
import { MASelectizePopoverPageComponent } from './ma-selectize-popover-page/ma-selectize-popover-page';
import { ConcordanceComponent } from './concordance/concordance';
import { GuiderComponent } from './guider/guider';
import { HelpPopoverComponent } from './help-popover/help-popover';
import { TagsSelectorComponent } from './tags-selector/tags-selector';
import { ConlluEditorComponent } from './conllu-editor/conllu-editor';
import { ConfigModal } from '../pages/docs/docs';
import {NgSelectizeModule} from 'ng-selectize';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http} from '@angular/http';
import { IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgJsonEditorModule } from 'ang-jsoneditor';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// let translate =
@NgModule({
  declarations: [SelectizePopoverPageComponent,
	  MASelectizePopoverPageComponent,
    GuiderComponent,
    HelpPopoverComponent,
    TagsSelectorComponent,
    ConcordanceComponent,
    ConfigModal,
    ConlluEditorComponent],
	imports: [
    IonicModule,
    CommonModule,
    NgJsonEditorModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    NgSelectizeModule],
  entryComponents:[
    MASelectizePopoverPageComponent,
    SelectizePopoverPageComponent,
    HelpPopoverComponent,
    ConfigModal,
    ],
  exports: [SelectizePopoverPageComponent,
	  MASelectizePopoverPageComponent,
    GuiderComponent,
    TranslateModule,
    ConfigModal,
    NgJsonEditorModule,
    HelpPopoverComponent,
    TagsSelectorComponent,
    ConcordanceComponent,
    ConlluEditorComponent]
})
export class ComponentsModule {}
