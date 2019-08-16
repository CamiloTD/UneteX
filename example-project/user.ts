import { virtual, key, hidden, sync } from '../src/decorators';

@virtual class User {

    @key name: string;
    @hidden password: string;
    @sync age = 0;

    constructor (name: string, password?: string) {
        this.name = name;
        this.password = password || "";
    }

    birthday () { this.age++; }
}

export default User;