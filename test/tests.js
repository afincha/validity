var element = null;
module( "processValidation-Test Success", {
  setup: function() {
    // prepare data for all following tests
    element = {
      required: {value: {length: '1'}},
      email: {value: 'xyz@we.com'},
	  url: {value: 'http://www.github.com/'}
    };
  }
});
test( "Test \'required\'", function() {
  ok(Validity.processValidation('required', element.required), "validated!")
});
test( "Test \'email\'", function() {
  ok(Validity.processValidation('email', element.email), "validated!")
});
test( "Test \'url\'", function() {
  ok(Validity.processValidation('URL', element.url), "validated")
});

module( "processValidation-Test Failure", {
  setup: function() {
    // prepare data for all following tests
    element = {
      required: {value: {length: '0'}},
      email: {value: 'xyzwe.com'},
	  url: {value: 'wwwgithubcom'}
    };
  }
});
test( "Test \'required\'", function() {
  strictEqual(Validity.processValidation('required', element.required), false, "validated")
});
test( "Test \'email\'", function() {
  strictEqual(Validity.processValidation('email', element.email), false, "validated")
});
test( "Test \'url\'", function() {
  strictEqual(Validity.processValidation('URL', element.url), false, "validated")
});