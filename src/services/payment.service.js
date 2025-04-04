const dotenv = require("dotenv").config();
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");

class PaymentService {
    async createVNPay({ bookingId, amount }) {
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");
        let ipAddr = "127.0.0.1";
        let orderId = moment(date).format("DDHHmmss");
        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: process.env.VNP_TIMECODE,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `${bookingId}`,
            vnp_OrderType: "billpayment",
            vnp_Amount: amount * 100, // VNPay yêu cầu đơn vị VND x100
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        }

        vnp_Params = this.sortObject(vnp_Params);
        const signData = querystring.stringify(vnpay_Params, { encode: true });
        const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        const paymentUrl = `${process.env.VNP_URL}?${querystring.stringify(vnp_Params, { encode: true })}`;
        return paymentUrl;
    }

    async handleVNPayReturn(query) {
        let vnp_Params = query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = this.sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const { vnp_TxnRef, vnp_ResponseCode, vnp_PayDate } = query;
            if (vnp_ResponseCode === "00") {
                return { success: true, message: "Payment successful", transactionId: vnp_TxnRef };
            }
            return { success: false, message: "Payment failed", transactionId: vnp_TxnRef };
        } else {
            return { success: false, message: "Checksum failed - Chữ ký không hợp lệ" };
        }
    }

    sortObject(obj) {
        let sorted = {};
        let keys = Object.keys(obj).sort();
        for (let key of keys) {
            sorted[key] = obj[key];
        }
        return sorted;
    }
}

module.exports = new PaymentService();