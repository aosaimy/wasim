
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER } from "@angular/core";
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
import { MyApp } from './app.component';
import { WordService } from '../providers/word-service';
import { ConlluService } from '../providers/conllu-service';
import { ConfigService } from '../providers/config-service';
import { GuidelinesService } from '../providers/guidelines-service';
import { ProjectService } from '../providers/project-service';
import { AnnotatePage } from '../pages/annotate/annotate';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ComponentsModule } from '../components/components.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DocsPage } from '../pages/docs/docs';
import { ProjectsPage,LoginModal } from '../pages/projects/projects';
import { NotMultiTag } from '../pipes/not-multi-tag';
import { IsNextSentence } from '../pipes/is-next-sentence';
import { Http, HttpModule} from '@angular/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileSelectDirective,FileDropDirective } from 'ng2-file-upload';
import { FocusModule} from 'angular2-focus';

import { ConfigurationService } from "ionic-configuration-service";

export function loadConfiguration(configurationService: ConfigurationService): () => Promise<void> {
  return () => configurationService.load("assets/ionic.config.json");
}
export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: AnnotatePage, name: 'Annotate Page', segment: 'annotate/:project/:hash/:id/:position',defaultHistory: [ ProjectsPage] },
    { component: AnnotatePage, name: 'Annotate Page', segment: 'annotate/:project/:hash/:id',defaultHistory: [ ProjectsPage] },
    { component: DocsPage, name: 'Documents Page', segment: 'docs/:project/:hash',defaultHistory: [ ProjectsPage] },
    { component: ProjectsPage, name: 'Projects Page', segment: 'projects',defaultHistory: [ ] }
  ]
};
// export function createTranslateLoader(http: Http) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

@NgModule({
  declarations: [
    MyApp,
    AnnotatePage,
    NotMultiTag,
    IsNextSentence,
    DocsPage,
    ProjectsPage,
    LoginModal,
    FileSelectDirective,
    FileDropDirective,
  ],
  imports: [
    FocusModule.forRoot(),
    BrowserModule,
    HttpModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp,{locationStrategy: 'hash'}, deepLinkConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DocsPage,
    ProjectsPage,
    LoginModal,
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
  StatusBar,
  SplashScreen,
  InAppBrowser,
  WordService,
  ConlluService,
  ConfigService,
  GuidelinesService,
  ProjectService,
]
})
export class AppModule {}
