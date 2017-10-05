import { enableProdMode, Component, ViewChild } from '@angular/core';
import { Nav, Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProjectsPage } from '../pages/projects/projects';

// import { Data } from './data';

// Enable production mode unless running locally
// if (!/localhost/.test(document.location.host)) {
  enableProdMode();
// }

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProjectsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
    // public data: Data,
    public _config: Config,
    public statusbar: StatusBar,
    public splashscreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Page One', component: Page1 },
      // { title: 'Page Two', component: Page2 },
      // { title: 'Sections', component: SectionPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusbar.styleDefault();
      this.splashscreen.hide()
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
