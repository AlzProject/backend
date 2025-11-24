import createApp from "./src/app.js";
import config from "./src/config/config.js";
import logger from "./src/utils/logger.js";

const app = createApp();
const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
