const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const App = require('../lib/app-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new App.AppStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
