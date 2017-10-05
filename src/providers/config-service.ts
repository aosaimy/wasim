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
@Injectable()
export class ConfigService {

  constructor(public http: Http,
  	public myconfig: Config) {
  }

  config = {
  	"default": {
	    "remote_repo" : "",
	    "language" : "qac",
	    "tagset": "",
	    "rowlength": 7,
	    "keyboardShortcuts":{},
	    "MF.vs.POS":{},
	    "mf":{},
	    "alltags" : [],
	    "sentenceTags" : [],
	    "loaded": false
	  }
	}
  
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
	        	if(data.config["MF.vs.POS"])
		        	data.config.alltags.forEach((xx,i,arr)=> arr[i].mf = Object.keys(data.config.mf)
	                 .filter(x=>data.config["MF.vs.POS"][x]
	                  .indexOf(data.config["MF.vs.POS_upostag"] ? xx.mapToConllU : xx.tag) >= 0)
	             	)
		        data.config.allxtags = data.config.alltags.map(x=>x.tag)
		        data.config.allutags = data.config.alltags.map(x=>x.mapToConllU).sort().filter(function(el,i,a){return i==a.indexOf(el);}) // sort and unique
		        
             	that.config[project] = data.config
	        	resolve(that.config[project]);
	        }
	        else
	        	if(data.default)
	        		that.config.default = data.default
	        	reject(data)
	      });
	  });
	}

  save(project:string, hash: string,config: {}) {
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
		return this.rtls.indexOf(this.getConfig(project).language) >= 0

	}

}