import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { number } from "starknet";
import { useCreateVoteCallback } from "../hooks/useCreateVoteCallback";
import { useStarknet } from "../providers/starknet";

export const CreateVote: FC = () => {
  const createVoteCallback = useCreateVoteCallback();
  const { account } = useStarknet();
  const [registeredAddresses, setRegisteredAddresses] = useState("");

  const handleChange = (event: any) =>
    setRegisteredAddresses(event.target.value);

  const handleCreateVote = () => {
    const addresses = registeredAddresses
      .split(",")
      .map((address: string) => number.toHex(number.toBN(address.trim())));

    return createVoteCallback(addresses);
  };

  return (
    <Flex
      direction="column"
      p="5"
      gap="4"
      background="blue.400"
      borderRadius="xl"
    >
      {account ? (
        <>
          <Heading size="lg">Create your own vote</Heading>
          <Flex direction="column" align="flex-start">
            <Text fontSize="lg" mb="8px">
              Registered Addresses:{" "}
            </Text>
            <Input
              value={registeredAddresses}
              onChange={handleChange}
              placeholder="integer or hex address, comma separated"
              size="md"
              w="1000px"
              variant="filled"
              fontSize="sm"
              _placeholder={{
                fontSize: "sm"
              }}
              _focusVisible={{
                bg: "white",
                border: "2px solid",
                borderColor: "blue.800"
              }}
              px="2.5"
            />
          </Flex>

          <Button onClick={handleCreateVote} fontSize="md">
            Create Vote 🤩
          </Button>
        </>
      ) : (
        <Text> Connect your wallet to view and create vote </Text>
      )}
    </Flex>
  );
};
