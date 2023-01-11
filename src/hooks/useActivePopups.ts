import { useMemo } from "react";
import { useTransactionManager } from "../providers/transactions";

export default function useActivePopups() {
  const { popupList } = useTransactionManager();

  return useMemo(() => {
    return popupList.filter(popup => popup.show);
  }, [popupList]);
}
