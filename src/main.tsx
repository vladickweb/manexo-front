import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AppRoutes } from "@/routes";

import "@mantine/core/styles.css";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: 0,
    },
  },
});

const theme = createTheme({
  primaryColor: "primary",
  colors: {
    primary: [
      "#e6f7f3",
      "#ccefe7",
      "#99dfcf",
      "#66cfb7",
      "#3dd2b8", // primary-light
      "#01b48a", // primary
      "#008f68", // primary-dark
      "#006c4f",
      "#004a36",
      "#00271c",
    ],
    secondary: [
      "#fef5e6",
      "#fdeacc",
      "#fbd599",
      "#f9c066",
      "#f7c949", // secondary-light
      "#f0a202", // secondary
      "#c87e00", // secondary-dark
      "#965e00",
      "#643f00",
      "#321f00",
    ],
  },
  fontFamily: "Inter, sans-serif",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
