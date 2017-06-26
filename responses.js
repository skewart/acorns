'use strict';

module.exports.errorResponse = (err) => {
  return {
    statusCode: 500,
    body: JSON.stringify(err)
  }
}

module.exports.badRequest = () => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      msg: 'Please include channel, platform, and current version query parameters'  
    })
  }
}

module.exports.windowsReleaseFile = (url) => {
  // TODO Double check that Squirrel.Windows follows redirects!
  return {
    statusCode: 302,
    headers: {
      'Location': url
    }
  }
}

module.exports.updateAvailable = (url) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: url
    })
  }
}

module.exports.noUpdate = () => {
  return {
    statusCode: 204
  }
}
