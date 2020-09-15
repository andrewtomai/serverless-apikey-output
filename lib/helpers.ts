import { config } from "process";

const R = require('ramda');

export interface Configuration {
    keys?: string[]; 
    file?: string;
}

// return the output file, or a default one if none is present
export const getOutputFile = (stage: string, configuration?: Configuration): string => {
    const defaultFile = `./.serverless-apikey-output/${stage}.keys.json`;
    return R.pathOr(defaultFile, ['file'], configuration)
}

// return true if the configuration passed in has a specified keys
export const hasSpecifiedKeys = (configuration?: Configuration): boolean => R.prop('keys', configuration);

// return true if the configuration passed in has a specified file
export const hasSpecifiedFile = (configuration?: Configuration): boolean => R.prop('file', configuration);

// intersect the apikeys mentioned in the configuration, and the ones we found
export const filterByConfiguration = (apiKeys: object[], configuration?: Configuration): object[] => {
    if (!hasSpecifiedKeys(configuration)) return apiKeys;
    return R.filter((key: any) => configuration?.keys?.includes(key.name), apiKeys);
}

// given an array of objects, return just the physical resource id of each object
export const pluckPhysicalIds = (apiKeys: object[]): string[] => R.pluck('PhysicalResourceId', apiKeys);

// a resource is an api key if it has a certain ResourceType
export const isApiKeyResource = (resource: any): boolean => R.propEq('ResourceType', 'AWS::ApiGateway::ApiKey', resource);
