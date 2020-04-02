require("dotenv").config();
require("./src/mongoose").connect();

require("./src/bot");