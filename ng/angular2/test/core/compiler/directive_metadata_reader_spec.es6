import {ddescribe,
  describe,
  it,
  iit,
  expect,
  beforeEach} from 'angular2/test_lib';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Decorator,
  Component,
  Viewport} from 'angular2/src/core/annotations/annotations';
import {DirectiveMetadata} from 'angular2/src/core/compiler/directive_metadata';
class SomeDecorator {}
Object.defineProperty(SomeDecorator, "annotations", {get: function() {
    return [new Decorator({selector: 'someDecorator'})];
  }});
class SomeComponent {}
Object.defineProperty(SomeComponent, "annotations", {get: function() {
    return [new Component({selector: 'someComponent'})];
  }});
class SomeViewport {}
Object.defineProperty(SomeViewport, "annotations", {get: function() {
    return [new Viewport({selector: 'someViewport'})];
  }});
class SomeDirectiveWithoutAnnotation {}
export function main() {
  describe("DirectiveMetadataReader", () => {
    var reader;
    beforeEach(() => {
      reader = new DirectiveMetadataReader();
    });
    it('should read out the Decorator annotation', () => {
      var directiveMetadata = reader.read(SomeDecorator);
      expect(directiveMetadata).toEqual(new DirectiveMetadata(SomeDecorator, new Decorator({selector: 'someDecorator'})));
    });
    it('should read out the Viewport annotation', () => {
      var directiveMetadata = reader.read(SomeViewport);
      expect(directiveMetadata).toEqual(new DirectiveMetadata(SomeViewport, new Viewport({selector: 'someViewport'})));
    });
    it('should read out the Component annotation', () => {
      var directiveMetadata = reader.read(SomeComponent);
      expect(directiveMetadata).toEqual(new DirectiveMetadata(SomeComponent, new Component({selector: 'someComponent'})));
    });
    it('should throw if not matching annotation is found', () => {
      expect(() => {
        reader.read(SomeDirectiveWithoutAnnotation);
      }).toThrowError('No Directive annotation found on SomeDirectiveWithoutAnnotation');
    });
  });
}

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/test/core/compiler/directive_metadata_reader_spec.map

//# sourceMappingURL=./directive_metadata_reader_spec.map