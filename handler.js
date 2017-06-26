'use strict';

import { ReleaseProvider } from './release_provider';
import { isWindows } from './platforms';
import { getChannel,
         getPlatform,
         getVersion,
         getFile } from './request_utils';
import { badRequest,
         noUpdate,
         redirectResponse,
         updateAvailable,
         errorResponse } from './responses';

/*
  Handles requests from clients checking to see if a new update
  is available.
*/
export function update(event, context, callback) {
  let channel = getChannel(event);
  let platform = getPlatform(event);
  let currentVersion = getVersion(event);

  if (!channel || !platform || !currentVersion) {
    callback(badRequest(), null);
    return;
  }

  new ReleaseProvider(channel, platform).lookForUpdate(currentVersion)
    .then((latest) => {
      if (!latest) {
        callback(null, noUpdate());
        return;
      }

      if (isWindows(platform)) {
        callback(null, redirectResponse(latest));
        return;
      }

      callback(null, updateAvailable(latest));
    })
    .catch((err) => {
      callback(errorResponse(err), null)
    });
};

/*
  Handles requests to download the latest version of the app
 */
export function latest(event, context, callback) {
  let channel = getChannel(event);
  let platform = getPlatform(event);
  let currentVersion = getVersion(event);

  if (!channel || !platform || !currentVersion) {
    callback(badRequest(), null);
    return;
  }

  new ReleaseProvider(channel, platform).getLatestRelease()
    .then((latest) => {
      callback(null, redirectResponse(latest));
    })
    .catch((err) => {
      callback(errorResponse(err), null);
    });
}

/*
  Handles requests to download a specific file
 */
export function download(event, context, callback) {
  let channel = getChannel(event);
  let platform = getPlatform(event);
  let file = getFile(event);

  if (!channel || !platform || !file) {
    callback(badRequest(), null);
    return;
  }

  let url = new ReleaseProvider(channel, platform).getUrlFor(file);
  callback(null, redirectResponse(url));
}
