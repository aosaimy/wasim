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
export class ConlluService {

  constructor(public http: Http,
  	public myconfig: ConfigurationService) {
  }
  data = {}
  options = new RequestOptions({ withCredentials: true });
  load(project:string, hash: string, pageid: string) {
	  if (this.data[project+"-"+pageid]) {
	    // already loaded data
	    return Promise.resolve(this.data[project+"-"+pageid]);
	  }
	  // don't have the data yet
	  return new Promise<string>((resolve,reject) => {
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

	     this.http.post(this.myconfig.getValue("server")+"conllu_get",{
				"project": project,
				"hash": hash,
				"file": pageid,
				// "argv": {
				// 	// "t": tool,
				// 	"d": false,
				// 	// "align": true,
				// 	"strict": true
				// }
			},this.options)
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // data = data;
	        if(data.ok){
            //TODO view only if data.mode == "readonly"
	        	this.data[project+"-"+pageid] = data.file;
	        	resolve(this.data[project+"-"+pageid]);
	        }
	        else{
            console.error(data.error)
	        	reject(data.error)
          }
	      });
	  });
	}
	projects = {}
	getList(project:string,hash:string, force_update:boolean = false) {
	  if (!force_update && this.projects[project]) {
	    return Promise.resolve(this.projects[project]);
	  }
	  // don't have the data yet
	  return new Promise(resolve => {
	     this.http.post(this.myconfig.getValue("server")+"conllu_list",{
				"project": project,
				"hash": hash,
			},this.options)
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
	  // don't have the data yet
	  return new Promise<{ok:boolean, filename: string, firstline: string, error: string}>((resolve,reject) => {
	    // We're using Angular HTTP provider to request the data,
	    // then on the response, it'll map the JSON data to a parsed JS object.
	    // Next, we process the data and resolve the promise with the new data.


	     this.http.post(this.myconfig.getValue("server")+'conllu_udpipe', {
	     	tokenizer: true,
	     	tagger: true,
			"project": project,
			"hash": hash,
	     	sentence: sentence,
	     	model: language,
	     	newFilename: newFilename,
	     },this.options)
	      .map(res => res.json())
	      .subscribe((data) => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        if(data.ok)
	        	resolve(data);
	        else
	        	reject(data.error)
	      });
	  });
	}
	save(project:string, hash: string, pageid: string, file: string) {
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

	     this.http.post(this.myconfig.getValue("server")+'conllu_save',{
				"project": project,
				"hash": hash,
				"pageid": pageid,
				"data" : file
			},this.options)
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        if(data.ok){
            this.data[project+"-"+pageid] = file
            if(this.projects[project])
              this.projects[project].files.find(x=>x.filename==pageid).firstline = file.split("\n")[0]
        		resolve(data);
          }
        	else
        		reject(data.error)
	      });
	  });
	}
	remove(project:string, hash: string, pageid: string) {
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

	     this.http.post(this.myconfig.getValue("server")+'conllu_remove',{
				"project": project,
				"hash": hash,
				"pageid": pageid,
			},this.options)
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
