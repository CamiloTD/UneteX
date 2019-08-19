import * as YAML from 'yamljs';
import { log, danger, info, highlight, warn, field, line, cold } from './terminal';
import UneteX from '../src';
import { UneteXCallQuery } from '../src/protocol/interfaces';
import { ClassMetadata } from '../src/protocol/xreflect';

const cwd = process.cwd();

let executionId = 0;
interface ExecutionInfo {
    start: number;
    id: number;
}

export async function start (config: any) {
    try {
        if(!config) config = YAML.load('UneteX.yml');
    } catch (exc) {
        log("👀 ", danger("Could not find configuration file."));
        process.exit(0);
    }
    
    const applicationName = config.applicationName || "DefaultApp";
    log("🚀 ", info(`Starting ${highlight(applicationName)}...`));
    line();

    //* Validations
        //* Entry point
            if(!config.main) {
                warn(`☢️  No ${field('main')} field specified in the configuration file.. Using ${highlight('./index')} as entry point.`);
                config.main = `${cwd}/index`;
            }
        //* JWTSecret
            if(!config.secret) {
                warn(`☢️  No ${field('jwt_secret')} field specified in the configuration file... UneteX will generate a random temporal key. All emitted token will expire when the app stops, if you want the info to be persistent please define the ${field('jwt_secret')} in your configuration file.`);
                config.secret = Math.random().toString().substring(2);
            }

        //* Port
            if(!config.host) config.host = '0.0.0.0';
            if(!config.port) config.port = 7575;

        line();

    //* Generate our app
        const module = await import(config.main);
        const app = new UneteX(module, {
            secret: config.secret
        });

        app.listen(config.port);//!, config.host);

        log("🚀 ", highlight(applicationName), info(`server started at ${highlight(`${config.host}:${config.port}`)}!`));
        line();
    
    //* Configure app events
        //* Basic
            app.events.on('initializeClass', function (metadata: ClassMetadata) {
                log(info(`🎁  Class ${highlight(metadata.name)} has been initialized.`));
            });

        //* Event Requests
            configureEventLogs(app);
}

function configureEventLogs (app: UneteX) {
    const TimeMapper = new Map<UneteXCallQuery, ExecutionInfo>();

    app.events.on('processCallRequest', function (query: UneteXCallQuery) {
        const execution_info = <ExecutionInfo>{
            start: Date.now(),
            id: executionId++
        };
        // TODO: Show the RemoteObject class if query.self == null
        log(
            query.self === null?
                cold(`🗣  (Function Call #${execution_info.id}):`) :
                cold(`👤  (RemoteObject Call #${execution_info.id}):`),
            highlight(`${query.route.join('.')}(${
                field(query.args.map((e: any) => typeof e).join(', '))
            })`)
        );

        TimeMapper.set(query, execution_info);
    });

    app.events.on('processCallRequest:success', function (query: UneteXCallQuery) {
        const execution_info = TimeMapper.get(query);
        
        if(!execution_info) return;
        // TODO: Show the RemoteObject class if query.self == null

        log(
            cold(`🌕  (Query #${execution_info.id}):`),
            highlight(`${query.route.join('.')}(${
                field(query.args.map((e: any) => typeof e).join(', '))
            }).`),
            info(`Succeeded at ${Date.now() - execution_info.start}ms`)
        );
        line();

        TimeMapper.delete(query);
    });

    app.events.on('processCallRequest:error', function (query: UneteXCallQuery, exc: any) {
        const execution_info = TimeMapper.get(query);
        
        if(!execution_info) return;
        
        log(
            danger(`💥  (Call Failure #${execution_info.id}):`),
            highlight(`${query.route.join('.')}(${
                field(query.args.map((e: any) => typeof e).join(', '))
            }).`),
            info(`Failed at at ${Date.now() - execution_info.start}ms`)
        );

        log(danger('Throws:'), exc);

        TimeMapper.delete(query);
    });
}