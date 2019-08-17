const UneteIO: any = require('unete-io/socket');

interface ClientModel {
    classes: any;
}

function SmartProxy (model: ClientModel) {
    
}

export default function Client (host: string) {
    const io_client = UneteIO.Socket(host);
    const model = <ClientModel>{ classes: {} };

    async function init () {
        model.classes = await io_client.classRefs();
        
    }
}