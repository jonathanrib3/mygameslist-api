import { INodemailerEmailSentData } from "@shared/containers/providers/interfaces/INodemailerEmailSentData";
import { ISESEmailSentData } from "@shared/containers/providers/interfaces/ISESEmailSentData";

interface IEMailSentDTO {
  sesEmailSentData?: ISESEmailSentData;
  nodemailerEmailSentData?: INodemailerEmailSentData;
}

export { IEMailSentDTO };
