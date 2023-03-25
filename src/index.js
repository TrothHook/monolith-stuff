const express = require("express");
const { PORT } = require("./config/index");
const { databaseConnection } = require("./database/index");

const expressApp = require("./app");

const StartServer = async () => {
    
  const app = express();
  await databaseConnection();
  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
