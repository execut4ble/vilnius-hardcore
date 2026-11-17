/**
 * Md5 hashes of images returned by the mikke PHP script that must not be shown.
 * When a returned image's hash is in this set, the route redirects to the fallback image instead.
 */
export const BLACKLISTED_MD5 = new Set([
  "8e5e8cc2ebf6db8261b6effc0b48d55e",
  "bd50e7a81aa5e77a5ec962fa5fb8a57f",
  "426c93cbb3aff326a0087240f51fdeb1",
  "ced8a15b79b35e8a224a86c6f88bc8ea",
]);
