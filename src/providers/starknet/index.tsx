import { createContext, useCallback, useContext, useReducer } from "react";
import { AccountInterface, defaultProvider, ProviderInterface } from "starknet";

export interface StarknetState {
  account?: AccountInterface;
  provider: ProviderInterface;
  setAccount: (account: AccountInterface | undefined) => void;
  setProvider: (provider: ProviderInterface | undefined) => void;
}

const StarknetContext = createContext<StarknetState>({
  account: undefined,
  provider: defaultProvider,
  setAccount: () => undefined,
  setProvider: () => undefined
});

export function useStarknet(): StarknetState {
  return useContext(StarknetContext);
}

interface StarknetManagerState {
  account?: AccountInterface;
  provider: ProviderInterface;
  error?: Error;
}

interface SetAccount {
  type: "set_account";
  account?: AccountInterface;
}

interface SetProvider {
  type: "set_provider";
  provider?: ProviderInterface;
}

type Action = SetAccount | SetProvider;

function reducer(
  state: StarknetManagerState,
  action: Action
): StarknetManagerState {
  switch (action.type) {
    case "set_account": {
      return { ...state, account: action.account };
    }
    case "set_provider": {
      return { ...state, provider: action.provider ?? defaultProvider };
    }
    default: {
      return state;
    }
  }
}

interface UseStarknetManagerProps {
  defaultProvider?: ProviderInterface;
  account?: AccountInterface;
  autoConnect?: boolean;
}

function useStarknetManager({
  defaultProvider: userDefaultProvider,
  account: userAccount,
  autoConnect
}: UseStarknetManagerProps): StarknetState {
  const [state, dispatch] = useReducer(reducer, {
    provider: userDefaultProvider ? userDefaultProvider : defaultProvider,
    account: userAccount
  });

  const { account, provider } = state;

  const setAccount = useCallback((data: AccountInterface | undefined) => {
    dispatch({ type: "set_account", account: data });
  }, []);

  const setProvider = useCallback((data: ProviderInterface | undefined) => {
    dispatch({ type: "set_provider", provider: data });
  }, []);

  return { account, provider, setAccount, setProvider };
}

/** Arguments for `StarknetProvider`. */
export interface StarknetProviderProps {
  /** Application. */
  children?: React.ReactNode;
  /** Default provider, used when the user is not connected. */
  defaultProvider?: ProviderInterface;
  /** Connect the first available connector on page load. */
  autoConnect?: boolean;
}

/** Root StarkNet context provider. */
export function StarknetProvider({
  children,
  defaultProvider
}: StarknetProviderProps): JSX.Element {
  const state = useStarknetManager({
    defaultProvider
  });
  return (
    <StarknetContext.Provider value={state}>
      {children}
    </StarknetContext.Provider>
  );
}
