import {RegExpWrapper,
  StringWrapper,
  isPresent} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/facade/dom';
import {Parser} from 'angular2/change_detection';
import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
export class TextInterpolationParser extends CompileStep {
  constructor(parser) {
    super();
    this._parser = parser;
  }
  process(parent, current, control) {
    if (!current.compileChildren || current.ignoreBindings) {
      return ;
    }
    var element = current.element;
    var childNodes = DOM.childNodes(DOM.templateAwareRoot(element));
    for (var i = 0; i < childNodes.length; i++) {
      var node = childNodes[i];
      if (DOM.isTextNode(node)) {
        this._parseTextNode(current, node, i);
      }
    }
  }
  _parseTextNode(pipelineElement, node, nodeIndex) {
    var ast = this._parser.parseInterpolation(DOM.nodeValue(node), pipelineElement.elementDescription);
    if (isPresent(ast)) {
      DOM.setText(node, ' ');
      pipelineElement.addTextNodeBinding(nodeIndex, ast);
    }
  }
}
Object.defineProperty(TextInterpolationParser, "parameters", {get: function() {
    return [[Parser]];
  }});
Object.defineProperty(TextInterpolationParser.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/pipeline/text_interpolation_parser.map

//# sourceMappingURL=./text_interpolation_parser.map