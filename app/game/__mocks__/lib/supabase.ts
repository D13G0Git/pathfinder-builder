export const supabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn((tableName: string) => {
    const mockChain = {
      select: jest.fn(() => mockChain),
      insert: jest.fn(() => mockChain),
      update: jest.fn(() => mockChain),
      eq: jest.fn(() => mockChain),
      neq: jest.fn(() => mockChain),
      in: jest.fn(() => mockChain),
      single: jest.fn(() => mockChain),
      order: jest.fn(() => mockChain),
      limit: jest.fn(() => mockChain),
      // Add other chainable methods as needed
      // Ensure that the chainable methods return `this` or a new mock object
      // that also has these methods to allow for chaining like .select().eq().single()
      // For simplicity, we'll make them return `mockChain` itself.
      // You might need to refine this depending on actual usage in GameContent.
      // For example, if a method returns a Promise, it should be:
      // select: jest.fn().mockReturnThis(), // or jest.fn().mockResolvedValue(data),
    };
    return mockChain;
  }),
};

// Example of how to make a chained call return a promise
// supabase.from('adventures').select().eq('id', '123').single()
// We need to ensure that single() or the last call in the chain returns the actual mock promise.
// A more robust way to mock `from` and its chained methods:
const mockQueryBuilder = (returnValue?: any) => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockResolvedValue(returnValue || { data: [{}], error: null }), // Default to success
  update: jest.fn().mockResolvedValue(returnValue || { data: [{}], error: null }),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue(returnValue || { data: {}, error: null }), // single usually returns one object
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  // Add more specific mock implementations if needed, e.g., for returning errors
});

// Reset the main `from` mock to use this more robust builder
supabase.from = jest.fn((_tableName: string) => mockQueryBuilder());

// You can then configure specific calls in your tests like:
// (supabase.from('adventures').select as jest.Mock).mockResolvedValueOnce({ data: [], error: null });
// Or more specifically for a chained call:
// (supabase.from('adventures').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: {}, error: null });
// However, the above `mockQueryBuilder` setup makes `insert`, `update`, `single` directly return resolved values.
// If `select` itself should return a value (not just be chainable), adjust accordingly.
// For most SELECT queries that are chained with .eq, .single, etc., the final method in the chain (e.g., single(), or the implicit execution)
// is what needs to resolve to the data.

// A common pattern is that select() itself can be awaited or returns a promise after chaining.
// Let's refine `select` to be more flexible.
const mockQueryExecutor = (defaultData: any = null) => {
  const executor = {
    data: defaultData,
    error: null,
    then: function(onFulfilled: any, onRejected?: any) {
      return Promise.resolve(this).then(onFulfilled, onRejected);
    },
    catch: function(onRejected: any) {
      return Promise.resolve(this).catch(onRejected);
    },
    finally: function(onFinally: any) {
      return Promise.resolve(this).finally(onFinally);
    }
  };
  return executor;
};


const mockChainable = () => {
  const chain: any = {
    select: jest.fn((selectString?: string) => {
      // If selectString is provided and complex, you might need to parse it
      // For now, just return the chain for further method calls
      return chain;
    }),
    insert: jest.fn((values: any) => {
      // Default: successful insert returning the inserted values (or a representation)
      return Promise.resolve({ data: Array.isArray(values) ? values : [values], error: null });
    }),
    update: jest.fn((values: any) => {
      // Default: successful update
      return Promise.resolve({ data: [values], error: null });
    }),
    delete: jest.fn(() => { // Added delete for completeness
        return Promise.resolve({ data: [{}], error: null });
    }),
    eq: jest.fn((column: string, value: any) => chain),
    neq: jest.fn((column: string, value: any) => chain),
    gt: jest.fn((column: string, value: any) => chain),
    gte: jest.fn((column: string, value: any) => chain),
    lt: jest.fn((column: string, value: any) => chain),
    lte: jest.fn((column: string, value: any) => chain),
    like: jest.fn((column: string, value: any) => chain),
    in: jest.fn((column: string, values: any[]) => chain),
    is: jest.fn((column: string, value: any) => chain), // For checking IS NULL, IS TRUE, etc.
    single: jest.fn(() => {
      // Default: successful single record query
      return Promise.resolve({ data: {}, error: null });
    }),
    order: jest.fn((column: string, options?: { ascending?: boolean }) => chain),
    limit: jest.fn((count: number) => chain),
    // This allows the chain to be awaitable, e.g. `await supabase.from('...').select()`
    // It should resolve with a default { data, error } structure.
    then: jest.fn((onFulfilled, onRejected) => {
        // Default resolution for a query chain if not overridden by single() etc.
        // Typically, a select without single() would return an array.
        return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected);
    }),
  };
  // Make all chainable methods also thenable for flexibility, though typically only the end of a chain is awaited.
  Object.keys(chain).forEach(key => {
    if (typeof chain[key] === 'function' && key !== 'then') {
      const originalMethod = chain[key];
      chain[key] = (...args: any[]) => {
        originalMethod(...args); // Call the original mock function
        return chain; // Return the chain itself to allow further chaining
      };
    }
  });
  return chain;
};

supabase.from = jest.fn((tableName: string) => mockChainable());
