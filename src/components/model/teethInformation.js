export const indication = {
  teethTreatmentIdx: 852,
  caseCode: '20201210-d3c26fe5-87c4-402d-989f-e83f7b80cf41',
  projectUniqueId: '7261664A57674355364D385831653048',
  trayNo: 538398,
  datetime: 'Thu Dec 10 2020 15:55:50 GMT+0900 (Korean Standard Time)',
  notation: 0,
  toothShade: 0,
  shade: {
    idx: 0,
    group: 'N',
    code: 'NONE',
  },
  teeth: [
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 22,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 23,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
  ],
  bridgeList: [2223],
};

export const indicationFormat = {
  indication: [
    {
      seq: 1,
      name: '크라운',
      list: [
        {
          id: 1,
          seq: 11,
          name: '풀 크라운',
          color: '#9F00A7',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 4,
          seq: 12,
          name: 'Cut-back 코핑',
          color: '#008000',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
      ],
    },
    {
      seq: 2,
      name: '폰틱',
      list: [
        {
          id: 7,
          seq: 21,
          name: '아나토믹 폰틱',
          color: '#72001E',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 8,
          seq: 22,
          name: 'Cut-back 폰틱',
          color: '#B51B44',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
      ],
    },
    {
      seq: 3,
      name: '인레이',
      list: [
        {
          id: 11,
          seq: 31,
          name: '인레이/온레이',
          color: '#335C15',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 13,
          seq: 33,
          name: '비니어',
          color: '#25879A',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
      ],
    },
    {
      seq: 4,
      name: '고급보철',
      list: [
        {
          id: 14,
          seq: 41,
          name: '바 기둥',
          color: '#664E0D',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 15,
          seq: 42,
          name: '바 연결부분',
          color: '#5C009C',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 16,
          seq: 43,
          name: '어태지먼트',
          color: '#002E3D',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 17,
          seq: 44,
          name: '이중관(내관)',
          color: '#B87471',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
      ],
    },
    {
      seq: 5,
      name: '왁스업',
      list: [
        {
          id: 18,
          seq: 51,
          name: '아나토믹 왁스업',
          color: '#1FC173',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 19,
          seq: 52,
          name: 'Cut-back 왁스업',
          color: '#494949',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
        {
          id: 20,
          seq: 53,
          name: '왁스업 폰틱',
          color: '#3F3993',
          materialList: [1, 3, 5, 6, 8, 10, 12],
        },
      ],
    },
    {
      seq: 6,
      name: 'Appliances & Removables',
      list: [
        {
          id: 21,
          seq: 61,
          name: '풀덴쳐',
          color: '#445274',
          materialList: [14, 15, 16, 17, 18, 19],
        },
        {
          id: 22,
          seq: 62,
          name: 'Partial framework',
          color: '#445274',
          materialList: [3, 5, 6, 12],
        },
        {
          id: 23,
          seq: 63,
          name: '바이트 스플린트',
          color: '#445274',
          materialList: [6, 12],
        },
        {
          id: 24,
          seq: 64,
          name: '바이트 스플린트(결손치)',
          color: '#009BAD',
          materialList: [6, 12],
        },
      ],
    },
    {
      seq: 7,
      name: '결손치',
      list: [
        {
          id: 25,
          seq: 71,
          name: '결손치',
          color: '#FF1010',
          materialList: [0],
        },
      ],
    },
    {
      seq: 8,
      name: '인접치',
      list: [
        {
          id: 26,
          seq: 72,
          name: '인접치',
          color: '#FCAE1B',
          materialList: [20],
        },
      ],
    },
    {
      seq: 9,
      name: '대합치',
      list: [
        {
          id: 27,
          seq: 73,
          name: '대합치',
          color: '#F06400',
          materialList: [20],
        },
      ],
    },
  ],
  materialList: [
    {
      idx: 0,
      id: '0000',
      code: 'None',
      name: 'None',
    },
    {
      idx: 1,
      id: '1101',
      code: 'ZI',
      name: 'Zirconia',
    },
    {
      idx: 2,
      id: '1102',
      code: 'MLZI',
      name: 'Zirconia Multilayer',
    },
    {
      idx: 3,
      id: '1103',
      code: 'NP',
      name: 'NP Metal',
    },
    {
      idx: 4,
      id: '1104',
      code: 'NP_L',
      name: 'NP Metal (Laser)',
    },
    {
      idx: 5,
      id: '1105',
      code: 'WAX',
      name: 'Wax',
    },
    {
      idx: 6,
      id: '1106',
      code: 'PMMA',
      name: 'Acrylic/PMMA',
    },
    {
      idx: 7,
      id: '1107',
      code: 'COMP',
      name: 'Composite',
    },
    {
      idx: 8,
      id: '1108',
      code: 'HC',
      name: 'Hybrid Ceramic',
    },
    {
      idx: 9,
      id: '1109',
      code: 'LS2',
      name: 'Lithium Disilicate',
    },
    {
      idx: 10,
      id: '1110',
      code: 'GCER',
      name: 'Glass Ceramic',
    },
    {
      idx: 11,
      id: '1111',
      code: 'FSP',
      name: 'Feldspar',
    },
    {
      idx: 12,
      id: '1112',
      code: 'PROV_AD',
      name: '3D Print',
    },
    {
      idx: 13,
      id: '1113',
      code: 'PEEK',
      name: 'PEEK',
    },
    {
      idx: 14,
      id: '1114',
      code: 'PINK_AD',
      name: 'Pring Base',
    },
    {
      idx: 15,
      id: '1115',
      code: 'PINK_AD_TEETH_AD',
      name: 'Pring Base & Teeth',
    },
    {
      idx: 16,
      id: '1116',
      code: 'PINKPMMA',
      name: 'Mill Base',
    },
    {
      idx: 17,
      id: '1117',
      code: 'PINKPMMA_TEETH_TRIM',
      name: 'Mill Base, Trim Teeth',
    },
    {
      idx: 18,
      id: '1118',
      code: 'PINKPMMA_TEETH_MILL',
      name: 'Mill Base & Teeth',
    },
    {
      idx: 19,
      id: '1119',
      code: 'PINK_AD_TEETH_MILL',
      name: 'Print Base, Mill Teeth',
    },
    {
      idx: 20,
      id: '1120',
      code: 'Healthy',
      name: 'Healthy',
    },
  ],
  toothShadeList: [
    {
      id: 'N',
      list: [
        {
          seq: 0,
          name: 'NONE',
        },
      ],
    },
    {
      id: 'A',
      list: [
        {
          seq: 1,
          name: 'A1',
        },
        {
          seq: 2,
          name: 'A2',
        },
        {
          seq: 3,
          name: 'A3',
        },
        {
          seq: 4,
          name: 'A3.5',
        },
        {
          seq: 5,
          name: 'A4',
        },
      ],
    },
    {
      id: 'B',
      list: [
        {
          seq: 6,
          name: 'B1',
        },
        {
          seq: 7,
          name: 'B2',
        },
        {
          seq: 8,
          name: 'B3',
        },
        {
          seq: 9,
          name: 'B4',
        },
      ],
    },
    {
      id: 'C',
      list: [
        {
          seq: 10,
          name: 'C1',
        },
        {
          seq: 11,
          name: 'C2',
        },
        {
          seq: 12,
          name: 'C3',
        },
        {
          seq: 13,
          name: 'C4',
        },
      ],
    },
    {
      id: 'D',
      list: [
        {
          seq: 14,
          name: 'D1',
        },
        {
          seq: 15,
          name: 'D2',
        },
        {
          seq: 16,
          name: 'D3',
        },
        {
          seq: 17,
          name: 'D4',
        },
      ],
    },
  ],
  implantList: [
    {
      idx: 1,
      type: 'None',
    },
    {
      idx: 2,
      type: 'SubstructureScan',
    },
    {
      idx: 3,
      type: 'WithoutAbutmentManual',
    },
    {
      idx: 4,
      type: 'WithoutAbutment',
    },
    {
      idx: 5,
      type: 'CustomAbutmentManual',
    },
    {
      idx: 6,
      type: 'CustomAbutment',
    },
  ],
  language: 'KR',
};
