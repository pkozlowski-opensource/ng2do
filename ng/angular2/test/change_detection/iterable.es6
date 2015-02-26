export class TestIterable {
  constructor() {
    this.list = [];
  }
  [Symbol.iterator]() {
    return this.list[Symbol.iterator]();
  }
}

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/test/change_detection/iterable.map

//# sourceMappingURL=./iterable.map