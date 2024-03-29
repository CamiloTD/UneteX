const { blue, bold, yellow, red, green, magenta, italic, cyan } = require('chalk');

//* Utils
export const info      = (str: string) => blue  (str);
export const warning   = (str: string) => bold  (yellow (str));
export const danger    = (str: string) => bold  (red    (str));
export const highlight = (str: string) => bold  (green  (str));
export const field     = (str: string) => italic(magenta(str)) 
export const cold      = (str: string) => bold(cyan(str));

//* Utils

export const timestamp = () => cyan(`[${new Date().toUTCString()}]`);

//* Log
export const log       = (...data: Array<any>) => console.log(timestamp(), ...data);
export const warn      = (data: string) => log(warning(data));
export const line      = () => console.log('\n')