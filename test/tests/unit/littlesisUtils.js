const assert = require('assert');
const littlesis = require('../../../js/littlesisUtils.js');

module.exports = {
  'LittlesisUtils.js tests' : {
    'entityLink': {
      
      'return link when only provided entity id': function() {
	assert.equal(littlesis.entityLink({id: 123}), 'https://littlesis.org/entities/123');
      },

      'return link when provided entity id and extension': function() {
	assert.equal(
	  littlesis.entityLink({id: 123, primary_ext: 'person'}),
	  'https://littlesis.org/person/123'
	);
      },

      'return link when provided entity id and extension and name': function() {
	assert.equal(
	  littlesis.entityLink({id: 123, primary_ext: 'person', name: 'Jane Smith'}),
	  'https://littlesis.org/person/123-Jane_Smith'
	);
      },

      'can change baseUrl': function() {
	assert.equal(
	  littlesis.entityLink({id: 123, primary_ext: 'person', name: 'Jane Smith'}, 'localhost:1234'),
	  'localhost:1234/person/123-Jane_Smith'
	);
      }

    }
  }
};
