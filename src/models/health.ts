export interface Health {
  status: "OK" | "ERROR";
  database: "UP" | "DOWN";
}
