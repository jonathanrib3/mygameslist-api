import { logger } from "@infra/http/logger";
import { app } from "@infra/http/server";

import "../config.js";

const PORT = process.env.SERVER_PORT;

app.listen(PORT, async () => {
  logger.info(`Success! Server running on http://localhost:${PORT.trim()}`);
});
