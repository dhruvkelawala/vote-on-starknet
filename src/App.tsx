import { useCallback, useState } from "react";
import { connect, disconnect } from "get-starknet";
import { useStarknet } from "./providers/starknet";
import { VotingStatus } from "./components/VotingStatus";
import { Flex, VStack, Text, Button, Heading } from "@chakra-ui/react";
import "./App.css";
import { CreateVote } from "./components/CreateVote";
import Popups from "./components/PopupList";

function App() {
  const [error, setError] = useState();
  const { account, setAccount, setProvider } = useStarknet();

  const handleConnectOrDisconnect = async () => {
    try {
      if (account) {
        await disconnect({ clearLastWallet: true });
        setAccount(undefined);
        setProvider(undefined);
        return;
      }

      const starknetWindowObject = await connect({
        modalTheme: "dark",
        modalMode: "alwaysAsk"
      });

      setAccount(starknetWindowObject?.account);
      setProvider(starknetWindowObject?.provider);
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <>
      <Flex direction="column" align="center" h="full" gap="10" pt="10">
        <Heading size="3xl">Vote On Starknet</Heading>
        {account ? (
          <>
            <VotingStatus />
            <CreateVote />

            <VStack p="2" gap="2">
              <Text>
                <Text fontWeight="bold">Connected Account:</Text>{" "}
                {account.address}
              </Text>
              <Button bgColor="orange.400" onClick={handleConnectOrDisconnect}>
                Disconnect
              </Button>
            </VStack>
          </>
        ) : (
          <>
            <Text>Please connect your wallet to start voting</Text>
            <Button bgColor="orange.400" onClick={handleConnectOrDisconnect}>
              Connect
            </Button>
          </>
        )}
      </Flex>
      <Popups />
    </>
  );
}

export default App;
