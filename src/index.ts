import { start, exit } from "./service";

start();

process.on("SIGINT", () => {
  console.log("Service exited.");
  exit();
  process.exit();
});
