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

function MainProxy (client: Client, route: Array<string> = []): any  {

    return new Proxy(function () {}, {

        get (target: any, propertyName: string, receiver: any) {
            if(propertyName === "then") return;
            
            return MainProxy(client, [...route, propertyName]);
        },

        async apply (target: any, thisArg: any, args: Array<any>) {
            await client.init();

            return await call(route, args, null);
        }
    });

    async function call (route: any, args: any, self: any, caller?: any) {
        const query = <UneteXCallQuery> {
            route: route,
            args: args,
            self: self
        };

        //! <self> is not applying changes
        const { error, response, self: newSelf }: UneteXResponse = await client.sock.call(query);
        
        if(error) throw error;
        
        const descriptor: ObjectDescriptor= <ObjectDescriptor>JWT.decode(response);
        
        if(caller && newSelf) {
            let descriptorNew = <ObjectDescriptor> JWT.decode(newSelf);
            let newData = descriptorNew.value;

            for(const i in newData) {
                let obj = newData[i];
                
                if(typeof obj === "object") obj = await readObject(newData[i], self, [i]);
                
                caller[i] = obj;
            }
        }

        if(typeof descriptor !== "object") return descriptor;

        return await readObject(descriptor, response);
    }

    async function readObject (descriptor: ObjectDescriptor, self?: string | null, baseRoute: Array<string> = []) {
        if(descriptor.meta !== null)
            return await RemoteObject(descriptor, self || null, baseRoute);
        else
            return descriptor.value;
    }

    async function RemoteObject (descriptor: ObjectDescriptor, self: string | null, baseRoute: Array<string>) {
        
        const classMeta     = await client.classRef(descriptor.meta);
        const newClass: any = ({[classMeta.name] : class {}})[classMeta.name];
        const rawObject     = descriptor.value;
        const classMethods  = classMeta.methods;
        const newObject: any = new newClass();
        
        for(const i in rawObject) {
            let obj = rawObject[i];
            
            if(typeof obj === "object") obj = await readObject(rawObject[i], self, [...baseRoute, i]);

            newObject[i] = obj;
        }
        
        for(const methodName of classMethods) {
            newClass.prototype[methodName] = async function (...args: any[]) {
                await client.init();

                return await call([...baseRoute, methodName], args, self, newObject);
            }
        }
        

        //!console.log({ newClass, newObject });

        return newObject;
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
        //! console.log({ ref, refs: this.classRefs })
        return this.classRefs[ref] || (this.classRefs[ref] = await this.sock.classRef(ref));
    }

}

export default function UneteXClient (host: string): any {
    const client = new Client(host);

    return MainProxy(client);
}