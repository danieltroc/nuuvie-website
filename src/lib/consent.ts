/**
 * Marketing cookies: the Meta pixel (ads on Instagram and Facebook). It loads only after the visitor
 * accepts in the cookie banner (components/site/CookieConsent.astro), and only on www.nuuvie.com.
 * Umami is cookie-free and runs without consent. Empty id = no pixel and no banner.
 */
export const META_PIXEL_ID = '994634066083263';
/** localStorage key holding the visitor's choice */
export const CONSENT_KEY = 'nuuvie-consent';
/** Bump when the banner asks about something new, so everyone is asked again */
export const CONSENT_VERSION = 1;
