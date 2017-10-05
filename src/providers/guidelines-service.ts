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
export class GuidelinesService {

  constructor(public http: Http,
  	public myconfig: Config) {
  }
  guidelines = {
  	loaded: false,
  	specialPos : [],
  	specialSeg : [],
  }
  load(project:string, hash: string,) {
	  if (this.guidelines.loaded) {
	    // already loaded data
	    return Promise.resolve(this.guidelines);
	  }
	  var that = this
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

	     this.http.post(this.myconfig.get("server")+"guidelines",{
	     	project: project,
	     	hash: hash
	     })
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // data = data;
	        if(data.ok){
	        	data.guides.forEach(v=>{
	        		if(v.ok){
	        			that.guidelines[v.type] = v.data
	        			this.guidelines[v.type] = this.guidelines[v.type].map(x=>{
	        				x.form_normalized=x.form.replace(/[ًٌٍَُِّْٰۢٓ۟۠ۥـٔ]/g,"")
	        				return x;
	        			})
	        		}
	        	});
	        	resolve(that.guidelines);
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
}