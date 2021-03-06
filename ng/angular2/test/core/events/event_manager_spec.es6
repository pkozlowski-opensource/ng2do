import {describe,
  ddescribe,
  it,
  iit,
  xit,
  xdescribe,
  expect,
  beforeEach,
  el} from 'angular2/test_lib';
import {EventManager,
  EventManagerPlugin,
  DomEventsPlugin} from 'angular2/src/core/events/event_manager';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
import {List,
  ListWrapper,
  Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {DOM,
  Element,
  document} from 'angular2/src/facade/dom';
export function main() {
  var domEventPlugin;
  beforeEach(() => {
    domEventPlugin = new DomEventsPlugin();
  });
  describe('EventManager', () => {
    it('should delegate event bindings to plugins', () => {
      var element = el('<div></div>');
      var handler = (e) => e;
      var plugin = new FakeEventManagerPlugin(['click']);
      var manager = new EventManager([plugin, domEventPlugin], new FakeVmTurnZone());
      manager.addEventListener(element, 'click', handler);
      expect(MapWrapper.get(plugin._nonBubbleEventHandlers, 'click')).toBe(handler);
    });
    it('should delegate bubbling events to plugins', () => {
      var element = el('<div></div>');
      var handler = (e) => e;
      var plugin = new FakeEventManagerPlugin(['click']);
      var manager = new EventManager([plugin, domEventPlugin], new FakeVmTurnZone());
      manager.addEventListener(element, '^click', handler);
      expect(MapWrapper.get(plugin._bubbleEventHandlers, 'click')).toBe(handler);
    });
    it('should delegate event bindings to the first plugin supporting the event', () => {
      var element = el('<div></div>');
      var clickHandler = (e) => e;
      var dblClickHandler = (e) => e;
      var plugin1 = new FakeEventManagerPlugin(['dblclick']);
      var plugin2 = new FakeEventManagerPlugin(['click', 'dblclick']);
      var manager = new EventManager([plugin1, plugin2], new FakeVmTurnZone());
      manager.addEventListener(element, 'click', clickHandler);
      manager.addEventListener(element, 'dblclick', dblClickHandler);
      expect(MapWrapper.contains(plugin1._nonBubbleEventHandlers, 'click')).toBe(false);
      expect(MapWrapper.get(plugin2._nonBubbleEventHandlers, 'click')).toBe(clickHandler);
      expect(MapWrapper.contains(plugin2._nonBubbleEventHandlers, 'dblclick')).toBe(false);
      expect(MapWrapper.get(plugin1._nonBubbleEventHandlers, 'dblclick')).toBe(dblClickHandler);
    });
    it('should throw when no plugin can handle the event', () => {
      var element = el('<div></div>');
      var plugin = new FakeEventManagerPlugin(['dblclick']);
      var manager = new EventManager([plugin], new FakeVmTurnZone());
      expect(() => manager.addEventListener(element, 'click', null)).toThrowError('No event manager plugin found for event click');
    });
    it('by default events are only caught on same element', () => {
      var element = el('<div><div></div></div>');
      var child = DOM.firstChild(element);
      var dispatchedEvent = DOM.createMouseEvent('click');
      var receivedEvent = null;
      var handler = (e) => {
        receivedEvent = e;
      };
      var manager = new EventManager([domEventPlugin], new FakeVmTurnZone());
      manager.addEventListener(element, 'click', handler);
      DOM.dispatchEvent(child, dispatchedEvent);
      expect(receivedEvent).toBe(null);
    });
    it('bubbled events are caught when fired from a child', () => {
      var element = el('<div><div></div></div>');
      DOM.appendChild(document.body, element);
      var child = DOM.firstChild(element);
      var dispatchedEvent = DOM.createMouseEvent('click');
      var receivedEvent = null;
      var handler = (e) => {
        receivedEvent = e;
      };
      var manager = new EventManager([domEventPlugin], new FakeVmTurnZone());
      manager.addEventListener(element, '^click', handler);
      DOM.dispatchEvent(child, dispatchedEvent);
      expect(receivedEvent).toBe(dispatchedEvent);
    });
  });
}
class FakeEventManagerPlugin extends EventManagerPlugin {
  constructor(supports) {
    super();
    this._supports = supports;
    this._nonBubbleEventHandlers = MapWrapper.create();
    this._bubbleEventHandlers = MapWrapper.create();
  }
  supports(eventName) {
    return ListWrapper.contains(this._supports, eventName);
  }
  addEventListener(element, eventName, handler, shouldSupportBubble) {
    MapWrapper.set(shouldSupportBubble ? this._bubbleEventHandlers : this._nonBubbleEventHandlers, eventName, handler);
  }
}
Object.defineProperty(FakeEventManagerPlugin, "parameters", {get: function() {
    return [[assert.genericType(List, assert.type.string)]];
  }});
Object.defineProperty(FakeEventManagerPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(FakeEventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function], [assert.type.boolean]];
  }});
class FakeVmTurnZone extends VmTurnZone {
  constructor() {
    super({enableLongStackTrace: false});
  }
  run(fn) {
    fn();
  }
  runOutsideAngular(fn) {
    fn();
  }
}

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/test/core/events/event_manager_spec.map

//# sourceMappingURL=./event_manager_spec.map