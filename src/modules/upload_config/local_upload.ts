import crypto from "crypto";
import { diskStorage } from "multer";
import path from "path";

export default {
  upload(folder: string) {
    return {
      storage: diskStorage({
        destination: path.resolve(__dirname, "..", "..", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex");

          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    };
  },
};
