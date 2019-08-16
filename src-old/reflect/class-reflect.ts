import { ClassMetadata, MethodMetadata, PropertyMetadata } from './interfaces';

export default ({


    metadata (_class_: any) {
        _class_ = typeof _class_ === "object"? _class_ : _class_.prototype;
        
        return _class_._unete_ || (_class_._unete_ = <ClassMetadata> {
            methods: {},
            properties: {
                _unete_: <PropertyMetadata> {
                    enumerable: false,
                    readable: false,
                    writable: false,
                    sync: false
                }
            },
            remote: false,
            unsigned: false,
            storage: false,
            collection: ""
        });
    },

    // Returns a method metadata
    method (_class_: any, name: string): MethodMetadata {
        const metadata = this.metadata(_class_);
        
        let method = metadata.methods[name];
        
        if(!method) return metadata.methods[name] = <MethodMetadata> {
            readable: true
        };

        return method;
    },

    initialized (_class_: any) {
        _class_ = typeof _class_ === "object"? _class_ : _class_.prototype;
        return !!_class_.prototype._unete_;
    },

    property (_class_: any, name: string ): PropertyMetadata {
        const metadata = this.metadata(_class_);
        
        let property = metadata.properties[name];
        
        if(!property) return metadata.properties[name] = <PropertyMetadata> {
            readable: true,
            writable: true,
            sync: false
        };

        return property;
    }

});