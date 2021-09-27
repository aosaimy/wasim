import { Injectable } from '@angular/core';
import { ConfigurationService } from "ionic-configuration-service";
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
export class GuidelinesService {

  constructor(public http: Http,
  	public myconfig: ConfigurationService) {
  }
  guidelines = {
    loaded: false,
    specialPos : [],
    specialSeg : [],
  }
  guidelinesObj = {
  	loaded: false,
  	specialPos : {},
  	specialSeg : {},
  }
  load(project:string, hash: string,) {
	  if (this.guidelines.loaded) {
	    // already loaded data
	    return Promise.resolve(this.guidelines);
	  }
	  // don't have the data yet
	  return new Promise((resolve,reject) => {
	    // We're using Angular HTTP provider to request the data,
	    // then on the response, it'll map the JSON data to a parsed JS object.
	    // Next, we process the data and resolve the promise with the new data.

	 //    let opts:RequestOptionsArgs = {
	 //    	headers : new Headers({
	 //    		'Content-Type': 'application/json; charset=utf-8',
	 //    		// 'Access-Control-Allow-Origin': 'http://localhost:8100'
	 //    	}),
	 //    	// 'body': JSON.stringify()
		// }

	     this.http.post(this.myconfig.getValue("server")+"guidelines",{
	     	project: project,
	     	hash: hash
	     })
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // data = data;
	        if(data.ok){
            this.guidelines.loaded = true
	        	data.guides.forEach(v=>{
	        		if(v.ok){
                this.guidelines[v.type] = v.data
	        			this.guidelinesObj[v.type] = {}
	        			this.guidelines[v.type] = this.guidelines[v.type].map(x=>{
	        				x.form_normalized=x.form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g,"")
                  let options = {}
                  x.options.forEach(x=>options[x.value]=x)
                  this.guidelinesObj[v.type][x.form_normalized]=options
	        				return x;
	        			})
	        		}
	        	});
	        	resolve(this.guidelines);
	        }
	        else
	        	reject(data.error)
	      });
	  });
	}

  get(type,form){
    form = form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g,"")
    if(!this.guidelines[type])
      return {}
    return this.guidelines[type].filter(x=>x.form_normalized==form)[0] || {}
  }
  getObj(type,form){
		form = form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g,"")
    if(!this.guidelines[type])
      return {}
		return this.guidelinesObj[type][form] || {}
	}
}
