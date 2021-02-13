const path = require('path');
const { program } = require('commander');
const synthesize = require('../lib/synthesize');
const package = require('../package-lock.json');

process.env.CFNSANE_TEMPLATE = 'Foobar';

program.version(package.version);

program
    .command('synth', {isDefault: true})
    .arguments('<template>')
    .option('-d, --debug', 'Show debug logs (specify multiple times to increase verbosity) [count] [default: false]', false)
    .option('-j, --json', 'Use JSON output instead of YAML when templates are printed to STDOUT [boolean] [default: false]', false)
    .option('-o, --output <path>', 'Emits the synthesized cloud assembly into a directory (default: dist)', 'dist')
    .option('-v, --verbose', 'Enable emission of additional debugging information, such as creation stack traces of tokens [boolean] [default: false]', false)
    .action((template, options) => {
        process.env.CFNSANE_TEMPLATE = template || 'template.yml';
        synthesize({
            ...options,
            app: 'node ' + path.join(__dirname, 'app.js'),
        });
    });

program.parse();
