import UneteX from '../src/index';
import { ACTION_CALL } from '../src/protocol/enums';
import User from './user';
import * as jwt from 'jsonwebtoken';
import UneteXClient from '../src/client';

const app = new UneteX({
    
    createUser (name: string, password: string) {
        return new User(name, password);
    }

}, {});

(async () => {
    await app.listen(7575);

    const client = UneteXClient('http://localhost:7575');
    const camilo = await client.createUser("Camilin", "Stalin minino");

    console.log(await camilo.pet.woof());

})();

process.on('unhandledRejection', (r: any) => console.log(r));
process.on('uncaughtException', (e: any) => console.log(e));