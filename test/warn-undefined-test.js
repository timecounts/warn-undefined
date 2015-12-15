var proxyquire = require('proxyquire');
var expect = require('chai').expect;
require('mocha-sinon');

describe('warn-undefined', function() {

  describe('proxy unsupported', function() {

    function wrap(foo) {
      var warnUndefined = proxyquire('../index', {'harmony-proxy': {}});
      return warnUndefined(foo);
    }

    it('passes object straight through', function() {
      var foo = {bar: 'baz', quux: 'fred'};
      var warnFoo = wrap(foo);
      expect(warnFoo).to.equal(foo);
    });

    it('still allows accessing defined properties', function() {
      var foo = {bar: 'baz', quux: 'fred'};
      var warnFoo = wrap(foo);
      expect(warnFoo.bar).to.equal('baz');
    });

    it('just gives undefined for missing properties', function() {
      var foo = {bar: 'baz', quux: 'fred'};
      var warnFoo = wrap(foo);
      expect(warnFoo.nx).to.be.undefined;
    });

  });

  describe('proxy supported', function() {

    if (typeof Proxy === 'undefined') {
      throw new Error("Can't test this on a platform that doesn't support Proxies! Did you mean to --harmony-proxies");
    }

    describe('default', function() {

      function wrap(foo) {
        var warnUndefined = proxyquire('../index', {'harmony-proxy': require('harmony-proxy')});
        return warnUndefined(foo);
      }

      it('returns object', function() {
        var foo = {bar: 'baz', quux: 'fred'};
        var warnFoo = wrap(foo);
        expect(warnFoo).to.be.an('object');
      });

      it('returns different object', function() {
        var foo = {bar: 'baz', quux: 'fred'};
        var warnFoo = wrap(foo);
        expect(warnFoo).not.to.equal(foo);
      });

      it('still allows accessing defined properties', function() {
        var foo = {bar: 'baz', quux: 'fred'};
        var warnFoo = wrap(foo);
        expect(warnFoo.bar).to.equal('baz');
      });

      it('console.errors when accessing undefined property', function() {
        var foo = {bar: 'baz', quux: 'fred'};
        var warnFoo = wrap(foo);
        expect(warnFoo.nx).to.be.undefined;
        expect(console.error.calledOnce);
      });

    });

    describe('raise', function() {

      function wrap(foo) {
        var warnUndefined = proxyquire('../index', {'harmony-proxy': require('harmony-proxy')});
        return warnUndefined(foo, {throwError: true});
      }

      it('throws error for accessing undefined property', function() {
        var foo = {bar: 'baz', quux: 'fred'};
        var warnFoo = wrap(foo);
        expect(function(){return warnFoo.nx}).to.throw(Error);
      });

    });

  });

});
