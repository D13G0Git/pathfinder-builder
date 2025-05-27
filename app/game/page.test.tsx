import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GamePage from './page' // Assuming GameContent is rendered by GamePage
// Or, if GameContent is exportable and you want to test it directly:
// import GameContent from './GameContent'; // Adjust path if GameContent is in a different file

// Import mocks
import { supabase } from './__mocks__/lib/supabase' // Adjusted path
import { useRouter, useSearchParams, mockRouterPush, mockSearchParamsGet } from './__mocks__/next/navigation' // Adjusted path
import { toast } from './__mocks__/sonner' // Adjusted path
import { getCharacterBuild } from './__mocks__/lib/character-builds' // Adjusted path
import { GameInterface as MockGameInterface } from './__mocks__/@/components/game-interface' // Adjusted path
import { Sidebar as MockSidebar } from './__mocks__/@/components/sidebar' // Adjusted path

// Explicitly mock the modules that GameContent will use
jest.mock('@/lib/supabase/client', () => require('./__mocks__/lib/supabase'))
jest.mock('next/navigation', () => require('./__mocks__/next/navigation'))
jest.mock('sonner', () => require('./__mocks__/sonner'))
jest.mock('@/lib/character-builds', () => require('./__mocks__/lib/character-builds'))

// Mock child components
jest.mock('@/components/sidebar', () => ({
  Sidebar: jest.fn((props) => <div data-testid="mock-sidebar">{/* Mock Sidebar Content */}</div>),
}))
jest.mock('@/components/game-interface', () => {
  const ActualGameInterface = jest.requireActual('@/components/game-interface');
  const MockGameInterfaceComponent = jest.fn((props) => (
    <div data-testid="mock-game-interface">
      {/* You can add simplified rendering based on props for easier debugging */}
      {/* For example: <div>Question: {props.scenario?.question}</div> */}
      <button onClick={() => props.onChoose('topLeft')}>topLeft</button>
      <button onClick={() => props.onChoose('topRight')}>topRight</button>
      <button onClick={() => props.onChoose('bottomLeft')}>bottomLeft</button>
      <button onClick={() => props.onChoose('bottomRight')}>bottomRight</button>
      {props.result && <div data-testid="game-result">{props.result}</div>}
    </div>
  ));
  return {
    __esModule: true,
    // Ensure this matches how GameInterface is exported and imported
    // If it's a default export in the actual component, this should be:
    // default: MockGameInterfaceComponent
    GameInterface: MockGameInterfaceComponent, // Assuming named export: export const GameInterface = (...)
  };
});


// Helper function to set up mock return values for Supabase getUser
const mockSupabaseUser = (user: any) => {
  (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
    data: { user },
    error: null,
  })
}

