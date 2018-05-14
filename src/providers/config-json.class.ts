let desc = {"saveFile":"Convert to Conll then Save",
  "syncConllU":"Convert to Conll",
  "diactric":"Add a diactric",
  "nav":"Move next/prev Word",
  "undo":"Undo last action (move backward in action history)",
  "redo":"Move forward in action history",
  "segment":"Edit the form/Add new segments to the current word/Delete current segment",
  "tag":"Assign current segment a new tag",
  "tag_ma":"Ask a morphological analyser for help",
  "tag_morphofeatures":"Assign morphological features",
  "diac":"Mark the last character with a diacritic",
  "more":"Show more less-frequent tags"}

export interface KeyboardJSON {
  code : string
  action : string
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  desc?: string
  params : string[]
  keys?: string[]
}

export interface TagsJSON {
  mapFrom: string[]
  tag: string
  desc: string
  count: number
  fn: number
  mapToConllU: string
  mf: string[]
  features: string[]
}
export class ConfigJSON {

    /**
     * The remote repository to push changes of your project to. Please make sure that you have appropriate login
     */
      remote_repo : string ="";
    /**
     * The default view for the right panel of Conll-U view. Four possible values or null to hide it completely: "textarea, pretty, errors, info"
     */
      conlluEditorType : string = "pretty";
    /**
     * Wether a morphological analyser will be used.
     */
      askMA : boolean = false;
    /**
     * Wether the memory-based morphological analyser (from previous taggins) will be used.
     */
      askMemMA : boolean = false;
    /**
     * Wether online guideline will be used. Requires memory-based option to be true.
     */
      askGuider : boolean = false;
    /**
     * (Read-only) project name
     */
      project : string ="";
    /**
     * (Read-only) project name
     */
      hash : string ="";
    /**
     * the model name for UDPipe.
     */
      language : string ="qac";
    /**
     * (Read-only) tagset name
     */
      tagset: string ="";
      users: string[] = [];
      debug: boolean = false;
      keyboardShortcuts: KeyboardJSON[] = [];

      MfVsPos:{} = {};
      MfVsPos_upostag:boolean = true;
      concordanceWindow:number = 5;
      mf:{} = {};
      isRtl:boolean = true;
      useUD:boolean = true;
      sync:boolean = true;
      alltags : TagsJSON[] = [];
      allxtags : string[] = [];
      allutags : {tag:string,desc:string}[] = [];
      onFeatSelect : { [id:string]: { [id:string]: string[] }} = {};
      tags : { [id:string]: {tag:string,desc:string}} = {};
      sentenceTags : any[] = [];
      loaded: boolean = false
      undoSize: number = 5
      features: { [id:string]: {tag:string,desc:string}} = {};

