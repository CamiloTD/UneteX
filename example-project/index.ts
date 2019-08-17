import UneteX from '../src/index';
import User from './user';
import { serialize } from '../src/utils/serialization';

const app = new UneteX({}, { port: 5000 });

//? Father Camilo...
const Camilo = new User("Camilo", "randomPassword");
//? and son Camilin, will travel...
const Camilin = new User("Camilin", "randomPassword2", Camilo);

const serialized = app.serializeAndSign(Camilin); //? Crush these data

//? Did they survive?...
const NeoCamilin = app.deserializeSigned(serialized);

NeoCamilin.say('Am i alive??');
NeoCamilin.parent.say('Am i too??');