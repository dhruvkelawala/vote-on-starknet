import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StarknetProvider } from "./providers/starknet";
import { ChakraProvider } from "@chakra-ui/react";
import { TransactionManagerProvider } from "./providers/transactions";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StarknetProvider>
      <TransactionManagerProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </TransactionManagerProvider>
    </StarknetProvider>
  </React.StrictMode>
);
