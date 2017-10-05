import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
import { MyApp } from './app.component';
// import { Data } from './data';
import { WordService } from '../providers/word-service';
import { ConlluService } from '../providers/conllu-service';
import { ConfigService } from '../providers/config-service';
import { GuidelinesService } from '../providers/guidelines-service';
import { ProjectService } from '../providers/project-service';
import { AnnotatePage } from '../pages/annotate/annotate';
import { SelectizePopoverPageComponent } from '../components/selectize-popover-page/selectize-popover-page';
import { MASelectizePopoverPageComponent } from '../components/ma-selectize-popover-page/ma-selectize-popover-page';
import { TagsSelectorComponent } from '../components/tags-selector/tags-selector';
import { GetFormPopoverComponent } from '../components/get-form-popover/get-form-popover';
import { GuiderComponent } from '../components/guider/guider';
import { HelpPopoverComponent } from '../components/help-popover/help-popover';
// import { HighlightComponent } from '../components/highlight/highlight';
import { DocsPage } from '../pages/docs/docs';
import { ProjectsPage } from '../pages/projects/projects';
import { NotMultiTag } from '../pipes/not-multi-tag';
import { HttpModule} from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NgSelectizeModule} from 'ng-selectize';
import { FileSelectDirective,FileDropDirective } from 'ng2-file-upload';
import { myconfig } from './config';

// import { Storage } from '@ionic/storage';

// let storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__hadiths' })// optional config);

// export function provideData() {
//   return new Data(storage)// optional config);
// }
// export function provideStorage() {
  // return storage;
// }



export const deepLinkConfig: DeepLinkConfig = {
  links: [
    // { component: AnnotatePage, name: 'Annotate Page', segment: '',defaultHistory: [ ] },
    { component: AnnotatePage, name: 'Annotate Page', segment: 'annotate/:project/:hash/:id',defaultHistory: [ ProjectsPage] },
    { component: DocsPage, name: 'Documents Page', segment: 'docs/:project/:hash',defaultHistory: [ ProjectsPage] },
    { component: ProjectsPage, name: 'Projects Page', segment: 'projects',defaultHistory: [ ] }
  ]
};

@NgModule({
  declarations: [
    MyApp,
    AnnotatePage,
    NotMultiTag,
    GetFormPopoverComponent,
    SelectizePopoverPageComponent,
    MASelectizePopoverPageComponent,
    TagsSelectorComponent,
    HelpPopoverComponent,
    DocsPage,
    ProjectsPage,
    FileSelectDirective,
    FileDropDirective,
    GuiderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgSelectizeModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,myconfig, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DocsPage,
    ProjectsPage,
    GetFormPopoverComponent,
    SelectizePopoverPageComponent,
    MASelectizePopoverPageComponent,
    HelpPopoverComponent,
    AnnotatePage
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  // Data,
  StatusBar,
  SplashScreen,

  WordService,
  ConlluService,
  ConfigService,
  GuidelinesService,
  ProjectService,
  // { provide: Storage, useFactory: provideStorage },
]
})
export class AppModule {}
