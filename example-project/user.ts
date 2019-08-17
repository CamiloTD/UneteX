import { virtual, key, hidden, sync } from '../src/decorators';

@virtual class User {

    @key name: string;
    @hidden password: string;
    @sync age = 0;
    
    parent: User | null | undefined;

    constructor (name: string, password?: string, parent?: User) {
        this.name = name;
        this.password = password || "";
        this.parent = parent;
    }

    say (message: string) {
        console.log(`${this.name}: ${message}`);
    }

    msg (message: string) {
        return `${this.name}: ${message}`;
    }
}

export default User;