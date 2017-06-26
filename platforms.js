'use strict';

const
  MAC_PLATFORM_NAME     = 'mac',
  WINDOWS_PLATFORM_NAME = 'win';

export function isMac(platform) {
  return platform === 'mac' || platform === 'osx';
}

export function isWindows(platform) {
  return platform === 'win' || platform === 'win32';
}

export function match(string) {
  if (isMac(string)) {
    return MAC_PLATFORM_NAME;
  }
  if (isWindows(string)) {
    return WINDOWS_PLATFORM_NAME;
  }
}

export function macPlatform() {
  return MAC_PLATFORM_NAME;
}

export function windowsPlatform() {
  return WINDOWS_PLATFORM_NAME;
}
