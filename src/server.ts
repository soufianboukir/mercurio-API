import app from "./app.ts";
import serverless from "serverless-http";
import config from "./config/config.ts";

export const handler = serverless(app);

if (config.nodeEnv !== "production") {
  app.listen(config.port, () => {
    console.log(`Dev server listening on http://localhost:${config.port}`);
  });
}
