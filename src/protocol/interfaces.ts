/* General Query */
    export interface UneteXQuery {
        action: string;
        query: UneteXInfoRequest;
    }

    export interface UneteXResponse {
        error: any;
        response: UneteXInfoResponse;
    }

/* ObjectInfo */
    export interface UneteXInfoRequest {
        route: Array<string>;
        context: ObjectContext;
    }

    export interface UneteXInfoResponse {
        type: number;
        flags: number;
    }

/* ObjectContext */
    export interface ObjectContext {
        class: string;
        self: string;
    }