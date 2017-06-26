'use strict';

const
  MAC_PLATFORM_NAME = 'mac',
  WINDOWS_PLATFORM_NAME = 'win';

function isMac(platform) {
  return platform === 'mac' || platform === 'osx';
}

function isWindows(platform) {
  return platform === 'win' || platform === 'win32';
}

module.exports.match = (string) => {
  if (isMac(string)) {
    return MAC_PLATFORM_NAME;
  }
  if (isWindows(string)) {
    return WINDOWS_PLATFORM_NAME;
  }
}

module.exports.isMac = isMac;
module.exports.isWindows = isWindows;

module.exports.macPlatform = () => {
  return MAC_PLATFORM_NAME;
}

module.exports.windowsPlatform = () => {
  return WINDOWS_PLATFORM_NAME;
}
