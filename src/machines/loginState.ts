import { createMachine, assign } from 'xstate';

interface LoginContext {
  username: string;
  password: string;
  error: string | null;
}

type LoginEvent =
  | { type: 'SET_USERNAME'; value: string }
  | { type: 'SET_PASSWORD'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' };

export const loginMachine = createMachine({
  id: 'login',
  initial: 'idle',
  context: {
    username: '',
    password: '',
    error: null,
  },
  schema: {
    context: {} as LoginContext,
    events: {} as LoginEvent,
  },
  states: {
    idle: {
      on: {
        SET_USERNAME: {
          actions: assign({
            username: (_, event) => event.value,
            error: null,
          }),
        },
        SET_PASSWORD: {
          actions: assign({
            password: (_, event) => event.value,
            error: null,
          }),
        },
        SUBMIT: {
          target: 'loading',
          cond: (context) => context.username.length > 0 && context.password.length > 0,
        },
      },
    },
    loading: {
      invoke: {
        src: async (context) => {
          const response = await fetch(
            "https://commpinboarddb-hchxgbe6hsh9fddx.southeastasia-01.azurewebsites.net/api/user/authenticate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              body: JSON.stringify({
                userName: context.username,
                password: context.password,
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          if (!data.userName) {
            throw new Error("Invalid credentials or missing user data");
          }

          return data;
        },
        onDone: {
          target: 'success',
          actions: (_, event) => {
            const data = event.data;
            localStorage.setItem("authenticatedUser", data.userName);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("fullName", data.fullName || "");
          },
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: (_, event) => event.data.message,
          }),
        },
      },
    },
    success: {
      type: 'final',
    },
  },
});
