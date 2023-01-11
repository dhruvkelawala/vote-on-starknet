import { Box, chakra, Flex } from "@chakra-ui/react";
import useActivePopups from "../hooks/useActivePopups";
import { PopupListItem } from "../providers/transactions";
import PopupItem from "./PopupItem";

const FixedPopupColumn = chakra(Flex, {
  baseStyle: {
    flexDirection: "column",
    position: "absolute",
    top: "88px",
    right: "1rem",
    maxWidth: "355px !important",
    width: "100%",
    zIndex: "3",
    background: "white"
  }
});

export default function Popups() {
  // get all popups
  const activePopups = useActivePopups();

  return (
    <FixedPopupColumn gap="20px">
      {activePopups.map(item => (
          <PopupItem
            key={item.key}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
    </FixedPopupColumn>
  );
}
