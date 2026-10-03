import { app } from "./app.js";
import { pool } from "./dbInit/db.js";

pool.getConnection()
.then((connection) => {
  console.log("MySQL connected Successfully");
  connection.release();

  app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on PORT : ${process.env.PORT}`);
  });
})
.catch((err) => {
    console.log("Error : ", err);
});
