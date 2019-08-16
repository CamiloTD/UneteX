import * as jwt from 'jsonwebtoken';
import * as XReflect from './protocol/xreflect';

import { UneteXQuery, UneteXInfoRequest } from './protocol/interfaces';
import { ACTION_INFO, ACTION_CALL, ACTION_CREATE, VIRTUAL, KEY, HIDDEN } from './protocol/enums';
import { isClass, decrypt, encrypt } from './utils/index';
import { ClassMetadata, PropertyMetadata} from './protocol/xreflect';
import { serialize } from './utils/serialization';

interface UneteXConfig {
    port: number;
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
class UneteX {
    
    port: number;
    secret: string;
    module: any;
    classes: Map<any, ClassData> = new Map();

    constructor (module: any, config: UneteXConfig) {
        this.port = config.port;
        this.secret = config.secret || Math.random().toString();
        this.module = module;

        this.init();
    }

    init () {
        const { module: localModules } = this;

        for(const name in localModules) {
            let element = localModules[name];
            if(isClass(element)) {
                this.initializeClass(element);
            }
        }
    }

    initializeClass (_class_: any) {
        const metadata = XReflect.getClassMetadata(_class_);

        if(metadata.flags & VIRTUAL) { /* Only virtual classes will be assigned */
            this.classes.set(_class_, classData(metadata, _class_));
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
        async processRequest (query: UneteXQuery) {
            switch(query.action){
                case ACTION_INFO:
                    return await this.processInfoRequest(query.query);
                case ACTION_CALL:
                case ACTION_CREATE:
            }
        }

        async processInfoRequest ({ route, context }: UneteXInfoRequest) {
            const { class: className, self } = context;
            const properties = this.deserialize(className, self);
        }
    
    /* Serialization */
        
        async serialize (object: any) {
            return serialize(object, this);
        }

        async deserialize (className: string, self: string) {
            const data: any = this.verify(self);
            const _class_ = this.module[className];
            const metadata = this.classes.get(_class_);

            if(!metadata) return data;

            const { fields } = metadata.meta;
            const newObject: any = {};

            for(const fieldName in fields) {
                const { flags } = fields;

                if(flags & HIDDEN) {
                    newObject[fieldName] = decrypt(data[fieldName], this.secret);
                } else {
                    newObject[fieldName] = data[fieldName];
                }
            }
        }
}

export default UneteX;