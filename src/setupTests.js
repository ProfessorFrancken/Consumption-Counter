import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'mutationobserver-shim';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

configure({ adapter: new Adapter() });
