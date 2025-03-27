import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/modules/LandingPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <LandingPage />;
}
