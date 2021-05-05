import { forwardRef, Directive, Input, NgModule } from '@angular/core';
import { Validators, NG_VALIDATORS, FormControl, NgModel } from '@angular/forms';

function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
function isDate(obj) {
    try {
        const date = new Date(obj);
        return !isNaN(date.getTime());
    }
    catch (e) {
        return false;
    }
}
function parseDate(obj) {
    try {
        // Moment.js
        if (obj._d instanceof Date) {
            const d = obj._d;
            const month = +d.getMonth() + 1;
            const day = +d.getDate();
            return `${d.getFullYear()}-${formatDayOrMonth(month)}-${formatDayOrMonth(day)}`;
        }
        // NgbDateStruct
        if (typeof obj === 'object' && obj.year != null && obj.month != null && obj.day != null) {
            const month = +obj.month;
            const day = +obj.day;
            return `${obj.year}-${formatDayOrMonth(month)}-${formatDayOrMonth(day)}`;
        }
    }
    catch (e) { }
    return obj;
}
function formatDayOrMonth(month) {
    return month < 10 ? `0${month}` : month;
}

const arrayLength = (value) => {
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const obj = control.value;
        return Array.isArray(obj) && obj.length >= +value ? null : { arrayLength: { minLength: value } };
    };
};

const ARRAY_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ArrayLengthValidator),
    multi: true
};
class ArrayLengthValidator {
    ngOnInit() {
        this.validator = arrayLength(this.arrayLength);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'arrayLength') {
                this.validator = arrayLength(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
ArrayLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[arrayLength][formControlName],[arrayLength][formControl],[arrayLength][ngModel]',
                providers: [ARRAY_LENGTH_VALIDATOR]
            },] }
];
ArrayLengthValidator.propDecorators = {
    arrayLength: [{ type: Input }]
};

const base64 = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    return /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i.test(v) ? null : { base64: true };
};

const BASE64_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => Base64Validator),
    multi: true
};
class Base64Validator {
    validate(c) {
        return base64(c);
    }
}
Base64Validator.decorators = [
    { type: Directive, args: [{
                selector: '[base64][formControlName],[base64][formControl],[base64][ngModel]',
                providers: [BASE64_VALIDATOR]
            },] }
];

const creditCard = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    const sanitized = v.replace(/[^0-9]+/g, '');
    // problem with chrome
    /* tslint:disable */
    if (!(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|(?:9792)\d{12})$/.test(sanitized))) {
        return { creditCard: true };
    }
    /* tslint:enable */
    let sum = 0;
    let digit;
    let tmpNum;
    let shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
        digit = sanitized.substring(i, (i + 1));
        tmpNum = parseInt(digit, 10);
        if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
                sum += ((tmpNum % 10) + 1);
            }
            else {
                sum += tmpNum;
            }
        }
        else {
            sum += tmpNum;
        }
        shouldDouble = !shouldDouble;
    }
    if (Boolean((sum % 10) === 0 ? sanitized : false)) {
        return null;
    }
    return { creditCard: true };
};

const CREDIT_CARD_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CreditCardValidator),
    multi: true
};
class CreditCardValidator {
    validate(c) {
        return creditCard(c);
    }
}
CreditCardValidator.decorators = [
    { type: Directive, args: [{
                selector: '[creditCard][formControlName],[creditCard][formControl],[creditCard][ngModel]',
                providers: [CREDIT_CARD_VALIDATOR]
            },] }
];

const dateISO = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(v) ? null : { dateISO: true };
};

const DATE_ISO_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DateISOValidator),
    multi: true
};
class DateISOValidator {
    validate(c) {
        return dateISO(c);
    }
}
DateISOValidator.decorators = [
    { type: Directive, args: [{
                selector: '[dateISO][formControlName],[dateISO][formControl],[dateISO][ngModel]',
                providers: [DATE_ISO_VALIDATOR]
            },] }
];

const date = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    let v = control.value;
    v = parseDate(v);
    return isDate(v) ? null : { date: true };
};

const DATE_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DateValidator),
    multi: true
};
class DateValidator {
    validate(c) {
        return date(c);
    }
}
DateValidator.decorators = [
    { type: Directive, args: [{
                selector: '[date][formControlName],[date][formControl],[date][ngModel]',
                providers: [DATE_VALIDATOR]
            },] }
];

