export const toast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(), // Added for completeness
  warning: jest.fn(), // Added for completeness
  loading: jest.fn(), // Added for completeness
  promise: jest.fn((promise, { loading, success, error }) => {
    // A basic mock for toast.promise
    // It should handle the promise and call the respective functions
    // For testing, you might want to control the promise resolution manually
    // or just call success/error directly based on test needs.
    if (typeof promise === 'function') {
      // If promise is a function, execute it
      const p = promise();
      p.then(success).catch(error);
      return p;
    }
    // If promise is a Promise instance
    promise.then(success).catch(error);
    return promise;
  }),
  dismiss: jest.fn(),
  custom: jest.fn(),
};
