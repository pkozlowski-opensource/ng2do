import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {DOM} from 'angular2/src/facade/dom';
import {Type} from 'angular2/src/facade/lang';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {ListWrapper} from 'angular2/src/facade/collection';
export class ResolveCss extends CompileStep {
  constructor(cmpMetadata, strategy, templateUrl) {
    super();
    this._strategy = strategy;
    this._component = cmpMetadata.type;
    this._templateUrl = templateUrl;
  }
  process(parent, current, control) {
    if (DOM.tagName(current.element) == 'STYLE') {
      current.ignoreBindings = true;
      var styleEl = current.element;
      var css = DOM.getText(styleEl);
      css = this._strategy.transformStyleText(css, this._templateUrl, this._component);
      if (PromiseWrapper.isPromise(css)) {
        ListWrapper.push(parent.inheritedProtoView.stylePromises, css);
        DOM.setText(styleEl, '');
        css.then((css) => {
          DOM.setText(styleEl, css);
        });
      } else {
        DOM.setText(styleEl, css);
      }
      this._strategy.handleStyleElement(styleEl);
    }
  }
}
Object.defineProperty(ResolveCss, "parameters", {get: function() {
    return [[DirectiveMetadata], [ShadowDomStrategy], [assert.type.string]];
  }});
Object.defineProperty(ResolveCss.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/pipeline/resolve_css.map

//# sourceMappingURL=./resolve_css.map