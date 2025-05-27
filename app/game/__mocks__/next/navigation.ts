export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
}));

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(), // Added replace as it's commonly used
  refresh: jest.fn(), // Added refresh
  back: jest.fn(),
  forward: jest.fn(),
}));

// Individual mock functions for more granular control if needed elsewhere
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockSearchParamsGet = jest.fn();

// Re-assign to the exports so they are the same mock instance
(useRouter as jest.Mock).mockImplementation(() => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
}));

(useSearchParams as jest.Mock).mockImplementation(() => ({
  get: mockSearchParamsGet,
}));
