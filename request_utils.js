'use strict';

const DEFAULT_CHANNEL = 'stable';

export function getChannel(event) {
  if (event.queryStringParameters && event.queryStringParameters.channel) {
    return event.queryStringParameters.channel;
  }
  return DEFAULT_CHANNEL;
}

export function getPlatform(event) {
  if (event.pathParameters && event.pathParameters.platform) {
    return platforms.match(event.pathParameters.platform);
  }
  if (event.queryStringParameters && event.queryStringParameters.platform) {
    return platforms.match(event.queryStringParameters.platform);
  }
}

export function getVersion(event) {
  if (event.pathParameters && event.pathParameters.version) {
    return event.pathParameters.version;
  }
  if (event.queryStringParameters && event.queryStringParameters.version) {
    return event.queryStringParameters.version;
  }
}

export function getFile(event) {
  if (event.pathParameters && event.pathParameters.file) {
    return event.pathParameters.file;
  }
}
