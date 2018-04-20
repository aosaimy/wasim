/*
* @Filename:   conllu.ts
* @Author: abbander
Author: Sampo Pyysalo
* @Date:   2017-05-10 14:26:53
*/
// -*- Mode: JavaScript; tab-width: 4; indent-tabs-mode: nil; -*-
// vim:set ft=javascript ts=4 sw=4 sts=4 cindent:
/*
CoNLL-U format library for JavaScript.
Home: http://github.com/spyysalo/conllu.js
Format: http://universaldependencies.github.io/docs/format.html

Author: Sampo Pyysalo
License: MIT (http://opensource.org/licenses/MIT)
*/
var errors = [];
function reportError(error) {
    if (errors.indexOf(error) < 0) {
        console.error(error);
        errors.push(error);
    }
}
export class ConlluDocument {
    // constructor(config, public events: Events=null) {
    constructor(config) {
        /*
         * ConllU.ConlluDocument: represents CoNLL-U document
         */
        this.sentences = [];
        this.config = null;
        this.reset = function () {
            this.sentences = [];
            this.error = false;
            this.logger = function (s) { };
            this.strict = null; // pick heuristically
        };
        this.log = function (message) {
            this.logger(message);
        };
        this.logError = function (message) {
            this.log('error: ' + message);
            this.error = true;
        };
        this.toConllU = function () {
            var lines = [];
            for (let sent of this.sentences) {
                sent.toConllU(lines);
                lines.push("");
            }
            return lines.join("\n");
        };
        /* Parse CoNLL-U format, return ConlluDocument.
         * (see http://universaldependencies.github.io/docs/format.html)
         *
         * CoNLL-U files contain three types of lines:
         * 1.  Word lines
         * 2.  Blank lines marking sentence boundaries
         * 3.  Comment lines starting with a hash ("#")
         *
         * Each word line has the following format
         * 1.  ID: Word index, integer starting at 1 for each new sentence;
         *     may be a range for tokens with multiple words; may be a decimal
         *     number for empty nodes.
         * 2.  FORM: Word form or punctuation symbol.
         * 3.  LEMMA: Lemma or stem of word form.
         * 4.  UPOSTAG: Universal part-of-speech tag.
         * 5.  XPOSTAG: Language-specific part-of-speech tag; underscore
         *     if not available.
         * 6.  FEATS: List of morphological features from the Universal
         *     feature inventory or from a defined language-specific extension;
         *      underscore if not available.
         * 7.  HEAD: Head of the current token, which is either a value of ID
         *     or zero (0).
         * 8.  DEPREL: Universal Stanford dependency relation to the HEAD
         *     (root iff HEAD = 0) or a defined language-specific subtype
         *     of one.
         * 9.  DEPS: List of secondary dependencies (head-deprel pairs).
         * 10. MISC: Any other annotation.
         */
        this.parse = function (input, logger, strict) {
            // discard previous state, if any
            this.reset();
            if (logger !== undefined) {
                this.logger = logger;
            }
            if (strict !== undefined) {
                this.strict = strict;
            }
            // TODO: handle other newline formats
            var lines = input.split('\n');
            if (this.strict === null) {
                this.strict = Util.selectParsingMode(input, this.logger);
            }
            // select splitter to use for dividing the lines into fields.
            var splitter = Util.selectFieldSplitter(input, this.logger, this.strict);
            var //elements = [],
            // comments = [],
            beforeConlluSentence = true;
            var sId = 'S' + (this.sentences.length + 1);
            var currentSentence = new ConlluSentence(sId, [], [], this); //, currentSentence.elements, currentSentence.comments);
            for (let idx = 0; idx < lines.length; idx++) {
                var line = lines[idx], that = this;
                var logLineError = function (message) {
                    that.logError('line ' + (idx + 1) + ': ' + message + ' ("' + line + '")');
                    that.error = true;
                };
                if (Util.isComment(line)) {
                    if (beforeConlluSentence) {
                        currentSentence.comments.push(line);
                    }
                    else {
                        logLineError('comments must precede sentence, ignoring');
                    }
                    continue;
                }
                // non-comment, assume inside sentence until terminated by
                // blank line
                beforeConlluSentence = false;
                var fields = splitter(line);
                if (fields.length === 0) {
                    // empty line, terminates sentence
                    if (currentSentence.elements.length !== 0) {
                        currentSentence.refix();
                        this.sentences.push(currentSentence);
                        let sId = 'S' + (this.sentences.length + 1);
                        currentSentence = new ConlluSentence(sId, [], [], this); //, currentSentence.elements, currentSentence.comments);
                        // this.sentences.push(sentence);
                    }
                    else {
                        logLineError('empty sentence, ignoring');
                    }
                    // reset
                    // elements = [];
                    // comments = [];
                    beforeConlluSentence = true;
                    continue;
                }
                if (fields.length !== 10) {
                    logLineError('expected 10 fields, got ' + fields.length);
                    Util.repairFields(fields, this.logger);
                }
                var element = new ConlluElement(fields, idx, line, currentSentence);
                var issues = element.validate();
                for (let j = 0; j < issues.length; j++) {
                    logLineError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!element.repair(this.logger)) {
                        logLineError('repair failed, discarding line');
                        continue; // failed, ignore line
                    }
                }
                currentSentence.elements.push(element);
            }
            // If elements is non-empty, last sentence ended without its
            // expected terminating empty line. Process, but warn if strict.
            // if (elements.length !== 0) {
            //     if (this.strict) {
            //         this.logError('missing blank line after last sentence');
            //     }
            //     var sId = 'S' + (this.sentences.length + 1);
            //     var sentence = new ConlluSentence(sId, elements, comments);
            //     sentence.document = this;
            //     this.sentences.push(sentence);
            //     // reset
            //     elements = [];
            //     comments = [];
            //     beforeConlluSentence = true;
            // }
            // If comments is non-empty, there were comments after the
            // terminating empty line. Warn and discard.
            if (currentSentence.comments.length !== 0 && currentSentence.elements.length == 0) {
                this.logError('comments may not occur after last sentence, ' +
                    'ignoring');
            }
            else {
                currentSentence.refix();
                this.sentences.push(currentSentence);
            }
            for (let i = 0; i < this.sentences.length; i++) {
                var sentence = this.sentences[i];
                let issues = sentence.validate();
                for (let j = 0; j < issues.length; j++) {
                    this.logError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!sentence.repair(this.logger)) {
                        this.logError('repair failed, discarding sentence');
                        continue;
                    }
                }
            }
            // console.log(this)
            return this;
        };
        this.toBrat = function (logger, includeEmpty) {
            if (logger !== undefined) {
                this.logger = logger;
            }
            if (includeEmpty === undefined) {
                includeEmpty = false; // hide empty nodes by default
            }
            // merge brat data over all sentences
            var mergedBratData = {}, textOffset = 0;
            var categories = [
                'entities',
                'attributes',
                'relations',
                'comments',
                'styles',
                'sentlabels'
            ];
            for (let i = 0; i < categories.length; i++) {
                mergedBratData[categories[i]] = [];
            }
            mergedBratData['text'] = '';
            for (let i = 0; i < this.sentences.length; i++) {
                var sentence = this.sentences[i];
                var issues = sentence.validate();
                for (let j = 0; j < issues.length; j++) {
                    this.logError(issues[j]);
                }
                if (issues.length !== 0) {
                    if (!sentence.repair(this.logger)) {
                        this.logError('repair failed, discarding sentence');
                        continue;
                    }
                }
                sentence.setBaseOffset(textOffset !== 0 ? textOffset + 1 : 0);
                var bratData = sentence.toBrat(includeEmpty);
                // merge
                if (mergedBratData['text'].length !== 0) {
                    mergedBratData['text'] += '\n';
                    textOffset += 1;
                }
                mergedBratData['text'] += bratData['text'];
                textOffset += bratData['text'].length;
                for (let j = 0; j < categories.length; j++) {
                    var c = categories[j];
                    mergedBratData[c] = mergedBratData[c].concat(bratData[c]);
                }
            }
            // to avoid brat breakage on error, don't send empty text
            if (mergedBratData['text'].length === 0) {
                mergedBratData['text'] = '<EMPTY>';
            }
            mergedBratData['error'] = this.error;
            return mergedBratData;
        };
        this.config = config;
        this.reset();
    }
    mapTagToXpostag(from) {
        var f = this.config.alltags.find(x => x.tag == from || x.mapFrom.indexOf(from) >= 0);
        if (f)
            return f.tag;
        reportError("tag is not mapped to Xpostag: " + from);
        return from;
    }
    fixSentenceIds() {
        this.sentences.forEach((s, i) => {
            // console.log(s)
            let id_i = s.comments.findIndex(c => {
                return c.indexOf("# sent_id") == 0;
            });
            if (id_i >= 0)
                s.comments[id_i] = "# sent_id = " + (i + 1);
            else
                s.comments.push("# sent_id = " + (i + 1));
            s.id = 'S' + (i + 1);
            let text_i = s.comments.findIndex(c => {
                return c.indexOf("# text") == 0;
            });
            if (text_i >= 0)
                s.comments[text_i] = "# text = " + s.getText();
            else
                s.comments.push("# text = " + s.getText());
        });
    }
    mapTagToUpostag(from, from_ud) {
        var f = this.config.alltags.find(x => x.tag == from);
        if (f)
            return f.mapToConllU;
        reportError("tag is not mapped to Upostag: " + from);
        return from_ud;
    }
    getElementLine(element, sentence) {
        var counter = 1;
        var result = 0;
        this.sentences.forEach(s => {
            s.elements.forEach(e => {
                if (s.id == sentence.id && e.id == element.id) {
                    result = counter;
                }
                counter++;
            });
            counter++;
        });
        return result;
    }
}
export class ConlluSentence {
    constructor(sentenceId, elements = [], comments = [], document) {
        /*
         * ConllU.ConlluSentence: represents CoNLL-U sentence
         */
        this.id = "";
        this.document = null;
        this.elements = [];
        this.comments = [];
        this.baseOffset = 0;
        this.tag = "";
        this.toConllU = function (lines) {
            for (let com of this.comments) {
                lines.push(com);
            }
            for (let elem of this.elements) {
                lines.push(elem.toConllU());
            }
            return lines;
        };
        // set offset of first character in sentence (for standoff
        // generation)
        this.setBaseOffset = function (baseOffset) {
            this.baseOffset = baseOffset;
        };
        this.dependencies = function () {
            var dependencies = [];
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                dependencies = dependencies.concat(element.dependencies());
            }
            return dependencies;
        };
        this.words = function (includeEmpty) {
            return this.elements.filter(function (e) {
                return (e.isWord() || (includeEmpty && e.isEmptyNode()));
            });
        };
        this.multiwords = function () {
            return this.elements.filter(function (e) {
                return e.isMultiword();
            });
        };
        // return words with possible modifications for visualization with
        // brat
        this.bratWords = function (includeEmpty) {
            var words = this.words(includeEmpty);
            for (let i = 0; i < words.length; i++) {
                if (Util.isRtl(words[i].form)) {
                    words[i] = Util.deepCopy(words[i]);
                    words[i].form = Util.rtlFix(words[i].form);
                }
            }
            return words;
        };
        // return tokens with possible modifications for visualization
        // with brat
        this.bratTokens = function () {
            var tokens = this.tokens();
            for (let i = 0; i < tokens.length; i++) {
                tokens[i] = Util.deepCopy(tokens[i]);
                tokens[i].form = Util.rtlFix(tokens[i].form);
            }
            return tokens;
        };
        // return the text of the sentence for visualization with brat
        this.bratText = function (includeEmpty) {
            var words = this.bratWords(includeEmpty);
            var tokens = this.bratTokens();
            var wordText = words.map(function (w) { return w.form; }).join(' ');
            var tokenText = tokens.map(function (w) { return w.form; }).join(' ');
            var combinedText = wordText;
            if (wordText != tokenText) {
                combinedText += '\n' + tokenText;
            }
            return combinedText;
        };
        // return the annotated text spans of the sentence for visualization
        // with brat.
        this.bratSpans = function (includeEmpty) {
            var spans = [], offset = this.baseOffset;
            // create an annotation for each word
            var words = this.bratWords(includeEmpty);
            for (let i = 0; i < words.length; i++) {
                var length = words[i].form.length;
                spans.push([this.id + '-T' + words[i].id, words[i].upostag,
                    [[offset, offset + length]]]);
                offset += length + 1;
            }
            return spans;
        };
        // return attributes of sentence annotations for visualization
        // with brat.
        this.bratAttributes = function (includeEmpty) {
            var words = this.words(includeEmpty);
            // create attributes for word features
            var attributes = [], aidseq = 1;
            for (let i = 0; i < words.length; i++) {
                var word = words[i], tid = this.id + '-T' + word.id;
                var nameVals = word.features;
                for (let j = 0; j < nameVals.length; j++) {
                    var name = nameVals[j].key, value = nameVals[j].value;
                    attributes.push([this.id + '-A' + aidseq++, name, tid, value]);
                }
            }
            return attributes;
        };
        // return relations for sentence dependencies for visualization
        // with brat.
        this.bratRelations = function (includeEmpty) {
            var dependencies = this.dependencies();
            var relations = [];
            for (let i = 0; i < dependencies.length; i++) {
                var dep = dependencies[i];
                relations.push([this.id + '-R' + i, dep[2],
                    [['arg1', this.id + '-T' + dep[1]],
                        ['arg2', this.id + '-T' + dep[0]]]]);
            }
            return relations;
        };
        // return comments (notes) on sentence annotations for
        // visualization with brat.
        this.bratComments = function (includeEmpty) {
            var words = this.words(includeEmpty);
            // TODO: better visualization for LEMMA, XPOSTAG, and MISC.
            var comments = [];
            for (let i = 0; i < words.length; i++) {
                var word = words[i], tid = this.id + '-T' + word.id, label = 'AnnotatorNotes';
                comments.push([tid, label, 'Lemma: ' + word.lemma]);
                if (word.xpostag !== '_') {
                    comments.push([tid, label, 'Xpostag: ' + word.xpostag]);
                }
                if (word.misc !== '_') {
                    comments.push([tid, label, 'Misc: ' + word.misc]);
                }
            }
            return comments;
        };
        // Return styles on sentence annotations for visualization with
        // brat. Note: this feature is an extension of both the CoNLL-U
        // comment format and the basic brat data format.
        this.bratStyles = function (includeEmpty) {
            var styles = [], wildcards = [];
            for (let i = 0; i < this.comments.length; i++) {
                var comment = this.comments[i];
                var m = comment.match(/^(\#\s*visual-style\s+)(.*)/);
                if (!m) {
                    continue;
                }
                var styleSpec = m[2];
                // Attempt to parse as a visual style specification. The
                // expected format is "REF<SPACE>STYLE", where REF
                // is either a single ID (for a span), a space-separated
                // ID1 ID2 TYPE triple (for a relation), or a special
                // wildcard value like "arcs", and STYLE is either
                // a colon-separated key-value pair or a color.
                m = styleSpec.match(/^([^\t]+)\s+(\S+)\s*$/);
                if (!m) {
                    // TODO: avoid console.log
                    console.warn('warning: failed to parse: "' + comment + '"');
                    continue;
                }
                var reference = m[1], style = m[2];
                // split style into key and value, adding a key to
                // color-only styles as needed for the reference type.
                var key, value;
                m = style.match(/^(\S+):(\S+)$/);
                if (m) {
                    key = m[1];
                    value = m[2];
                }
                else {
                    value = style;
                    if (reference === 'arcs' || reference.indexOf(' ') !== -1) {
                        key = 'color';
                    }
                    else {
                        key = 'bgColor';
                    }
                }
                // store wildcards for separate later processing
                if (reference.match(/^(nodes|arcs)$/)) {
                    wildcards.push([reference, key, value]);
                    continue;
                }
                // adjust every ID in reference for brat
                if (reference.indexOf(' ') === -1) {
                    reference = this.id + '-T' + reference;
                }
                else {
                    reference = reference.split(' ');
                    reference[0] = this.id + '-T' + reference[0];
                    reference[1] = this.id + '-T' + reference[1];
                }
                styles.push([reference, key, value]);
            }
            // for expanding wildcards, first determine which words / arcs
            // styles have already been set, and then add the style to
            // everything that hasn't.
            var setStyle = {};
            for (let i = 0; i < styles.length; i++) {
                setStyle[styles[i][0].concat([styles[i][1]])] = true;
            }
            for (let i = 0; i < wildcards.length; i++) {
                let reference = wildcards[i][0], key = wildcards[i][1], value = wildcards[i][2];
                if (reference === 'nodes') {
                    var words = this.words(includeEmpty);
                    for (let j = 0; j < words.length; j++) {
                        var r = this.id + '-T' + words[j].id;
                        if (!setStyle[r.concat(key)]) {
                            styles.push([r, key, value]);
                            setStyle[r.concat(key)] = true;
                        }
                    }
                }
                else if (reference === 'arcs') {
                    var deps = this.dependencies();
                    for (let j = 0; j < deps.length; j++) {
                        var rr = [this.id + '-T' + deps[j][1],
                            this.id + '-T' + deps[j][0],
                            deps[j][2]];
                        if (!setStyle[rr.concat([key]).join("")]) {
                            styles.push([rr, key, value]);
                            setStyle[rr.concat([key]).join("")] = true;
                        }
                    }
                }
                else {
                    reportError('internal error');
                }
            }
            return styles;
        };
        // Return label of sentence for visualization with brat, or null
        // if not defined. Note: this feature is an extension of both the
        // CoNLL-U comment format and the basic brat data format.
        this.bratLabel = function () {
            var label = null;
            for (let i = 0; i < this.comments.length; i++) {
                var comment = this.comments[i];
                var m = comment.match(/^(\#\s*sentence-label\b)(.*)/);
                if (!m) {
                    continue;
                }
                label = m[2].trim();
            }
            return label;
        };
        // Return representation of sentence in brat embedded format (see
        // http://brat.nlplab.org/embed.html).
        // If includeEmpty is truthy, include empty nodes in the representation.
        // Note: "styles" is an extension, not part of the basic format.
        this.toBrat = function (includeEmpty) {
            var text = this.bratText(includeEmpty);
            var spans = this.bratSpans(includeEmpty);
            var attributes = this.bratAttributes(includeEmpty);
            var relations = this.bratRelations(includeEmpty);
            var comments = this.bratComments(includeEmpty);
            var styles = this.bratStyles(includeEmpty);
            var labels = [this.bratLabel()];
            return {
                'text': text,
                'entities': spans,
                'attributes': attributes,
                'relations': relations,
                'comments': comments,
                'styles': styles,
                'sentlabels': labels,
            };
        };
        this.elementById = function () {
            var elementById = {};
            for (let i = 0; i < this.elements.length; i++) {
                elementById[this.elements[i].id] = this.elements[i];
            }
            return elementById;
        };
        this.addError = function (issue, element, issues) {
            issues.push('line ' + (element.lineidx + 1) + ': ' + issue + ' ("' + element.line + '")');
        };
        // Check validity of the sentence. Return list of strings
        // representing issues found in validation (empty list if none).
        this.validate = function () {
            var issues = [];
            this.validateUniqueIds(issues);
            this.validateWordSequence(issues);
            this.validateMultiwordSequence(issues);
            this.validateEmptyNodeSequence(issues);
            this.validateReferences(issues);
            return issues;
        };
        // Check for presence of ID duplicates
        this.validateUniqueIds = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var elementById = {};
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (elementById[element.id] !== undefined) {
                    this.addError('non-unique ID "' + element.id + '"', element, issues);
                }
                elementById[element.id] = element;
            }
            return issues.length === initialIssueCount;
        };
        // Check validity of word ID sequence (should be 1,2,3,...)
        this.validateWordSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var expectedId = 1;
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isMultiword() || element.isEmptyNode()) {
                    continue; // only check simple word sequence here
                }
                if (parseInt(element.id, 10) !== expectedId) {
                    this.addError('word IDs should be 1,2,3,..., ' +
                        'expected ' + expectedId + ', got ' + element.id, element, issues);
                }
                expectedId = parseInt(element.id, 10) + 1;
            }
            return issues.length === initialIssueCount;
        };
        // Check that multiword token ranges are valid
        this.validateMultiwordSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var expectedId = 1;
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isMultiword() && element.rangeFrom() !== expectedId) {
                    this.addError('multiword tokens must appear before ' +
                        'first word in their range', element, issues);
                }
                else {
                    expectedId = parseInt(element.id, 10) + 1;
                }
            }
            return issues.length === initialIssueCount;
        };
        this.validateEmptyNodeSequence = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var previousWordId = '0'; // TODO check https://github.com/UniversalDependencies/docs/issues/382
            var nextEmptyNodeId = 1;
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (element.isWord()) {
                    previousWordId = element.id;
                    nextEmptyNodeId = 1;
                }
                else if (element.isEmptyNode()) {
                    var expectedId = previousWordId + '.' + nextEmptyNodeId;
                    if (element.id !== expectedId) {
                        this.addError('empty node IDs should be *.1, *.2, ... ' +
                            'expected ' + expectedId + ', got ' + element.id, element, issues);
                    }
                    nextEmptyNodeId++;
                }
            }
            return issues.length === initialIssueCount;
        };
        // Check validity of ID references in HEAD and DEPS.
        this.validateReferences = function (issues) {
            issues = (issues !== undefined ? issues : []);
            var initialIssueCount = issues.length;
            var elementById = this.elementById();
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                // validate HEAD
                if (!element.validHeadReference(elementById)) {
                    this.addError('HEAD is not valid ID: "' + element.head + '"', element, issues);
                }
                // validate DEPS
                var elemDeps = element.dependencies(true);
                for (let j = 0; j < elemDeps.length; j++) {
                    var head = elemDeps[j][1];
                    if (head !== '0' && elementById[head] === undefined) {
                        this.addError('invalid ID "' + head + '" in DEPS', element, issues);
                    }
                }
            }
            return issues.length === initialIssueCount;
        };
        this.repair = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            if (!this.validateUniqueIds()) {
                this.repairUniqueIds(log);
            }
            if (!this.validateWordSequence()) {
                this.repairWordSequence(log);
            }
            if (!this.validateMultiwordSequence()) {
                this.repairMultiwordSequence(log);
            }
            if (!this.validateEmptyNodeSequence()) {
                this.repairEmptyNodeSequence(log);
            }
            if (!this.validateReferences()) {
                this.repairReferences(log);
            }
            var issues = this.validate();
            return issues.length === 0;
        };
        this.repairUniqueIds = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            var elementById = {}, filtered = [];
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                if (elementById[element.id] === undefined) {
                    elementById[element.id] = element;
                    filtered.push(element);
                }
                else {
                    log('repair: remove element with duplicate ID "' + element.id + '"');
                }
            }
            this.elements = filtered;
            return true;
        };
        this.repairWordSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairWordSequence()');
            return true;
        };
        this.repairMultiwordSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairMultiwordSequence()');
            return true;
        };
        this.repairEmptyNodeSequence = function (log) {
            log('TODO: implement ConllU.ConlluSentence.repairEmptyNodeSequence()');
            return true;
        };
        this.repairReferences = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            var elementById = this.elementById();
            for (let i = 0; i < this.elements.length; i++) {
                var element = this.elements[i];
                // repair HEAD if not valid
                if (!element.validHeadReference(elementById)) {
                    log('repair: blanking invalid HEAD');
                    element.head = null;
                }
                // repair DEPS if not valid
                if (element.deps === '_') {
                    continue;
                }
                var deparr = element.deps.split('|'), filtered = [];
                for (let j = 0; j < deparr.length; j++) {
                    var dep = deparr[j];
                    var m = dep.match(Util.dependencyRegex);
                    if (m) {
                        var head = m[1], deprel = m[2];
                        if (head === '0' || elementById[head] !== undefined) {
                            filtered.push(dep);
                        }
                        else {
                            log('repair: removing invalid ID from DEPS');
                            this.error = true;
                        }
                    }
                    else {
                        reportError('internal error: repairReferences(): ' +
                            'invalid DEPS');
                    }
                }
                if (filtered.length === 0) {
                    element.deps = '_';
                }
                else {
                    element.deps = filtered.join('|');
                }
            }
            return true;
        };
        this.id = sentenceId;
        this.document = document;
        this.comments = comments;
        this.baseOffset = 0;
        this.elements = elements;
        this.elements.forEach(e => {
            e.sentence = this;
        });
        // this.refix()
    }
    ;
    refix(keepParentRelations = false) {
        // Fix the id, isSeg, parent, children according to the ID values.
        // Needed after editing elements of one sentence.
        // param: keepParentRelations: when true will respect parent relation. Only Id, children and isSeg is updated.
        var from = -1, to = -2;
        var parent;
        var counter = 1;
        this.elements = this.elements.map(e => {
            if (e.isMultiword()) {
                if (!keepParentRelations) {
                    // isSeg is updated later
                    from = parseInt(e.id.split("-")[0]);
                    to = parseInt(e.id.split("-")[1]);
                    if (from == to)
                        return null;
                    e.isSeg = -(to - from) - 1;
                    parent = e;
                }
                e.parent = null;
                e.children.length = 0;
                return e;
            }
            else {
                e.id = "" + counter++;
                if (!keepParentRelations) {
                    if (parseInt(e.id) >= from && parseInt(e.id) <= to) {
                        e.isSeg = parseInt(e.id) - from;
                        if (!keepParentRelations)
                            e.parent = parent;
                        e.parent.children.push(e);
                        e.parent.id = e.parent.children[0].id + "-" + (parseInt(e.parent.children[0].id) + e.parent.children.length - 1);
                    }
                }
                else if (e.parent) {
                    e.parent.children.push(e);
                    e.isSeg = parseInt(e.id) - parseInt(e.parent.children[0].id);
                    e.parent.isSeg = -(parseInt(e.parent.children[e.parent.children.length - 1].id) - parseInt(e.parent.children[0].id)) - 1;
                    if (-e.parent.isSeg != e.parent.children.length)
                        console.error("Not the same", -e.parent.isSeg, e.parent.children.length);
                    e.parent.id = e.parent.children[0].id + "-" + (parseInt(e.parent.children[0].id) + e.parent.children.length - 1);
                }
            }
            return e;
        }).filter(e => e != null);
    }
    getText() {
        return this.tokens().map(e => e.form).join(" ");
    }
    tokens() {
        // extract token sequence by omitting word IDs that are
        // included in a multiword token range.
        var multiwords = this.multiwords();
        var inRange = {};
        for (let i = 0; i < multiwords.length; i++) {
            var mw = multiwords[i];
            for (let j = mw.rangeFrom(); j <= mw.rangeTo(); j++) {
                inRange[j] = true;
            }
        }
        return this.elements.filter(function (e) {
            return e.isToken(inRange);
        });
    }
    ;
}
export class ConlluElement {
    // represents CoNLL-U word or multiword token
    constructor(fields, lineidx, line, sentence) {
        /*
         * ConllU.Element: represents CoNLL-U word or multiword token
         */
        this.id = "";
        this.form = "";
        this.lemma = "";
        this.upostag = "";
        this._xpostag = "";
        // private feats : string = "";
        this.head = "";
        this.deprel = "";
        this.deps = "";
        this._miscs = {};
        this.lineidx = "";
        this.line = "";
        this.isSeg = -1;
        this.parent = null;
        this.children = [];
        this.features = [];
        this.sentence = null;
        this.copy = function (from) {
            this.form = from.form;
            this.lemma = from.lemma;
            this.upostag = from.upostag;
            this.xpostag = from.xpostag;
            this.feats = from.feats;
            this.head = from.head;
            this.deprel = from.deprel;
            this.deps = from.deps;
            this.misc = from.misc;
        };
        this.copyMorphInfo = function (from) {
            this.upostag = from.upostag;
            this.xpostag = from.xpostag;
            this.feats = from.feats;
            this.head = from.head;
            this.deprel = from.deprel;
            this.deps = from.deps;
            this.misc = from.misc;
        };
        this.morphFeatsMissing = function () {
            var tag = this.sentence.document.config.alltags.find(x => x.tag == this.xpostag);
            if (!tag) {
                // reportError("tag was not found!", this.xpostag)
                return [];
            }
            else if (!tag.features) {
                reportError("tag has no list of possible morph feats!" + this.xpostag);
                return [];
            }
            else
                return tag.features.filter(x => !this.features.find(y => y.key == x));
        };
        this.changeWith = function (el) {
            if (el.parent) {
                reportError("ERROR: changeWith cannot be used with a child element");
                el = el.parent;
            }
            // parent vs. parent
            var i = this.sentence.elements.findIndex(x => x == this);
            if (el.children.length > 0) {
                // Array.prototype.splice.apply(this.sentence.elements,[i,1,el].concat(el.children))
                var c = el.cloneParent();
                // c now has elements where first is parent and rest is children
                var parent = c[0];
                parent.analysis = this.analysis;
                c.forEach(e => {
                    e.sentence = this.sentence;
                    if (e != parent)
                        e.parent = parent;
                    e._miscs["FROM_MA"] = true;
                });
                // if(this.sentence.document.events){
                //     this.sentence.document.events.publish('highlight:change', c[1]);
                //     this.sentence.document.events.publish("stats",{action:"changeWith",elements:c})
                // }
                Array.prototype.splice.apply(this.sentence.elements, [i, 1 + this.children.length].concat(c));
                this.sentence.refix(true);
                return c[1];
            }
            else {
                let c = el.clone();
                c.analysis = this.analysis;
                c.sentence = this.sentence;
                c._miscs["FROM_MA"] = true;
                this.sentence.elements.splice(i, 1 + this.children.length, c);
                // if(this.sentence.document.events){
                //     this.sentence.document.events.publish('highlight:change', c);
                //     this.sentence.document.events.publish("stats",{action:"changeWith",element:c})
                // }
                this.sentence.refix(true);
                return c;
            }
        };
        this.clone = function () {
            var e = new ConlluElement([this.id, this.form,
                this.lemma,
                this.upostag,
                this.xpostag,
                this.feats,
                this.head,
                this.deprel,
                this.deps,
                this.misc], this.lineidx, this.line, this.sentence);
            // e.analysis = this.analysis
            return e;
        };
        this.cloneParent = function () {
            var all = [];
            var parent = this.clone();
            return [parent].concat(this.children.map(e => {
                e.parent = parent;
                return e.clone();
            }));
        };
        this.toConllU = function () {
            var line = [this.id,
                this.form,
                this.lemma,
                this.upostag,
                this.xpostag,
                this.feats,
                this.head,
                this.deprel,
                this.deps,
                this.misc];
            return line.join("\t");
        };
        // constraints that hold for all fields
        this.validateField = function (field, name, issues, allowSpace) {
            name = (name !== undefined ? name : 'field');
            issues = (issues !== undefined ? issues : []);
            if (allowSpace === undefined) {
                allowSpace = false;
            }
            if (field === undefined) {
                issues.push('invalid ' + name);
                return false;
            }
            else if (field.length === 0) {
                issues.push(name + ' must not be empty: "' + field + '"');
                return false;
            }
            else if (Util.hasSpace(field) && !allowSpace) {
                issues.push(name + ' must not contain space: "' + field + '"');
                return false;
            }
            else {
                return true;
            }
        };
        this.validateId = function (id, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(id, 'ID', issues)) {
                return false;
            }
            else if (id.match(/^\d+$/)) {
                if (id === '0') {
                    issues.push('ID indices must start from 1: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (id.match(/^(\d+)-(\d+)$/)) {
                var m = id.match(/^(\d+)-(\d+)$/);
                if (!m) {
                    reportError('internal error');
                    return false;
                }
                var start = parseInt(m[1], 10), end = parseInt(m[2], 10);
                if (end < start) {
                    issues.push('ID ranges must have start <= end: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (id.match(/^(\d+)\.(\d+)$/)) {
                m = id.match(/^(\d+)\.(\d+)$/);
                if (!m) {
                    reportError('internal error');
                    return false;
                }
                var iPart = parseInt(m[1], 10), fPart = parseInt(m[2], 10);
                if (iPart == 0 || fPart == 0) {
                    issues.push('ID indices must start from 1: "' + id + '"');
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                issues.push('ID must be integer, range, or decimal: "' + id + '"');
                return false;
            }
        };
        this.validateForm = function (form, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(form, 'FORM', issues, true)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateLemma = function (lemma, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(lemma, 'LEMMA', issues, true)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateUpostag = function (upostag, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(upostag, 'UPOSTAG', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateXpostag = function (xpostag, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(xpostag, 'XPOSTAG', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateFeats = function (feats, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(feats, 'FEATS', issues)) {
                return false;
            }
            else if (feats === '_') {
                return true;
            }
            var initialIssueCount = issues.length;
            var featarr = feats.split('|');
            var featmap = {};
            var prevName = null;
            for (let i = 0; i < featarr.length; i++) {
                var feat = featarr[i];
                var m = feat.match(Util.featureRegex);
                if (!m) {
                    // TODO more descriptive issue
                    issues.push('invalid FEATS entry: "' + feat + '"');
                    continue;
                }
                var name = m[1], valuestr = m[2];
                if (prevName !== null &&
                    name.toLowerCase() < prevName.toLowerCase()) {
                    issues.push('features must be ordered alphabetically ' +
                        '(case-insensitive): "' + name + '" < "' + prevName + '"');
                    var noIssue = false;
                }
                prevName = name;
                var values = valuestr.split(',');
                var valuemap = {}, validValues = [];
                for (let j = 0; j < values.length; j++) {
                    var value = values[j];
                    let m = value.match(Util.featureValueRegex);
                    if (!m) {
                        issues.push('invalid FEATS value: "' + value + '"');
                        continue;
                    }
                    if (valuemap[value] !== undefined) {
                        issues.push('duplicate feature value: "' + value + '"');
                        continue;
                    }
                    valuemap[value] = true;
                    validValues.push(value);
                }
                if (featmap[name] !== undefined) {
                    issues.push('duplicate feature name: "' + name + '"');
                    continue;
                }
                if (validValues.length !== 0) {
                    featmap[name] = validValues;
                }
            }
            return issues.length === initialIssueCount;
        };
        this.validateHead = function (head, issues) {
            issues = (issues !== undefined ? issues : []);
            // TODO: consider checking that DEPREL is "root" iff HEAD is 0.
            if (head === null) {
                return true; // exceptional case for ConlluElement.repair()
            }
            else if (!this.validateField(head, 'HEAD', issues)) {
                return false;
            }
            else if (this.isEmptyNode() && head === '_') {
                return true; // underscore permitted for empty nodes.
            }
            else if (head === '_') {
                return true; // AboBander Only
            }
            else if (!head.match(/^\d+$/)) {
                issues.push('HEAD must be an ID or zero: "' + head + '"');
                return false;
            }
            else {
                return true;
            }
        };
        this.validateDeprel = function (deprel, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(deprel, 'DEPREL', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validateDeps = function (deps, issues) {
            issues = (issues !== undefined ? issues : []);
            // TODO: consider checking that deprel is "root" iff head is 0.
            if (!this.validateField(deps, 'DEPS', issues)) {
                return false;
            }
            else if (deps === '_') {
                return true;
            }
            var deparr = deps.split('|');
            var prevHead = null;
            // TODO: don't short-circuit on first error
            for (let i = 0; i < deparr.length; i++) {
                var dep = deparr[i];
                var m = dep.match(/^(\d+(?:\.\d+)?):(\S+)$/);
                if (!m) {
                    // TODO more descriptive issue
                    issues.push('invalid DEPS: "' + deps + '"');
                    return false;
                }
                var head = m[1], deprel = m[2];
                if (prevHead !== null &&
                    parseFloat(head) < parseFloat(prevHead)) {
                    issues.push('DEPS must be ordered by head index');
                    return false;
                }
                prevHead = head;
            }
            return true;
        };
        this.validateMisc = function (misc, issues) {
            issues = (issues !== undefined ? issues : []);
            if (!this.validateField(misc, 'MISC', issues)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.validHeadReference = function (elementById) {
            return (this.head === '_' || this.head === null || this.head === '0' ||
                elementById[this.head] !== undefined);
        };
        this.isWord = function () {
            // word iff ID is an integer
            return !!this.id.match(/^\d+$/);
        };
        this.isMultiword = function () {
            return !!this.id.match(/^\d+-\d+$/);
        };
        this.isEmptyNode = function () {
            return !!this.id.match(/^\d+\.\d+$/);
        };
        this.rangeFrom = function () {
            return parseInt(this.id.match(/^(\d+)-\d+$/)[1], 10);
        };
        this.rangeTo = function () {
            return parseInt(this.id.match(/^\d+-(\d+)$/)[1], 10);
        };
        this.isToken = function (inRange) {
            // token iff multiword or not included in a multiword range
            return this.isMultiword() || !inRange[this.id];
        };
        // return list of (DEPENDENT, HEAD, DEPREL) lists
        this.dependencies = function (skipHead) {
            skipHead = (skipHead !== undefined ? skipHead : false);
            var elemDeps = [];
            if (!skipHead && this.head !== '_' && this.head !== null) {
                elemDeps.push([this.id, this.head, this.deprel]);
            }
            if (this.deps != '_') {
                var deparr = this.deps.split('|');
                for (let i = 0; i < deparr.length; i++) {
                    var dep = deparr[i];
                    var m = dep.match(Util.dependencyRegex);
                    if (m) {
                        elemDeps.push([this.id, m[1], m[2]]);
                    }
                    else {
                        reportError('internal error: dependencies(): invalid DEPS ' +
                            this.deps);
                    }
                }
            }
            return elemDeps;
        };
        // Check validity of the element. Return list of strings
        // representing issues found in validation (empty list if none).
        this.validate = function () {
            var issues = [];
            this.validateId(this.id, issues);
            this.validateForm(this.form, issues);
            // multiword tokens (elements with range IDs) are (locally) valid
            // iff all remaining fields (3-10) contain just an underscore.
            if (this.isMultiword()) {
                if (this.lemma != '_' ||
                    this.upostag != '_' ||
                    this.xpostag != '_' ||
                    this.feats != '_' ||
                    this.head != '_' ||
                    this.deprel != '_' ||
                    this.deps != '_' //||
                ) {
                    issues.push('non-underscore field for multiword token');
                }
                return issues;
            }
            // if we're here, not a multiword token.
            this.validateLemma(this.lemma, issues);
            this.validateUpostag(this.upostag, issues);
            this.validateXpostag(this.xpostag, issues);
            this.validateFeats(this.feats, issues);
            this.validateHead(this.head, issues);
            this.validateDeprel(this.deprel, issues);
            this.validateDeps(this.deps, issues);
            this.validateMisc(this.misc, issues);
            return issues;
        };
        // Attempt to repair a non-valid element. Return true iff the
        // element is valid following repair, false otherwise.
        this.repair = function (log) {
            log = (log !== undefined ? log : Util.nullLogger);
            if (!this.validateId(this.id)) {
                return false; // can't be helped
            }
            if (!this.validateForm(this.form)) {
                log('repair: blanking invalid FORM');
                this.form = '<ERROR>';
            }
            if (this.isMultiword()) {
                // valid as long as everything is blank
                this.lemma = '_';
                this.upostag = '_';
                this.xpostag = '_';
                this.feats = '_';
                this.head = '_';
                this.deprel = '_';
                this.deps = '_';
                this.misc = '_';
                return true;
            }
            // if we're here, not a multiword token.
            if (!this.validateLemma(this.lemma)) {
                log('repair: blanking invalid LEMMA');
                this.lemma = '<ERROR>';
            }
            if (!this.validateUpostag(this.upostag)) {
                log('repair: blanking invalid UPOSTAG');
                this.upostag = '_'; // TODO: not valid
            }
            if (!this.validateXpostag(this.xpostag)) {
                log('repair: blanking invalid XPOSTAG');
                this.xpostag = '_';
            }
            if (!this.validateFeats(this.feats)) {
                log('repair: blanking invalid FEATS ' + this.toConllU());
                this.feats = '_';
            }
            if (!this.validateHead(this.head)) {
                log('repair: blanking invalid HEAD');
                this.head = null; // note: exceptional case
            }
            if (!this.validateDeprel(this.deprel)) {
                log('repair: blanking invalid DEPREL');
                this.deprel = '_'; // TODO: not valid
            }
            if (!this.validateDeps(this.deps)) {
                log('repair: blanking invalid DEPS');
                this.deps = '_';
            }
            if (!this.validateMisc(this.misc)) {
                log('repair: blanking invalid MISC');
                this.misc = '_';
            }
            var issues = this.validate();
            return issues.length === 0;
        };
        this.sentence = sentence;
        this.id = fields[0];
        this.form = fields[1];
        this.lemma = fields[2];
        this.upostag = fields[3];
        this.feats = fields[5];
        this.xpostag = fields[4];
        this.head = fields[6];
        this.deprel = fields[7];
        this.deps = fields[8];
        this.misc = fields[9];
        this.lineidx = lineidx;
        this.line = line;
    }
    get xpostag() {
        return this._xpostag;
    }
    set xpostag(argv) {
        if (this.isMultiword()) {
            this._xpostag = "_";
            return;
        }
        this._xpostag = this.sentence.document.mapTagToXpostag(argv);
        this.upostag = this.sentence.document.mapTagToUpostag(this._xpostag, this.upostag);
        // remove feats
        var tag = this.sentence.document.config.alltags.find(x => x.tag == this._xpostag);
        if (!tag)
            return;
        else if (Array.isArray(tag.features)) {
            this.features = this.features.filter(x => tag.features.indexOf(x.key) >= 0);
            // this.features = tag.features.map(x=>this.features.find(y=>y.key==x)||x).map(x=>typeof x =="string" ?{key:x,value:"_"}:x)
            // console.log(this.features)
        }
    }
    set misc(args) {
        this._miscs = {};
        if (args == undefined)
            return;
        if (args == "_")
            return;
        args.split("|").forEach(text => {
            var arr = text.split("=");
            this._miscs[arr[0]] = arr[1];
        });
    }
    get misc() {
        return Object.keys(this._miscs).map(key => {
            return this._miscs[key] ? key + "=" + this._miscs[key] : undefined;
        }).filter(x => x != undefined).sort().join("|") || "_";
    }
    set feats(args) {
        this.features = [];
        if (args == undefined)
            return;
        if (args == "_")
            return;
        // args.split("|").forEach(text => {
        //     var arr = text.split("=")
        //     this.features.push({key:arr[0],value:arr[1]})
        // })
        var featarr = args.split('|');
        for (let i = 0; i < featarr.length; i++) {
            var feat = featarr[i];
            var m = feat.match(Util.featureRegex);
            if (!m) {
                continue;
            }
            var name = m[1], valuestr = m[2];
            var values = valuestr.split(',');
            for (let j = 0; j < values.length; j++) {
                var value = values[j];
                let m = value.match(Util.featureValueRegex);
                if (!m) {
                    continue;
                }
                this.features.push({ key: name, value: value });
            }
        }
    }
    get feats() {
        return this.features.map(v => {
            return v.key + "=" + v.value;
        }).sort().join("|") || "_";
    }
    ;
    setFeature(key, value) {
        var i = this.features.findIndex(x => x.key == key);
        if (i >= 0)
            if (value)
                this.features[i].value = value;
            else
                this.features.splice(i, 1);
        else
            this.features.push({ key: key, value: value });
    }
    getForm() {
        // console.log(elem)
        if (!this.parent)
            return this.form;
        var prev = this.parent.children[this.isSeg - 1];
        var prevStr = "";
        if (prev) {
            prevStr = prev.form.replace(/[ًٌٍَُِّْ]*$/, "");
            prevStr = prevStr.charAt(prevStr.length - 1);
        }
        var next = this.parent.children[this.isSeg + 1];
        var nextStr = "";
        if (next)
            nextStr = next.form.charAt(0);
        var meLast = this.form.replace(/[ًٌٍَُِّْ]*$/, "");
        meLast = meLast.charAt(meLast.length - 1);
        var meFirst = this.form.charAt(0);
        if (-this.parent.isSeg == this.isSeg + 1)
            return (Util.isTatweel(prevStr, meFirst) ? "ـ" : "") + this.form;
        else if (this.isSeg == 0)
            return this.form + (Util.isTatweel(meLast, nextStr) ? "ـ" : "");
        else
            return (Util.isTatweel(prevStr, meFirst) ? "ـ" : "") +
                this.form
                + (Util.isTatweel(meLast, nextStr) ? "ـ" : "");
    }
}
export class Util {
    static isTatweel(first, second) {
        if (!first || !second)
            return false;
        if (first == "ـ" && second == "ـ")
            return false;
        if ("دذاءؤرىةإأآو_".indexOf(first) >= 0)
            return false;
        else if ("ء_".indexOf(second) >= 0)
            return false;
        else {
            return true;
        }
    }
}
Util.repairFields = function (fields, logger) {
    if (logger === undefined) {
        logger = Util.nullLogger;
    }
    if (fields.length > 10) {
        logger('repair: discarding fields > 10');
        fields = fields.slice(0, 10);
    }
    else {
        logger('repair: filling in empty ("_") for missing fields');
        for (let m = 0; m < 10 - fields.length; m++) {
            fields.push('_');
        }
    }
};
Util.strictFieldSplitter = function (line) {
    // strict CoNLL format parsing: only split on TAB, no extra space.
    if (line.length === 0) {
        return [];
    }
    else {
        return line.split('\t');
    }
};
Util.looseFieldSplitter = function (line) {
    // loose CoNLL format parsing: split on any space sequence, trim
    // surrounding space.
    line = line.trim();
    if (line.length === 0) {
        return [];
    }
    else {
        return line.split(/\s+/);
    }
};
Util.selectParsingMode = function (conll, log) {
    // return whether to use strict mode parsing
    // very simple heuristic: any TABs in the input trigger
    // strict parsing, loose only if none present.
    if (conll.indexOf('\t') !== -1) {
        log('note: TAB found, parsing CoNLL-U in strict mode.');
        return true;
    }
    else {
        log('note: no TAB found, parsing CoNLL-U in loose mode.');
        return false;
    }
};
Util.selectFieldSplitter = function (conll, log, strict) {
    // return function to use for dividing lines into fields.
    if (strict) {
        return Util.strictFieldSplitter;
    }
    else {
        return Util.looseFieldSplitter;
    }
};
Util.isComment = function (line) {
    return line.length !== 0 && line[0] === '#';
};
Util.hasSpace = function (s) {
    return !!s.match(/\s/);
};
Util.nullLogger = function (message) {
    return null;
};
/*
 * Return true iff given string only contains characters from a
 * right-to-left Unicode block and is not empty.
 */
Util.isRtl = function (s) {
    // range from http://stackoverflow.com/a/14824756
    return !!s.match(/^[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]+$/);
};
/*
 * Return given token with possible modifications to accommodate
 * issues in brat rendering of right-to-left text
 * (https://github.com/UniversalDependencies/docs/issues/52)
 */
Util.rtlFix = function (s) {
    var prefix = '\u02D1', suffix = '\u02D1';
    if (Util.isRtl(s)) {
        s = prefix + s + suffix;
    }
    return s;
};
/*
 * Return a deep copy of the given object. Note: not particularly
 * efficient, and all fields must be serializable for this to work
 * correctly.
 */
Util.deepCopy = function (o) {
    return JSON.parse(JSON.stringify(o));
};
/*
 * Regular expressions for various parts of the format.
 * See https://github.com/UniversalDependencies/docs/issues/33
 */
// match single (feature, value[s]) pair in FEATS
Util.featureRegex = /^([A-Z0-9][a-zA-Z0-9]*(?:\[[a-z0-9]+\])?)=(_|[A-Z0-9][a-zA-Z0-9]*(?:,[A-Z0-9][a-zA-Z0-9]*)*)$/;
// match single feature value in FEATS
Util.featureValueRegex = /^([A-Z0-9][a-zA-Z0-9]*|_)$/;
// match single (head, deprel) pair in DEPS
Util.dependencyRegex = /^(\d+(?:\.\d+)?):(.*)$/;