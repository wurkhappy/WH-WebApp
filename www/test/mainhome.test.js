define(function(require){
  var Model = require("models/scope_item");
  describe('Scope Item Model tests', function() {

    it('isPaid should return a boolean.', function() {
      var model = new Model();
      chai.assert.isBoolean(model.isPaid());
    });
    it('isPaid should return a boolean.', function() {
      var model = new Model();
      chai.assert.isBoolean(model.isPaid());
    });
  });
});