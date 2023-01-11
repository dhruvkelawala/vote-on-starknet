import { CommonTransactionReceiptResponse } from "starknet";
import { List } from "immutable";
import {
  PopupContent,
  Transaction,
  TransactionSubmitted,
  PopupListItem
} from "./model";
import { nanoid } from "nanoid";

export interface TransactionManagerState {
  transactions: List<Transaction>;
  popupList: List<PopupListItem>;
}

interface AddTransaction {
  type: "add_transaction";
  transaction: TransactionSubmitted;
}

interface RemoveTransaction {
  type: "remove_transaction";
  transactionHash: string;
}

interface UpdateTransaction {
  type: "update_transaction";
  transactionResponse: CommonTransactionReceiptResponse;
  lastUpdatedAt: number;
}

interface AddPopup {
  type: "add_popup";
  popupListItem: {
    key?: string;
    removeAfterMs?: number | null;
    content: PopupContent;
  };
}

interface RemovePopup {
  type: "remove_popup";
  key: string;
}

export type Action =
  | AddTransaction
  | RemoveTransaction
  | UpdateTransaction
  | AddPopup
  | RemovePopup;

export function transactionManagerReducer(
  state: TransactionManagerState,
  action: Action
): TransactionManagerState {
  if (action.type === "add_transaction") {
    return {
      ...state,
      transactions: state.transactions.push(action.transaction)
    };
  } else if (action.type === "remove_transaction") {
    return {
      ...state,
      transactions: state.transactions.filter(
        tx => tx.transactionHash !== action.transactionHash
      )
    };
  } else if (action.type === "update_transaction") {
    if (action.transactionResponse.status === "NOT_RECEIVED") {
      return state;
    }

    const entry = state.transactions.findEntry(
      tx => tx.transactionHash === action.transactionResponse.transaction_hash
    );

    if (!entry) {
      return state;
    }

    const [transactionIndex, transaction] = entry;

    const txSummary = transaction.summary;

    const newTransaction: Transaction = {
      status: action.transactionResponse.status,
      transactionHash: action.transactionResponse.transaction_hash,
      lastUpdatedAt: action.lastUpdatedAt,
      summary: txSummary
    };

    return {
      ...state,
      transactions: state.transactions.set(transactionIndex, newTransaction)
    };
  } else if (action.type === "add_popup") {
    const { key, content, removeAfterMs } = action.popupListItem;

    const popupList = (
      key ? state.popupList.filter(popup => popup.key !== key) : state.popupList
    ).concat([
      {
        key: key || nanoid(),
        show: true,
        content,
        removeAfterMs: removeAfterMs ?? 10000
      }
    ]);

    return {
      ...state,
      popupList: popupList
    };

    // return {
    //   ...state,
    //   popupList: state.popupList.push(action.popupListItem),
    // }
  } else if (action.type === "remove_popup") {
    return {
      ...state,
      popupList: state.popupList.filter(popup => popup.key !== action.key)
    };
  }
  return state;
}
