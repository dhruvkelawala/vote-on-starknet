import { Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { useVoteCallback } from "../hooks/useVoteCallback";
import { useVotingStatus } from "../hooks/useVotingStatus";

export const VotingStatus: FC = () => {
  const { votingStatus } = useVotingStatus();
  const voteCallback = useVoteCallback();

  if (!votingStatus) {
    return <></>;
  }

  return (
    <Flex
      direction="column"
      p="5"
      gap="4"
      background="blue.400"
      borderRadius="xl"
    >
      <Heading size="lg">Vote Status</Heading>
      <VStack>
        <Text fontSize="xl">Yes: {votingStatus.yesVotes}</Text>
        <Text fontSize="xl">No: {votingStatus.noVotes}</Text>
      </VStack>

      <HStack>
        <Button onClick={() => voteCallback("yes")} fontSize="md">
          Vote Yes 😎
        </Button>
        <Button onClick={() => voteCallback("no")} fontSize="md">
          Vote No 😕
        </Button>
      </HStack>
    </Flex>
  );
};
