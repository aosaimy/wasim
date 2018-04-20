import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Http , Headers, RequestOptionsArgs } from '@angular/http';
import { RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';
import { ConlluDocument, ConlluSentence, ConlluElement } from '../pages/annotate/conllu';


/*
  Generated class for the WordService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WordService {

  constructor(public http: Http,
  	public myconfig: Config) {
  }
  data = {}
  load(sentence:string,config:any) {
	  if (this.data[sentence]) {
	    // already loaded data
	    return Promise.resolve(this.data[sentence]);
	  }
	  var that = this
	  // don't have the data yet
	  return new Promise((resolve,reject) => {
	    // We're using Angular HTTP provider to request the data,
	    // then on the response, it'll map the JSON data to a parsed JS object.
	    // Next, we process the data and resolve the promise with the new data.


	     this.http.post(this.myconfig.get("server")+'ma', {sentence:sentence})
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        if(!data.ok){
	        	return resolve([])
	        }
	        var doc = new ConlluDocument(config)
	        var parsed = doc.parse(data.rs.join("\n").trim(),x=>{
	        	return console.warn("Parsing Conllu Error of MA Results:",x)
	        },true);

	        // console.log(parsed)
	        // data = data;
	        var result : ConlluElement[][] = []
          if(parsed.sentences.length == 0)
            return reject("No Analysis is returned. Check the server.")
	        parsed.sentences[0].elements
            	.forEach(e=>{
            		if(e.parent)
            		 	return
        		 	var wid = e.children.length > 0 ? e.children[0]._miscs["WID"] : e._miscs["WID"];
            		 if(!Array.isArray(result[wid]))
            		 	result[wid] = []
            		 result[wid].push(e)
            	})
	        that.data[sentence] = result;

	        resolve(that.data[sentence]);
	      });
	  });
	}

}

export class WordAnalysis{
	rank : number = -1;
	gloss : string;
	diac : string;
	lemma : string;
	pos : string;
	score : number;
	segmentation : string;
	constructor(public o) {
		this.rank = o.rank;
		this.gloss = o.gloss;
		this.diac = o.diac;
		this.lemma = o.lemma;
		this.pos = o.pos;
		this.score = o.score;
		this.segmentation = o.segmentation;
	}
}

export class Word{

	id: number = 0;
	word: string = ""
	possibilities : WordAnalysis[] = []
	constructor(public o) {
		this.update(o)
	}
	update(o) {
		this.id = o.id
		this.word = o.word
		if(o.possibilities)
			o.possibilities.forEach(e=>this.possibilities.push(new WordAnalysis(e)))
	}
	diacsArr = [];
	diacs(){
		var that = this
		if(this.diacsArr.length == 0){
			this.possibilities.forEach((e,i,arr)=>{
				if(that.diacsArr.indexOf(e.diac)==-1)
					that.diacsArr.push(e.diac)
			})
		}
		return this.diacsArr;
	}
	lemmaArr = [];
	lemma(){
		var that = this
		if(this.lemmaArr.length == 0){
			this.possibilities.forEach((e,i,arr)=>{
				if(that.lemmaArr.filter(ee=>e.gloss == ee.gloss).length==0)
					that.lemmaArr.push({
						"lemma": e.lemma,
						"gloss": e.gloss.replace(/;/g,"\n"),
					})
			})
		}
		return this.lemmaArr;
	}
}
