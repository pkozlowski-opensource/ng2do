import {ChangeDetection,
  Parser} from 'angular2/change_detection';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {PropertyBindingParser} from './property_binding_parser';
import {TextInterpolationParser} from './text_interpolation_parser';
import {DirectiveParser} from './directive_parser';
import {ViewSplitter} from './view_splitter';
import {ElementBindingMarker} from './element_binding_marker';
import {ProtoViewBuilder} from './proto_view_builder';
import {ProtoElementInjectorBuilder} from './proto_element_injector_builder';
import {ElementBinderBuilder} from './element_binder_builder';
import {ResolveCss} from './resolve_css';
import {ShimShadowDom} from './shim_shadow_dom';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
import {ShadowDomStrategy,
  EmulatedShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
export function createDefaultSteps(changeDetection, parser, compiledComponent, directives, shadowDomStrategy, templateUrl) {
  var steps = [new ViewSplitter(parser), new ResolveCss(compiledComponent, shadowDomStrategy, templateUrl), new PropertyBindingParser(parser), new DirectiveParser(directives), new TextInterpolationParser(parser), new ElementBindingMarker(), new ProtoViewBuilder(changeDetection, shadowDomStrategy), new ProtoElementInjectorBuilder(), new ElementBinderBuilder(parser)];
  if (shadowDomStrategy instanceof EmulatedShadowDomStrategy) {
    var step = new ShimShadowDom(compiledComponent, shadowDomStrategy);
    ListWrapper.push(steps, step);
  }
  return steps;
}
Object.defineProperty(createDefaultSteps, "parameters", {get: function() {
    return [[ChangeDetection], [Parser], [DirectiveMetadata], [assert.genericType(List, DirectiveMetadata)], [ShadowDomStrategy], [assert.type.string]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/pipeline/default_steps.map

//# sourceMappingURL=./default_steps.map