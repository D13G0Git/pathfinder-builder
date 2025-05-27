import React from 'react';

// Create a Jest mock function for the GameInterface component
const MockGameInterface = jest.fn((props: any) => (
  <div data-testid="mock-game-interface">
    GameInterface
    {/* Render some props if needed for simpler assertions or debugging */}
    {/* For example, to see the current question: */}
    {/* <div>Question: {props.scenario?.question}</div> */}
    {/* The main way to check props will be via `mockGameInterface.mock.calls` or `mockGameInterface.mock.instances[0].props` */}
    <button onClick={() => props.onChoose('topLeft')}>topLeft</button>
    <button onClick={() => props.onChoose('topRight')}>topRight</button>
    <button onClick={() => props.onChoose('bottomLeft')}>bottomLeft</button>
    <button onClick={() => props.onChoose('bottomRight')}>bottomRight</button>
  </div>
));

export const GameInterface = MockGameInterface;

// If the original component is a default export, you might also need:
// export default MockGameInterface;
// However, usually for components, named exports are common.
// Check your actual GameInterface component export style.
// If it's `export default function GameInterface(...)`, then the mock should be:
// export default MockGameInterface;
// and the import in the test file would be `import GameInterface from '@/components/game-interface';`
// If it's `export const GameInterface = (...)`, then the mock is correct as is.
