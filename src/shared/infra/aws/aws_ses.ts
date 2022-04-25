import "@root/config.js";
import aws from "aws-sdk";

const ses_instance = new aws.SES({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  },
});

export { ses_instance };
