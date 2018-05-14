import { SimpleChanges, Component, Input } from '@angular/core';
import { Events, ToastController, ViewController, NavParams } from 'ionic-angular';
import { GuidelinesService } from '../../providers/guidelines-service';
import { ConfigJSON } from '../../providers/config-json.class';

/**
 * Generated class for the GuiderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'guider',
  templateUrl: 'guider.html'
})

export class GuiderComponent {
  @Input() element
  @Input() type : string
  @Input() project : string = ""
  @Input() hash : string = ""
  @Input() config : ConfigJSON
  constructor(private navParams: NavParams,
    public guidelinesService: GuidelinesService,
    public events: Events,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
      // this.config = navParams.data.config
      this.guidelinesService.load(navParams.data.project,navParams.data.hash).then(x=>{
      // this.guidelinesService.load("hadiths","d14274111536eed778f6b8a648115aa8").then(x=>{
        }).catch(x=>{
            this.toastCtrl.create({
              message: 'No guider is found: ' + x,
              duration: 3000,
              position: "top"
            }).present()
        })
  }
  toggle(e){
    e.showDetails = e.showDetails || false;
    this.events.publish("stats",{action:"showGuider:toggle",elements:e})
    e.showDetails = ! e.showDetails ;
  }
  options = []
  get(){
    return this.options
  }
  show(){
     return this.options && this.options.length > 0
  }
  assign(element,option){
    element.xpostag = option.value
     // console.log(element,option)
  }
  ngOnChanges(changes: SimpleChanges) {
    this.options= this.guidelinesService.get(this.type,this.element.form).options
    if(this.options)
      this.options.forEach(e=>e.showDetails=false)

    if(this.show())
      this.events.publish("stats",{action:"showGuider",elements:this.element})
  }

}
