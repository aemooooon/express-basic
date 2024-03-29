// read config.env file with dotenv package
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// create a server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server has started on PORT ${port}`);
});
