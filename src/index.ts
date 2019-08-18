import * as jwt from 'jsonwebtoken';
import * as XReflect from './protocol/xreflect';

import { UneteXQuery, UneteXInfoRequest, ObjectDescriptor, UneteXCallQuery, UneteXResponse } from './protocol/interfaces';
import { ACTION_INFO, ACTION_CALL, ACTION_CREATE, VIRTUAL, KEY, HIDDEN } from './protocol/enums';
import { isClass, decrypt, encrypt } from './utils/index';
import { ClassMetadata, PropertyMetadata} from './protocol/xreflect';
import { serialize } from './utils/serialization';

const UneteIO: any = require('unete-io');

interface UneteXConfig {
    secret?: string;
}

interface ClassData {
    meta: ClassMetadata;
    key: string | null;
}

interface ObjectSerialization {
    class: string;
    value: any;
}

function classData (meta: ClassMetadata, _class_: any): ClassData {
    let key = null;
    let fields = meta.fields;

    for(const field_name in fields) {
        if(fields[field_name].flags & KEY) {
            if(key !== null) throw { code: "DUPLICATED_KEY", className: _class_.name, field: field_name };

            key = field_name;
        }
    }

    return <ClassData> { meta, instances: new Map(), key };
}

/**
 * * JWT:
 *  * sign: Signs `data` into a JWT with `secret`, signed data cant be transferred securely and it wont be modified early
 *  * verify: Takes a JWToken and returns the original object
 *  ! encrypt: Takes an object and encrypts it with `secret`
 *  ! decrypt: Takes base64 string and decrypts it into an object
 * 
 * * Classes
 * * Protocol
 *  ? processRequest
 *  ? processInfoRequest
 * 
 */
class UneteX extends UneteIO.Server {
    
    secret: string;
    module: any;
    classRefs: any;

    constructor (module: any, config: UneteXConfig = {}) {
        super({

            call: (query: UneteXCallQuery) => {
                return this.processCallRequest(query);
            },

            classRefs: ()  => {
                const refs: any = {};
                const { classRefs } = this;

                for(const i in classRefs) refs[i] = XReflect.getClassMetadata(classRefs[i]);

                return refs;
            },

            classRef: (ref: number) => XReflect.getClassMetadata(this.classRefs[ref])
        });

        this.secret = config.secret || Math.random().toString();
        this.module = module;
        this.classRefs = {};
    }

    initializeClass (_class_: any, baseObject: any) {
        const metadata = XReflect.getClassMetadata(_class_);

        if(metadata.flags & VIRTUAL) { /* Only virtual classes will be assigned */
            this.classRefs[metadata.ref] = _class_;
            
            metadata.name = _class_.name;
            metadata.methods = Reflect.ownKeys(Reflect.getPrototypeOf(baseObject)).filter((n) => typeof baseObject[n] === "function" && n !== "constructor");
        }
    }

    /**
     * * Signs <data> into a JWT, returns a JWT string that can be verified in the future
     * 
     * @param data. Data to sign
     */
        sign (data: any) {
            return jwt.sign(data, this.secret);
        }

        verify (token: string) {
            return jwt.verify(token, this.secret);
        }

        encrypt (data: any) {
            return encrypt(data, this.secret);
        }

        decrypt (data: any) {
            return decrypt(data, this.secret);
        }
        
    /* Classes */
    /* Protocol */

        async processCallRequest (query: UneteXCallQuery) {
            const { route, args, self } = query;
            const new_object = this.deserializeSigned(self);
            let lastFieldName: string;

            let pointer = self? new_object : this.module;

            for(let i=0, l=route.length-1;i<l;i++) {
                pointer = pointer[route[i]];
            }

            const field_name = route[route.length - 1];

            try {
                const rawResponse = await pointer[field_name](...args);
                const signedResponse = this.serializeAndSign(rawResponse);
                
                return <UneteXResponse> {
                    error: null,
                    response: signedResponse,
                    self: self? this.serializeAndSign(new_object): null
                }
            } catch (exc) {
                return <UneteXResponse> {
                    error: exc,
                    response: null,
                    self: self? this.serializeAndSign(new_object) : null
                }
            }
        }
    
