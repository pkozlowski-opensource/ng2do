export var NO_CHANGE = new Object();
export class Pipe {
  supports(obj) {
    return false;
  }
  transform(value) {
    return null;
  }
}
Object.defineProperty(Pipe.prototype.transform, "parameters", {get: function() {
    return [[assert.type.any]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/change_detection/pipes/pipe.map

//# sourceMappingURL=./pipe.map