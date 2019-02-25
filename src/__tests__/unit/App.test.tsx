import React from 'react';
import App from '../../App/App';
import { sanityCheckInstantiation } from '../_support/testHelpers';

describe('App', () => {
  sanityCheckInstantiation(<App />, '.App');
});
