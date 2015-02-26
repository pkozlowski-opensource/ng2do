import {describe,
  beforeEach,
  it,
  expect,
  ddescribe,
  iit,
  SpyObject,
  el} from 'angular2/test_lib';
import {NativeShadowDomStrategy,
  EmulatedShadowDomStrategy,
  resetShadowDomCache} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {UrlResolver} from 'angular2/src/core/compiler/url_resolver';
import {StyleUrlResolver} from 'angular2/src/core/compiler/style_url_resolver';
import {StyleInliner} from 'angular2/src/core/compiler/style_inliner';
import {ProtoView} from 'angular2/src/core/compiler/view';
import {XHR} from 'angular2/src/core/compiler/xhr/xhr';
import {isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/facade/dom';
import {Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {PromiseWrapper,
  Promise} from 'angular2/src/facade/async';
import {DynamicProtoChangeDetector} from 'angular2/change_detection';
export function main() {
  var strategy;
  describe('NativeShadowDomStratgey', () => {
    beforeEach(() => {
      var urlResolver = new UrlResolver();
      var styleUrlResolver = new StyleUrlResolver(urlResolver);
      strategy = new NativeShadowDomStrategy(styleUrlResolver);
    });
    it('should attach the view nodes to the shadow root', () => {
      var host = el('<div></div>');
      var nodes = el('<div>view</div>');
      var pv = new ProtoView(nodes, new DynamicProtoChangeDetector(null), null);
      var view = pv.instantiate(null, null);
      strategy.attachTemplate(host, view);
      var shadowRoot = DOM.getShadowRoot(host);
      expect(isPresent(shadowRoot)).toBeTruthy();
      expect(shadowRoot).toHaveText('view');
    });
    it('should rewrite style urls', () => {
      var css = '.foo {background-image: url("img.jpg");}';
      expect(strategy.transformStyleText(css, 'http://base', null)).toEqual(".foo {background-image: url('http://base/img.jpg');}");
    });
    it('should not inline import rules', () => {
      var css = '@import "other.css";';
      expect(strategy.transformStyleText(css, 'http://base', null)).toEqual("@import 'http://base/other.css';");
    });
  });
  describe('EmulatedShadowDomStratgey', () => {
    var xhr,
        styleHost;
    beforeEach(() => {
      var urlResolver = new UrlResolver();
      var styleUrlResolver = new StyleUrlResolver(urlResolver);
      xhr = new FakeXHR();
      var styleInliner = new StyleInliner(xhr, styleUrlResolver, urlResolver);
      styleHost = el('<div></div>');
      strategy = new EmulatedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost);
      resetShadowDomCache();
    });
    it('should attach the view nodes as child of the host element', () => {
      var host = el('<div><span>original content</span></div>');
      var nodes = el('<div>view</div>');
      var pv = new ProtoView(nodes, new DynamicProtoChangeDetector(null), null);
      var view = pv.instantiate(null, null);
      strategy.attachTemplate(host, view);
      var firstChild = DOM.firstChild(host);
      expect(DOM.tagName(firstChild)).toEqual('DIV');
      expect(firstChild).toHaveText('view');
      expect(host).toHaveText('view');
    });
    it('should rewrite style urls', () => {
      var css = '.foo {background-image: url("img.jpg");}';
      expect(strategy.transformStyleText(css, 'http://base', SomeComponent)).toEqual(".foo[_ngcontent-0] {\nbackground-image: url(http://base/img.jpg);\n}");
    });
    it('should scope style', () => {
      var css = '.foo {} :host {}';
      expect(strategy.transformStyleText(css, 'http://base', SomeComponent)).toEqual(".foo[_ngcontent-0] {\n\n}\n\n[_nghost-0] {\n\n}");
    });
    it('should inline @import rules', (done) => {
      xhr.reply('http://base/one.css', '.one {}');
      var css = '@import "one.css";';
      var promise = strategy.transformStyleText(css, 'http://base', SomeComponent);
      expect(promise).toBePromise();
      promise.then((css) => {
        expect(css).toEqual('.one[_ngcontent-0] {\n\n}');
        done();
      });
    });
    it('should return the same style given the same component', () => {
      var css = '.foo {} :host {}';
      expect(strategy.transformStyleText(css, 'http://base', SomeComponent)).toEqual(".foo[_ngcontent-0] {\n\n}\n\n[_nghost-0] {\n\n}");
      expect(strategy.transformStyleText(css, 'http://base', SomeComponent)).toEqual(".foo[_ngcontent-0] {\n\n}\n\n[_nghost-0] {\n\n}");
    });
    it('should return different styles given different components', () => {
      var css = '.foo {} :host {}';
      expect(strategy.transformStyleText(css, 'http://base', SomeComponent)).toEqual(".foo[_ngcontent-0] {\n\n}\n\n[_nghost-0] {\n\n}");
      expect(strategy.transformStyleText(css, 'http://base', SomeOtherComponent)).toEqual(".foo[_ngcontent-1] {\n\n}\n\n[_nghost-1] {\n\n}");
    });
    it('should move the style element to the style host', () => {
      var originalHost = el('<div></div>');
      var styleEl = el('<style>/*css*/</style>');
      DOM.appendChild(originalHost, styleEl);
      expect(originalHost).toHaveText('/*css*/');
      strategy.handleStyleElement(styleEl);
      expect(originalHost).toHaveText('');
      expect(styleHost).toHaveText('/*css*/');
    });
    it('should add an attribute to the content elements', () => {
      var elt = el('<div></div>');
      strategy.shimContentElement(SomeComponent, elt);
      expect(DOM.getAttribute(elt, '_ngcontent-0')).toEqual('');
    });
    it('should add an attribute to the host elements', () => {
      var elt = el('<div></div>');
      strategy.shimHostElement(SomeComponent, elt);
      expect(DOM.getAttribute(elt, '_nghost-0')).toEqual('');
    });
  });
}
class FakeXHR extends XHR {
  constructor() {
    super();
    this._responses = MapWrapper.create();
  }
  get(url) {
    var response = MapWrapper.get(this._responses, url);
    if (isBlank(response)) {
      return PromiseWrapper.reject('xhr error');
    }
    return PromiseWrapper.resolve(response);
  }
  reply(url, response) {
    MapWrapper.set(this._responses, url, response);
  }
}
Object.defineProperty(FakeXHR.prototype.get, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(FakeXHR.prototype.reply, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
class SomeComponent {}
class SomeOtherComponent {}

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/test/core/compiler/shadow_dom_strategy_spec.map

//# sourceMappingURL=./shadow_dom_strategy_spec.map