const digits = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    return /^\d+$/.test(v) ? null : { digits: true };
};

const DIGITS_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DigitsValidator),
    multi: true
};
class DigitsValidator {
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

const email = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    /* tslint:disable */
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ? null : { 'email': true };
    /* tslint:enable */
};

const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidator),
    multi: true
};
class EmailValidator {
    validate(c) {
        return email(c);
    }
}
EmailValidator.decorators = [
    { type: Directive, args: [{
                selector: '[ngvemail][formControlName],[ngvemail][formControl],[ngvemail][ngModel]',
                providers: [EMAIL_VALIDATOR]
            },] }
];

const equalTo = (equalControl) => {
    let subscribe = false;
    return (control) => {
        if (!subscribe) {
            subscribe = true;
            equalControl.valueChanges.subscribe(() => {
                control.updateValueAndValidity();
            });
        }
        const v = control.value;
        return equalControl.value === v ? null : { equalTo: { control: equalControl, value: equalControl.value } };
    };
};

const EQUAL_TO_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EqualToValidator),
    multi: true
};
class EqualToValidator {
    ngOnInit() {
        this.validator = equalTo(this.equalTo);
    }
    validate(c) {
        return this.validator(c);
    }
}
EqualToValidator.decorators = [
    { type: Directive, args: [{
                selector: '[equalTo][formControlName],[equalTo][formControl],[equalTo][ngModel]',
                providers: [EQUAL_TO_VALIDATOR]
            },] }
];
EqualToValidator.propDecorators = {
    equalTo: [{ type: Input }]
};

const equal = (val) => {
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = control.value;
        return val === v ? null : { equal: { value: val } };
    };
};

const EQUAL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EqualValidator),
    multi: true
};
class EqualValidator {
    ngOnInit() {
        this.validator = equal(this.equal);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'equal') {
                this.validator = equal(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
EqualValidator.decorators = [
    { type: Directive, args: [{
                selector: '[equal][formControlName],[equal][formControl],[equal][ngModel]',
                providers: [EQUAL_VALIDATOR]
            },] }
];
EqualValidator.propDecorators = {
    equal: [{ type: Input }]
};

const gte = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v >= +value ? null : { gte: { value: value } };
    };
};

const GREATER_THAN_EQUAL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => GreaterThanEqualValidator),
    multi: true
};
class GreaterThanEqualValidator {
    ngOnInit() {
        this.validator = gte(this.gte);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'gte') {
                this.validator = gte(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
GreaterThanEqualValidator.decorators = [
    { type: Directive, args: [{
                selector: '[gte][formControlName],[gte][formControl],[gte][ngModel]',
                providers: [GREATER_THAN_EQUAL_VALIDATOR]
            },] }
];
GreaterThanEqualValidator.propDecorators = {
    gte: [{ type: Input }]
};

const gt = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v > +value ? null : { gt: { value: value } };
    };
};

const GREATER_THAN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => GreaterThanValidator),
    multi: true
};
class GreaterThanValidator {
    ngOnInit() {
        this.validator = gt(this.gt);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'gt') {
                this.validator = gt(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
GreaterThanValidator.decorators = [
    { type: Directive, args: [{
                selector: '[gt][formControlName],[gt][formControl],[gt][ngModel]',
                providers: [GREATER_THAN_VALIDATOR]
            },] }
];
GreaterThanValidator.propDecorators = {
    gt: [{ type: Input }]
};

const includedIn = (includedInArr) => {
    return (control) => {
        if (!isPresent(includedInArr)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        if (includedInArr.indexOf(control.value) < 0) {
            return { includedIn: { value: control.value, reason: includedInArr } };
        }
        return null;
    };
};

const INCLUDED_IN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IncludedInValidator),
    multi: true
};
class IncludedInValidator {
    ngOnInit() {
        this.validator = includedIn(this.includedIn);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'includedIn') {
                this.validator = includedIn(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
IncludedInValidator.decorators = [
    { type: Directive, args: [{
                selector: '[includedIn][formControlName],[includedIn][formControl],[includedIn][ngModel]',
                providers: [INCLUDED_IN_VALIDATOR]
            },] }
];
IncludedInValidator.propDecorators = {
    includedIn: [{ type: Input }]
};

const json = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    try {
        const obj = JSON.parse(v);
        if (Boolean(obj) && typeof obj === 'object') {
            return null;
        }
    }
    catch (e) { }
    return { json: true };
};

const JSON_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JSONValidator),
    multi: true
};
class JSONValidator {
    validate(c) {
        return json(c);
    }
}
JSONValidator.decorators = [
    { type: Directive, args: [{
                selector: '[json][formControlName],[json][formControl],[json][ngModel]',
                providers: [JSON_VALIDATOR]
            },] }
];

const lte = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v <= +value ? null : { lte: { value: value } };
    };
};

