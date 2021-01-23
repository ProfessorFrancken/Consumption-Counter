// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {configure} from "enzyme";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import Adapter from "enzyme-adapter-react-16";
import "mutationobserver-shim";
import "@testing-library/jest-dom/extend-expect";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
// @ts-expect-error ts-migrate(2739) FIXME: Type '{ getItem: Mock<any, any>; setItem: Mock<any... Remove this comment to see the full error message
global.localStorage = localStorageMock;

configure({adapter: new Adapter()});
