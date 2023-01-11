import { Status, TransactionStatus } from "starknet";

export interface TransactionSubmitted {
  status: TransactionStatus;
  transactionHash: string;
  address?: string;
  summary: string;
}

export interface TransactionReceived {
  status?: Status;
  transactionHash: string;
  lastUpdatedAt: number;
  summary: string;
}

export type Transaction = TransactionSubmitted | TransactionReceived;

export interface PopupContent {
  transactionHash: string;
  status?: Status;
  summary: string;
}

export type PopupListItem = {
  key: string;
  show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
};

export interface TransactionManager {
  transactions: Transaction[];
  popupList: PopupListItem[];
  addTransaction: (transaction: TransactionSubmitted) => void;
  removeTransaction: (transactionHash: string) => void;
  refreshTransaction: (transactionHash: string) => void;
  removePopup: (transactionHash: string) => void;
}

export const TRANSACTION_MANAGER_INITIAL_STATE: TransactionManager = {
  transactions: [],
  popupList: [],
  addTransaction: _transaction => undefined,
  removeTransaction: _transactionHash => undefined,
  refreshTransaction: _transactionHash => undefined,
  removePopup: _transactionHash => undefined
};
