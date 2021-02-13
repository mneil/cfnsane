#!/usr/bin/env node
const colors = require('colors/safe');
const { ToolkitInfo, Bootstrapper } = require('aws-cdk/lib');
const { SdkProvider } = require('aws-cdk/lib/api/aws-auth');
const { CloudFormationDeployments } = require('aws-cdk/lib/api/cloudformation-deployments');
const { CloudExecutable } = require('aws-cdk/lib/api/cxapp/cloud-executable');
const { execProgram } = require('aws-cdk/lib/api/cxapp/exec');
const { CdkToolkit } = require('aws-cdk/lib/cdk-toolkit');
const { data, debug, error, print, setLogLevel } = require('aws-cdk/lib/logging');
const { PluginHost } = require('aws-cdk/lib/plugin');
const { serializeStructure } = require('aws-cdk/lib/serialize');
const { Configuration } = require('aws-cdk/lib/settings');
const version = require('aws-cdk/lib/version');

/**
 * Synthesize the stack. Pulled directly from
 * https://github.com/aws/aws-cdk/blob/e5c616f73eac395492636341f57fb6a716d1ea69/packages/aws-cdk/bin/cdk.ts#L137
 * and ran. Basically we're just passing through to the CDK
 * cli here where any command would work. But, we're only
 * interested in sythesize at the moment.
 *
 */
