import * as MethodDecorators from './method-decorators';
import * as ClassDecorators from './class-decorators';
import * as PropertyDecorators from './property-decorators';

/* Class Decorators */
export const remote = ClassDecorators.remote;
export const signed = ClassDecorators.unsigned;

/* Method Decorators */
/* Property Decorators */
export const locked = PropertyDecorators.locked;
export const sync = PropertyDecorators.sync;

/* Multipurpose Decorators */
export const hidden = (_class_: any, propertyName: string, descriptor?: PropertyDescriptor) => {
    if(descriptor) return MethodDecorators.hidden(_class_, propertyName, descriptor);

    return PropertyDecorators.hidden(_class_, propertyName);
}