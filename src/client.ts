import { UneteXQuery, UneteXCallQuery, UneteXResponse, ObjectDescriptor } from "./protocol/interfaces";
import { ACTION_CALL } from "./protocol/enums";
import * as JWT from 'jsonwebtoken';
import { prototype } from "stream";
import { ClassMetadata } from "./protocol/xreflect";

const UneteIO: any = require('unete-io');

interface ClientModel {
    classes: any;
}

interface SelfContext {
    self: string | null;
    value: any;
}

function MainProxy (client: any, route: Array<string> = [], context: SelfContext = <SelfContext> { self: null, value: null }): any  {

    return new Proxy(function () {}, {

        get (target: any, propertyName: string, receiver: any) {
            if(propertyName === "then") return;
            if(propertyName === "__doc__") return context.value;
            
            if(context.value[propertyName]) {
                const descriptor: ObjectDescriptor= <ObjectDescriptor>JWT.decode(response);
                
                if(typeof descriptor !== "object") return descriptor;

                return readObject(descriptor, response);
            }
            return MainProxy(client, [...route, propertyName], context);
        },

        set (target: any, propertyName: string, value: any) {
           return false;
        },

        deleteProperty (target: any, propertyName: any) {
            return false;
        },

        defineProperty (target, key, descriptor) {
            return false
        },

        enumerate (target: any) {
            return Object.keys(context.value);
        },

        async apply (target: any, thisArg: any, args: Array<any>) {
            await client.init();

            const query = <UneteXCallQuery> {
                route: route,
                args: args,
                self: context.self
            };

            //! <self> is not applying changes
            const { error, response, self }: UneteXResponse = await client.sock.call(query);
            
            if(error) throw error;
            
            const descriptor: ObjectDescriptor= <ObjectDescriptor>JWT.decode(response);
            
            if(typeof descriptor !== "object") return descriptor;

            return readObject(descriptor, response);
        },

        has (target: any, propertyName: string) {
            return propertyName in context.value;
        }
    });

    function readObject (descriptor: ObjectDescriptor, self?: string) {
        if(descriptor.meta !== null)
            return MainProxy(client, [], <SelfContext>{ self: self || null, value: descriptor.value });
        else
            return descriptor.value;
    }

    function RemoteObject (objectValue: any, classMeta: ClassMetadata) {
        console.log({ objectValue, classMeta });
        const newClass = ({[classMeta.name] : class {}})[classMeta.name];
        
        console.log(newClass);
    }
}

class Client {
    sock: any;
    classRefs: any;
    initialized: boolean;

    constructor (host: string) {
        this.sock = UneteIO.Socket(host);
        this.classRefs = {};
        this.initialized = false;
    }

    async init () {
        if(!this.initialized) {
            this.classRefs = await this.sock.classRefs();
            this.initialized = true;
        }
    }

    async classRef (ref: any) {
        return this.classRefs[ref] || (this.classRefs[ref] = await this.sock.classRef(ref));
    }

}

export default function UneteXClient (host: string): any {
    const client = new Client(host);

    return MainProxy(client);
}