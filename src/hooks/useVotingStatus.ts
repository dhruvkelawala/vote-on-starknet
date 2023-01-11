import { useVoterContract } from "../contracts/useVoterContract";
import useSWR from "swr";
import { useStarknet } from "../providers/starknet";

export interface VotingStatusResult {
  yesVotes: string;
  noVotes: string;
}

export const useVotingStatus = (): {
  votingStatus: VotingStatusResult | undefined;
  votingStatusError: any;
} => {
  const contract = useVoterContract();
  const { account } = useStarknet();
  const { data, error } = useSWR(
    [account?.address, account?.chainId, "get_voting_status"],
    () => {
      if (!account) {
        return undefined;
      }

      return contract.call("get_voting_status", [account.address]);
    },
    {
      refreshInterval: 10000
    }
  );

  const votingStatus = data
    ? {
        yesVotes: data.status.votes_yes.toString(), // Can also do data[0].votes_yes.toString()
        noVotes: data.status.votes_no.toString()
      }
    : undefined;

  return {
    votingStatus,
    votingStatusError: error
  };
};
