import crypto from 'crypto';

export const generateOtp = (length: number = 6): string => {
  if (length <= 0) return '';
  
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  
  const otp = crypto.randomInt(min, max);
  
  return otp.toString();
};
