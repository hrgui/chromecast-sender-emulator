const { CastSenderEmulator } = require("./dist");
const repl = require("repl");

async function main() {
  const replInstance = repl.start("> ");
  replInstance.context.cse = new CastSenderEmulator();
}

main();
