const { CastSenderEmulator } = require("./dist");

async function main() {
  const cde = new CastSenderEmulator();
  await cde.start();
  await cde.identify();
  await cde.load();
}

main();
