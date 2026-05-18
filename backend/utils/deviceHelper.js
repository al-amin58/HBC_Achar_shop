/** Parse User-Agent into a short device label */
export const parseDeviceLabel = (ua = '') => {
  const s = String(ua);
  let browser = 'Browser';
  let os = 'Unknown';

  if (/Edg\//i.test(s)) browser = 'Edge';
  else if (/Chrome\//i.test(s) && !/Edg/i.test(s)) browser = 'Chrome';
  else if (/Firefox\//i.test(s)) browser = 'Firefox';
  else if (/Safari\//i.test(s) && !/Chrome/i.test(s)) browser = 'Safari';

  if (/Windows NT 10/i.test(s)) os = 'Windows 10/11';
  else if (/Windows/i.test(s)) os = 'Windows';
  else if (/Android/i.test(s)) os = 'Android';
  else if (/iPhone|iPad|iOS/i.test(s)) os = 'iOS';
  else if (/Mac OS X/i.test(s)) os = 'macOS';
  else if (/Linux/i.test(s)) os = 'Linux';

  return `${browser} • ${os}`;
};

export const getClientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || '';
};
