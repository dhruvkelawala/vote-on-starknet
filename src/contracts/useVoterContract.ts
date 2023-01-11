import { useContract, useNetwork } from "@starknet-react/core";
import { constants, Contract } from "starknet";
import { VOTER_CONTRACT_ADDRESS } from "../constants";
import VoterABI from "../assets/abi/vote_abi.json";
import { useStarknet } from "../providers/starknet";
import { useMemo } from "react";

export const useVoterContract = () => {
  const { provider } = useStarknet();

  return useMemo(
    () => new Contract(VoterABI, VOTER_CONTRACT_ADDRESS, provider),
    [provider]
  );
};
