import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { number } from './validator';
const NUMBER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NumberValidator),
    multi: true
};
export class NumberValidator {
    validate(c) {
        return number(c);
    }
}
NumberValidator.decorators = [
    { type: Directive, args: [{
                selector: '[number][formControlName],[number][formControl],[number][ngModel]',
                providers: [NUMBER_VALIDATOR]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLyIsInNvdXJjZXMiOlsic3JjL2FwcC9udW1iZXIvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQThCLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxNQUFNLGdCQUFnQixHQUFRO0lBQzVCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzlDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQU1GLE1BQU0sT0FBTyxlQUFlO0lBQzFCLFFBQVEsQ0FBQyxDQUFrQjtRQUN6QixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDOzs7WUFQRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1FQUFtRTtnQkFDN0UsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7YUFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBudW1iZXIgfSBmcm9tICcuL3ZhbGlkYXRvcic7XG5cbmNvbnN0IE5VTUJFUl9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTnVtYmVyVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tudW1iZXJdW2Zvcm1Db250cm9sTmFtZV0sW251bWJlcl1bZm9ybUNvbnRyb2xdLFtudW1iZXJdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTlVNQkVSX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgTnVtYmVyVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIHJldHVybiBudW1iZXIoYyk7XG4gIH1cbn1cbiJdfQ==