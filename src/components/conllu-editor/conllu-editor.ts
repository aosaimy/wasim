import { Input, Output, Component,EventEmitter } from '@angular/core';

/**
 * Generated class for the ConlluEditorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'conllu-editor',
  templateUrl: 'conllu-editor.html'
})
export class ConlluEditorComponent {

  conlluRawSpans : {sentid: number,elemid: string,line: number,elems: string[]}[]
  conlluRawSpansSubset : {sentid?: number,elemid?: string,line?: number,elems?: string[]}[] = [{}]


  @Input() public filename
  _conlluRaw:string = ""

  @Input("raw")
  public set conlluRaw  (argv :string){
    if(argv!==undefined){
      this._conlluRaw = argv
      this.conlluRawSpans = this.getConlluRaw()
      this.conlluRawSpansSubset = this.conlluRawSpans.filter(e=>e.sentid === this.sid)
      this.start = this.conlluRawSpansSubset[0] ? this.conlluRawSpansSubset[0].line : 1
    }
  }
  public get conlluRaw(){
    return this._conlluRaw || ""
  }
  eid: number = -1
  sid: number = -1
  start = 1
  @Input()
  public set hid(hid:number[]){

    this.eid = hid[0]
    this.sid = hid[1]
    if(this.eid && this.sid)
      setTimeout(() => {
        let highlight_element : any = document.querySelector("conllu-editor pre > .highlight");
        if(highlight_element){
          document.querySelector("conllu-editor").scrollTo(0, highlight_element.offsetTop-100)
        }
      })
    if(this.conlluRawSpans){
      this.conlluRawSpansSubset = this.conlluRawSpans.filter(e=>e.sentid === this.sid)
      this.start = this.conlluRawSpansSubset[0] ? this.conlluRawSpansSubset[0].line : 1
    }
  }


  @Output() public conlluRawChange: EventEmitter<string> = new EventEmitter();
  @Output() public highlighElementChange: EventEmitter<string> = new EventEmitter();

  constructor() {
    this.conlluRawSpans = this.getConlluRaw()
  }

  onConlluRawSpansChanged(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      e.target.childNodes.forEach(e=>{
        if(e.nodeName != "CODE")
          return
        if(e.innerText)
          e.innerText = e.innerText.trim()+"\t"
      })
      // r[index]=e.target.innerText
      let conlluRaw = this.conlluRaw.split("\n").map((rr,i)=>{
        return i==row_index? e.target.innerText : rr
      }).join("\n")
      // console.log(this.conlluRaw)
      if(document.activeElement.classList.contains("conllu-row"))
        return
      this.conlluRawChange.emit(conlluRaw)
      this.highlighElementChange.emit('S'+r.sentid+':'+r.elemid)
      // this.saveForUndo(conlluRaw)
      // this.highlightElement('S'+r.sentid+':'+r.elemid)
    })
  }
  removeConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      // r[index]=e.target.innerText
      let conlluRaw = this.conlluRaw.split("\n").filter((rr,i)=>{
        return i!=row_index
      }).join("\n")
      // if(document.activeElement.classList.contains("conllu-row"))
      //   return
      // this.saveForUndo(conlluRaw)
      this.conlluRawChange.emit(conlluRaw)
    })
  }
  addConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    setTimeout(() => {
      // r[index]=e.target.innerText
      var ar = this.conlluRaw.split("\n")
      ar.splice(row_index,0,"# ")
      let conlluRaw = ar.join("\n")
      // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
      // console.log(this.conlluRaw)
      // console.log(document.activeElement)
      // if(document.activeElement.classList.contains("conllu-row"))
        // return
      // this.saveForUndo(conlluRaw)
      this.conlluRawChange.emit(conlluRaw)
    })
  }
  downloadConlluRawRow(r,row_index,e = null) {
    //make sure there is a tab after each span
    // this.conlluRaw = this.conlluRaw.split("\n").splice(row_index,0,"# ").join("\n")
    // this.conlluRawSpans.splice(row_index,0, {sentid: this.conlluRawSpans[row_index].sentid, elemid:"comment", elems: ["# "]})
    // console.log(this.conlluRaw)
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.conlluRaw);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    let filename = this.filename
    if(!/\.conllu$/.test(filename))
      filename+= ".conllu"
    downloadAnchorNode.setAttribute("download", filename);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  getConlluRaw(e=null){
    var sentid = 1
    return this.conlluRaw.replace(/\n{3,}/g,"\n\n").split("\n").map((e,i)=>{
      if(e=="")
        sentid++
      var elemid = e.split("\t")[0]
      elemid = /^[0-9-]/.test(elemid.trim()) ? elemid.trim() : "comment"
      return {
        sentid:sentid,
        elemid:elemid,
        line:i,
        elems:e.split("\t").map(ee=>ee+="\t")
      }
    })
  }
}
