import * as program from 'commander';
import * as YAML from 'yamljs';
import { start } from './cli/actions';

//* Command line options
       program.version('0.5.0'); 
       program.option('-c, --config <file_path>', 'Specifies the configuration file', (filename: string) => YAML.load(filename));

//* Commands
       program.command('start')
              .description('Starts UneteX server with the specified configuration file, if no config specified, it will search for ./UneteX.yml')
              .action(() => start(program.config));


program.parse(process.argv);