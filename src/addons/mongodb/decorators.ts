import { getClassHiddenMetadata, ClassMetadata } from "../../protocol/xreflect";

export const collection = (collection_name: string) => set('collection', collection_name);

function set(key: string, val: any) {

    return function (_target_: any) {
        const meta = getClassHiddenMetadata(_target_);

        if(!meta.mongodb) meta.mongodb = {};
        
        meta.mongodb[key] = val;
    }
}