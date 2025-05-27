import React from 'react';

const MockSidebar = (props: any) => (
  <div data-testid="mock-sidebar">
    Sidebar
    {/* You can render props here if needed for verification in tests */}
    {/* Example: <pre>{JSON.stringify(props)}</pre> */}
  </div>
);

// If the original component is a default export:
// export default MockSidebar;

// If the original component is a named export, e.g., export const Sidebar = (...)
// then the mock should also be a named export:
export const Sidebar = MockSidebar;

// Fallback if unsure, try to provide both default and named (though usually one is correct)
export default MockSidebar;
// If you know Sidebar is a named export, ensure this matches:
// export { MockSidebar as Sidebar };
