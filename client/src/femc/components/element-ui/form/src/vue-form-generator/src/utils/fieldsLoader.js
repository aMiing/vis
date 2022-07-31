const forEach = require('lodash').forEach;

import coreFields from '../fields/core/index.js';
import elFields from '../fields/element-item/index.js';
// import optionalFields from '../fields/optional/index.js';

const fieldComponents = {};
forEach(Object.keys(coreFields), key => {
  fieldComponents[key] = coreFields[key];
});

forEach(Object.keys(elFields), key => {
  fieldComponents[key] = elFields[key];
});

// forEach(Object.keys(optionalFields), key => {
//   fieldComponents[key] = optionalFields[key];
// });

export default fieldComponents;
