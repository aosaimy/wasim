import { Output, Injectable, EventEmitter } from '@angular/core';
import {Http} from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'

export class Hadith{
   sourcePage : string = ""
   orig: string = ""
   hid: number = -1
   chapter : Chapter = null
   page : number = -1
   chapterid: number = -1
   hadith: string = ""
   hadith_injected: string = ""
   footnotes: Footnote[] = []
   data: any = null
   
   constructor(private http:Http) {}
   
   process(){
     var arr = this.hadith.split(" ")
     for(var ft of this.footnotes)
       arr.splice(ft.location,0,"<span class='footnote'>("+ft.num+")</span>")
     this.hadith_injected = ["<div>",arr.join(" "),"</div>"].join(" ")
     var re = /ر[ًٌٍَُِّْ]*و[ًٌٍَُِّْ]*ا[ًٌٍَُِّْ]*ه|م[ًٌٍَُِّْ]*ت[ًٌٍَُِّْ]*ف[ًٌٍَُِّْ]*ق[ًٌٍَُِّْ]* ع[ًٌٍَُِّْ]*ل[ًٌٍَُِّْ]*ي[ًٌٍَُِّْ]*ه/.exec(this.hadith_injected)
     if(re!=null)
       this.hadith_injected = this.hadith_injected.slice(0,re.index)+"#####"+this.hadith_injected.slice(re.index)

   }
   getSourcePage(){
     return "P"+this.sourcePage+".xhtml"
   }
   getHadithData(){
     if(!this.data)
       this.data =  this.http.request('http://localhost:5001/analyzeAyah?ayah='+this.sourcePage+'&sorah=hadiths')
                 .map(res => res.json());
     return this.data;
   }
}

export class Chapter{
  id :string = ""
  chapter: number = -1
  title : string = ""
  pageRef : string = ""
  hadiths: Hadith[] = []
  

}

export class Footnote {
  text : string = ""
  hadith : Hadith = null
  num : number = -1
  location : number = -1
}


@Injectable()
export class Data {

  @Output() dataIsReady = new EventEmitter();

  isReady :boolean = false
  static singelton: Data = null
  static initialData: any = null

  hadiths : Hadith[] = []
  chapters: Chapter[] = []

  constructor(public storage: Storage, private http:Http) {
      if (Data.singelton != null)
          console.error("SINGLTON FAILURE")
      else
          Data.singelton = this;
      // this.init(()=>console.log("loaded"))
  }
  save(){
      this.storage.set("myhadiths",JSON.stringify(this.hadiths))
      this.storage.set("mychaters",JSON.stringify(this.chapters))
      this.isReady = true
      this.dataIsReady.emit("new_disaster")
  }

  init(fn=function(){}){
      this.storage.get("myhadiths").then((data)=> {
          this.hadiths = JSON.parse(data);
          if(this.hadiths == null)
              this.hadiths = []
          else{

            this.isReady = true
            this.dataIsReady.emit("new_disaster")
            return
          }

          this.getInitialData().forEach(d=>{
            d.chapters.forEach(ch=>{
              let cha = new Chapter()
              var arr = ch[1].split(" - ")
              if(arr.length != 2){
                cha.title = arr[0]
                cha.chapter = 0
              }
              else{
                cha.title = arr[1]
                cha.chapter = arr[0]
              }


              cha.id = ch[0]
              cha.pageRef = arr[2]
              this.chapters.push(cha)
            })

            d.hadiths.forEach(h=>{
              
              let ha = new Hadith(this.http)
              ha.sourcePage = h.sourcePage
              ha.orig = h.orig
              ha.hid = h.hid
              ha.chapter = this.getById(h.ch)
              if(!ha.chapter)
                console.error(h,h.ch)
              ha.chapter.hadiths.push(ha)
              ha.page = h.pageId
              ha.chapterid = h.chapterid
              ha.hadith = h.hadith

              var i = 1;
              for(var f of h.footnotes){
                let ft = new Footnote()
                ft.text = f.text
                ft.num = i++;
                ft.location = f.location
                ft.hadith = ha
                ha.footnotes.push(ft)
              }
              ha.process()

              this.hadiths.push(ha)
            })


          this.isReady = true
            this.dataIsReady.emit("new_disaster")
          })
          fn();
      })
  }

  chaptersById = null
  getById(id){
    if(this.chaptersById!=null)
      return this.chaptersById[id]
    this.chaptersById = {}
    this.chapters.forEach(ch=> this.chaptersById[ch.id] = ch)
    return this.chaptersById[id]
  }  
  getInitialData() {
    return this.http.request('./assets/json/initialData.json')
                 .map(res => res.json());
  }

  getRandomHadith(){
    return this.hadiths[Math.floor(Math.random() * this.hadiths.length) + 0 ]
  }
  getHadithById(id){
    return this.hadiths.filter(h=>h.sourcePage==id)[0]
  }


  isEverthingResolved(){
    if(true)
      this.dataIsReady.emit("ready")
  }
  getHadiths(values){
      // this.hadiths.forEach(g=>g.q.forEach(q=>{
      //     if(values[q.name] != undefined)
      //         q.setValue(values[q.name])
      //     q.q.forEach(q=>{
      //         if(values[q.name] != undefined)
      //             q.setValue(values[q.name])
      //     }
      //     );
      // }))
      // // this.initQuestionHash();
      return this.hadiths;
  }

  static deserialize(json, clazz) {
    var instance = new clazz(),
        types = instance.getTypes();

    if(Object.prototype.toString.call( json ) === '[object Array]' ) {
            instance = []
            for(var i in json)
            instance.push(Data.deserialize(json[i], clazz))
            return instance
    } 

    for(var prop in json) {
        if(!json.hasOwnProperty(prop)) {
            continue;
        }

        
        if(typeof json[prop] === 'object') {
            instance[prop] = Data.deserialize(json[prop], types[prop]);
        } else {
            instance[prop] = json[prop];
        }
    }

    return instance;
  }
}