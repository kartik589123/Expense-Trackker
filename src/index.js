const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PORT } = require("./config/serverConfig");
const expense = require("./routes/expense");
const signup_login = require("./routes/signup_login");
const premium = require("./routes/premium");
const db = require("./models/index");
const app = express();
const Sib = require("sib-api-v3-sdk");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", expense);
app.use("/", signup_login);
app.use("/", premium);

app.listen(PORT, async () => {
  console.log(`Server is running on port:${PORT}`);
  //db.sequelize.sync({ alter: true });
  // const tranEmailApi = new Sib.TransactionalEmailsApi();

  // const sender = {
  //   email: "meta619012@gmail.com",
  //   name: "Expense-password Reset",
  // };

  // const recievers = [
  //   {
  //     email: "kartikkdk619@gmail.com",
  //   },
  // ];

  // tranEmailApi
  //   .sendTransacEmail({
  //     sender,
  //     to: recievers,
  //     subject: "Trail to check the working",
  //     textContent: `<h1>Sendin blue checking out</h1>`,
  //   })
  //   .then(console.log)
  //   .catch(console.log);
});
