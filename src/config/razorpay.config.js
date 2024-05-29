import Razorpay from "razorpay";
import config from "./index.js";

const razorpay = new Razorpay({
    key_id: config.ROZORPAY_KEY_ID,
    key_secret: config.ROZORPAY_SECRET
});

export default razorpay;