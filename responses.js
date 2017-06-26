'use strict';

export function errorResponse(err) {
  return {
    statusCode: 500,
    body: JSON.stringify(err)
  }
}

export function badRequest() {
  return {
    statusCode: 400,
    body: JSON.stringify({
      msg: 'Please include channel, platform, and current version query parameters'
    })
  }
}

export function redirectResponse(url) {
  return {
    statusCode: 302,
    headers: {
      'Location': url
    }
  }
}

export function updateAvailable(url) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: url
    })
  }
}

export function noUpdate() {
  return {
    statusCode: 204
  }
}
