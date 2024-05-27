import config from "../config/index.js";
import tranporter from "../config/transporter.config.js";

const mailHelper = async (option) => {

    const message = {
        from: config.SMTP_SENDER_EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await tranporter.sendMail(message);
};

export default mailHelper;