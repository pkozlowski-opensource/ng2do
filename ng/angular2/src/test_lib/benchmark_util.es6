import {DOM,
  document,
  location} from 'angular2/src/facade/dom';
import {NumberWrapper,
  BaseException,
  isBlank} from 'angular2/src/facade/lang';
export function getIntParameter(name) {
  return NumberWrapper.parseInt(getStringParameter(name), 10);
}
Object.defineProperty(getIntParameter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export function getStringParameter(name) {
  var els = DOM.querySelectorAll(document, `input[name="${name}"]`);
  var value;
  var el;
  for (var i = 0; i < els.length; i++) {
    el = els[i];
    var type = DOM.type(el);
    if ((type !== 'radio' && type !== 'checkbox') || DOM.getChecked(el)) {
      value = DOM.getValue(el);
      break;
    }
  }
  if (isBlank(value)) {
    throw new BaseException(`Could not find and input field with name ${name}`);
  }
  return value;
}
Object.defineProperty(getStringParameter, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export function bindAction(selector, callback) {
  var el = DOM.querySelector(document, selector);
  DOM.on(el, 'click', function(_) {
    callback();
  });
}
Object.defineProperty(bindAction, "parameters", {get: function() {
    return [[assert.type.string], [Function]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/test_lib/benchmark_util.map

//# sourceMappingURL=./benchmark_util.map