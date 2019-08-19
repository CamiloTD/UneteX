import UneteXClient from '../src/client';

const Client = UneteXClient('http://localhost:7575');

(async () =>{
    const user = await Client.createUser();

    await user.eat('Bananas');

    console.log(user);
})();