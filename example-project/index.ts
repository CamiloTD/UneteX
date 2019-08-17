import UneteX from '../src/index';
import User from './user';
import { serialize } from '../src/utils/serialization';
import { ACTION_CALL } from '../src/protocol/enums';
import { UneteXCallQuery } from '../src/protocol/interfaces';

const app = new UneteX({}, { port: 5000 });

//? Father Camilo...
const Camilo = new User("Camilo", "randomPassword");
//? and son Camilin, will travel...
const Camilin = new User("Camilin", "randomPassword2", Camilo);

const serialized = app.serializeAndSign(Camilin); //? Crush these data

//? Did they survive?...
app.processRequest({
    action: ACTION_CALL,
    query: {
        route: ['msg'],
        args: ['Hello, im Camilin!'],
        self: serialized
    }
}).then((response: any) => {
    console.log(app.deserializeSigned(response.response));
});