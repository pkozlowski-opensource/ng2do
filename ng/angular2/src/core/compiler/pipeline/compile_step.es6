import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
export class CompileStep {
  process(parent, current, control) {}
}
Object.defineProperty(CompileStep.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=d:/work/gitrepos/gh/pkozlowski-opensource/angular/modules/angular2/src/core/compiler/pipeline/compile_step.map

//# sourceMappingURL=./compile_step.map