// Requiring module
const assert = require('assert');
  // We can add nested blocks for different tests
  describe( "Test1",() => {
    beforeEach(() => {
      console.log( "executes before every test" );
    });
      
    it("Is returning 5 when adding 2 + 3",() => {
      assert.equal(2 + 3, 5);
    });
  
    it("Is returning 6 when multiplying 2 * 3",() => {
      assert.equal(2*3, 6);
    });
  });