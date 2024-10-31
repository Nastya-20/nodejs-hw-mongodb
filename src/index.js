import { initMongoConnections } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";


const boostrap = async () => {
  await initMongoConnections();
  setupServer();
};

boostrap();