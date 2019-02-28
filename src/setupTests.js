import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

////////////////////////////////////////////////////////////////////////

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

////////////////////////////////////////////////////////////////////////

import localforage from 'localforage';

beforeEach(() => {
  localforage.clear();
});

afterEach(() => {
  sinon.restore();
});
