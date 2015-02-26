import {Type,
  isBlank,
  isPresent,
  int} from 'angular2/src/facade/lang';
import {DOM,
  Element,
  StyleElement} from 'angular2/src/facade/dom';
import {List,
  ListWrapper,
  MapWrapper,
  Map} from 'angular2/src/facade/collection';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {View} from './view';
import {Content} from './shadow_dom_emulation/content_tag';
import {LightDom} from './shadow_dom_emulation/light_dom';
import {ShadowCss} from './shadow_dom_emulation/shadow_css';
import {StyleInliner} from './style_inliner';
import {StyleUrlResolver} from './style_url_resolver';
export class ShadowDomStrategy {
  attachTemplate(el, view) {}
  constructLightDom(lightDomView, shadowDomView, el) {}
  polyfillDirectives() {
    return null;
  }
  transformStyleText(cssText, baseUrl, component) {}
  handleStyleElement(styleEl) {}
  shimContentElement(component, element) {}
  shimHostElement(component, element) {}
}
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.transformStyleText, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [Type]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.handleStyleElement, "parameters", {get: function() {
    return [[StyleElement]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.shimContentElement, "parameters", {get: function() {
    return [[Type], [Element]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.shimHostElement, "parameters", {get: function() {
    return [[Type], [Element]];
  }});
export class EmulatedShadowDomStrategy extends ShadowDomStrategy {
  constructor(styleInliner, styleUrlResolver, styleHost) {
    super();
    this._styleInliner = styleInliner;
    this._styleUrlResolver = styleUrlResolver;
    this._styleHost = styleHost;
  }
  attachTemplate(el, view) {
    DOM.clearNodes(el);
    _moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return new LightDom(lightDomView, shadowDomView, el);
  }
  polyfillDirectives() {
    return [Content];
  }
  transformStyleText(cssText, baseUrl, component) {
    cssText = this._styleUrlResolver.resolveUrls(cssText, baseUrl);
    var css = this._styleInliner.inlineImports(cssText, baseUrl);
    if (PromiseWrapper.isPromise(css)) {
      return css.then((css) => _shimCssForComponent(css, component));
    } else {
      return _shimCssForComponent(css, component);
    }
  }
  handleStyleElement(styleEl) {
    DOM.remove(styleEl);
    this._insertStyleElement(this._styleHost, styleEl);
  }
  shimContentElement(component, element) {
    var id = _getComponentId(component);
    var attrName = _getContentAttribute(id);
    DOM.setAttribute(element, attrName, '');
  }
  shimHostElement(component, element) {
    var id = _getComponentId(component);
    var attrName = _getHostAttribute(id);
    DOM.setAttribute(element, attrName, '');
  }
  _insertStyleElement(host, style) {
    if (isBlank(this._lastInsertedStyle)) {
      var firstChild = DOM.firstChild(host);
      if (isPresent(firstChild)) {
        DOM.insertBefore(firstChild, style);
      } else {
        DOM.appendChild(host, style);
      }
    } else {
      DOM.insertAfter(this._lastInsertedStyle, style);
    }
    this._lastInsertedStyle = style;
  }
}
Object.defineProperty(EmulatedShadowDomStrategy, "parameters", {get: function() {
    return [[StyleInliner], [StyleUrlResolver], [Element]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.transformStyleText, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [Type]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.handleStyleElement, "parameters", {get: function() {
    return [[StyleElement]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.shimContentElement, "parameters", {get: function() {
    return [[Type], [Element]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.shimHostElement, "parameters", {get: function() {
    return [[Type], [Element]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype._insertStyleElement, "parameters", {get: function() {
    return [[Element], [StyleElement]];
  }});
export class NativeShadowDomStrategy extends ShadowDomStrategy {
  constructor(styleUrlResolver) {
    super();
    this._styleUrlResolver = styleUrlResolver;
  }
  attachTemplate(el, view) {
    _moveViewNodesIntoParent(DOM.createShadowRoot(el), view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return null;
  }
  polyfillDirectives() {
    return [];
  }
  transformStyleText(cssText, baseUrl, component) {
    return this._styleUrlResolver.resolveUrls(cssText, baseUrl);
  }
}
Object.defineProperty(NativeShadowDomStrategy, "parameters", {get: function() {
    return [[StyleUrlResolver]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.transformStyleText, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [Type]];
  }});
function _moveViewNodesIntoParent(parent, view) {
  for (var i = 0; i < view.nodes.length; ++i) {
    DOM.appendChild(parent, view.nodes[i]);
  }
}
var _componentUIDs = MapWrapper.create();
var _nextComponentUID = 0;
function _getComponentId(component) {
  var id = MapWrapper.get(_componentUIDs, component);
  if (isBlank(id)) {
    id = _nextComponentUID++;
    MapWrapper.set(_componentUIDs, component, id);
  }
  return id;
}
Object.defineProperty(_getComponentId, "parameters", {get: function() {
    return [[Type]];
  }});
function _getHostAttribute(id) {
  return `_nghost-${id}`;
}
Object.defineProperty(_getHostAttribute, "parameters", {get: function() {
    return [[int]];
  }});
function _getContentAttribute(id) {
  return `_ngcontent-${id}`;
}
Object.defineProperty(_getContentAttribute, "parameters", {get: function() {
    return [[int]];
  }});
function _shimCssForComponent(cssText, component) {
  var id = _getComponentId(component);
  var shadowCss = new ShadowCss();
  return shadowCss.shimCssText(cssText, _getContentAttribute(id), _getHostAttribute(id));
}
Object.defineProperty(_shimCssForComponent, "parameters", {get: function() {
    return [[assert.type.string], [Type]];
  }});
export function resetShadowDomCache() {
  MapWrapper.clear(_componentUIDs);
  _nextComponentUID = 0;
}

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/shadow_dom_strategy.map

//# sourceMappingURL=./shadow_dom_strategy.map