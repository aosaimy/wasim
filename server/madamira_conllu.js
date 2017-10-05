var config = require('./config');
var http = require("http");
var parser =require("xml2js").Parser(
                     {
                        trim: true,
                        // explicitArray: true
                     });;
var resultsParser = require('/Users/abbander/Leeds/ArabicMorphologyTools/bin/resultsParser')
var resultsConllU = require('/Users/abbander/Leeds/ArabicMorphologyTools/bin/resultConllU')
var resultsUniquer = require('/Users/abbander/Leeds/ArabicMorphologyTools/bin/resultsUniquer')

var buckwalter = require(config.buckwalter_path+'buckwalter');
exports.post = function(request, res) {
  var data = request.body;
  var req = http.request({
    url: config.ma.url,
    port: config.ma.port,
    method: 'POST',
    headers: {
      // specify how to handle the request, http-request makes no assumptions
      'content-type': 'application/xml;charset=utf-8'
    }
  }, function(ress) {
    if (ress.statusCode != 200) {
      console.error(ress)
    }
    var xml = []
    ress.on('data', (chunk) => {
      xml.push(chunk)
    });
    ress.on('end', () => {
      parser.parseString(xml.join(""), function(err, result) {
        if (!Array.isArray(result.madamira_output.out_doc[0].out_seg[0].word_info[0].word))
          result.madamira_output.out_doc[0].out_seg[0].word_info[0].word = [result.madamira_output.out_doc[0].out_seg[0].word_info.word]
        try {
            // console.log(JSON.stringify(result.madamira_output.out_doc[0].out_seg[0].word_info[0].word));
            // console.dir(result.madamira_output.out_doc[0].out_seg[0].word_info[0]);
          var stream = resultsParser
                .parseString(JSON.stringify(result.madamira_output.out_doc[0].out_seg[0].word_info[0].word),
                    "MX",data.sentence)
          var stream2 = resultsUniquer.oneTool.uniqueFromJSON(stream,"MX",data.sentence, {
            m: "all",
            s: true,
            md5 : true,
            t: true
          })
          var stream3 = resultsConllU.oneTool.toConlluFromInStream(stream2,"MX",data.sentence, {})
          var objs = []
          stream3.on('data',function(buffer){
              objs.push(buffer);
              // console.error(buffer);
            });
            stream3.on('end',function(){
                res.send({ ok: true, rs: objs })
            });
        } catch (e) {
          console.error(e)
          return res.send({ ok: false, rs: ress.statusCode, body: result })
        }
      })
    })
  })
  // console.log(getXML(data.sentence))
  req.write(getXML(data.sentence))
  req.end()

}



function getXML(sentence) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<madamira_input xmlns="urn:edu.columbia.ccls.madamira.configuration:0.1">
    <madamira_configuration>
        <preprocessing sentence_ids="false" separate_punct="true" input_encoding="UTF8"/>
        <overall_vars output_encoding="UTF8" dialect="MSA" output_analyses="ALL" morph_backoff="NONE"/>
        <requested_output>
            <req_variable name="PREPROCESSED" value="false" />
            <req_variable name="STEM" value="true" />
            <req_variable name="GLOSS" value="true" />
            <req_variable name="LEMMA" value="true" />
            <req_variable name="DIAC" value="true" />
            <req_variable name="ASP" value="true" />
            <req_variable name="CAS" value="true" />
            <req_variable name="ENC0" value="true" />
            <req_variable name="ENC1" value="true" />
            <req_variable name="ENC2" value="true" />
            <req_variable name="GEN" value="true" />
            <req_variable name="MOD" value="true" />
            <req_variable name="NUM" value="true" />
            <req_variable name="PER" value="true" />
            <req_variable name="POS" value="true" />
            <req_variable name="PRC0" value="true" />
            <req_variable name="PRC1" value="true" />
            <req_variable name="PRC2" value="true" />
            <req_variable name="PRC3" value="true" />
            <req_variable name="STT" value="false" />
            <req_variable name="VOX" value="false" />
            <req_variable name="BW" value="false" />
            <req_variable name="SOURCE" value="false" />
            <req_variable name="NER" value="false" />
            <req_variable name="BPC" value="false" />
        </requested_output>
        <tokenization>
            <scheme alias="MyD3">
                <scheme_override alias="MyD3"
                                 form_delimiter="\u00B7"
                                 include_non_arabic="true"
                                 mark_no_analysis="true"
                                 token_delimiter=" "
                                 tokenize_from_BW="false">
                    <split_term_spec term="PRC3"/>
                    <split_term_spec term="PRC2"/>
                    <split_term_spec term="PART"/>
                    <split_term_spec term="PRC0"/>
                    <split_term_spec term="REST"/>
                    <split_term_spec term="ENC0"/>
                    <token_form_spec enclitic_mark="+"
                                     proclitic_mark="+"
                                     token_form_base="WORD"
                                     transliteration="UTF8">
                        <normalization type="ALEF"/>
                        <normalization type="YAA"/>` +
    // <normalization type="DIAC"/>
    `<normalization type="LEFTPAREN"/>
                        <normalization type="RIGHTPAREN"/>
                    </token_form_spec>
                </scheme_override>
            </scheme>
        </tokenization>
    </madamira_configuration>

    <in_doc id="ExampleDocument">
        <in_seg id="SENT1">` +
    sentence +
    `</in_seg>
    </in_doc>

</madamira_input>`
}