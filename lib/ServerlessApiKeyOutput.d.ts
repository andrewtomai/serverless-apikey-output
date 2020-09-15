import * as Serverless from 'serverless';
import * as Helpers from './helpers';
export default class ServerlessApiKeyOutputPlugin {
    provider: string;
    hooks: object;
    serverless: Serverless;
    options: Serverless.Options;
    constructor(serverless: Serverless, options: Serverless.Options);
    /**
     *
     * @param msg string to log out
     */
    log: (msg: string) => null;
    /**
     * downloads all api keys, filtering only the requested ones based on logical name if provided
     */
    downloadApiKeyValues: () => Promise<void>;
    writeOutputFile: (resources: object[]) => void;
    getApiKeyValue: (physicalId: string) => Promise<object>;
    /**
   * Looks up the CF Resources for this stack from AWS
   * @returns {Promise.<String>}
   */
    getAllCloudfrontResources: () => Promise<object[]>;
    getCustomConfiguration: () => Helpers.Configuration;
    /**
   * Checks CLI options and settings to discover the current stage that is being worked on
   * @returns {string}
   */
    getStage: () => string;
    /**
     * Checks CLI options and settings to discover the current region that is being worked on
     * @returns {string}
     */
    getRegion: () => string;
    /**
     * Returns the name of the current Stack.
     * @returns {string}
     */
    getStackName: () => string;
}
