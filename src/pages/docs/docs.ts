import { Component } from '@angular/core';
import { Config, ToastController, NavController, NavParams } from 'ionic-angular';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConlluService } from '../../providers/conllu-service';
import { ProjectsPage } from '../projects/projects';
import { AnnotatePage } from '../annotate/annotate';
import { ConfigService } from '../../providers/config-service';

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

  public uploader:FileUploader = new FileUploader({url: this.myconfig.get("server")+"conllu_upload"});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  public project = ""
  public hash = ""
  public newFilename = ""
  public text = ""
  public list : {filename:string, firstline:string}[]= []
  public config :string = ""

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    private conlluService: ConlluService,
    private myconfig: Config,
    private configService: ConfigService,
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
	          message: result.error,
	          duration: 3000,
	          position: "top"
	        }).present()
  	})

    this.configService.load(this.project, this.hash).then(s=>{
      this.config = JSON.stringify(this.configService.getConfig(this.project),null,4)
    }).catch(x=>{
      // this.config = JSON.stringify(this.configService.getConfig(this.project),null,4)
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
	    var that = this
	  	this.conlluService.udpipe(this.project,this.hash,sentence,this.newFilename,this.configService.getConfig(this.project).language).then((result)=>{
	  			that.list.push({filename:result.filename,firstline:result.firstline})
	  	}).catch(err=>{
        this.toastCtrl.create({
            message: err,
            duration: 3000,
            position: "top"
          }).present()
      })
  }
  configErrors=""
  saveConfig(){
    try{
      this.configService.save(this.project, this.hash,JSON.parse(this.config)).then(e=>{
        this.toastCtrl.create({
              message: "Config file has been updated successfully.",
              duration: 3000,
              position: "top"
            }).present() ;
        }).catch(e=>{
        throw({message:e})
      })
    }
    catch(e){
      console.dir(e)
      this.configErrors = e.message
    }

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

}
