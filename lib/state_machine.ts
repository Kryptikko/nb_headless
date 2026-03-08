
type ScreenStateValue = 'home' | 'roster' | 'assembly' | 'combat'
interface Context {
  // game state
}
type Action = (ctx: Context, event: EventType) => void;

const state_machine = {
  init: 'home',
  states: {
    'home': {
      on { }
    }
  }
}

const state_machine = (state: string) => {
}

type EventType = 'START' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'RESET';
type StateValue = 'idle' | 'loading' | 'success' | 'failure';
const machine = {
  initial: 'idle' as const,
  states: {
    idle: {
      on: { START: 'loading' }
    },
    loading: {
      on: {
        SUCCESS: 'success',
        FAILURE: 'failure'
      }
    },
    success: {
      on: { RESET: 'idle' }
    },
    failure: {
      on: {
        RETRY: 'loading',
        RESET: 'idle'
      }
    }
  }
} satisfies Record<string, any>;


function transition(
  state: StateValue,
  event: EventType
): StateValue {
  return machine.states[state]?.on?.[event] ?? state;
}

// Usage:
// let current = machine.initial;
// current = transition(current, 'START');     // "loading"
// current = transition(current, 'FAILURE');   // "failure"
// current = transition(current, 'RETRY');     // "loading"
// current = transition(current, 'SUCCESS');   // "success"
