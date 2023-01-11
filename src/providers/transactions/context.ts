import { createContext, useContext } from "react";

import { TransactionManager, TRANSACTION_MANAGER_INITIAL_STATE } from "./model";

export const TransactionManagerContext = createContext<TransactionManager>(
  TRANSACTION_MANAGER_INITIAL_STATE
);

export function useTransactionManager(): TransactionManager {
  return useContext(TransactionManagerContext);
}
