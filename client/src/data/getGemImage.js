/**
 * getGemImage — maps gem id to its static image path in /public/images/
 * Image filenames follow pattern: imgi_{X}_{gemId}.webp
 * The second number IS the gem's id (1–36)
 */

// Manual map: gemId → filename (from the actual files in /images/)
const IMAGE_MAP = {
  1:  '/images/imgi_2_1.webp',
  2:  '/images/imgi_3_2.webp',
  3:  '/images/imgi_4_3.webp',
  4:  '/images/imgi_5_4.webp',
  5:  '/images/imgi_6_5.webp',
  6:  '/images/imgi_7_6.webp',
  7:  '/images/imgi_8_7.webp',
  8:  '/images/imgi_9_8.webp',
  9:  '/images/imgi_10_36.webp',   // triangular coral — closest available
  10: '/images/imgi_11_10.webp',
  11: '/images/imgi_12_9.webp',
  12: '/images/imgi_13_11.webp',
  13: '/images/imgi_14_12.webp',
  14: '/images/imgi_15_13.webp',
  15: '/images/imgi_16_14.webp',
  16: '/images/imgi_17_15.webp',
  17: '/images/imgi_18_16.webp',
  18: '/images/imgi_19_17.webp',
  19: '/images/imgi_20_18.webp',
  20: '/images/imgi_21_19.webp',
  21: '/images/imgi_22_20.webp',
  22: '/images/imgi_23_21.webp',
  23: '/images/imgi_24_22.webp',
  24: '/images/imgi_25_23.webp',
  25: '/images/imgi_26_24.webp',
  26: '/images/imgi_27_25.webp',
  27: '/images/imgi_28_26.webp',
  28: '/images/imgi_29_27.webp',
  29: '/images/imgi_30_28.webp',
  30: '/images/imgi_31_29.webp',
  31: '/images/imgi_32_30.webp',
  32: '/images/imgi_33_31.webp',
  33: '/images/imgi_34_32.webp',
  34: '/images/imgi_35_33.webp',
  35: '/images/imgi_36_34.webp',
  36: '/images/imgi_37_35.webp',
};

export function getGemImage(gemId) {
  return IMAGE_MAP[gemId] || '/images/imgi_2_1.webp';
}
