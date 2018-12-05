import { generateApiKey } from "./util";

const result = generateApiKey();

console.log("\n1. Copy the API_SECRET_KEY to your client environment.\n");
console.log(` API_SECRET_KEY=${result.key}\n\n`);
console.log("2. Copy the API_SECRET_HASH to the microservice environment.\n");
console.log(` API_SECRET_HASH=${result.hash}\n`);