      constructor(data?: any){
        if(data){
            this.remote_repo = data.config.remote_repo
            this.language = data.config.language
            this.tagset = data.config.tagset
            this.useUD = data.config.useUD
            this.isRtl = data.config.isRtl
            this.sync = data.config.sync
            this.undoSize = data.config.undoSize
            this.users = data.config.users
            this.keyboardShortcuts = data.config.keyboardShortcuts
            this.conlluEditorType = data.config.conlluEditorType //as ConlluEditorType
            this.askMA = data.config.askMA
            this.askMemMA = data.config.askMemMA
            this.askGuider = data.config.askGuider
            this.onFeatSelect = data.config.onFeatSelect
            this.MfVsPos = data.config["MF.vs.POS"] || data.config.MfVsPos
            this.MfVsPos_upostag = data.config["MF.vs.POS_upostag"] || data.config.MfVsPos_upostag

            this.mf = data.config.mf
            this.sentenceTags = data.config.sentenceTags
            this.allutags = data.config.allutags

            this.alltags = data.config.alltags
          }
      }
      getFeature(key) : {tag:string,desc:string}{
        return this.features[key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }
      // getFeatures(xpostag){
      //   return this.alltags.find(x=>x.tag==this.xpostag)
      // }
      getXPosTag(key): {tag:string,desc:string}{
        return this.tags["X:"+key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }

      getUPosTag(key): {tag:string,desc:string}{
        return this.tags["U:"+key] || {tag:"N/A:"+key, desc : "n/a:"+key}
      }
  static validation = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "definitions": {
        "ConlluEditorType": {
            "enum": [
                "errors",
                "info",
                "pretty",
                "textarea"
            ],
            "type": "string"
        },
        "KeyboardJSON": {
            "properties": {
                "action": {
                    "type": "string"
                },
                "altKey": {
                    "type": "boolean"
                },
                "code": {
                    "type": "string"
                },
                "ctrlKey": {
                    "type": "boolean"
                },
                "desc": {
                    "type": "string"
                },
                "keys": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "metaKey": {
                    "type": "boolean"
                },
                "params": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "shiftKey": {
                    "type": "boolean"
                }
            },
            "type": "object"
        },
        "TagsJSON": {
            "properties": {
                "count": {
                    "type": "number"
                },
                "desc": {
                    "type": "string"
                },
                "features": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "fn": {
                    "type": "number"
                },
                "mapFrom": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "mapToConllU": {
                    "type": "string"
                },
                "mf": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "tag": {
                    "type": "string"
                }
            },
            "type": "object"
        }
    },
    "properties": {
        "MfVsPos": {
            "properties": {
            },
            "type": "object"
        },
        "MfVsPos_upostag": {
            "default": true,
            "type": "boolean"
        },
        "alltags": {
            "default": [
            ],
            "items": {
                "$ref": "#/definitions/TagsJSON"
            },
            "type": "array"
        },
        "allutags": {
            "default": [
            ],
            "items": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "allxtags": {
            "default": [
            ],
            "items": {
                "type": "string"
            },
            "type": "array"
        },
        "askGuider": {
            "default": false,
            "description": "Wether online guideline will be used. Requires memory-based option to be true.",
            "type": "boolean"
        },
        "askMA": {
            "default": false,
            "description": "Wether a morphological analyser will be used.",
            "type": "boolean"
        },
        "askMemMA": {
            "default": false,
            "description": "Wether the memory-based morphological analyser (from previous taggins) will be used.",
            "type": "boolean"
        },
        "concordanceWindow": {
            "default": 5,
            "type": "number"
        },
        "conlluEditorType": {
            "$ref": "#/definitions/ConlluEditorType",
            "description": "The default view for the right panel of Conll-U view. Four possible values or null to hide it completely: \"textarea, pretty, errors, info\""
        },
        "debug": {
            "default": false,
            "type": "boolean"
        },
        "features": {
            "additionalProperties": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "object"
        },
        "hash": {
            "default": "",
            "description": "(Read-only) project name",
            "type": "string"
        },
        "isRtl": {
            "default": true,
            "type": "boolean"
        },
        "keyboardShortcuts": {
            "default": [
            ],
            "items": {
                "$ref": "#/definitions/KeyboardJSON"
            },
            "type": "array"
        },
        "language": {
            "default": "qac",
            "description": "the model name for UDPipe.",
            "type": "string"
        },
        "loaded": {
            "default": false,
            "type": "boolean"
        },
        "mf": {
            "properties": {
            },
            "type": "object"
        },
        "onFeatSelect": {
            "additionalProperties": {
                "additionalProperties": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "type": "object"
            },
            "type": "object"
        },
        "project": {
            "default": "",
            "description": "(Read-only) project name",
            "type": "string"
        },
        "remote_repo": {
            "default": "",
            "description": "The remote repository to push changes of your project to. Please make sure that you have appropriate login",
            "type": "string"
        },
        "sentenceTags": {
            "default": [
            ],
            "items": {
            },
            "type": "array"
        },
        "sync": {
            "default": true,
            "type": "boolean"
        },
        "tags": {
            "additionalProperties": {
                "properties": {
                    "desc": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "object"
        },
        "tagset": {
            "default": "",
            "description": "(Read-only) tagset name",
            "type": "string"
        },
        "undoSize": {
            "default": 5,
            "type": "number"
        },
        "useUD": {
            "default": true,
            "type": "boolean"
        },
        "users": {
            "default": [
            ],
            "items": {
                "type": "string"
            },
            "type": "array"
        }
    },
    "type": "object"
}




}
