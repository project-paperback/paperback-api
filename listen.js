const app = require("./server/app.js");
const port = 8080;
app.listen(port, () => {
  console.log(`Server is online ${port} ...`);
});
