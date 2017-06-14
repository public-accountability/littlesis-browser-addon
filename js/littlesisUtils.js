/**
   Littlesis Utils
       helper functions for littlesis
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory); 
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node.
    module.exports = factory();
  } else {
    root.littlesis = factory(); // Browser globals (root is window)
  }
}(this, function () {

  /**
   * Returns the LittleSis.org entity linke
   * Only attributes.id is required
   * @param {object} attributes
   * @param {integer|string} [attributes.id] entity id
   * @param {string} [attributes.primary_ext] primary extension: 'org' or 'person'
   * @param {string} [attributes.name ]
   * @param {string} [baseUrl]
   */
  var entityLink = function(attributes, baseUrl) {
    var base = 'https://littlesis.org';
    var extension = 'entities';
    var name = '';

    if (baseUrl) {
       base = baseUrl;
    }

    if (attributes.primary_ext && ['Org', 'org', 'Person', 'person'].includes(attributes.primary_ext)) {
      extension = attributes.primary_ext.toLowerCase();
    }
    
    if (attributes.name) {
      name = '-' + encodeURIComponent(attributes.name.replace(' ', '_'));
    }

    return base + '/' + extension + '/' + attributes.id + name;

  };

  
  return {
    entityLink: entityLink
  };
  
}));