const LESS_THAN_EQUAL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LessThanEqualValidator),
    multi: true
};
class LessThanEqualValidator {
    ngOnInit() {
        this.validator = lte(this.lte);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'lte') {
                this.validator = lte(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
LessThanEqualValidator.decorators = [
    { type: Directive, args: [{
                selector: '[lte][formControlName],[lte][formControl],[lte][ngModel]',
                providers: [LESS_THAN_EQUAL_VALIDATOR]
            },] }
];
LessThanEqualValidator.propDecorators = {
    lte: [{ type: Input }]
};

const lt = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v < +value ? null : { lt: { value: value } };
    };
};

const LESS_THAN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => LessThanValidator),
    multi: true
};
class LessThanValidator {
    ngOnInit() {
        this.validator = lt(this.lt);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'lt') {
                this.validator = lt(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
LessThanValidator.decorators = [
    { type: Directive, args: [{
                selector: '[lt][formControlName],[lt][formControl],[lt][ngModel]',
                providers: [LESS_THAN_VALIDATOR]
            },] }
];
LessThanValidator.propDecorators = {
    lt: [{ type: Input }]
};

const maxDate = (maxInput) => {
    let value;
    let subscribe = false;
    let maxValue = maxInput;
    const isForm = maxInput instanceof FormControl || maxInput instanceof NgModel;
    return (control) => {
        if (!subscribe && isForm) {
            subscribe = true;
            maxInput.valueChanges.subscribe(() => {
                control.updateValueAndValidity();
            });
        }
        if (isForm) {
            maxValue = maxInput.value;
        }
        value = parseDate(maxValue);
        if (!isDate(value) && !(value instanceof Function)) {
            if (value == null) {
                return null;
            }
            else if (isForm) {
                return { maxDate: { error: 'maxDate is invalid' } };
            }
            else {
                throw Error('maxDate value must be or return a formatted date');
            }
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const d = new Date(parseDate(control.value)).getTime();
        if (!isDate(d)) {
            return { value: true };
        }
        if (value instanceof Function) {
            value = value();
        }
        return d <= new Date(value).getTime()
            ? null
            : (isForm ? { maxDate: { control: maxInput, value: maxInput.value } } : { maxDate: { value: maxValue, control: undefined } });
    };
};

const MAX_DATE_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxDateValidator),
    multi: true
};
class MaxDateValidator {
    ngOnInit() {
        this.validator = maxDate(this.maxDate);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'maxDate') {
                this.validator = maxDate(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
MaxDateValidator.decorators = [
    { type: Directive, args: [{
                selector: '[maxDate][formControlName],[maxDate][formControl],[maxDate][ngModel]',
                providers: [MAX_DATE_VALIDATOR]
            },] }
];
MaxDateValidator.propDecorators = {
    maxDate: [{ type: Input }]
};

const max = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v <= +value ? null : { max: { value: value } };
    };
};

const MAX_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxValidator),
    multi: true
};
class MaxValidator {
    ngOnInit() {
        this.validator = max(this.max);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'max') {
                this.validator = max(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
MaxValidator.decorators = [
    { type: Directive, args: [{
                selector: '[max][formControlName],[max][formControl],[max][ngModel]',
                providers: [MAX_VALIDATOR]
            },] }
];
MaxValidator.propDecorators = {
    max: [{ type: Input }]
};

const minDate = (minInput) => {
    let value;
    let subscribe = false;
    let minValue = minInput;
    const isForm = minInput instanceof FormControl || minInput instanceof NgModel;
    return (control) => {
        if (!subscribe && isForm) {
            subscribe = true;
            minInput.valueChanges.subscribe(() => {
                control.updateValueAndValidity();
            });
        }
        if (isForm) {
            minValue = minInput.value;
        }
        value = parseDate(minValue);
        if (!isDate(value) && !(value instanceof Function)) {
            if (value == null) {
                return null;
            }
            else if (isForm) {
                return { minDate: { error: 'minDate is invalid' } };
            }
            else {
                throw Error('minDate value must be or return a formatted date');
            }
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const d = new Date(parseDate(control.value)).getTime();
        if (!isDate(d)) {
            return { value: true };
        }
        if (value instanceof Function) {
            value = value();
        }
        return d >= new Date(value).getTime()
            ? null
            : (isForm ? { minDate: { control: minInput, value: minInput.value } } : { minDate: { value: minValue, control: undefined } });
    };
};

const MIN_DATE_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinDateValidator),
    multi: true
};
class MinDateValidator {
    ngOnInit() {
        this.validator = minDate(this.minDate);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'minDate') {
                this.validator = minDate(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
MinDateValidator.decorators = [
    { type: Directive, args: [{
                selector: '[minDate][formControlName],[minDate][formControl],[minDate][ngModel]',
                providers: [MIN_DATE_VALIDATOR]
            },] }
];
MinDateValidator.propDecorators = {
    minDate: [{ type: Input }]
};

const min = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v >= +value ? null : { min: { value: value } };
    };
};

const MIN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinValidator),
    multi: true
};
class MinValidator {
    ngOnInit() {
        this.validator = min(this.min);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'min') {
                this.validator = min(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
MinValidator.decorators = [
    { type: Directive, args: [{
                selector: '[min][formControlName],[min][formControl],[min][ngModel]',
                providers: [MIN_VALIDATOR]
            },] }
];
MinValidator.propDecorators = {
    min: [{ type: Input }]
};

const notEqualTo = (notEqualControl) => {
    let subscribe = false;
    return (control) => {
        if (!subscribe) {
            subscribe = true;
            notEqualControl.valueChanges.subscribe(() => {
                control.updateValueAndValidity();
            });
        }
        const v = control.value;
        if (notEqualControl.value == null && v == null) {
            return null;
        }
        return notEqualControl.value !== v ? null : { notEqualTo: { control: notEqualControl, value: notEqualControl.value } };
    };
};

const NOT_EQUAL_TO_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NotEqualToValidator),
    multi: true
};
class NotEqualToValidator {
    ngOnInit() {
        this.validator = notEqualTo(this.notEqualTo);
    }
    validate(c) {
        return this.validator(c);
    }
}
NotEqualToValidator.decorators = [
    { type: Directive, args: [{
                selector: '[notEqualTo][formControlName],[notEqualTo][formControl],[notEqualTo][ngModel]',
                providers: [NOT_EQUAL_TO_VALIDATOR]
            },] }
];
NotEqualToValidator.propDecorators = {
    notEqualTo: [{ type: Input }]
};

const notEqual = (val) => {
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = control.value;
        return val !== v ? null : { notEqual: { value: val } };
    };
};

const NOT_EQUAL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NotEqualValidator),
    multi: true
};
class NotEqualValidator {
    ngOnInit() {
        this.validator = notEqual(this.notEqual);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'notEqual') {
                this.validator = notEqual(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
NotEqualValidator.decorators = [
    { type: Directive, args: [{
                selector: '[notEqual][formControlName],[notEqual][formControl],[notEqual][ngModel]',
                providers: [NOT_EQUAL_VALIDATOR]
            },] }
];
NotEqualValidator.propDecorators = {
    notEqual: [{ type: Input }]
};

const notIncludedIn = (includedInArr) => {
    return (control) => {
        if (!isPresent(includedInArr)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        if (includedInArr.indexOf(control.value) >= 0) {
            return { notIncludedIn: { value: control.value, reason: includedInArr } };
        }
        return null;
    };
};

const NOT_INCLUDED_IN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NotIncludedInValidator),
    multi: true
};
class NotIncludedInValidator {
    ngOnInit() {
        this.validator = notIncludedIn(this.notIncludedIn);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'notIncludedIn') {
                this.validator = notIncludedIn(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
NotIncludedInValidator.decorators = [
    { type: Directive, args: [{
                selector: '[notIncludedIn][formControlName],[notIncludedIn][formControl],[notIncludedIn][ngModel]',
                providers: [NOT_INCLUDED_IN_VALIDATOR]
            },] }
];
NotIncludedInValidator.propDecorators = {
    notIncludedIn: [{ type: Input }]
};

const notMatching = (p) => {
    if (!isPresent(p)) {
        return (control) => null;
    }
    const patternValidator = Validators.pattern(p);
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        if (!patternValidator(control)) {
            return { notMatching: { value: control.value, reason: p } };
        }
        return null;
    };
};

const NOT_MATCHING_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NotMatchingValidator),
    multi: true
};
class NotMatchingValidator {
    ngOnInit() {
        this.validator = notMatching(this.notMatching);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'notMatching') {
                this.validator = notMatching(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
NotMatchingValidator.decorators = [
    { type: Directive, args: [{
                selector: '[notMatching][formControlName],[notMatching][formControl],[notMatching][ngModel]',
                providers: [NOT_MATCHING_VALIDATOR]
            },] }
];
NotMatchingValidator.propDecorators = {
    notMatching: [{ type: Input }]
};

// tslint:disable-next-line:variable-name
const number = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) ? null : { number: true };
};

const NUMBER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NumberValidator),
    multi: true
};
class NumberValidator {
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

const property = (value) => {
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const properties = value.split(',');
        const obj = control.value;
        let isValid = true;
        for (const prop of properties) {
            if (obj[prop] == null) {
                isValid = false;
                break;
            }
        }
        return isValid ? null : { hasProperty: { value: value } };
    };
};

const PROPERTY_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PropertyValidator),
    multi: true
};
class PropertyValidator {
    ngOnInit() {
        this.validator = property(this.property);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'property') {
                this.validator = property(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
PropertyValidator.decorators = [
    { type: Directive, args: [{
                selector: '[property][formControlName],[property][formControl],[property][ngModel]',
                providers: [PROPERTY_VALIDATOR]
            },] }
];
PropertyValidator.propDecorators = {
    property: [{ type: Input }]
};

const rangeLength = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = control.value;
        return v.length >= value[0] && v.length <= value[1] ? null : { rangeLength: { value: value } };
    };
};

const RANGE_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RangeLengthValidator),
    multi: true
};
class RangeLengthValidator {
    ngOnInit() {
        this.validator = rangeLength(this.rangeLength);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'rangeLength') {
                this.validator = rangeLength(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
RangeLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[rangeLength][formControlName],[rangeLength][formControl],[rangeLength][ngModel]',
                providers: [RANGE_LENGTH_VALIDATOR]
            },] }
];
RangeLengthValidator.propDecorators = {
    rangeLength: [{ type: Input }]
};

