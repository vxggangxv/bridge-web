import { readRemoteFile } from 'react-papaparse';
// import en from './translation.en';
// import ko from './translation.ko';
// import jp from './translation.jp';
import en from './translation.en.json';
import ko from './translation.ko.json';
import jp from './translation.jp';

// let langText = {};
// readRemoteFile(require('lang/normal.csv'), {
//   step: row => {
//     console.log('Row:', row.data);
//     if (!!row.data[0]) {
//       langText = {
//         ...langText,
//         [row.data[0]]: row.data[1],
//       };
//       // setLangText(draft => {
//       //   // return [...draft, { [row.data[0]]: row.data[1] }];
//       //   // return {};
//       //   return { ...draft, [row.data[0]]: row.data[1] };
//       // });
//     }
//   },
//   complete: () => {
//     console.log('All done!');
//     // console.log(langText);
//     const langJSON = JSON.stringify(langText);
//     console.log('langJSON', langJSON);
//     langText = langJSON;
//   },
// });

// const en = langText;

export { en, ko, jp };
