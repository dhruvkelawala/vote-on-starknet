import { useCallback } from "react";
import { stark } from "starknet";
import { VOTER_CLASS_HASH, VOTER_CONTRACT_ADDRESS } from "../constants";
import { useStarknet } from "../providers/starknet";
import { useTransactionManager } from "../providers/transactions";

export function useCreateVoteCallback() {
  const { account } = useStarknet();
  const { addTransaction } = useTransactionManager();

  return useCallback(
    async (whitelistedAddresses: string[]) => {
      if (!account) {
        console.error("No account found");
        return;
      }

      const { transaction_hash } = await account.deploy({
        classHash: VOTER_CLASS_HASH,
        salt: stark.randomAddress(), // can also be 0
        unique: false, // can also be true. True means this address will be unique to the deployer and cannot be squatted
        constructorCalldata: {
          admin_address: account.address,
          registered_addresses: whitelistedAddresses
        }
      });

      return addTransaction({
        status: "TRANSACTION_RECEIVED",
        summary: "Deploy Voter Contract",
        transactionHash: transaction_hash
      });
    },
    [account]
  );
}
