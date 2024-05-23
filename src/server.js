const routes = require("./routes");
const HAPI = require("@hapi/hapi");

const Initiator = async () => {
  const server = HAPI.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  server.route(routes);
  await server.start();
  console.log(`Server berjalan di ${server.info.uri} `);
};
Initiator();
