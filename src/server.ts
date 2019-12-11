import httpServer, { port } from "./app";

const server = httpServer.listen(
  { port: 3000 },
  () =>
  console.log(`App is running at http://localhost:${port}`)
);

export default server;
