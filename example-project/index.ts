import UneteX from '../src/index';
import { ACTION_CALL } from '../src/protocol/enums';
import User from './user';
import * as jwt from 'jsonwebtoken';

const UneteIO: any = require('unete-io');

const app = new UneteX({
    
    createUser (name: string, password: string) {
        return new User(name, password);
    }

}, {});

(async () => {
    await app.listen(7575);

    const client = UneteIO.Socket('http://localhost:7575');
    const { response: camilo } = await client.call({
        route: ['createUser'],
        args: ['Camilo', '123'],
        self: null
    });

    const msg = await client.call({
        route: ['msg'],
        args: ['Hey, im alive!'],
        self: camilo
    });

    console.log(msg);

    console.log(jwt.decode(msg.response));
})();