const fdi_teeth_num = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 38, 37, 36, 35, 34, 33, 32, 31,
  41, 42, 43, 44, 45, 46, 47, 48,
];

const universal_teeth_num = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32,
];

const palmer_teeth_num = [
  8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8,
];

export const NOTATION_CONFIG = {
  fdi: {
    name: 'fdi',
    index: 0,
    list: fdi_teeth_num,
  },
  universal: {
    name: 'universal',
    index: 1,
    list: universal_teeth_num,
  },
  palmer: {
    name: 'palmer',
    index: 2,
    list: palmer_teeth_num,
  },
};

// export const numbering_config = {
//   fdi: fdi_teeth_num,
//   universal: universal_teeth_num,
//   palmer: palmer_teeth_num,
//   bridge: bridge_numbering,
// };

// export const FDI_TEETH_NUM = numbering_config.fdi;
// export const UNIVERSAL_TEETH_NUM = numbering_config.universal;
// export const PALMER_TEETH_NUM = numbering_config.palmer;
// export const NUMBERING_CONFIG = numbering_config;

export const BRIDGE_NUMBERING = [
  '1817',
  '1716',
  '1615',
  '1514',
  '1413',
  '1312',
  '1211',
  '1121',
  '2122',
  '2223',
  '2324',
  '2425',
  '2526',
  '2627',
  '2728',
  '3837',
  '3736',
  '3635',
  '3534',
  '3433',
  '3332',
  '3231',
  '3141',
  '4142',
  '4243',
  '4344',
  '4445',
  '4546',
  '4647',
  '4748',
];

// export const bridgePathMnameList = [
//   109, 124, 149, 170, 197, 226, 263, 320, 378, 417, 441, 471, 490, 516, 530, 526, 498, 464, 437,
//   410, 385, 353, 318, 284, 253, 225, 202, 176, 141, 116,
// ];

export const toothInitValue = { number: null, index: null, hasDate: false };

export const teethContextActionsInitValue = {
  copy: {
    active: false,
    hidden: false,
  },
  paste: {
    active: false,
    hidden: false,
  },
  delete: {
    active: false,
    hidden: false,
  },
};