const range = (value) => {
    return (control) => {
        if (!isPresent(value)) {
            return null;
        }
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = +control.value;
        return v >= value[0] && v <= value[1] ? null : { range: { value: value } };
    };
};

const RANGE_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RangeValidator),
    multi: true
};
class RangeValidator {
    ngOnInit() {
        this.validator = range(this.range);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'range') {
                this.validator = range(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
RangeValidator.decorators = [
    { type: Directive, args: [{
                selector: '[range][formControlName],[range][formControl],[range][ngModel]',
                providers: [RANGE_VALIDATOR]
            },] }
];
RangeValidator.propDecorators = {
    range: [{ type: Input }]
};

const url = (control) => {
    if (isPresent(Validators.required(control))) {
        return null;
    }
    const v = control.value;
    /* tslint:disable */
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) ? null : { 'url': true };
    /* tslint:enable */
};

const URL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => UrlValidator),
    multi: true
};
class UrlValidator {
    validate(c) {
        return url(c);
    }
}
UrlValidator.decorators = [
    { type: Directive, args: [{
                selector: '[url][formControlName],[url][formControl],[url][ngModel]',
                providers: [URL_VALIDATOR]
            },] }
];

const uuids = {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};
const uuid = (version) => {
    return (control) => {
        if (isPresent(Validators.required(control))) {
            return null;
        }
        const v = control.value;
        const pattern = uuids[version] || uuids.all;
        return (new RegExp(pattern)).test(v) ? null : { uuid: true };
    };
};

