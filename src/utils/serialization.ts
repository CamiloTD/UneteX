import { isClass } from ".";
import UneteX from "..";

interface ObjectDescriptor {
    value: any;
    meta: any;
}

const SerializeMethods: any = {
     
    undefined (): ObjectDescriptor { return <ObjectDescriptor>{ value: undefined, meta: null }; },
    
    object (o: any, unetex: UneteX) {
        const meta = unetex.classes.get(o.constructor);

        let newObject: any = {};

        for(const i in o) newObject[i] = serialize(o[i], unetex);
        
        return <ObjectDescriptor> {
            value: newObject,
            meta: null
        }
    },

    boolean () {},
    number () {},
    bigint () {},
    string () {},
    symbol () {},
    function () {}

}

export function serialize (object: any, unetex: UneteX) {
    const obj: ObjectDescriptor = SerializeMethods[isClass(object)? "class" : typeof object](object, unetex);


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

