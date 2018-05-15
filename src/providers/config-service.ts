import { Injectable } from '@angular/core';
// import { Config } from 'ionic-angular';
import { ConfigurationService } from "ionic-configuration-service";
import { Http , Headers, RequestOptionsArgs } from '@angular/http';
import { RequestOptions, Request, RequestMethod} from '@angular/http';
import { ConfigJSON} from './config-json.class';
// import { Sentence} from '../pages/annotate/conllu';
// import 'rxjs/add/operator/map';


/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

let desc = {"saveFile":"Convert to Conll then Save",
  "syncConllU":"Convert to Conll",
  "diactric":"Add a diactric",
  "nav":"Move next/prev Word",
  "undo":"Undo last action (move backward in action history)",
  "redo":"Move forward in action history",
  "segment":"Edit the form/Add new segments to the current word/Delete current segment",
  "tag":"Assign current segment a new tag",
  "tag_ma":"Ask a morphological analyser for help",
  "tag_morphofeatures":"Assign morphological features",
  "diac":"Mark the last character with a diacritic",
  "more":"Show more less-frequent tags"}

@Injectable()
export class ConfigService {

  constructor(public http: Http,
  	public myconfig: ConfigurationService) {
      this.config.default = new ConfigJSON()
  }

  config : {[id:string]:ConfigJSON } = {}


  load(project:string, hash: string,) {
	  if (this.config[project]) {
	    // already loaded data
	    return Promise.resolve(this.config[project]);
	  }
	  // don't have the data yet
	  return new Promise<ConfigJSON>((resolve,reject) => {
	     this.http.post(this.myconfig.getValue("server")+"get_config",{
	     	project: project,
	     	hash: hash
	      },new RequestOptions({ withCredentials: true }))
	      .map(res => res.json())
	      .subscribe(data => {
	        if(data.ok){
            var config = new ConfigJSON(data.config)
            config.project = project
            config.hash = hash
            config.keyboardShortcuts.forEach(e=>{
              e.keys = []
              if(e.metaKey)
                e.keys.push("⌘")
              if(e.shiftKey)
                e.keys.push("⇧")
              if(e.altKey)
                e.keys.push("⎇")
              if(!e.code) e.code = ""
              var code = e.code
                .replace(/^Key/,"")
                .replace("ArrowLeft","⇦")
                .replace("ArrowRight","⇨")
                .replace("Enter","⏎")
                if(code)
                  e.keys.push(code)
              let params = e.params ? e.params.join() : ""
              if(e.code.indexOf("Digit") ==0)
                params = ""
              if(e.code.indexOf("F"+params) ==0)
                params = ""
                e.desc = desc[e.action+params] || desc[e.action] || e.action
            })
            config.alltags.forEach((xx,i,arr)=> {
              arr[i].mapFrom = arr[i].mapFrom || [""]
            })
	        	if(config.MfVsPos){
		        	config.alltags.forEach((xx,i,arr)=> {
                  arr[i].features = Object.keys(config.mf).filter(x=>config.MfVsPos[x].indexOf(config.MfVsPos_upostag ? xx.mapToConllU : xx.tag) >= 0)
	             })
            }
            else{
              console.error("config['MF.vs.POS'] is missing")
            }
            config.allxtags = config.alltags.map(x=>x.tag)
            // config.allutags = data.config.alltags.map(x=>x.mapToConllU).sort().filter(function(el,i,a){return i==a.indexOf(el);}) // sort and unique
		        config.tags = {}
            config.alltags.forEach(x=>config.tags["X:"+x.tag]=x)
            // config.allutags.forEach(x=>config.tags["U:"+x.tag]=x)
            config.tags["X:_"]={tag:"_",desc:"_"}
            config.tags["U:_"]={tag:"_",desc:"_"}

            config.features = {}
            Object.keys(config.mf).forEach(k=>config.mf[k].forEach(v=>config.features[k+"="+v.tag]=v))

            this.config[project] = config
	        	resolve(this.config[project]);
	        }
	        else
	        	// if(data.default)
	        	// 	that.config.default = data.default
	        	reject(data.error)
	      });
	  });
	}

  save(project:string, hash: string,config: ConfigJSON) {
    config = JSON.parse(JSON.stringify(config))
    delete config.hash
	  // don't have the data yet
	  return new Promise((resolve,reject) => {

	     this.http.post(this.myconfig.getValue("server")+"save_config",{
	     	project: project,
	     	hash: hash,
	     	config: config
	     },new RequestOptions({ withCredentials: true }))
	      .map(res => res.json())
	      .subscribe(data => {
	        if(data.ok){
	        	resolve();
            config.isRtl = this.isRtl(project)
	        	this.config[project] = new ConfigJSON(config)
	        }
	        else
	        	reject(data.error)
	      });
	  });
	}
	getConfig(project) : ConfigJSON{
		return this.config[project] ? this.config[project] : this.config.default
	}
	rtls = ["arabic","qac"]
	isRtl(project){
    if(this.getConfig(project).isRtl != undefined)
      return this.getConfig(project).isRtl
		return this.rtls.indexOf(this.getConfig(project).language) >= 0

	}

}
