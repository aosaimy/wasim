import { Injectable } from '@angular/core';
// import { Config } from 'ionic-angular';
import { ConfigurationService } from "ionic-configuration-service";
import { Http , Headers, RequestOptionsArgs,RequestOptions, Request, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProjectService {

  options = new RequestOptions({ withCredentials: true });
  constructor(public http: Http,
  	public myconfig: ConfigurationService) {
  }
  data = {}
  username : null|string = null
  _list : {ok:boolean,projects:string[],error:string}= {ok:false,projects:[],error:"Not laoded yet."}
  list() {
    if (this._list.ok) {
      return Promise.resolve(this._list);
    }
    // don't have the data yet
    return new Promise((resolve,reject) => {
       this.http.post(this.myconfig.getValue("server")+"projects_list",{
        },this.options)

       .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          console.log(data)
          // data = data;
          if(data.ok){
            this.username = data.username
            this._list = data;
            resolve(data);
          }
          else
            reject(data.error)
        },error=>{
          if(error.status != 200)
            reject("Server is not working properly. url="+this.myconfig.getValue("server"))
        })

    });
  }
  login(username,password) {
    // don't have the data yet
    return new Promise((resolve,reject) => {
       this.http.post(this.myconfig.getValue("server")+"users_login",{username:username,password:password
        },this.options)
       .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          console.log(data)
          // data = data;
          if(data.ok){
            this.username = username;
            resolve(data);
          }
          else
            reject(data.error)
        },error=>{
          if(error.status != 200)
            reject("Server is not working properly. url="+this.myconfig.getValue("server"))
        })
    });
  }
	logout() {
	  // don't have the data yet
    this.username = null
    this._list = {ok:false,projects:[],error:"Not laoded yet."}
	  return new Promise((resolve,reject) => {
	     this.http.post(this.myconfig.getValue("server")+"users_logout",{
        },this.options)
	     .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        // console.log(data)
	        // data = data;
	        if(data.ok){
            resolve(data);
	        }
          else
            reject(data.error)
	      },error=>{
          if(error.status != 200)
            reject("Server is not working properly. url="+this.myconfig.getValue("server"))
        })
	  });
	}
	create(project: string) {
	  // var this = this
	  // don't have the data yet
	  return new Promise(resolve => {
	     this.http.post(this.myconfig.getValue("server")+"projects_create",{
				// "security": security,
				"project": project,
        },this.options)
	      .map(res => res.json())
	      .subscribe((data:{ok:boolean,hash:string,project:string,error:string}) => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
        	resolve(data);
	      });
	  });
	}
}
