const R = require('ramda')
import { dirname } from 'path';
import { mkdirSync, existsSync, writeFileSync, statSync } from 'fs';
import * as Serverless from 'serverless';
import * as Helpers from './helpers';


export default class ServerlessApiKeyOutputPlugin {
    provider: string;
    hooks: object;
    serverless: Serverless;
    options: Serverless.Options;
    
    constructor(serverless: Serverless , options: Serverless.Options) {
        // Mark this plug-in as only usable with aws
        this.provider = 'aws';
        // Define our hooks. We only care about downlading things when a full deploy.
        this.hooks = {
            'after:deploy:deploy': this.downloadApiKeyValues
        };
        // Stash the context away for later
        this.serverless = serverless;
        this.options = options;
    }

    /**
     * 
     * @param msg string to log out
     */
    log = (msg: string) => this.serverless.cli.log(`[serverless-apikey-output] ${msg}`)

    /**
     * downloads all api keys, filtering only the requested ones based on logical name if provided
     */
    downloadApiKeyValues = async () => {
        // get all the cf resources
        const cfResources = await this.getAllCloudfrontResources();
        // filter to only cloudfront resources, and pluck out the physical ids.
        const apiKeyResources: object[] = cfResources.filter(Helpers.isApiKeyResource);
        // get the physical ids to fetch
        const apiKeyResourceIds = Helpers.pluckPhysicalIds(apiKeyResources);
        const apiKeyValues = await Promise.all(apiKeyResourceIds.map(this.getApiKeyValue))
        // filter to only keys specified in the configuration
        const matchingApiKeyResources = Helpers.filterByConfiguration(apiKeyValues, this.getCustomConfiguration());
        this.log(`Stashing ${matchingApiKeyResources.length} Api Key Resource(s)`);
        this.writeOutputFile(matchingApiKeyResources);
    }

    writeOutputFile = (resources: object[]) => {
        const filename = Helpers.getOutputFile(this.getStage(), this.getCustomConfiguration());
        // recursively make directory until we reach the file
        const directory = dirname(filename);
        if (!existsSync(directory)) {
            mkdirSync(directory, { recursive: true });
        }
        if (!statSync(directory).isDirectory()) {
            throw new Error(`Expected ${directory} to be a directory`);
        }
        this.log(`Writing api keys to ${filename}`)
        writeFileSync(`${filename}`, JSON.stringify(resources))
    }

    getApiKeyValue = async (physicalId: string): Promise<object> => {
        const params = {
            apiKey: physicalId,
            includeValue: true
        };
        return this.serverless.getProvider('aws').request(
            'APIGateway',
            'getApiKey',
            params,
            { region: this.getRegion() }
        );
    }

      /**
     * Looks up the CF Resources for this stack from AWS
     * @returns {Promise.<String>}
     */
    getAllCloudfrontResources = async () => {
        const stackName = this.getStackName();
        let nextToken = null;
        let resources: object[] = [];
        do {
            const resourceResultPage: any = await this.serverless.getProvider('aws').request(
                'CloudFormation',
                'listStackResources',
                { StackName: stackName, NextToken: nextToken },
                { region: this.getRegion() }
            );
            nextToken = resourceResultPage.NextToken
            resources = resources.concat(resourceResultPage.StackResourceSummaries)
        } while(nextToken);
        return resources;
    }

    getCustomConfiguration = (): Helpers.Configuration => this.serverless.service.custom?.apiKeyOutput;

      /**
     * Checks CLI options and settings to discover the current stage that is being worked on
     * @returns {string}
     */
    getStage = (): string => R.pathOr('dev', ['service', 'provider', 'stage'], this.serverless)
    /**
     * Checks CLI options and settings to discover the current region that is being worked on
     * @returns {string}
     */
    getRegion = (): string => this.serverless.getProvider('aws').getRegion()
    /**
     * Returns the name of the current Stack.
     * @returns {string}
     */
    getStackName = (): string => `${(this.serverless.service as any).service}-${this.getStage()}`;
}
