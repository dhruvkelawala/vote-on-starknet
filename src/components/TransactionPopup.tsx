import { Flex, Text } from "@chakra-ui/react";
import { Status } from "starknet";

export default function TransactionPopup({
  hash,
  status,
  summary
}: {
  hash: string;
  status?: Status;
  summary?: string;
}) {
  // const { chainId } = useActiveStarknetReact()

  const getStatusHeader = (status: Status) => {
    switch (status) {
      // case 'RECEIVED':
      //   return 'Submitted'
      case "ACCEPTED_ON_L2":
        return "Successful";
      case "ACCEPTED_ON_L1":
        return "Finalised";
      case "REJECTED":
        return "Failed";
      default:
        return "Submitted";
    }
  };

  const pending = !status || status === "PENDING" || status === "RECEIVED";
  const success = !pending && status !== "REJECTED";

  return (
    <Flex align="flex-start" flexWrap="nowrap">
      <Flex direction="column" gap="8px" marginTop="1px">
        <Flex>
          <Text
            fontWeight="700"
            fontSize="18px"
            lineHeight="18px"
            paddingRight="16px"
            color={pending ? "#5287FF" : success ? "green" : "red"}
          >
            {status
              ? `Transaction ${getStatusHeader(status)}`
              : `Transaction Submitted`}
          </Text>
        </Flex>
        <Flex direction="column" gap="12px">
          <Text fontWeight="400" fontSize="12px" lineHeight="120%">
            {summary ??
              "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
