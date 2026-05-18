import { parseDeviceLabel, getClientIp } from './deviceHelper.js';

/** Upsert current login device on user document */
export const recordLoginDevice = async (user, req) => {
  const ua = req.headers['user-agent'] || '';
  const ip = getClientIp(req);
  const name = parseDeviceLabel(ua);

  user.loginDevices.forEach((d) => { d.isCurrent = false; });

  let device = user.loginDevices.find(
    (d) => d.userAgent === ua && d.ip === ip
  );

  if (device) {
    device.lastActive = new Date();
    device.isCurrent = true;
    device.name = name;
  } else {
    user.loginDevices.push({
      name,
      ip,
      userAgent: ua,
      lastActive: new Date(),
      isCurrent: true,
    });
  }

  if (user.loginDevices.length > 10) {
    user.loginDevices.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
    const current = user.loginDevices.find((d) => d.isCurrent);
    user.loginDevices = user.loginDevices.slice(0, 10);
    if (current && !user.loginDevices.some((d) => String(d._id) === String(current._id))) {
      user.loginDevices[user.loginDevices.length - 1] = current;
    }
  }

  await user.save();
};
