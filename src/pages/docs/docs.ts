import { ViewChild, Component } from '@angular/core';
import { ToastController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConfigurationService } from "ionic-configuration-service";

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConlluService } from '../../providers/conllu-service';
import { ProjectsPage } from '../projects/projects';
import { AnnotatePage } from '../annotate/annotate';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../providers/config-service';
import { ConfigJSON } from '../../providers/config-json.class';

/**
 * Generated class for the DocsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-docs',
  templateUrl: 'docs.html',
})
export class DocsPage {

  public uploader:FileUploader = new FileUploader({url: this.myconfig.getValue("server")+"conllu_upload"});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  public project = ""
  public hash = ""
  public newFilename = ""
  public text = ""
  public list : {filename:string, firstline:string}[]= []
  // public config :ConfigJSON = ""

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    private conlluService: ConlluService,
    private myconfig: ConfigurationService,
    public configService: ConfigService,
    public modalCtrl: ModalController,
    private translateService: TranslateService,
    public toastCtrl: ToastController
  	) {
    if (!navParams.data.project){
      navCtrl.setRoot(ProjectsPage)
    }
    else{
      this.project = navParams.data.project;
      this.hash = navParams.data.hash;
    }
    var that = this
    this.uploader.authToken = this.project + ":" + this.hash
    this.uploader.onSuccessItem = function (item: any) {
    	that.list.push(item.file.name)
    }


  	conlluService.getList(this.project,this.hash).then((result) =>{
  		if(result.ok)
  			this.list = result.files
  		else
  			this.toastCtrl.create({
	          message: this.translateService.instant(result.error),
	          duration: 3000,
	          position: "top"
	        }).present()
  	})
  }

  goto(id){
    this.navCtrl.push(AnnotatePage,{
      project: this.project,
      hash: this.hash,
    id: id,
    })
  }
  remove(filename){
  	this.conlluService.remove(this.project,this.hash,filename).then(s=>{
  		if(s.ok)
  			this.list.splice(this.list.findIndex(x=>x.filename==filename),1)
  	})
  }
  udpipe(sentence){
	  	this.conlluService.udpipe(this.project,this.hash,sentence,this.newFilename,this.configService.getConfig(this.project).language).then((result)=>{
        this.newFilename = ""
	  			this.list.push({filename:result.filename,firstline:result.firstline})
	  	}).catch(err=>{
        this.toastCtrl.create({
            message: this.translateService.instant(err),
            duration: 3000,
            position: "top"
          }).present()
      })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DocsPage');
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  openConfig(){
    let loginModal = this.modalCtrl.create(ConfigModal,{
      project: this.project,
      hash: this.hash,
    },{
       enableBackdropDismiss: true
     });
     loginModal.present();
     // loginModal.onDidDismiss(()=>{this.list()})
  }

}

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({

  selector: 'page-login',
  // styleUrls: ['./app.component.css'],
  template: `
  <ion-header>
  <ion-navbar>
    <ion-title>{{'Configuration File' | translate}}</ion-title>
    <ion-buttons end>
      <button right ion-button icon-only (click)="saveConfig()" tabindex="-1">
        <ion-icon name="cloud-upload"></ion-icon>
      </button>
    </ion-buttons>

  </ion-navbar>
</ion-header>
<ion-content padding rtl>
<json-editor [style.height.%]="90" [options]="editorOptions" [data]="config"></json-editor>
                    <div [hidden]="!configErrors" class="configErrors">{{configErrors}}</div>
                    <!--<textarea [style.height.%]="90" [style.width.%]="100" [(ngModel)]="configStr"></textarea>-->
                    <!--<button ion-button item-end (click)="saveConfig(i)">{{'SAVE' | translate}}</button>-->
                    </ion-content>
`,
})
export class ConfigModal {

 config : ConfigJSON
 // get config (){
 //   return this._config;
 // }
 // set config (argv){
 //   // this.configStr = JSON.stringify(argv,null,4)
 //   this._config =argv
 // }
 // configStr : string = ""
 public project = ""
 public hash = ""
   public editorOptions: JsonEditorOptions;


 @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

 constructor(params: NavParams,private translateService: TranslateService,    public toastCtrl: ToastController,public configService: ConfigService) {
   // console.log('UserId', params.get('userId'));
   this.project = params.data.project
   this.hash = params.data.hash
   this.editorOptions = new JsonEditorOptions()
   this.editorOptions.schema = ConfigJSON.validation
  this.editorOptions.modes = ['code', 'tree']; // set all allowed modes

   this.configService.load(this.project, this.hash).then(s=>{
     this.config = s
    }).catch(x=>{
      // this.config = JSON.stringify(this.configService.getConfig(this.project),null,4)
    })
 }
  configErrors=""
  saveConfig(){
    try{
      this.configService.save(this.project, this.hash,this.editor.get() as any).then(e=>{
      // this.configService.save(this.project, this.hash,JSON.parse(this.configStr)).then(e=>{
        this.toastCtrl.create({
              message: this.translateService.instant("Config file has been updated successfully."),
              duration: 3000,
              position: "top"
            }).present() ;
        }).catch(e=>{
          console.dir(e)
          this.toastCtrl.create({
            message: this.translateService.instant(e),
            duration: 3000,
            position: "top"
          }).present()
          this.configErrors = e
      })
    }
    catch(e){
      console.dir(e)
      this.configErrors = e.message
    }

  }


}
