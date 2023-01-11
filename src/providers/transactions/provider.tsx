import React, { useCallback, useEffect, useReducer } from "react";
import { List } from "immutable";
import { TransactionManagerContext } from "./context";
import { PopupListItem, Transaction, TransactionSubmitted } from "./model";
import { transactionManagerReducer } from "./reducer";
import { useStarknet } from "../starknet";

function shouldRefreshTransaction(
  transaction: Transaction,
  now: number
): boolean {
  // try to get transaction data as soon as possible
  if (
    transaction.status === "TRANSACTION_RECEIVED" ||
    transaction.status === "RECEIVED"
  ) {
    return true;
  }

  // wont' be updated anymore
  if (
    transaction.status === "ACCEPTED_ON_L1" ||
    transaction.status === "REJECTED"
  ) {
    return false;
  }

  // every couple of minutes is enough. Blocks finalized infrequently.
  if (transaction.status === "ACCEPTED_ON_L2") {
    return now - transaction.lastUpdatedAt > 120000;
  }

  return now - transaction.lastUpdatedAt > 15000;
}

interface TransactionManagerProviderProps {
  children: React.ReactNode;
  interval?: number;
}

export function TransactionManagerProvider({
  children,
  interval = 5000
}: TransactionManagerProviderProps): JSX.Element {
  const { provider } = useStarknet();

  const [state, dispatch] = useReducer(transactionManagerReducer, {
    transactions: List<Transaction>(),
    popupList: List<PopupListItem>()
  });

  const refresh = useCallback(
    async (transaction: Transaction) => {
      try {
        const transactionResponse = await provider.getTransactionReceipt(
          transaction.transactionHash
        );
        const lastUpdatedAt = Date.now();

        if (transaction.status !== transactionResponse.status) {
          dispatch({
            type: "update_transaction",
            transactionResponse,
            lastUpdatedAt
          });

          if (
            transactionResponse.status !== "NOT_RECEIVED" &&
            transactionResponse.status !== "PENDING" &&
            transactionResponse.status !== "ACCEPTED_ON_L1"
          ) {
            dispatch({
              type: "add_popup",
              popupListItem: {
                content: {
                  status: transactionResponse.status,
                  summary: transaction.summary,
                  transactionHash: transaction.transactionHash
                }
              }
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    [provider, dispatch]
  );

  const refreshByTxHash = useCallback(
    async (transactionHash: string) => {
      try {
        const transactionResponse = await provider.getTransactionReceipt(
          transactionHash
        );
        const lastUpdatedAt = Date.now();

        dispatch({
          type: "update_transaction",
          transactionResponse,
          lastUpdatedAt
        });
      } catch (err) {
        console.error(err);
      }
    },
    [provider, dispatch]
  );

  const refreshAllTransactions = useCallback(() => {
    const now = Date.now();
    for (const transaction of state.transactions.toArray()) {
      if (shouldRefreshTransaction(transaction, now)) {
        refresh(transaction);
      }
    }
  }, [state.transactions, refresh]);

  const addTransaction = useCallback(
    (transaction: TransactionSubmitted) => {
      dispatch({ type: "add_transaction", transaction });
    },
    [dispatch]
  );

  const removeTransaction = useCallback(
    (transactionHash: string) => {
      dispatch({ type: "remove_transaction", transactionHash });
    },
    [dispatch]
  );

  const removePopup = useCallback((key: string) => {
    dispatch({ type: "remove_popup", key });
  }, []);

  const refreshTransaction = useCallback(
    (transactionHash: string) => {
      refreshByTxHash(transactionHash);
    },
    [refreshByTxHash]
  );

  // periodically refresh all transactions.
  // do this more often than once per block since there are
  // different stages of "accepted" transactions.
  useEffect(() => {
    refreshAllTransactions();
    const intervalId = setInterval(() => {
      refreshAllTransactions();
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval, refreshAllTransactions]);

  return (
    <TransactionManagerContext.Provider
      value={{
        transactions: state.transactions.toArray(),
        popupList: state.popupList.toArray(),
        addTransaction,
        removeTransaction,
        refreshTransaction,
        removePopup
      }}
    >
      {children}
    </TransactionManagerContext.Provider>
  );
}