async function synthesize(config) {
    const argv = {
        ...config, // user config
        _: ['synthesize'],
        // v: 1,
        // lookups: true,
        // 'ignore-errors': false,
        // ignoreErrors: false,
        // json: false,
        // j: false,
        // debug: false,
        // ec2creds: undefined,
        // i: undefined,
        // 'version-reporting': undefined,
        // versionReporting: undefined,
        // 'path-metadata': true,
        // pathMetadata: true,
        // 'asset-metadata': true,
        // assetMetadata: true,
        // 'role-arn': undefined,
        // r: undefined,
        // roleArn: undefined,
        // staging: true,
        // 'no-color': false,
        // noColor: false,
        // fail: false,
        // quiet: false,
        // q: false,
        // '$0': 'cdk'
    };
    if (argv.verbose) {
        setLogLevel(argv.verbose);
    }
    debug('CDK toolkit version:', version.DISPLAY_VERSION);
    debug('Command line arguments:', argv);

    const configuration = new Configuration({
        ...argv,
    });
    await configuration.load();

    const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
        profile: configuration.settings.get(['profile']),
        ec2creds: argv.ec2creds,
        httpOptions: {
            proxyAddress: argv.proxy,
            caBundlePath: argv['ca-bundle-path'],
        },
    });

    const cloudFormation = new CloudFormationDeployments({ sdkProvider });

    const cloudExecutable = new CloudExecutable({
        configuration,
        sdkProvider,
        synthesizer: execProgram,
    });

    /** Function to load plug-ins, using configurations additively. */
    function loadPlugins(...settings) {
        const loaded = new Set();
        for (const source of settings) {
            const plugins = source.get(['plugin']) || [];
            for (const plugin of plugins) {
                const resolved = tryResolve(plugin);
                if (loaded.has(resolved)) { continue; }
                debug(`Loading plug-in: ${colors.green(plugin)} from ${colors.blue(resolved)}`);
                PluginHost.instance.load(plugin);
                loaded.add(resolved);
            }
        }

        function tryResolve(plugin) {
            try {
                return require.resolve(plugin);
            } catch (e) {
                error(`Unable to resolve plugin ${colors.green(plugin)}: ${e.stack}`);
                throw new Error(`Unable to resolve plug-in: ${plugin}`);
            }
        }
    }

    loadPlugins(configuration.settings);

    const cmd = argv._[0];

    // Bundle up global objects so the commands have access to them
    const commandOptions = { args: argv, configuration, aws: sdkProvider };

    try {
        const returnValue = argv.commandHandler
            ? await (argv.commandHandler)(commandOptions)
            : await main(cmd, argv);
        if (typeof returnValue === 'object') {
            return toJsonOrYaml(returnValue);
        } else if (typeof returnValue === 'string') {
            return returnValue;
        } else {
            return returnValue;
        }
    } finally {
        await version.displayVersionMessage();
    }

    async function main(command, args) {
        const toolkitStackName = ToolkitInfo.determineName(configuration.settings.get(['toolkitStackName']));
        debug(`Toolkit stack: ${colors.bold(toolkitStackName)}`);

        if (args.all && args.STACKS) {
            throw new Error('You must either specify a list of Stacks or the `--all` argument');
        }

        args.STACKS = args.STACKS || [];
        args.ENVIRONMENTS = args.ENVIRONMENTS || [];

        const stacks = (args.all) ? ['*'] : args.STACKS;
        const cli = new CdkToolkit({
            cloudExecutable,
            cloudFormation,
            verbose: argv.trace || argv.verbose > 0,
            ignoreErrors: argv['ignore-errors'],
            strict: argv.strict,
            configuration,
            sdkProvider,
        });

        switch (command) {
            case 'ls':
            case 'list':
                return cli.list(args.STACKS, { long: args.long });

            case 'diff':
                const enableDiffNoFail = isFeatureEnabled(configuration, cxapi.ENABLE_DIFF_NO_FAIL);
                return cli.diff({
                    stackNames: args.STACKS,
                    exclusively: args.exclusively,
                    templatePath: args.template,
                    strict: args.strict,
                    contextLines: args.contextLines,
                    fail: args.fail || !enableDiffNoFail,
                });

            case 'bootstrap':
                // Use new bootstrapping if it's requested via environment variable, or if
                // new style stack synthesis has been configured in `cdk.json`.
                //
                // In code it's optimistically called 'default' bootstrapping but that is in
                // anticipation of flipping the switch, in user messaging we still call it
                // 'new' bootstrapping.
                let source = { source: 'legacy' };
                const newStyleStackSynthesis = isFeatureEnabled(configuration, cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT);
                if (args.template) {
                    print(`Using bootstrapping template from ${args.template}`);
                    source = { source: 'custom', templateFile: args.template };
                } else if (process.env.CDK_NEW_BOOTSTRAP) {
                    print('CDK_NEW_BOOTSTRAP set, using new-style bootstrapping');
                    source = { source: 'default' };
                } else if (newStyleStackSynthesis) {
                    print(`'${cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT}' context set, using new-style bootstrapping`);
                    source = { source: 'default' };
                }

                const bootstrapper = new Bootstrapper(source);

                if (args.showTemplate) {
                    return bootstrapper.showTemplate();
                }

                return cli.bootstrap(args.ENVIRONMENTS, bootstrapper, {
                    roleArn: args.roleArn,
                    force: argv.force,
                    toolkitStackName: toolkitStackName,
                    execute: args.execute,
                    tags: configuration.settings.get(['tags']),
                    terminationProtection: args.terminationProtection,
                    parameters: {
                        bucketName: configuration.settings.get(['toolkitBucket', 'bucketName']),
                        kmsKeyId: configuration.settings.get(['toolkitBucket', 'kmsKeyId']),
                        createCustomerMasterKey: args.bootstrapCustomerKey,
                        qualifier: args.qualifier,
                        publicAccessBlockConfiguration: args.publicAccessBlockConfiguration,
                        trustedAccounts: arrayFromYargs(args.trust),
                        cloudFormationExecutionPolicies: arrayFromYargs(args.cloudformationExecutionPolicies),
                    },
                });

            case 'deploy':
                const parameterMap = {};
                for (const parameter of args.parameters) {
                    if (typeof parameter === 'string') {
                        const keyValue = parameter.split('=');
                        parameterMap[keyValue[0]] = keyValue.slice(1).join('=');
                    }
                }
                return cli.deploy({
                    stackNames: stacks,
                    exclusively: args.exclusively,
                    toolkitStackName,
                    roleArn: args.roleArn,
                    notificationArns: args.notificationArns,
                    requireApproval: configuration.settings.get(['requireApproval']),
                    reuseAssets: args['build-exclude'],
                    tags: configuration.settings.get(['tags']),
                    execute: args.execute,
                    force: args.force,
                    parameters: parameterMap,
                    usePreviousParameters: args['previous-parameters'],
                    outputsFile: args.outputsFile,
                    progress: configuration.settings.get(['progress']),
                    ci: args.ci,
                });

            case 'destroy':
                return cli.destroy({
                    stackNames: stacks,
                    exclusively: args.exclusively,
                    force: args.force,
                    roleArn: args.roleArn,
                });

            case 'synthesize':
            case 'synth':
                return cli.synth(args.STACKS, args.exclusively, args.quiet);

            case 'metadata':
                return cli.metadata(args.STACK);

            case 'init':
                const language = configuration.settings.get(['language']);
                if (args.list) {
                    return printAvailableTemplates(language);
                } else {
                    return cliInit(args.TEMPLATE, language, undefined, args.generateOnly);
                }
            case 'version':
                return data(version.DISPLAY_VERSION);

            default:
                throw new Error('Unknown command: ' + command);
        }
    }

    function toJsonOrYaml(object) {
        return serializeStructure(object, argv.json);
    }
}

module.exports = synthesize;
