export declare const CustomValidators: {
    arrayLength: (value: number) => import("@angular/forms").ValidatorFn;
    base64: import("@angular/forms").ValidatorFn;
    creditCard: import("@angular/forms").ValidatorFn;
    date: import("@angular/forms").ValidatorFn;
    dateISO: import("@angular/forms").ValidatorFn;
    digits: import("@angular/forms").ValidatorFn;
    email: import("@angular/forms").ValidatorFn;
    equal: (val: any) => import("@angular/forms").ValidatorFn;
    equalTo: (equalControl: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidatorFn;
    gt: (value: number) => import("@angular/forms").ValidatorFn;
    gte: (value: number) => import("@angular/forms").ValidatorFn;
    includedIn: (includedInArr: any[]) => import("@angular/forms").ValidatorFn;
    json: import("@angular/forms").ValidatorFn;
    lt: (value: number) => import("@angular/forms").ValidatorFn;
    lte: (value: number) => import("@angular/forms").ValidatorFn;
    max: (value: number) => import("@angular/forms").ValidatorFn;
    maxDate: (maxInput: any) => import("@angular/forms").ValidatorFn;
    min: (value: number) => import("@angular/forms").ValidatorFn;
    minDate: (minInput: any) => import("@angular/forms").ValidatorFn;
    notEqual: (val: any) => import("@angular/forms").ValidatorFn;
    notEqualTo: (notEqualControl: import("@angular/forms").AbstractControl) => import("@angular/forms").ValidatorFn;
    notIncludedIn: (includedInArr: any[]) => import("@angular/forms").ValidatorFn;
    notMatching: (p: string | RegExp) => import("@angular/forms").ValidatorFn;
    number: import("@angular/forms").ValidatorFn;
    property: (value: string) => import("@angular/forms").ValidatorFn;
    range: (value: number[]) => import("@angular/forms").ValidatorFn;
    rangeLength: (value: number[]) => import("@angular/forms").ValidatorFn;
    url: import("@angular/forms").ValidatorFn;
    uuid: (version?: string) => import("@angular/forms").ValidatorFn;
};
export declare class CustomFormsModule {
}
