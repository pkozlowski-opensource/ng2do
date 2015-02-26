export class OpaqueToken {
  constructor(desc) {
    this._desc = `Token(${desc})`;
  }
  toString() {
    return this._desc;
  }
}
Object.defineProperty(OpaqueToken, "parameters", {get: function() {
    return [[assert.type.string]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/di/opaque_token.map

//# sourceMappingURL=./opaque_token.map