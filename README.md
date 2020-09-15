# Serverless Api Key Output Plugin

[![npm](https://img.shields.io/npm/v/serverless-apikey-output)](https://www.npmjs.com/package/serverless-apikey-output)
[![license](https://img.shields.io/github/license/andrewtomai/serverless-apikey-output)](https://github.com/andrewtomai/serverless-apikey-output/blob/master/LICENCE.MD)

A [serverless](https://serverless.com) plugin to store an API Key and it's value from your AWS CloudFormation Stack in a JSON file.

## Warning!
Do not commit an API Key to your repo!

## Usage

### Install
```bash
$ npm install serverless-apikey-output
```

```bash
$ yarn add serverless-apikey-output
```

### Configuration

```yaml
plugins:
  - serverless-apikey-output

custom:
  output:
    keys: #optional: the default is to export all api keys
      - MyApiKeyName # this is the apikey "name" -- not to be confused with the cloudformation logicalId
    file: .build/stack.json # optional: the default path is '.serverless-apikey-output/${self:provider.stage}.keys.json'
```

## Example

The plugin works by listing all resources of type "AWS::ApiGateway::ApiKey" after deployment, so it will pick up any created API Key.

### Serverless.yml

```yaml
service: apikey-example
provider:
  name: aws
  runtime: nodejs12.x
  apiKeys:
    - myapikey
    - ${self:provider.stage}-test-key

plugins:
  - serverless-apikey-output

functions:
  test:
    handler: handler.test
    events:
      - http:
          path: test
          method: get

custom:
  apiKeyOutput:
    keys:
      - ${self:provider.stage}-test-key # only export one of the two keys created
    file: test-keys/${self:provider.stage}.keys.json
```

### Output Sample

```json
[
    {
        "id": "<Physical APIKey Id>",
        "value": "<Api Key Value>",
        "name": "dev-test-key",
        "enabled": true,
        "createdDate": "2020-09-15T07:24:38.000Z",
        "lastUpdatedDate": "2020-09-15T07:24:38.000Z",
        "stageKeys": [
            "<ApiGatewayId>/dev"
        ],
        "tags": {
            "STAGE": "dev"
        }
    }
]
```