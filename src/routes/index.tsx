import { createFileRoute } from "@tanstack/react-router";

import { HealthStatus } from "@/components/HealthStatus/HealthStatus";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <HealthStatus />
    </div>
  );
}
