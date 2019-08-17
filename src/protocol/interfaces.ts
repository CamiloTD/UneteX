/* General Query */
    export interface UneteXQuery {
        action: string;
        query: UneteXCallQuery;
    }

    export interface UneteXResponse {
        error: any;
        response: any;
        self: any;
    }

/* ObjectInfo */
    export interface UneteXInfoRequest {
        route: Array<string>;
        context: ObjectDescriptor;
    }

    export interface ObjectDescriptor {
        value: any;
        meta: any;
    }

    export interface UneteXCallQuery {
        route: Array<string>;
        args: Array<any>;
        self: string | null;
    }