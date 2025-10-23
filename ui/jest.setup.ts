import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

jest.mock("@tanstack/react-query", () => ({
  __esModule: true,
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(() => ({
    data: { data: [], totalPages: 1 },
    error: null,
    isLoading: false,
    isFetching: false,
  })),
  QueryClient: jest.fn(function() {
    const self = this;
    self.fetchQuery = jest.fn();
    self.getQueryData = jest.fn();
    self.setQueryData = jest.fn();
    self.invalidateQueries = jest.fn();
    self.removeQueries = jest.fn();
    self.mount = jest.fn();
    self.unmount = jest.fn();
  }),
}));
