import {DOM,
  Element} from 'angular2/src/facade/dom';
import {normalizeBlank} from 'angular2/src/facade/lang';
export class NgElement {
  constructor(domElement) {
    this.domElement = domElement;
  }
  getAttribute(name) {
    return normalizeBlank(DOM.getAttribute(this.domElement, name));
  }
}
Object.defineProperty(NgElement, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(NgElement.prototype.getAttribute, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/dom/element.map

//# sourceMappingURL=./element.map