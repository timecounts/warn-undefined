warn-undefined
==============

You can use this function to wrap an object; then if you try and access
a property of the object that is not defined it will log an error to the
console (or throw an error, if you prefer) helping you to catch
programming bugs faster.

IMPORTANT - uses ES6 Proxy!
---------------------------

If you aren't on a platform that supports ES6 Proxies this will fall
back to just returning the object. If you're running older versions of
node, you may need to run them with `--harmony-proxies` for
`warn-undefined` to make any difference.

Options
-------

- `throwError`: set to true to throw errors instead of logging them
- `warn`: use `console.warn` instead of `console.error`
- `disabled`: set to true to bypass (e.g. on production)
- `fallback`: changes the default return from `undefined` to
  whatever's provided here; :warning: only works if `Proxy` is
  supported!

Example
-------

```js
var warnUndefined = require('warn-undefined');

var foo = {bar: 'baz', quux: 'fred'};

var protectedFoo = warnUndefined(foo, {
  disabled: (['development', 'test'].indexOf(process.env.NODE_ENV) < 0),
  throwError: true
});

foo.bar; //baz
protectedFoo.bar; //baz
foo.nx; //undefined
protectedFoo.nx; //Throws error!
```

License
-------

[MIT](http://benjie.mit-license.org/)
