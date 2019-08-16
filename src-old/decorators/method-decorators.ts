import * as Decorators from './utils';

export const hidden = Decorators.methodFlags(<any>{ readable: false });