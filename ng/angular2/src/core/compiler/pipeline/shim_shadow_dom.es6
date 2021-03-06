import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {isPresent,
  Type} from 'angular2/src/facade/lang';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
export class ShimShadowDom extends CompileStep {
  constructor(cmpMetadata, strategy) {
    super();
    this._strategy = strategy;
    this._component = cmpMetadata.type;
  }
  process(parent, current, control) {
    if (current.ignoreBindings) {
      return ;
    }
    this._strategy.shimContentElement(this._component, current.element);
    var host = current.componentDirective;
    if (isPresent(host)) {
      this._strategy.shimHostElement(host.type, current.element);
    }
  }
}
Object.defineProperty(ShimShadowDom, "parameters", {get: function() {
    return [[DirectiveMetadata], [ShadowDomStrategy]];
  }});
Object.defineProperty(ShimShadowDom.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/pipeline/shim_shadow_dom.map

//# sourceMappingURL=./shim_shadow_dom.map