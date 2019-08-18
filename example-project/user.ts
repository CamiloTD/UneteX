import { virtual, key, hidden, sync } from '../src/decorators';

@virtual class User {

    @key name: string;
    @sync age = 0;

    pet: Pet;
    parent: User | null | undefined;

    constructor (name: string, petName: string) {
        this.name = name;
        this.pet = new Pet(petName);
    }

    say (message: string) {
        console.log(`${this.name}: ${message}`);
    }

    msg (message: string) {
        return `${this.name}: ${message}`;
    }
}

@virtual class Pet {

    @hidden name: string;

    constructor (name: string) {
        this.name = name;
    }

    woof () {
        return `${this.name}: Woof woof!`;
    }

}

export default User;