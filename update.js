'use strict';

const ReleaseProvider = require('./release_provider').ReleaseProvider;
const responses = require('./responses');
const platforms = require('./platforms');

const DEFAULT_CHANNEL = 'stable';

module.exports.check = (event, context, callback) => {
  let channel = getRequestChannel(event);
  let platform = getRequestPlatform(event);
  let currentVersion = getRequestVersion(event);

  if (!channel || !platform || !currentVersion) {
    callback(responses.badRequest(), null);
    return;
  }

  new ReleaseProvider(channel, platform).lookForUpdate(currentVersion)
    .then((latest) => {
      if (!latest) {
        callback(null, responses.noUpdate());
        return;
      }

      if (platforms.isWindows(platform)) {
        callback(null, responses.windowsReleaseFile(latest));
        return;
      }

      callback(null, responses.updateAvailable(latest));
    })
    .catch((err) => {
      callback(responses.errorResponse(err), null)
    });
};

// ----- Helpers -----

function getRequestChannel(event) {
  if (event.queryStringParameters && event.queryStringParameters.channel) {
    return event.queryStringParameters.channel;
  }
  return DEFAULT_CHANNEL;
}

function getRequestPlatform(event) {
  if (event.pathParameters && event.pathParameters.platform) {
    return platforms.match(event.pathParameters.platform);
  }
  if (event.queryStringParameters && event.queryStringParameters.platform) {
    return platforms.match(event.queryStringParameters.platform);
  }
}

function getRequestVersion(event) {
  if (event.pathParameters && event.pathParameters.version) {
    return event.pathParameters.version;
  }
  if (event.queryStringParameters && event.queryStringParameters.version) {
    return event.queryStringParameters.version;
  }
}
