import { useCallback } from "react";
import { VOTER_CONTRACT_ADDRESS } from "../constants";
import { useStarknet } from "../providers/starknet";
import { useTransactionManager } from "../providers/transactions";

export function useVoteCallback() {
  const { account } = useStarknet();
  const { addTransaction } = useTransactionManager();

  return useCallback(
    async (choice: "yes" | "no") => {
      if (!account) {
        console.error("No account found");
        return;
      }

      const { transaction_hash } = await account.execute({
        contractAddress: VOTER_CONTRACT_ADDRESS,
        entrypoint: "vote",
        calldata: [choice === "yes" ? 1 : 0]
      });

      return addTransaction({
        status: "TRANSACTION_RECEIVED",
        summary: "Voting",
        transactionHash: transaction_hash
      });
    },
    [account]
  );
}
