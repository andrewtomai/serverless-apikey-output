export interface Configuration {
    keys?: string[];
    file?: string;
}
export declare const getOutputFile: (stage: string, configuration?: Configuration | undefined) => string;
export declare const hasSpecifiedKeys: (configuration?: Configuration | undefined) => boolean;
export declare const hasSpecifiedFile: (configuration?: Configuration | undefined) => boolean;
export declare const filterByConfiguration: (apiKeys: object[], configuration?: Configuration | undefined) => object[];
export declare const pluckPhysicalIds: (apiKeys: object[]) => string[];
export declare const isApiKeyResource: (resource: any) => boolean;
