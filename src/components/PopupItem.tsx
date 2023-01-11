import { Flex, Box, chakra } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { X } from "react-feather";

import { PopupContent } from "../providers/transactions";

import { useTransactionManager } from "../providers/transactions";

import TransactionPopup from "./TransactionPopup";

export const Popup = chakra(Box, {
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "orange.300",
    position: "relative",
    borderRadius: "8px",
    padding: "16px",
    paddingRight: "35px",
    overflow: "hidden"
  }
});

export default function PopupItem({
  removeAfterMs,
  content,
  popKey
}: {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
}) {
  const { removePopup } = useTransactionManager();

  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);

  const popupContent = (
    <TransactionPopup
      hash={content.transactionHash}
      status={content.status}
      summary={content.summary}
    />
  );

  return (
    <Flex justify="center" borderRadius="xl" backgroundColor="orange.300">
      <Popup>
        <Box
          position="absolute"
          top="12px"
          left="12px"
          _hover={{
            cursor: "pointer"
          }}
          onClick={removeThisPopup}
        >
          <X size="16px" />
        </Box>
        {popupContent}
      </Popup>
    </Flex>
  );
}
