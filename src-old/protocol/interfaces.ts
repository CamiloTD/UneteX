import { ClassMetadata } from '../reflect/interfaces';
/* InitConnection */

/*
*
* Executes when client makes a function execution
*
* Ex: obj.method(...arguments)
*
*/
interface ExecuteMethodRequest {
    path: Array<string>; // obj.method() => ['prop', 'method'] 
    arguments: Array<any>; // obj.method('foo', 'bar', function () {}) => ['foo', 'bar', null]
    callbacks: Array<string>; // obj.method('foo', 'bar', function () {}) => [null, null, <callback-id>']
    protos: Array<string>;

    context: ObjectContext;
};

interface BasicResponse {
    error: any;
    data: any;
    meta: ObjectMetadata;
    proto: string;
    self: any;
};

interface ClassRequest {
    class: string;
};

interface ClassResponse {
    error: any;

    name: string;
    meta: ClassMetadata;
};

interface ObjectUpdate {
    self: any;
    updates: any;
};

/*
* Object context, info about 'self'
*/
interface ObjectContext {
    proto: string;
    data: any;
}

interface ObjectMetadata {
    fields: any; // Object { [string]: proto }
}