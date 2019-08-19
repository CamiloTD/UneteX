import { virtual, key, hidden, sync } from '../src/decorators';


@virtual class User {

    
    name: string;
    fruits: Array<string>;

    constructor (name: string) {
        this.name = name;
        this.fruits = [];
    }

    eat (fruit_name: string) {
        this.fruits.push(fruit_name);
    }
}


export default User;