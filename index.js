var Proxy = null;
var supportsProxies = false;
var WHITELIST_PROPERTIES = [
  'inspect', // Used by Node REPL if it exists
];

try {
  Proxy = require('harmony-proxy');
  new Proxy({}, {});
  supportsProxies = true;
} catch(e) {
}

function makeHandler(options) {
  return {
    get: function handler_get(target, property, receiver) {
      var whitelisted = (!options.strict && WHITELIST_PROPERTIES.indexOf(property) >= 0);
      var hasProperty = (property in target);

      if (hasProperty || whitelisted) {
        return target[property];
      } else {
        var message = "Attempted to access non-existent property '" + property + "' of warnUndefined object";
        if (options.throwError) {
          throw new Error(message + " '" + target + "'");
        } else {
          var method = options.warn ? 'warn' : 'error';
          if (console && console[method]) {
            console[method](message, target);
          }
        }
        return options.fallback;
      }
    }
  };
}

module.exports = function warnUndefined(obj, options) {
  options = options || {};
  if (!supportsProxies) {
    return obj;
  } else {
    return new Proxy(obj, makeHandler(options));
  }
}
