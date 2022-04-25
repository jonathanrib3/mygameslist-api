import { ses_instance } from "@infra/aws/aws_ses";
import { logger } from "@infra/http/logger";
import { app } from "@infra/http/server";
import { AppError } from "@shared/infra/errors/AppError";

import "../config.js";

const PORT = process.env.SERVER_PORT;

app.listen(PORT, async () => {
  logger.info(`Success! Server running on http://localhost:${PORT.trim()}`);
});

// function sendMailTest() {
//   const emailPromise = ses_instance
//     .sendEmail(
//       {
//         Source: "mygameslist-sender@outlook.com",
//         Destination: {
//           ToAddresses: ["jonathanrib.3@gmail.com"],
//         },
//         Message: {
//           Subject: {
//             Data: "Email testing",
//             Charset: "UTF-8",
//           },
//           Body: {
//             Html: {
//               Charset: "UTF-8",
//               Data: "Test",
//             },
//             Text: {
//               Charset: "UTF-8",
//               Data: "Test",
//             },
//           },
//         },
//       },
//       (err, data) => {
//         if (err) {
//           throw new AppError(500, err.message);
//         }
//         return data;
//       }
//     )
//     .promise();

//   return emailPromise;
// }
// sendMailTest()
//   .then((result) => {
//     console.log(result.$response);
//   })
//   .catch((err) => console.log(err));