// Helper to set up Supabase from mocks
const mockSupabaseFrom = (method: string, data: any = null, error: any = null, options: { chain?: string, tableName?: string } = {}) => {
  const mockFn = jest.fn();
  if (error) {
    mockFn.mockResolvedValueOnce({ data: null, error });
  } else {
    mockFn.mockResolvedValueOnce({ data, error: null });
  }

  let queryBuilderMock = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: mockFn, // if 'single' is the final call
    // Add other chainable methods if used by the component
  };

  // If the method itself is the final call (e.g. insert, update without a follow-up single/select)
  if (method === 'insert' || method === 'update' || method === 'delete') {
     queryBuilderMock = { ...queryBuilderMock, [method]: mockFn };
  } else if (method === 'select' && !options.chain?.includes('single')) {
    // if select is directly awaited or its result is used (e.g. an array)
    queryBuilderMock = { ...queryBuilderMock, select: mockFn };
  }


  if (options.chain) {
    let currentMock: any = queryBuilderMock;
    const methods = options.chain.split('.');
    methods.forEach((m, index) => {
      if (index === methods.length - 1) {
        currentMock[m] = mockFn;
      } else {
        currentMock[m] = jest.fn().mockReturnThis();
        currentMock = currentMock[m]; // This is not quite right, should set the mock on the returned `this`
      }
    });
  }
  
  // More robust chaining mock:
  const createChainableMock = (finalMock: jest.Mock) => {
    const chain: any = {};
    const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'is', 'order', 'limit'];
    methods.forEach(m => {
      chain[m] = jest.fn(() => chain); // Return `this` (chain)
    });
    chain.single = jest.fn(() => finalMock); // `single` returns the final mock
    
    // Allow `select`, `insert`, `update`, `delete` to also directly return the final mock if no other methods are chained after them.
    // This needs to be smarter based on how the component uses it.
    // For simplicity, let's assume `single` is usually the end, or the method itself if it's an insert/update.
    if (method === 'insert' || method === 'update' || method === 'delete') {
        chain[method] = finalMock;
    } else { // Default to select being chainable, and single being the executer
        chain.select = jest.fn(() => chain); // Ensure select returns the chain
        chain.single = finalMock; // And single executes
        // If a select can be directly awaited:
        // chain.then = (onfulfilled, onrejected) => finalMock().then(onfulfilled, onrejected);
    }
    return chain;
  };

  const finalExecutionMock = jest.fn();
    if (error) {
        finalExecutionMock.mockResolvedValue({ data: null, error });
    } else {
        finalExecutionMock.mockResolvedValue({ data, error: null });
    }
  
  const fromMock = (supabase.from as jest.Mock).mockReturnValue(createChainableMock(finalExecutionMock));
  
  // If a specific table is targeted
  if (options.tableName) {
    (supabase.from as jest.Mock).mockImplementation((tableName: string) => {
      if (tableName === options.tableName) {
        return createChainableMock(finalExecutionMock);
      }
      // Fallback for other tables if needed, or a default mock
      return createChainableMock(jest.fn().mockResolvedValue({ data: null, error: {message: 'Default mock table response'} }));
    });
  }


  return finalExecutionMock; // Return the mock that will be resolved/rejected
};


// Mocks for data
const mockUser = { id: 'user-123', email: 'test@example.com' };
const mockCharacter = { id: 'char-123', name: 'Test Character', user_id: 'user-123', stats: { health: 100, mana: 50 }, class: 'warrior' };
const mockAdventure = { id: 'adv-123', character_id: 'char-123', status: 'inprogress', current_scenario_number: 1, result_data: null };
const mockScenario1 = {
  id: 'scene-1',
  adventure_id: 'adv-123',
  scenario_number: 1,
  image_prompt: 'A dark forest',
  question: 'You see a light. Do you approach, {character.name}?',
  choice_1: 'Approach the light',
  choice_2: 'Ignore it',
  choice_3: null,
  choice_4: null,
  result_1: 'You find a hidden chest!',
  result_2: 'You continue in darkness.',
  result_3: null,
  result_4: null,
  stats_change_1: JSON.stringify({ mana: -10 }),
  stats_change_2: JSON.stringify({ health: -5 }),
  stats_change_3: null,
  stats_change_4: null,
  next_scenario_1: 2,
  next_scenario_2: 3,
  next_scenario_3: null,
  next_scenario_4: null,
};
const mockScenario2 = { /* ... similar structure ... */ id: 'scene-2', scenario_number: 2, question: 'The chest is locked.' };
const mockPlayerProgress = {
  id: 'progress-123',
  adventure_id: 'adv-123',
  character_id: 'char-123',
  current_scenario_number: 1,
  character_stats: JSON.stringify(mockCharacter.stats),
};


