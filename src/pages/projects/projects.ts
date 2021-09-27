import { Component } from '@angular/core';
import { AlertController, ToastController,ViewController,ModalController, NavController, NavParams } from 'ionic-angular';
import { Proj, ProjectService } from '../../providers/project-service';
import { DocsPage } from '../docs/docs';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from "ionic-configuration-service";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProjectsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {

  // public security = ""
  public projects : {project:string, hash:string}[]= []
  // public validSecurity  = false

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    public alertCtrl: AlertController,
    private projectService: ProjectService,
    private storage: Storage,
    private myconfig: ConfigurationService,
    private translateService: TranslateService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  	) {
    this.list()
  }

  new_project = ""
  create(){
   let projectCreateModal = this.modalCtrl.create(ProjectCreateModal,{projectPage: this},{
      showBackdrop: true,
     });
     projectCreateModal.present();
  }
  goto(project){
    this.navCtrl.push(DocsPage,{
      project: project.project,
      hash: project.hash,
    })
  }
  remove(project){
    this.projectService.remove(project.project).then((result:{ok:boolean,projects:Proj[],error:string})=>{
      // this.validSecurity = true
      // this.storage.set("security",this.security);
      this.projects = this.projects.filter(p=> p!=project)
      if(this.projects.length == 0){
        this.toastCtrl.create({
            message: this.translateService.instant("There is no projects created yet. Please create one now."),
            duration: 3000,
            position: "top"
          }).present()
      }
    }).catch(error=>{
      console.error(error)
        this.toastCtrl.create({
            message: this.translateService.instant(""+error),
            duration: 3000,
            position: "top"
          }).present()
    })
  }
  logout(){
  	this.projectService.logout()
    this.projects = []
   let loginModal = this.modalCtrl.create(LoginModal,{},{
       enableBackdropDismiss: false
     });
     loginModal.present();
     loginModal.onDidDismiss(()=>{this.list()})

  }
  lang(event=null){
    let prompt = this.alertCtrl.create({
      title: this.translateService.instant('Language Change'),
      // message: this.translateService.instant("Please the language code"),
      inputs: this.translateService.getLangs().map(e=>new Object({
          name: 'lang',
          type: 'radio',
          label: e,
          checked : e == this.translateService.currentLang,
          value: e
      })),
      buttons: [
        {
          text: this.translateService.instant('Change Langugaue'),
          handler: data => {
            this.translateService.use(data);
            this.storage.get("lang").then(e=>console.log(e))
            this.storage.set("lang",data)
          }
        }
      ]
    }).present()
  }
  list(){
  	this.projectService.list().then((result:{ok:boolean,projects:Proj[],error:string})=>{
			this.projects = result.projects
			// this.validSecurity = true
			// this.storage.set("security",this.security);
			if(result.projects.length == 0){
				this.toastCtrl.create({
	          message: this.translateService.instant("There is no projects created yet. Please create one now."),
	          duration: 3000,
	          position: "top"
	        }).present()
			}
  	}).catch(error=>{
        this.toastCtrl.create({
            message: this.translateService.instant(error),
            duration: 3000,
            position: "top"
          }).present()
       let loginModal = this.modalCtrl.create(LoginModal,{},{
         enableBackdropDismiss: false
       });
       loginModal.present();
       loginModal.onDidDismiss(()=>{this.list()})

    })

  }
  ionViewDidLoad() {
  }
}


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginModal {

 username = ""
 password = ""
 constructor(public viewCtrl: ViewController, params: NavParams,private translateService: TranslateService,private projectService: ProjectService,    public toastCtrl: ToastController) {
   // console.log('UserId', params.get('userId'));
   this.username = this.projectService.username
 }
 login() {
    this.projectService.login(this.username,this.password)
      .then((result:{ok:boolean,error:string})=>{
        this.viewCtrl.dismiss({username:this.username})
    })
      .catch(e=>{
          this.toastCtrl.create({
            message: this.translateService.instant(e),
            duration: 3000,
            position: "top"
          }).present()

    })
 }
}


@Component({
  selector: 'project-create',
  templateUrl: 'project-create.html',
})

export class ProjectCreateModal {

  remote_repo= ""
  askMA= true
  askMemMA= true
  askGuider= true
  project= ""
  language= "arabic"
  debug= false
  isRtl= true
  useUD= false
  projectPage
 constructor(public viewCtrl: ViewController, params: NavParams,private translateService: TranslateService,private projectService: ProjectService,    public toastCtrl: ToastController) {
   this.projectPage = params.data.projectPage
 }
 createProject(){
   this.projectService.create(this.project, {
      remote_repo : this.remote_repo,
      askMA : this.askMA,
      askMemMA : this.askMemMA,
      askGuider : this.askGuider,
      project : this.project,
      language : this.language,
      debug : this.debug,
      isRtl : this.isRtl,
      useUD : this.useUD,
   })
      .then((result:{ok:boolean,hash:string,project:string,error:string})=>{
        this.projectPage.projects.push({
          project: result.project,
          hash: result.hash,
        })
        this.viewCtrl.dismiss({project:result.project})
    }).catch(e=>{
         this.toastCtrl.create({
          message: this.translateService.instant("Error: "+e),
          duration: 3000,
          position: "top"
        }).present()
    })

 }
 // login() {
 //    this.projectService.login(this.username,this.password)
 //      .then((result:{ok:boolean,error:string})=>{
 //        this.viewCtrl.dismiss({username:this.username})
 //    })
 //      .catch(e=>{
 //          this.toastCtrl.create({
 //            message: this.translateService.instant(e),
 //            duration: 3000,
 //            position: "top"
 //          }).present()

 //    })
 // }

}
