import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Http , Headers, RequestOptionsArgs } from '@angular/http';
import { RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProjectService {

  constructor(public http: Http,
  	public myconfig: Config) {
  }
  data = {}
  list : {ok:boolean,projects:string[],error:string}= {ok:false,projects:[],error:"Not laoded yet."}
	getList(security:string) {
	  if (this.list.ok) {
	    return Promise.resolve(this.list);
	  }
	  var that = this
	  // don't have the data yet
	  return new Promise(resolve => {
	     this.http.post(this.myconfig.get("server")+"projects_list",{
				"security": security
			})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        console.log(data)
	        // data = data;
	        if(data.ok){
	        	that.list = data;
	        }
        	resolve(data);
	      });
	  });
	}
	create(security:string,project: string) {
	  var that = this
	  // don't have the data yet
	  return new Promise(resolve => {
	     this.http.post(this.myconfig.get("server")+"projects_create",{
				"security": security,
				"project": project,
			})
	      .map(res => res.json())
	      .subscribe((data:{ok:boolean,hash:string,project:string,error:string}) => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
        	resolve(data);
	      });
	  });
	}
}
