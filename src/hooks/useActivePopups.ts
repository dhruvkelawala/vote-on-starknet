import { useMemo } from "react";
import { useTransactionManager } from "../providers/transactions";

export default function useActivePopups() {
  const { popupList } = useTransactionManager();
  console.log(
    "🚀 ~ file: useActivePopups.ts:6 ~ useActivePopups ~ popupList",
    popupList
  );

  return useMemo(() => {
    return popupList.filter(popup => popup.show);
  }, [popupList]);
}
