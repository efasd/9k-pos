import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { digits } from './validator';
const DIGITS_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DigitsValidator),
    multi: true
};
export class DigitsValidator {
    validate(c) {
        return digits(c);
    }
}
DigitsValidator.decorators = [
    { type: Directive, args: [{
                selector: '[digits][formControlName],[digits][formControl],[digits][ngModel]',
                providers: [DIGITS_VALIDATOR]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLyIsInNvdXJjZXMiOlsic3JjL2FwcC9kaWdpdHMvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQThCLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxNQUFNLGdCQUFnQixHQUFRO0lBQzVCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzlDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQU1GLE1BQU0sT0FBTyxlQUFlO0lBQzFCLFFBQVEsQ0FBQyxDQUFrQjtRQUN6QixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDOzs7WUFQRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1FQUFtRTtnQkFDN0UsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7YUFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBkaWdpdHMgfSBmcm9tICcuL3ZhbGlkYXRvcic7XG5cbmNvbnN0IERJR0lUU19WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGlnaXRzVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tkaWdpdHNdW2Zvcm1Db250cm9sTmFtZV0sW2RpZ2l0c11bZm9ybUNvbnRyb2xdLFtkaWdpdHNdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbRElHSVRTX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgRGlnaXRzVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIHJldHVybiBkaWdpdHMoYyk7XG4gIH1cbn1cbiJdfQ==