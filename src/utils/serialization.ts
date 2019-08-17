import { isClass } from ".";
import UneteX from "..";
import { getClassMetadata } from "../protocol/xreflect";
import { VIRTUAL } from "../protocol/enums";

interface ObjectDescriptor {
    value: any;
    meta: any;
}

const SerializeMethods: any = {
    
    object (o: any, unetex: UneteX) {
        const meta = getClassMetadata(o.constructor);

        let newObject: any = {};

        for(const i in o) {
            if(!o.hasOwnProperty(i)) continue;
            newObject[i] = serialize(o[i]);
        }
        
        return <ObjectDescriptor> {
            value: newObject,
            meta: meta.flags & VIRTUAL? meta : null
        }
    }

}

export function serialize (o: any) {
    if(typeof o === "object") return SerializeMethods.object(o);
    if(isClass(o)) return SerializeMethods.class(o);
    
    return o;
}

/*export function deserialize (className: string, self: string) {
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
}*/