    /* Serialization */
        
        serialize (o: any, propMeta?: PropertyMetadata) {
            let result = o;

            //* Objects are suspicious to have prototype, lets go and catch them all!!
            if(typeof o === "object") result = this.serializeObject(o, propMeta);
            
            //* Property Pipeline!
            if(propMeta) {
                //* Let's encrypt the hidden properties
                if(propMeta.flags & HIDDEN) result = this.encrypt(result);
            }

            return result;
        }


        serializeObject (o: any, propMeta?: PropertyMetadata) {
            const classMeta: ClassMetadata = XReflect.getClassMetadata(o.constructor);
            let newObject: any = {};

            for(const i in o) {
                if(!o.hasOwnProperty(i)) continue;
                newObject[i] = this.serialize(o[i], classMeta.fields[i]);
            }

            //* Are you <class> registered???
            if(!this.classRefs[classMeta.ref]){
                //* No??!! Impossible!! Let's register...
                this.initializeClass(o.constructor, o);
            }
            
            return <ObjectDescriptor> {
                value: newObject,
                meta: classMeta.flags & VIRTUAL? classMeta.ref : null
            }
        }
        
        deserialize (o: any, propMeta?: PropertyMetadata) {
            let result = o;

            //* Hey bud! can i see your metadata?
            if(propMeta) {
                //* Encrypted stuff, go decrypted
                if(propMeta.flags & HIDDEN) result = this.decrypt(result);
            }

            if(typeof result === "object") result = this.deserializeObject(result, propMeta);

            return result;
        }

        deserializeObject (o: any, propMeta?: PropertyMetadata) {
            const { value: rawObject, meta: classRef } = o;
            const classMeta: any = XReflect.getClassMetadata(this.classRefs[classRef]);
            let newObject: any = {};
                    
            //* If there isn't classMeta, just return the rawObject
                if(!classMeta) return rawObject;
            
            //? Hmm... let's check for your prototype
                const baseClass = this.classRefs[classMeta.ref];
                if(baseClass) newObject = Object.create(baseClass.prototype);

            
                //? Do the hard work bud...
                for(const fieldName in rawObject){
                    newObject[fieldName] = this.deserialize(rawObject[fieldName], classMeta.fields[fieldName])
                }
                    

            return newObject;
        }
    
        serializeAndSign (o: any) {
            return this.sign(this.serialize(o));
        }

        deserializeSigned (token: string | null) {
            return token && this.deserialize(this.verify(token));
        }
}

export default UneteX;

/**
 * * 2019-08-17T02:39:05.680Z - This is so beautiful! ❤️ Now... Hidden fields works!! it does works!!
 * ? 2019-08-17T02:47:50.855Z - 🤦‍♂️ Lol, noticed that i have initialized in the class and not the constructor, i saved me from a future memory conflict :3
 * ! 2019-08-17T03:06:25.037Z - Hmm... I think the ref is important, the trouble is... ah :/ i will need to restructure some shit for using names then
 * ! 2019-08-17T03:14:32.462Z - 😭 Hmm... The recursion is bugged :T... Lets se what happens
 * ? 2019-08-17T03:22:32.531Z - I did it... i killed `classes: Map<...>` it wont be with us anymore, REST IN PEACE ON OUR MEMORIES
 * * 2019-08-17T03:25:05.205Z - Wow, this was easier than i though, now, let s see if it works! ... Pretty sure it wont ha ha ha!
 * ? 2019-08-17T03:25:45.283Z - It didn't :T
 * * 2019-08-17T03:38:04.239Z - IT WORKED!!! THE FUSION WORKED!!! YEAH! 🎂
 * * 2019-08-17T03:48:32.597Z - Its children... Everything is working ok!!! WOW! Im so happy
 * * 2019-08-17T04:06:16.533Z - Uff... this was a hard work... now, the sign & verification is ok, now objects can be freezed
 * * 2019-08-17T05:23:55.841Z - Remote prototype now works seamlessly... i love it :)
 * 
 */