const UUID_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => UUIDValidator),
    multi: true
};
class UUIDValidator {
    ngOnInit() {
        this.validator = uuid(this.uuid);
    }
    ngOnChanges(changes) {
        for (const key in changes) {
            if (key === 'uuid') {
                this.validator = uuid(changes[key].currentValue);
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }
    validate(c) {
        return this.validator(c);
    }
    registerOnValidatorChange(fn) {
        this.onChange = fn;
    }
}
UUIDValidator.decorators = [
    { type: Directive, args: [{
                selector: '[uuid][formControlName],[uuid][formControl],[uuid][ngModel]',
                providers: [UUID_VALIDATOR]
            },] }
];
UUIDValidator.propDecorators = {
    uuid: [{ type: Input }]
};

const CustomValidators = {
    arrayLength,
    base64,
    creditCard,
    date,
    dateISO,
    digits,
    email,
    equal,
    equalTo,
    gt,
    gte,
    includedIn,
    json,
    lt,
    lte,
    max,
    maxDate,
    min,
    minDate,
    notEqual,
    notEqualTo,
    notIncludedIn,
    notMatching,
    number,
    property,
    range,
    rangeLength,
    url,
    uuid
};
const CustomDirectives = [
    ArrayLengthValidator,
    Base64Validator,
    CreditCardValidator,
    DateValidator,
    DateISOValidator,
    DigitsValidator,
    EmailValidator,
    EqualValidator,
    EqualToValidator,
    GreaterThanValidator,
    GreaterThanEqualValidator,
    IncludedInValidator,
    JSONValidator,
    LessThanValidator,
    LessThanEqualValidator,
    MaxValidator,
    MaxDateValidator,
    MinValidator,
    MinDateValidator,
    NotEqualValidator,
    NotEqualToValidator,
    NotIncludedInValidator,
    NotMatchingValidator,
    NumberValidator,
    PropertyValidator,
    RangeValidator,
    RangeLengthValidator,
    UrlValidator,
    UUIDValidator
];
class CustomFormsModule {
}
CustomFormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CustomDirectives],
                exports: [CustomDirectives]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { CustomFormsModule, CustomValidators, arrayLength as ɵa, base64 as ɵb, rangeLength as ɵba, url as ɵbb, uuid as ɵbc, ArrayLengthValidator as ɵbd, Base64Validator as ɵbe, CreditCardValidator as ɵbf, DateValidator as ɵbg, DateISOValidator as ɵbh, DigitsValidator as ɵbi, EmailValidator as ɵbj, EqualValidator as ɵbk, EqualToValidator as ɵbl, GreaterThanValidator as ɵbm, GreaterThanEqualValidator as ɵbn, IncludedInValidator as ɵbo, JSONValidator as ɵbp, LessThanValidator as ɵbq, LessThanEqualValidator as ɵbr, MaxValidator as ɵbs, MaxDateValidator as ɵbt, MinValidator as ɵbu, MinDateValidator as ɵbv, NotEqualValidator as ɵbw, NotEqualToValidator as ɵbx, NotIncludedInValidator as ɵby, NotMatchingValidator as ɵbz, creditCard as ɵc, NumberValidator as ɵca, PropertyValidator as ɵcb, RangeValidator as ɵcc, RangeLengthValidator as ɵcd, UrlValidator as ɵce, UUIDValidator as ɵcf, date as ɵd, dateISO as ɵe, digits as ɵf, email as ɵg, equal as ɵh, equalTo as ɵi, gt as ɵj, gte as ɵk, includedIn as ɵl, json as ɵm, lt as ɵn, lte as ɵo, max as ɵp, maxDate as ɵq, min as ɵr, minDate as ɵs, notEqual as ɵt, notEqualTo as ɵu, notIncludedIn as ɵv, notMatching as ɵw, number as ɵx, property as ɵy, range as ɵz };
//# sourceMappingURL=ngx-custom-validators.js.map
