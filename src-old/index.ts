const MongoClient = require('mongodb');
const ClassReflection = require('./reflect/class-reflect');

interface UneteXConfig {
    port: number;
}

class UneteX {
    config: UneteXConfig;
    module: any;

    constructor (module: any, config: UneteXConfig) {
        this.config = config;
        this.module = module;
        this.init();
    }

    init () {   
        const { module } = this;

        
    }
}

export default UneteX;