describe('GamePage / GameContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default router/searchParams mocks
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockSearchParamsGet });
    // Default supabase user
    mockSupabaseUser(mockUser);

    // Reset GameInterface mock calls for props inspection
     if (MockGameInterface && (MockGameInterface as any).mockClear) {
      (MockGameInterface as any).mockClear();
    }
  });

  it('renders loading state initially', async () => {
    // Prevent console errors from unhandled promises if initialization fails early
    (supabase.auth.getUser as jest.Mock).mockReturnValue(new Promise(() => {})); // Keep it pending

    render(<GamePage />);
    expect(screen.getByText(/Cargando tu aventura.../i)).toBeInTheDocument();
  });

  describe('Initialization & Authentication', () => {
    it('redirects to /login if user is not authenticated', async () => {
      mockSupabaseUser(null); // No user
      
      render(<GamePage />);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/login');
      });
    });

    it('redirects to /characters if no character or adventure ID is provided', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => {
        if (key === 'character') return null;
        if (key === 'adventure') return null;
        return null;
      });

      render(<GamePage />);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/characters');
      });
    });

    it('shows error toast and redirects to /characters if supabase.auth.getUser throws an error', async () => {
      (supabase.auth.getUser as jest.Mock).mockRejectedValueOnce(new Error('Auth error'));
      
      render(<GamePage />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error obteniendo el usuario: Auth error');
      });
      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/characters');
      });
    });
  });

  describe('New Adventure Creation', () => {
    it('creates a new adventure and loads the first scenario', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => {
        if (key === 'character') return mockCharacter.id;
        return null;
      });

      // Mock supabase calls
      const charSelectMock = mockSupabaseFrom('select', [mockCharacter], null, { tableName: 'characters', chain: 'eq.single' });
      const advInsertMock = mockSupabaseFrom('insert', [{ ...mockAdventure, id: 'new-adv-id', current_scenario_number: 1 }], null, { tableName: 'adventures', chain: 'single'});
      const sceneInsertMock = mockSupabaseFrom('insert', [mockScenario1], null, { tableName: 'game_scenarios', chain: 'single' }); // Assume createInitialScenario inserts one
      const progressInsertMock = mockSupabaseFrom('insert', [mockPlayerProgress], null, { tableName: 'player_scenario_progress', chain: 'single' });
      const sceneSelectMock = mockSupabaseFrom('select', [mockScenario1], null, { tableName: 'game_scenarios', chain: 'eq.single' });


      await act(async () => {
        render(<GamePage />);
      });
      
      await waitFor(() => {
        expect(charSelectMock).toHaveBeenCalled();
      });
      await waitFor(() => {
         expect(advInsertMock).toHaveBeenCalledWith(expect.objectContaining({
           character_id: mockCharacter.id,
           status: 'inprogress',
         }));
      });
      await waitFor(() => {
        expect(sceneInsertMock).toHaveBeenCalledWith(expect.objectContaining({
          adventure_id: 'new-adv-id', // from advInsertMock's return
          scenario_number: 1,
        }));
      });
      await waitFor(() => {
        expect(progressInsertMock).toHaveBeenCalledWith(expect.objectContaining({
          adventure_id: 'new-adv-id',
          character_id: mockCharacter.id,
          current_scenario_number: 1,
          character_stats: JSON.stringify(mockCharacter.stats),
        }));
      });
      await waitFor(() => {
        expect(sceneSelectMock).toHaveBeenCalledWith(); // Called by loadScenario
      });

      await waitFor(() => {
        const gameInterfaceMock = (MockGameInterface as jest.Mock).mock;
        expect(gameInterfaceMock.calls.length).toBeGreaterThan(0);
        const lastCallProps = gameInterfaceMock.calls[gameInterfaceMock.calls.length - 1][0];
        expect(lastCallProps.scenario).toBeDefined();
        expect(lastCallProps.scenario.question).toContain(mockCharacter.name); // Placeholder replaced
      });
    });
  });

  describe('Existing Adventure Loading', () => {
    beforeEach(() => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => {
        if (key === 'adventure') return mockAdventure.id;
        return null;
      });
    });

    it('loads existing adventure and current scenario from progress', async () => {
      const existingProgress = { ...mockPlayerProgress, current_scenario_number: 2 };
      const adventureWithCharacter = { ...mockAdventure, characters: mockCharacter };

      const advSelectMock = mockSupabaseFrom('select', adventureWithCharacter, null, { tableName: 'adventures', chain: 'eq.single' });
      const progressSelectMock = mockSupabaseFrom('select', existingProgress, null, { tableName: 'player_scenario_progress', chain: 'eq.single' });
      const sceneSelectMock = mockSupabaseFrom('select', mockScenario2, null, { tableName: 'game_scenarios', chain: 'eq.single' }); // For scenario 2

      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => expect(advSelectMock).toHaveBeenCalled());
      await waitFor(() => expect(progressSelectMock).toHaveBeenCalled());
      await waitFor(() => expect(sceneSelectMock).toHaveBeenCalled());
      
      await waitFor(() => {
        const gameInterfaceMock = (MockGameInterface as jest.Mock).mock;
        expect(gameInterfaceMock.calls.length).toBeGreaterThan(0);
        const lastCallProps = gameInterfaceMock.calls[gameInterfaceMock.calls.length - 1][0];
        expect(lastCallProps.scenario.id).toBe(mockScenario2.id);
      });
    });

    it('creates progress if it does not exist (PGRST116 error)', async () => {
      const adventureWithCharacter = { ...mockAdventure, characters: mockCharacter, current_scenario_number: 1 }; // Start at scenario 1

      const advSelectMock = mockSupabaseFrom('select', adventureWithCharacter, null, { tableName: 'adventures', chain: 'eq.single' });
      // Mock progress select to return PGRST116 error
      const progressSelectErrorMock = mockSupabaseFrom('select', null, { code: 'PGRST116', message: 'Row not found' }, { tableName: 'player_scenario_progress', chain: 'eq.single' });
      
      // Subsequent mocks for createPlayerProgress
      const progressInsertMock = mockSupabaseFrom('insert', { ...mockPlayerProgress, current_scenario_number: 1 }, null, { tableName: 'player_scenario_progress', chain: 'single' });
      const sceneSelectMock = mockSupabaseFrom('select', mockScenario1, null, { tableName: 'game_scenarios', chain: 'eq.single' }); // For scenario 1

      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => expect(advSelectMock).toHaveBeenCalled());
      await waitFor(() => expect(progressSelectErrorMock).toHaveBeenCalled()); // Initial attempt
      await waitFor(() => expect(progressInsertMock).toHaveBeenCalledWith(expect.objectContaining({ // createPlayerProgress called
        adventure_id: mockAdventure.id,
        character_id: mockCharacter.id,
        current_scenario_number: 1, // Should default to scenario 1 from adventure
      })));
      await waitFor(() => expect(sceneSelectMock).toHaveBeenCalled()); // Load scenario 1

      await waitFor(() => {
        const gameInterfaceMock = (MockGameInterface as jest.Mock).mock;
        expect(gameInterfaceMock.calls.length).toBeGreaterThan(0);
        const lastCallProps = gameInterfaceMock.calls[gameInterfaceMock.calls.length - 1][0];
        expect(lastCallProps.scenario.id).toBe(mockScenario1.id);
      });
    });
  });
  
  describe('Initialization Errors', () => {
     it('handles error when fetching adventure details', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => key === 'adventure' ? 'adv-id' : null);
      mockSupabaseUser(mockUser);
      const advSelectErrorMock = mockSupabaseFrom('select', null, { message: 'DB error fetching adventure' }, { tableName: 'adventures', chain: 'eq.single' });

      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => expect(advSelectErrorMock).toHaveBeenCalled());
      await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error inicializando el juego')));
      await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/characters'));
    });

    it('handles error when fetching character details for a new game', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => key === 'character' ? 'char-id' : null);
      mockSupabaseUser(mockUser);
      const charSelectErrorMock = mockSupabaseFrom('select', null, { message: 'DB error fetching character' }, { tableName: 'characters', chain: 'eq.single' });
      
      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => expect(charSelectErrorMock).toHaveBeenCalled());
      await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Error inicializando el juego')));
      await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/characters'));
    });
  });

  describe('Scenario Rendering & Placeholder Replacement', () => {
    it('replaces placeholders in scenario text', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => key === 'adventure' ? mockAdventure.id : null);
      const adventureWithCharacter = { ...mockAdventure, characters: mockCharacter, current_scenario_number: 1 };
      const progressWithStats = { ...mockPlayerProgress, character_stats: JSON.stringify({ ...mockCharacter.stats, name: mockCharacter.name }) }; // Ensure name is in stats for replacement
      
      mockSupabaseFrom('select', adventureWithCharacter, null, { tableName: 'adventures', chain: 'eq.single' });
      mockSupabaseFrom('select', progressWithStats, null, { tableName: 'player_scenario_progress', chain: 'eq.single' });
      mockSupabaseFrom('select', mockScenario1, null, { tableName: 'game_scenarios', chain: 'eq.single' });

      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => {
        const gameInterfaceMock = (MockGameInterface as jest.Mock).mock;
        expect(gameInterfaceMock.calls.length).toBeGreaterThan(0);
        const props = gameInterfaceMock.calls[gameInterfaceMock.calls.length - 1][0];
        expect(props.scenario.question).toBe(`You see a light. Do you approach, ${mockCharacter.name}?`);
        expect(props.scenario.options[0].text).toBe(mockScenario1.choice_1); // Assuming options are transformed
      });
    });
  });

  describe('handleChoice Logic', () => {
    // To properly test handleChoice, we need GameContent to be rendered and initialized.
    // We'll set up mocks for a loaded game state.
    const setupGameForChoice = async (currentScenarioData = mockScenario1, currentProgressData = mockPlayerProgress) => {
        (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => key === 'adventure' ? mockAdventure.id : null);
        const adventureWithCharacter = { ...mockAdventure, characters: mockCharacter, current_scenario_number: currentScenarioData.scenario_number };
        
        mockSupabaseUser(mockUser);
        mockSupabaseFrom('select', adventureWithCharacter, null, { tableName: 'adventures', chain: 'eq.single' }); // Initial adventure load
        mockSupabaseFrom('select', currentProgressData, null, { tableName: 'player_scenario_progress', chain: 'eq.single' }); // Initial progress load
        mockSupabaseFrom('select', currentScenarioData, null, { tableName: 'game_scenarios', chain: 'eq.single' }); // Initial scenario load
        
        await act(async () => {
          render(<GamePage />);
        });

        // Wait for GameInterface to be rendered with initial scenario
        await waitFor(() => {
            expect(MockGameInterface as jest.Mock).toHaveBeenCalled();
            const gameInterfaceMock = (MockGameInterface as jest.Mock).mock;
            expect(gameInterfaceMock.calls.length).toBeGreaterThan(0);
            const lastProps = gameInterfaceMock.calls[gameInterfaceMock.calls.length - 1][0];
            expect(lastProps.scenario.id).toBe(currentScenarioData.id);
        });
    };

    it('handles a choice, updates stats, saves decision, updates progress, and loads next scenario', async () => {
      jest.useFakeTimers(); // For setTimeout in handleChoice

      await setupGameForChoice(mockScenario1, mockPlayerProgress);

      const decisionInsertMock = mockSupabaseFrom('insert', [{}], null, { tableName: 'decisions' });
      const progressUpdateMock = mockSupabaseFrom('update', [{}], null, { tableName: 'player_scenario_progress', chain: 'eq' });
      const nextSceneSelectMock = mockSupabaseFrom('select', mockScenario2, null, { tableName: 'game_scenarios', chain: 'eq.single' }); // For next scenario (scene-2)

      // Simulate user choice via GameInterface's onChoose prop
      let gameInterfaceProps: any;
       await waitFor(() => {
         gameInterfaceProps = (MockGameInterface as jest.Mock).mock.calls[0][0];
         expect(gameInterfaceProps.onChoose).toBeDefined();
       });

      await act(async () => {
        gameInterfaceProps.onChoose('topLeft'); // Corresponds to choice_1
      });
      
      // 1. Immediate result and stats update (check GameInterface props)
      await waitFor(() => {
        const lastCallProps = (MockGameInterface as jest.Mock).mock.calls[(MockGameInterface as jest.Mock).mock.calls.length - 1][0];
        expect(lastCallProps.result).toBe(mockScenario1.result_1);
        // Check if playerProgress state (which would be passed to GameInterface or Sidebar) reflects stat changes
        // This requires GameContent to expose this state or for Sidebar mock to receive it.
        // For now, we'll infer from Supabase calls.
      });

      // Run timers for the delay in handleChoice
      await act(async () => {
        jest.runAllTimers();
      });
      
      // 2. Delayed actions
      await waitFor(() => {
        expect(decisionInsertMock).toHaveBeenCalledWith(expect.objectContaining({
          adventure_id: mockAdventure.id,
          scenario_id: mockScenario1.id,
          choice_index: 0, // topLeft is index 0
          character_stats_before: JSON.stringify(mockCharacter.stats), // Original stats
          // character_stats_after: JSON.stringify({ health: 100, mana: 40 }), // Stats after change
        }));
      });

      await waitFor(() => {
        expect(progressUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
          current_scenario_number: mockScenario1.next_scenario_1, // Should be 2
          character_stats: JSON.stringify({ health: 100, mana: 40 }), // Updated stats
        }));
      });
      
      await waitFor(() => expect(nextSceneSelectMock).toHaveBeenCalled());

      // 3. GameInterface updated with new scenario and result cleared
      await waitFor(() => {
        const lastCallProps = (MockGameInterface as jest.Mock).mock.calls[(MockGameInterface as jest.Mock).mock.calls.length - 1][0];
        expect(lastCallProps.scenario.id).toBe(mockScenario2.id);
        expect(lastCallProps.result).toBeNull();
      });

      jest.useRealTimers();
    });

    it('shows toast error for an invalid choice', async () => {
        // Scenario where choice_3 (topRight if mapping is direct) is null
        const scenarioWithNullChoice = { ...mockScenario1, choice_3: null, result_3: null, next_scenario_3: null };
        await setupGameForChoice(scenarioWithNullChoice, mockPlayerProgress);

        let gameInterfaceProps: any;
        await waitFor(() => {
            gameInterfaceProps = (MockGameInterface as jest.Mock).mock.calls[0][0];
        });
        
        await act(async () => {
            gameInterfaceProps.onChoose('bottomLeft'); // Assuming this maps to choice_3 which is null
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Opción no válida seleccionada.');
        });
    });
  });
  
  describe('Adventure Completion', () => {
    it('completes adventure, calls getCharacterBuild, updates adventure status, toasts success, and redirects', async () => {
      jest.useFakeTimers();
      const lastScenario = { ...mockScenario1, id: 'last-scene', scenario_number: 5, next_scenario_1: 999 /* non-existent */ };
      await setupGameForChoice(lastScenario, { ...mockPlayerProgress, current_scenario_number: 5 });

      const decisionInsertMock = mockSupabaseFrom('insert', [{}], null, { tableName: 'decisions' });
      const progressUpdateMock = mockSupabaseFrom('update', [{}], null, { tableName: 'player_scenario_progress' }); // For final progress update
      // Mock game_scenarios.select for the "next" (non-existent) scenario to simulate completion
      const sceneSelectEmptyMock = mockSupabaseFrom('select', [], null, { tableName: 'game_scenarios', chain: 'eq.single' }); 
      
      const adventureUpdateCompletedMock = mockSupabaseFrom('update', [{}], null, { tableName: 'adventures', chain: 'eq' });
      (getCharacterBuild as jest.Mock).mockReturnValue({ name: 'Completed Build', description: 'Desc' });

      let gameInterfaceProps: any;
      await waitFor(() => {
        gameInterfaceProps = (MockGameInterface as jest.Mock).mock.calls[0][0];
      });

      await act(async () => {
        gameInterfaceProps.onChoose('topLeft'); // Make a choice on the last scenario
      });
      
      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => expect(sceneSelectEmptyMock).toHaveBeenCalled()); // Attempt to load next, finds nothing
      await waitFor(() => expect(getCharacterBuild).toHaveBeenCalled());
      await waitFor(() => {
        expect(adventureUpdateCompletedMock).toHaveBeenCalledWith(expect.objectContaining({
          status: 'completed',
          result_data: expect.any(Object), // Contains build name and description
        }));
      });
      await waitFor(() => expect(toast.success).toHaveBeenCalledWith('¡Aventura completada!'));
      await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/adventures'));
      
      jest.useRealTimers();
    });
  });

  describe('UI States', () => {
    it('shows "Error cargando la aventura" if critical data is null after loading attempts', async () => {
      (mockSearchParamsGet as jest.Mock).mockImplementation((key: string) => key === 'adventure' ? 'adv-id' : null);
      mockSupabaseUser(mockUser);
      // Simulate adventure loading but scenario or progress failing in a way that leaves them null
      mockSupabaseFrom('select', { ...mockAdventure, characters: mockCharacter }, null, { tableName: 'adventures', chain: 'eq.single' });
      mockSupabaseFrom('select', null, null, { tableName: 'player_scenario_progress', chain: 'eq.single' }); // Progress is null
      // GameScenarios might also return null or error, leading to currentScenario being null

      await act(async () => {
        render(<GamePage />);
      });

      await waitFor(() => {
        // This assertion depends on how GameContent handles this state.
        // It might show a specific error message or redirect.
        // If it shows an error message:
        expect(screen.getByText(/Error cargando la aventura./i)).toBeInTheDocument();
        // Or if it redirects:
        // expect(mockRouterPush).toHaveBeenCalledWith('/characters'); 
        // Or if toast is shown:
        // expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Error"));
      }, { timeout: 2000 }); // Increased timeout for safety
    });
  });

});
