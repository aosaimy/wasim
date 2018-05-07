import { Component } from '@angular/core';
import { ToastController,ViewController,ModalController, NavController, NavParams } from 'ionic-angular';
import { ProjectService } from '../../providers/project-service';
import { DocsPage } from '../docs/docs';
// import { Storage } from '@ionic/storage';

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
  public projects = []
  // public validSecurity  = false

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    private projectService: ProjectService,
    // public storage: Storage,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  	) {
  	// this.storage.get("security").then(v=>{
  	// 	this.security = v
	  // 	if(this.security){
  	// 		this.validSecurity = true
  	// 		this.securityChanged()
	  // 	}

  	// });
    this.list()
  }

  new_project = ""
  create(){
  	this.projectService.create(this.new_project)
  		.then((result:{ok:boolean,hash:string,project:string,error:string})=>{
  		if(result.ok){
  			this.projects.push({
  				project: result.project,
  				hash: result.hash,
  			})
  			// this.storage.set("project_hash_"+result.project,result.hash);
  		}
  	}).catch(e=>{
              this.toastCtrl.create({
            message: e.error,
            duration: 3000,
            position: "top"
          }).present()

    })
  }
  goto(project){
    this.navCtrl.push(DocsPage,{
      project: project.project,
      hash: project.hash,
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
  list(){
  	this.projectService.list().then((result:{ok:boolean,projects:string[],error:string})=>{
			this.projects = result.projects
			// this.validSecurity = true
			// this.storage.set("security",this.security);
			if(result.projects.length == 0){
				this.toastCtrl.create({
	          message: "There is no projects created yet. Please create one now.",
	          duration: 3000,
	          position: "top"
	        }).present()
			}
  	}).catch(error=>{
        this.toastCtrl.create({
            message: error,
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
 constructor(public viewCtrl: ViewController, params: NavParams,private projectService: ProjectService,    public toastCtrl: ToastController) {
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
            message: e,
            duration: 3000,
            position: "top"
          }).present()

    })
 }

}
