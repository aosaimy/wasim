import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
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
import { ConcordanceComponent } from '../components/concordance/concordance';
import { HelpPopoverComponent } from '../components/help-popover/help-popover';
import { ConlluEditorComponent } from '../components/conllu-editor/conllu-editor';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { HighlightComponent } from '../components/highlight/highlight';
import { DocsPage } from '../pages/docs/docs';
import { ProjectsPage,LoginModal } from '../pages/projects/projects';
import { NotMultiTag } from '../pipes/not-multi-tag';
import { IsNextSentence } from '../pipes/is-next-sentence';
import { HttpModule} from '@angular/http';

// import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NgSelectizeModule} from 'ng-selectize';
import { FileSelectDirective,FileDropDirective } from 'ng2-file-upload';
import {FocusModule} from 'angular2-focus';

import { ConfigurationService } from "ionic-configuration-service";

export function loadConfiguration(configurationService: ConfigurationService): () => Promise<void> {
  return () => configurationService.load("assets/ionic.config.json");
}


// import { Storage } from '@ionic/storage';

// let storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__hadiths' })// optional config);

// export function provideData() {
//   return new Data(storage)// optional config);
// }
// export function provideStorage() {
  // return storage;
// }


// var wasim_config = {
//   server: "http://wasim-api.localhost/",
//   // udpipe: "http://localhost:1441/",
//   locationStrategy: 'hash',
// }


export const deepLinkConfig: DeepLinkConfig = {
  links: [
    // { component: AnnotatePage, name: 'Annotate Page', segment: '',defaultHistory: [ ] },
    { component: AnnotatePage, name: 'Annotate Page', segment: 'annotate/:project/:hash/:id/:position',defaultHistory: [ ProjectsPage] },
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
    IsNextSentence,
    GetFormPopoverComponent,
    SelectizePopoverPageComponent,
    MASelectizePopoverPageComponent,
    ConlluEditorComponent,
    TagsSelectorComponent,
    HelpPopoverComponent,
    DocsPage,
    ProjectsPage,
    LoginModal,
    FileSelectDirective,
    FileDropDirective,
    GuiderComponent,
    ConcordanceComponent
  ],
  imports: [
    FocusModule.forRoot(),
    BrowserModule,
    HttpModule,
    // HttpClientModule,
    NgSelectizeModule,
    // IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{locationStrategy: 'hash'}, deepLinkConfig)
    // IonicModule.forRoot(MyApp,wasim_config, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DocsPage,
    ProjectsPage,
    LoginModal,
    GetFormPopoverComponent,
    SelectizePopoverPageComponent,
    MASelectizePopoverPageComponent,
    HelpPopoverComponent,
    AnnotatePage
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  ConfigurationService,
  {
    provide: APP_INITIALIZER,
    useFactory: loadConfiguration,
    deps: [ConfigurationService],
    multi: true
  },

  // Data,
  StatusBar,
  SplashScreen,
  InAppBrowser,
  WordService,
  ConlluService,
  ConfigService,
  GuidelinesService,
  ProjectService,
  // { provide: Storage, useFactory: provideStorage },
]
})
export class AppModule {}
