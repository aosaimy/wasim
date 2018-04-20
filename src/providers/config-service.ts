import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Http , Headers, RequestOptionsArgs } from '@angular/http';
import { RequestOptions, Request, RequestMethod} from '@angular/http';
// import { Sentence} from '../pages/annotate/conllu';
import 'rxjs/add/operator/map';


/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
interface KeyboardJSON {
  code : string
  action : string
  altKey: boolean
  metaKey: boolean
  shiftKey: boolean
  params : string[]
}

interface TagsJSON {
  mapFrom: string[]
  tag: string
  desc: string
  count: number
  fn: number
  mapToConllU: string
  mf: string[]
}

export class ConfigJSON {
      remote_repo : string ="";
      language : string ="qac";
      tagset: string ="";
      rowlength: number = 7;
      debug: boolean = false;
      keyboardShortcuts: KeyboardJSON[] = [];
      MfVsPos:{} = {};
      MfVsPos_upostag:boolean = true;
      concordanceWindow:number = 5;
      mf:{} = {};
      isRtl:boolean = true;
      useUD:boolean = true;
      sync:boolean = true;
      alltags : TagsJSON[] = [];
      allxtags : string[] = [];
      allutags : string[] = [];
      onFeatSelect : { [id:string]: { [id:string]: string[] }} = {};
      tags : { [id:string]: {tag:string,desc:string}} = {};
      sentenceTags : any[] = [];
      loaded: boolean = false
      undoSize: number = 5
      features: { [id:string]: {tag:string,desc:string}} = {};
      constructor(){
      }
      getFeature(key) : {tag:string,desc:string}{
        return this.features[key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }
      // getFeatures(xpostag){
      //   return this.alltags.find(x=>x.tag==this.xpostag)
      // }
      getXPosTag(key): {tag:string,desc:string}{
        return this.tags["X:"+key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }

      getUPosTag(key): {tag:string,desc:string}{
        return this.tags["U:"+key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }
}


@Injectable()
export class ConfigService {

  constructor(public http: Http,
  	public myconfig: Config) {
      this.config.default = new ConfigJSON()
  }

  config : {[id:string]:ConfigJSON } = {}


  load(project:string, hash: string,) {
	  if (this.config[project]) {
	    // already loaded data
	    return Promise.resolve(this.config[project]);
	  }
	  var that = this
	  // don't have the data yet
	  return new Promise((resolve,reject) => {
	     this.http.post(this.myconfig.get("server")+"get_config",{
	     	project: project,
	     	hash: hash
	     })
	      .map(res => res.json())
	      .subscribe(data => {
	        if(data.ok){
            var config = new ConfigJSON()
            config.remote_repo = data.config.remote_repo
            config.language = data.config.language
            config.tagset = data.config.tagset
            config.useUD = data.config.useUD
            config.rowlength = data.config.rowlength
            config.isRtl = data.config.isRtl
            config.sync = data.config.sync
            config.undoSize = data.config.undoSize
            config.keyboardShortcuts = data.config.keyboardShortcuts
            config.onFeatSelect = data.config.onFeatSelect
            config.MfVsPos = data.config["MF.vs.POS"]
            config.MfVsPos_upostag = data.config["MF.vs.POS_upostag"]

            config.mf = data.config.mf
            config.sentenceTags = data.config.sentenceTags
            config.allutags = data.config.allutags

            data.config.alltags.forEach((xx,i,arr)=> {
              arr[i].mapFrom = arr[i].mapFrom || ""
            })
	        	if(data.config["MF.vs.POS"]){
              config.MfVsPos = data.config["MF.vs.POS"]
		        	data.config.alltags.forEach((xx,i,arr)=> {
                  arr[i].features = Object.keys(data.config.mf).filter(x=>data.config["MF.vs.POS"][x].indexOf(data.config["MF.vs.POS_upostag"] ? xx.mapToConllU : xx.tag) >= 0)
	             })
            }
            else{
              console.error("config['MF.vs.POS'] is missing")
            }
            config.alltags = data.config.alltags
            config.allxtags = data.config.alltags.map(x=>x.tag)
            // data.config.allutags = data.config.alltags.map(x=>x.mapToConllU).sort().filter(function(el,i,a){return i==a.indexOf(el);}) // sort and unique
		        config.tags = {}
            config.alltags.forEach(x=>config.tags["X:"+x.tag]=x)
            // config.allutags.forEach(x=>config.tags["U:"+x.tag]=x)
            config.tags["X:_"]={tag:"_",desc:"_"}
            config.tags["U:_"]={tag:"_",desc:"_"}

            config.features = {}
            Object.keys(data.config.mf).forEach(k=>data.config.mf[k].forEach(v=>config.features[k+"="+v.tag]=v))

            that.config[project] = config
	        	resolve(that.config[project]);
	        }
	        else
	        	if(data.default)
	        		that.config.default = data.default
	        	reject(data)
	      });
	  });
	}

  save(project:string, hash: string,config: ConfigJSON) {
	  var that = this
	  // don't have the data yet
	  return new Promise((resolve,reject) => {

	     this.http.post(this.myconfig.get("server")+"save_config",{
	     	project: project,
	     	hash: hash,
	     	config: config
	     })
	      .map(res => res.json())
	      .subscribe(data => {
	        if(data.ok){
	        	resolve();
            config.isRtl = this.isRtl(project)
	        	this.config[project] = config
	        }
	        else
	        	reject(data.error)
	      });
	  });
	}
	getConfig(project){
		return this.config[project] ? this.config[project] : this.config.default
	}
	rtls = ["arabic","qac"]
	isRtl(project){
    if(this.getConfig(project).isRtl != undefined)
      return this.getConfig(project).isRtl
		return this.rtls.indexOf(this.getConfig(project).language) >= 0

	}

}
