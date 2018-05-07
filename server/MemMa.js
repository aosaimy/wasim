"use strict";
var conlluParser = require('conllu-dao');
var path = require('path');
var fs = require('fs');
var glob = require('glob')

// promisify fs.readFile()
fs.readFileAsync = function(filename, unicode) {
  return new Promise(function(resolve, reject) {
    try {
      fs.readFile(filename, unicode, function(err, buffer) {
        if (err) reject(err);
        else resolve(buffer);
      });
    } catch (err) {
      reject(err);
    }
  });
};

class MemLexicon {

  constructor(path, project_config, project) {
    if (!Array.isArray(path))
      throw new Error("path mush an array with no separator");
    this.path = path;
    this.memLexicon = {};
    this.project = project;
    this.files = [];
    this.project_config = project_config;
    if (project_config.excludeFiles)
      this.excludeFiles = new RegExp(project_config.excludeFiles);
    this.doc = new conlluParser.ConlluDocument(this.project_config);
  }
  init() {
    console.error("Start Indexing for project:" + this.project + "...");
    // read its config
    // read the directory
    var that = this;
    glob(path.join(...this.path)+"/*", {nodir:true}, function(err, items) {
    // fs.readdir(path.join(...this.path), function(err, items) {
      if (err)
        throw err;
      // read each file and parse it
      let counter = 0;
      // that.files = items.filter(f => f[0] != "."); //&& !/^qac/.test(f))
      that.files = items.filter(f=>!that.excludeFiles.test(f))
      var promises = that.files.map(f =>
        fs.readFileAsync(path.join(...that.path, f), "utf8")
        .then((file_content) => {
          that.index(f, file_content)
          process.stdout.write("\rIndexing: " + (++counter) + "/" + that.files.length +" " +f+ "         ")
        })
        .catch(e => {
          console.error(e)
        }))
      Promise.all(promises).then(() => {
        console.error("\nIndexing is done.")
        that.convertToFinal()
      }).catch(e => {

        console.error(e)
      })
    })
  }
  get(sentence) {
    return sentence.split(" ").map((x) => {
      let form = x.replace(/[ًٌٍَُِّْ]/g, "").replace(/ٱ/g, "ا")
      if (this.memLexicon[form] === undefined) {
        let sent = new conlluParser.ConlluSentence("-1", [], [], this.doc)
        sent.comments.push("# sentid=" + "-1" + " " + form)
        this.memLexicon[form]= {
          elems: [],
          final : sent.toConllU().join("\n").split("\n"),
        }
        return this.memLexicon[form].final
      }
      return this.memLexicon[form].final

    })
  }
  convertToFinal() {
    let toBeConverted = Object.keys(this.memLexicon).filter(k=>this.memLexicon[k].final===null)
    toBeConverted.forEach((form, i) => {
      process.stdout.write("\rConverting: " + i + "/" + toBeConverted.length + "         ")
      var counter = 1
      let elems = [].concat.apply([], this.memLexicon[form].elems.map(e => {
        if (e.e.isMultiword)
          return [e.e, ...e.e.children]
        return [e.e]
      }))

      let sent = new conlluParser.ConlluSentence(i, elems, [], this.doc)
      sent.elements.forEach(e => {
        if (e.isMultiword)
          e.id = counter + "-" + (counter + e.id.split("-").map(e => parseInt(e)).reduce((a, x) => x - a))
        else
          e.id = "" + counter++
      })
      sent.comments.push("# sentid=" + i + " " + form)
      // sent.refix(true)
      this.memLexicon[form].final = sent.toConllU().join("\n").split("\n")
    })
    console.error("\nConverting is done.")

  }
  index(filename, file_content) {
    let doc = new conlluParser.ConlluDocument(this.project_config, filename)
    doc.parse(file_content, x => console.log(x), true)
    doc.sentences.forEach(s => s.elements.forEach(e => {
      let form = e.form.replace(/[ًٌٍَُِّْ]/g, "").replace(/ٱ/g, "ا")
      if (!this.memLexicon[form]) {
        this.memLexicon[form] = {
          form: form,
          elems: [],
          final: null
        }
      }
      // if (this.memLexicon[form].elems.find(ee => ee.isSameAs(e)) === undefined) {
      e._miscs.DOCID = e.sentence.document.id;
      e._miscs.SENTID = e.sentence.id;
      e._miscs.ELEMID = e.id;
      e._miscs.SENT = e.getContext(3).map(e => e.form).join("±");
      let prev = this.memLexicon[form].elems.find(ee => ee.e.isSameAs(e))
      if(!prev)
        this.memLexicon[form].elems.push({
          e:e,
          others : []
          })
      else
        prev.others.push(e)
      this.memLexicon[form].final = null
      // }
    }))
  }
}

module.exports = MemLexicon
