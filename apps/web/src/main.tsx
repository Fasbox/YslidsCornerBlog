import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/token.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components/shell/shell.css";
import "./styles/components/cards.css";
import "./styles/components/home.css";
import "./index.css";
import "./styles/components/sectionIndex.css";
import "./styles/components/forms.css";
import "./styles/components/postDetail.css";
import "./styles/components/search.css";
import "./styles/components/adminDashboard.css";
import "./styles/components/adminEditor.css";
import "./styles/components/tiptap.css";
import "./styles/components/tagPicker.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 20_000,
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
