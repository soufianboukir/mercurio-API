import app from "./app.js";
import serverless from "serverless-http";
import config from "./config/config";
export const handler = serverless(app);
if (config.nodeEnv !== "production") {
    app.listen(config.port, () => {
        console.log(`Dev server listening on http://localhost:${config.port}`);
    });
}
