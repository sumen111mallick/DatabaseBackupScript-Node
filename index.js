const mysqldump = require("mysqldump");
const CronJob = require("node-cron");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

CronJob.schedule("* * * * *", () => {
  console.log("running a task every minute");
  const data = takeBake();
  console.log(data);
  sendEmail(data);
});

const takeBake = () => {
  const currDate = Date.now();
  mysqldump({
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
    },
    dumpToFile: "./" + currDate + "dump.sql",
    //compressFile: true,
  });
  return currDate;
};

const sendEmail = (filename) => {
  var mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROMUSER,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.FROMUSER,
    to: process.env.TOUSER,
    subject: "Sending Database backup for Housingstreet production Node.js",
    text: "That was easy!",
    attachments: [
      {
        // filename and content type is derived from path
        path: "./" + filename + "dump.sql",
      },
    ],
  };
  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
