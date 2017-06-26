'use strict';

import 'semver';
import 'aws-sdk';
import { isMac, isWindows } from './platforms';

export class ReleaseProvider {
  constructor(channel, platform) {
    this.latestVersion = null;
    this.latestFile = null;
    this.targetFileMatcher = null;

    this.platform = platform;
    this.prefix = channel + '/' + platform;
    this.bucket = process.env.BUCKET_NAME;
    this.contents = [];
  }

  lookForUpdate(currentVersion) {
    this.targetFileMatcher = this.buildUpdateFileMatcher();
    this.latestVersion = currentVersion;
    return new Promise((resolve, reject) => {
      this.lookForUpdateOnS3(resolve, reject);
    });
  }

  getLatestRelease() {
    this.targetFileMatcher = this.buildInstallFileMatcher();
    return new Promise((resolve, reject) => {
      this.lookForUpdateOnS3(resolve, reject);
    });
  }

  getUrlFor(file) {
    return this.urlFor(this.prefix + '/' + file);
  }

  // ----- Helpers -----

  lookForUpdateOnS3(onSuccess, onError) {
    let params = this.getParams();

    this.client().listObjectsV2(params, (err, data) => {
      if (err) {
        onError(err);
        return;
      }

      let keys = this.getKeys(data.Contents);
      this.findLatest(keys);

      if (data.IsTruncated) {
        this.continuationToken = data.NextContinuationToken;
        this.lookForUpdateOnS3(onSuccess, onError);
        return;
      }

      onSuccess(this.urlFor(this.latestFile));
    });
  }

  findLatest(keys) {
    keys.forEach((key) => {
      let parts = key.split('/');
      if (parts.length < 4) return;

      let version = parts[2];
      let file = parts[3];
      if (this.isNewer(version) && this.isTargetFile(file)) {
        this.latestFile = key;
      }
    });
  }

  isNewer(version) {
    return !this.latestVersion || semver.gt(version, this.latestVersion);
  }

  isTargetFile(file) {
    return file.match(this.targetFileMatcher);
  }

  buildUpdateFileMatcher() {
    if (isMac(this.platform)) {
      return new RegExp('\.zip$');
    } else if (isWindows(this.platform)) {
      return new RegExp('^RELEASES$');
    }
  }

  buildInstallFileMatcher() {
    if (isMac(this.platform)) {
      return new RegExp('\.dmg$');
    } else if (isWindows(this.platform)) {
      return new RegExp('\.exe$');
    }
  }

  getKeys(contents) {
    return contents.map((i) => {
      return i.Key;
    })
  }

  getParams() {
    let params = {
      'Bucket': this.bucket,
      'Prefix': this.prefix
    }
    if (this.continuationToken) {
      params['ContinuationToken'] = this.continuationToken;
    }
    return params;
  }

  client() {
    if (!this.s3Client) {
      this.s3Client = new AWS.S3();
    }
    return this.s3Client;
  }

  urlFor(key) {
    if (key) {
      let host = process.env.S3_BASE_URL;
      return [host, this.bucket, key].join('/');
    }
  }
}
