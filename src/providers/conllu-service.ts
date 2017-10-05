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
export class ConlluService {

  constructor(public http: Http,
  	public myconfig: Config) {
  }
  data = {}
  load(project:string, hash: string, pageid: string) {
	  if (this.data[project+"-"+pageid]) {
	    // already loaded data
	    return Promise.resolve(this.data[project+"-"+pageid]);
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

	     this.http.post(this.myconfig.get("server")+"conllu_get",{
				"project": project,
				"hash": hash,
				"file": pageid,
				// "argv": {
				// 	// "t": tool,
				// 	"d": false,
				// 	// "align": true,
				// 	"strict": true
				// }
			})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // data = data;
	        if(data.ok){
	        	that.data[project+"-"+pageid] = data.file;
	        	resolve(that.data[project+"-"+pageid]);
	        }
	        else
	        	reject(data.error)
	      });
	  });
	}
	projects = {}
	getList(project:string,hash:string, force_update:boolean = false) {
	  if (!force_update && this.projects[project]) {
	    return Promise.resolve(this.projects[project]);
	  }
	  var that = this
	  // don't have the data yet
	  return new Promise(resolve => {
	     this.http.post(this.myconfig.get("server")+"conllu_list",{
				"project": project,
				"hash": hash,
			})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // data = data;
	        if(data.ok){
	        	this.projects[project] = data;
	        }
        	resolve(data);
	      });
	  });
	}
  	udpipe(project:string,hash:string, sentence:string,newFilename:string, language: string) {
	  var that = this
	  // don't have the data yet
	  return new Promise((resolve,reject) => {
	    // We're using Angular HTTP provider to request the data,
	    // then on the response, it'll map the JSON data to a parsed JS object.
	    // Next, we process the data and resolve the promise with the new data.


	     this.http.post(this.myconfig.get("server")+'conllu_udpipe', {
	     	tokenizer: true,
	     	tagger: true,
			"project": project,
			"hash": hash,
	     	sentence: sentence,
	     	model: language,
	     	newFilename: newFilename,
	     })
	      .map(res => res.json())
	      .subscribe((data: {ok:boolean, filename: string, error: string}) => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        if(data.ok)
	        	resolve(data);
	        else
	        	reject(data.error)
	      });
	  });
	}
	save(project:string, hash: string, pageid: string, data: string) {
	  var that = this
	  // don't have the data yet
	  return new Promise<any>((resolve,reject) => {
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

	     this.http.post(this.myconfig.get("server")+'conllu_save',{
				"project": project,
				"hash": hash,
				"pageid": pageid,
				"data" : data
			})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        console.log(data)
	        // data = data;
	        if(data.ok)
        		resolve(data);
        	else
        		reject(data.error)
	      });
	  });
	}
	remove(project:string, hash: string, pageid: string) {
	  var that = this
	  // don't have the data yet
	  return new Promise<any>((resolve,reject) => {
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

	     this.http.post(this.myconfig.get("server")+'conllu_remove',{
				"project": project,
				"hash": hash,
				"pageid": pageid,
			})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        console.log(data)
	        // data = data;
	        if(data.ok)
        		resolve(data);
        	// else
        	// 	reject(data.error)
	      });
	  });
	}

}
