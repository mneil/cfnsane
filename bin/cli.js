const path = require('path');
const synthesize = require('../lib/synthesize');

process.env.CFNSANE_TEMPLATE = 'Foobar';

synthesize({
    app: 'node ' + path.join(__dirname, 'app.js'),
});
