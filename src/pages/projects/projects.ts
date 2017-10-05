import { Component } from '@angular/core';
import { ToastController, NavController, NavParams } from 'ionic-angular';
import { ProjectService } from '../../providers/project-service';
import { DocsPage } from '../docs/docs';
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

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  public security = ""
  public projects = []
  public validSecurity  = false

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    private projectService: ProjectService,
    public storage: Storage,
    public toastCtrl: ToastController
  	) {
  	this.storage.get("security").then(v=>{
  		this.security = v
	  	if(this.security){
  			this.validSecurity = true
  			this.securityChanged()
	  	}

  	});
  }

  new_project = ""
  create(){
  	this.projectService.create(this.security,this.new_project)
  		.then((result:{ok:boolean,hash:string,project:string,error:string})=>{
  		if(result.ok){
  			this.projects.push({
  				project: result.project,
  				hash: result.hash,
  			})
  			this.storage.set("project_hash_"+result.project,result.hash);
  		}
  		else
  			this.toastCtrl.create({
	          message: result.error,
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
  securityChanged(){
  	this.projectService.getList(this.security).then((result:{ok:boolean,projects:string[],error:string})=>{
  		if(result.ok){
  			this.projects = result.projects
  			this.validSecurity = true
  			this.storage.set("security",this.security);
  			if(result.projects.length == 0){
  				this.toastCtrl.create({
		          message: "There is no projects created yet. Please create one now.",
		          duration: 3000,
		          position: "top"
		        }).present()
  			}
  		}
  		else
  			this.toastCtrl.create({
	          message: result.error,
	          duration: 3000,
	          position: "top"
	        }).present()
  	})

  }
  ionViewDidLoad() {
  }
}
