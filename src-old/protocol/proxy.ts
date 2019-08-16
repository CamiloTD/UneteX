interface UneteXProxyContext {
    route: []
}

export default function UneteXProxy (module: any, context: UneteXProxyContext) {

    const proxy = new Proxy (function () {}, {

        get (obj: any, prop: string) {

        }

    });
    
}