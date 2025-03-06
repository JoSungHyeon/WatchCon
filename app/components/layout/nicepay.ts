import exp from 'constants';
import CryptoJS from 'crypto-js';
import format from 'date-format';
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const merchantKey = process.env.MERCHANT_KEY;
const merchantID = process.env.MERCHANT_ID;

const NICEPAY_CONFIG = {
  merchantKey: "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==",
  merchantID: "nicepay00m",
  returnURL: `${baseURL}/api/auth-req`, 
};

export { NICEPAY_CONFIG };

const getSignData = (str: string) => {
  return CryptoJS.SHA256(str).toString();
};

export { getSignData };

const getEdiDate = () => {
  return format.asString('yyyyMMddhhmmss', new Date());
};

export { getEdiDate };
