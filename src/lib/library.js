import moment from 'moment';
import { ENV_MODE_DEV } from 'lib/setting';
import _ from 'lodash';
import reactAttrconvert from 'react-attr-converter';
import { NOTATION_CONFIG, BRIDGE_NUMBERING } from 'lib/teeth/teethMapper';
import { pageUrl } from 'lib/mapper';

export function getIndexForTeethFDI(num) {
  return NOTATION_CONFIG.fdi.list.indexOf(num);
}

/**
 *
 * @param {number} num : teeth number
 * @param {number} type : NOTATION_CONFIG index number
 */
export function getMapperTeethNumbering(num, type) {
  // 0이면 기본값 그대로 리턴
  if (type === 0) return num;
  const index = NOTATION_CONFIG.fdi.list.indexOf(num);
  return (
    _.reduce(NOTATION_CONFIG, (acc, item) => {
      if (item.index === type) {
        return item.list[index];
      }
      // console.log(acc, 'acc');
      return acc;
    }) || null
  );
}

export const NEW_BRIDGE_NUMBERING = BRIDGE_NUMBERING.map((item, idx) => {
  return {
    id: idx + 1,
    text: item,
  };
});
// console.log(NEW_BRIDGE_NUMBERING,'NEW_BRIDGE_NUMBERING');

export const meteriallist = Array(26)
  .fill(true)
  .map((item, idx) => ({
    seq: idx,
    name: `meterial-${idx}`,
    list: Array(10)
      .fill(true)
      .map((item, idx) => ({ seq: idx, name: `meterial-item-${idx}` })),
  }));

/**
 * 공백있나 없나 체크
 * @param {string} value
 */
export function checkSpace(value) {
  return value && value.search(/\s/) !== -1;
}

/**
 * 정규식 비밀번호 유효성 검사
 * 8~16자리 글자, 영어,대문자소문자,특수문자
 * @param {string} value
 */
export function regPassword(value) {
  if (checkSpace(value)) return false;
  let regExp = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return regExp.test(value);
}

/**
 * 숫자만
 * @param {number} value
 */
export function regNumber(value) {
  if (typeof value !== 'number' && !value) return false;
  if (checkSpace(value)) return false;
  let regExp = /^[0-9]*$/g;
  // let regExp = /^[\d]$/g;
  return regExp.test(value);
}

/**
 * 정규식 번호(폰, 전화)
 * 숫자 - 숫자 (시작 숫자, 하이픈 포함, 마지막 숫자 형식)
 * @param {string} value
 */
export function regPhone(value) {
  // /^\d{2,3}-\d{3,4}-\d{4}$/
  let regExp = /^[\d]+-[\d]+([-]?[\d])*$/;
  return regExp.test(value);
}

/**
 * 정규식 이메일 유효성 검사
 * @param {string} value
 */
export function regEmail(value) {
  if (checkSpace(value)) return false;
  let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(value);
}

/**
 * 정규식 이름 유효성 검사
 * @param {string} value
 */
export function regName(value) {
  let regExp = /^[\s0-9a-zㄱ-ㅎ가-힣_-]{0,100}$/i;
  return regExp.test(value);
}

// eslint-disable-next-line no-useless-escape
export const reqProjectInput = /[\/\?\*\:\<\>\|\"\n]/g;
export const reqRemoveTag = /(<([^>]+)>)/gi;

/**
 * 정규식 글자 제한
 * @param {number} len
 * @param {string} value
 * @param {boolean} bool 마지막 boolean으로 1번째부터인지 0번째부터인지?
 */
export function regLength(len, value, bool) {
  try {
    value = value.toString().trim();
  } catch (e) {
    console.log(e, 'error');
  }
  let regExp = bool ? new RegExp(`^.{${len},${len}}$`) : new RegExp(`^.{1,${len}}$`);
  return regExp.test(value);
}

/**
 * 숫자만 입력
 * @param {*} value
 */
export function inputNumber(value) {
  return value.replace(/[^0-9]/g, '');
}

/**
 * 3자리 단위마다 콤마 생성
 * @param {number} x
 */
export function addCommas(x) {
  // 숫자가 아니고 false일 경우(null, undefined)
  if (typeof x !== 'number' && !x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 양수 확인
 * @param {number} x
 * @returns {boolean}
 */
export function isPositive(x) {
  return Number(x) >= 0;
}

/**
 * 정수 확인
 * @param {number} n
 * @returns {boolean}
 */
export function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

/**
 * 실수 확인
 * @param {number} n
 * @returns {boolean}
 */
export function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

/**
 * 정수 또는 실수 확인
 * @param {number} n
 * @returns {boolean}
 */
export function isIntOrFloat(n) {
  if (typeof n !== 'number' && !n) return false;
  return (Number(n) === n && n % 1 === 0) || (Number(n) === n && n % 1 !== 0);
}

/**
 * 모든 콤마 제거
 * @param {number} x
 */
export function removeCommas(x) {
  if (!x || x.length == 0) return '';
  else return x.split(',').join('');
}

/**
 * 로컬스토리지가 오브젝트인지 확인
 * @param {*}
 */
const st = typeof localStorage === 'object' ? localStorage : {};

/**
 * 키값 관리 객체
 */
export const keys = {
  user: '__$$_dof_$$__',
  remember: `__$$_dof_$$__remember`,
  token: '__$$_dof_$$__token',
  autoLogin: '__$$_dof_$$__auto',
};

/**
 * 스토리지 맵핑 오브젝트
 */
export const storage = {
  set(key, value) {
    st[key] = JSON.stringify(value);
  },
  get(key) {
    if (!st[key]) return null;
    const value = st[key];
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return value;
    }
  },

  remove(key) {
    delete st[key];
  },
  clear() {
    if (st.clear) {
      st.clear();
    }
  },
};

/**
 * 쿠키 관련 클래스
 */
class clsCookie {
  set(name, value, exp = 1) {
    // set(변수이름, 변수값, 기간(일수));
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  get(name) {
    // get(변수이름)
    let x;
    let y;
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      x = cookies[i].substr(0, cookies[i].indexOf('='));
      y = cookies[i].substr(cookies[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
      if (x === name) {
        return unescape(y); // unescape로 디코딩 후 값 리턴
      }
    }
  }

  remove(name) {
    // deleteCookie(변수이름)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
  }

  clear() {
    let cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf('=');
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}
export const cookie = new clsCookie();

/**
 * 개발 환경 적용한 console.log
 * @param {string} param0 setPath // 현재 콘솔로그를 찍는 파일명
 * @param {string,object} (param0, param1) // 콘솔에 찍힐 txt와 payload 순서는 상관없이 사용가능.
 */
export const devConsoleSet =
  (setPath = 'utils.js') =>
  (txt, payload) => {
    if (ENV_MODE_DEV) {
      if (payload) {
        if (typeof payload === 'string') {
          console.log(
            ` %c file: ${setPath} ${payload} :\n`,
            'color:skyblue;padding:5px;font-weight:bold',
            txt,
          );
        } else {
          console.log(
            ` %c file: ${setPath} ${txt} :\n`,
            'color:skyblue;padding:5px;font-weight:bold',
            payload,
          );
        }
      } else if (typeof txt === 'string') {
        console.log(` %c file: ${setPath} ${txt} `, 'color:skyblue;padding:5px;font-weight:bold');
      } else {
        console.log(
          ` %c file: ${setPath} ${JSON.stringify(txt)} :\n`,
          'color:skyblue;padding:5px;font-weight:bold',
        );
      }
    }
  };

/**
 *
 * @param {*} target
 */
export function disableDragSelect(target) {
  try {
    if (target) {
      target.setAttribute('onselectstart', 'return false');
      target.setAttribute('oncontextmenu', 'return false');
      target.setAttribute('ondragstart', 'return false');
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 */
export const getScrollTop = () => {
  if (!document.body) return 0;
  const scrollTop = document.documentElement
    ? document.documentElement.scrollTop || document.body.scrollTop
    : document.body.scrollTop;
  return scrollTop;
};

/**
 *
 */
export const getScrollBottom = () => {
  if (!document.body) return 0;
  const { scrollHeight } = document.body;
  const { innerHeight } = window;
  const scrollTop = getScrollTop();
  return scrollHeight - innerHeight - scrollTop;
};

/**
 *
 */
export const preventStickBottom = () => {
  const scrollBottom = getScrollBottom();
  if (scrollBottom !== 0) return;
  if (document.documentElement) {
    document.documentElement.scrollTop -= 1;
  } else {
    if (!document.body) return;
    document.body.scrollTop -= 1;
  }
};

/**
 *
 * @param {*} start
 * @param {*} end
 */
export function numRangeMap(start, end) {
  return function (num) {
    return num >= start && num <= end;
  };
}

/**
 * isFocusCurrentTarget
 * @param {*} param0 e, eventObject
 */
export function isFocusCurrentTarget({ relatedTarget, currentTarget }) {
  if (relatedTarget === null) return false;
  let node = relatedTarget.parentNode;
  while (node !== null) {
    if (node === currentTarget) return true;
    node = node.parentNode;
  }
  return false;
}

/**
 * 정한 숫자만큼 앞에 0이 붙는다
 * ex) fixedNumbering(50,4) => 0050
 * @param {*} number
 * @param {*} len
 * 길이를 정해줄 수 있다.
 */
export function fixedNumbering(number, len = 4) {
  const str = `${number}`;
  const pad = '0'.repeat(len);
  const ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
}

/**
 *
 * @param {*} text
 */
export function AlertFn(text) {
  console.log(`
  ==========================
  >>> *${text}
  ==========================
  `);
}

/**
 * NOTE: value가 있으면 value를 리턴하고 없으면 -를 반환
 * @param {*} val
 */
export function checkValueDash(val) {
  return val || '-';
}

/**
 *
 * @param {*} config
 */
export function convertDateTime(config) {
  const { type = 'date', format = 'YYYY-MM-DD', value = 0, isNull } = config;
  if (isNull && !value) {
    return isNull;
  }
  if (type === 'unix') {
    return moment(value).valueOf();
  }
  if (type === 'date') {
    return moment.unix(value).format(format);
  }
}

/**
 *
 * @param {*} target
 */
export function getElementSize(target) {
  if (target) {
    const { clientWidth, clientHeight } = target;
    return { x: clientWidth, y: clientHeight };
  }
  return { x: null, y: null };
}

/**
 //files을 배열로 file들을 넣어야함
  uploadFile은 서버에서 받으려는 파일 네임.
 * const testData = {
    caseCode, 
    caseId, 
    userCode, 
    files:{
      uploadFile:files
    }
  }
  const formData = setFormData(testData);
  INFO_WORKS_DIRECT_FILE_UPLOAD_SAGAS(formData);
 * @param {*} data 
 */
export function setFormData(data) {
  const formData = new FormData();
  _.forOwn(data, (val, key, value) => {
    // console.log(val, 'val');
    // console.log(key, 'in_key');
    formData.append(key, val);
    if (key === 'files') {
      _.forOwn(val, (in_val, in_key) => {
        if (Array.isArray(in_val)) {
          // console.log(in_val, 'in_val');
          // console.log(in_key, 'in_key');
          in_val.forEach(item => formData.append(in_key, item));
        }
      });
    }
  });
  return formData;
}

/**
 * 확장자있는 파일네임 추출
 * @param {*} name
 */
export function extractFileName(name) {
  const index = name.lastIndexOf('.');
  let fileName = name;
  if (index !== -1) {
    fileName = name.substring(0, index);
  }
  return fileName;
}

/**
 * 파일명에서 확장자명 추출
 * @param name   파일명
 * @returns fileExtension 확장자명
 */
export function extractExtension(name) {
  // return name?.slice(name?.lastIndexOf('.') + 1).toLowerCase();
  const fileExtension = name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
  return fileExtension;
}

/**
 *
 * @param {*} e
 */
export function disableF5(e) {
  const keycode = e.keyCode;
  console.log(keycode, 'keycode');
  if ((e.ctrlKey === true && (keycode === 78 || keycode === 82)) || (e.which || keycode) === 116) {
    e.preventDefault();
  }
}

/**
 *
 * @param {*} nextProp
 * @param {*} prevProp
 * @param {*} list
 */
export function compareProp(nextProp, prevProp, list) {
  const compareBoolList = list.map(item => nextProp[item] === prevProp[item]);
  // console.log(compareBoolList,'compareBoolList');
  return compareBoolList.every(item => item === true);
}

/**
 * 카멜케이스를 대쉬로 바꿔주는 정규식 함수
 * @param {*} str
 */
export const camelCaseToDash = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * * 대쉬로 이뤄진 문자를 카멜케이스로 바꿔주는 정규식 함수
 * @param {*} str
 */
export const dashToCamelCase = str =>
  str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });

/**
 * 스트링으로짜여있는 css를 jsx 객체형식으로 바꿔주는 함수
 * @param {string} str
 */
export const stringCssToObject = str => {
  let result = {};
  let attributes = str.split(';');
  for (let i = 0; i < attributes.length; i++) {
    let entry = attributes[i].split(':');
    const keyName = entry.splice(0, 1)[0].trim();
    if (keyName !== '') {
      result[keyName] = entry.join(':');
    }
  }
  return result;
};

/**
 * 로그함수
 * @param {*} value
 */
// NOTE: 로그레벨에 대한 정의 필요
const logLevel = 0;
export const log = (...value) => {
  if (logLevel === 0) {
    console.log(...value);
  } else if (logLevel === 1) {
    return null;
  }
};

// NOTE: not used
// export function rmmbrace(value){
//   // var regExp = /[\{\}']+/g;
//   return value.replace(/[\{\}']+/g,'')
// }

/**
 * NOTE: 케이스 아이디를 만들어주는 포맷 함수
 * @param {object} config
 */
export const makeCaseID = config => {
  const { date = '', company = '', patient = '', numbering = '' } = config;
  return `${date}${company}${patient}${numbering}`;
};

/**
 * NOTE: 특정 문자를 카멜케이스로 치환해서 반환해줍니다.
 * @param {*} config
 */
export function replaceCamelCase(config) {
  // eslint-disable-next-line no-unused-vars
  const { str, replace = '-' } = config;
  // const regConvert = new RegExp(`/${replace}([a-z])/g`);
  return str.replace(/[:-]([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

/**
 * NOTE: 리얼돔 엘리먼트의 구조를 오브젝트 구초제로 변환해주는 함수입니다.
 * @param {object} item element node
 */
export function getElementAttrToObject(item) {
  const { text } = item;
  const new_obj = Array.from(item.attributes).reduce((x, y) => {
    const replaceStr = reactAttrconvert(y.name);
    x[replaceStr] = y.value;
    if (text && text.trim().length > 0) x.text = text;
    return x;
  }, {});
  new_obj.element = item.nodeName;
  if (item.nodeName === 'text') {
    new_obj.text = item.textContent;
  }
  if (item.children.length > 0) {
    new_obj.children = Array.from(item.children, getElementAttrToObject);
  }
  return new_obj;
}

/**
 * 첫번째 인자를 기준으로 두번재 인자로 들어온 속성을 가진 부모를 재귀적으로 부모엘리먼트를 찾아 올라가는 함수입니다.
 * @param {*} elm
 * @param {*} attributes
 */
/**
 * //FIXME: class2개일때 1개만 만족해도 처리하는 기능 추가.
 * findParent(ccc, {title:'hello',class:'abc'})
 * 첫번째인자로 타겟을 찍고 두번째인자로 찾을 요소가 포함되어있는지 쓰면 된다. 그럼 재귀로 부모를 쭉 타고 올라가서 모두 만족하면 해당 부모 elm을 아니면 null을 반환한다
 */

export function findParent(elm, attributes) {
  const resArr = [];
  const tmp = elm;
  if (attributes && typeof attributes !== 'string') {
    for (let attr in attributes) {
      elm = tmp;
      if (attributes.hasOwnProperty(attr)) {
        if (elm.getAttribute(attr) === attributes[attr]) {
          resArr.push(elm);
        } else {
          while ((elm = elm.parentElement)) {
            const getClass = elm.getAttribute(attr);
            const classListArr = getClass ? getClass.split(' ') : null;
            if (classListArr && classListArr.length >= 2) {
              if (inMap(classListArr, attributes[attr])) break;
            } else if (elm.getAttribute(attr) === attributes[attr]) {
              resArr.push(elm);
              break;
            }
          }
        }
      }
    }
  } else if (typeof attributes === 'string') {
    if (elm.getAttribute(attributes)) {
      resArr.push(elm);
    } else {
      while ((elm = elm.parentElement)) {
        if (elm.getAttribute(attributes)) {
          resArr.push(elm);
          break;
        }
      }
    }
  }

  function inMap(arr, attr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === attr) {
        resArr.push(elm);
        return true;
      }
    }
    return false;
  }
  if (typeof attributes === 'string') return resArr[0];
  return resArr.every(x => x === resArr[0]) && resArr.length === Object.keys(attributes).length
    ? resArr[0]
    : null;
}

/**
 * NOTE: Element Parent를 찾는 class 입니다.
 * const findElement = new FindElment(); // 조건 일부만 맞아도됨
 * const findElement = new FindElment(true); // 넣은 조건 전부 맞아야함
 * findElement.findParent(target, null,'g) // 첫번째는 클릭한 타겟, 두번째는 조건, 세번째는 태그네임
 * findElement.findParent(target, {class:"test"})
 */
export class FindElment {
  constructor(accurate) {
    this.accurate = accurate;
  }

  findParent(target, attr, nodeName) {
    let tmpAttrArray = [];
    for (let key in attr) {
      tmpAttrArray.push(`${key}-${attr[key]}`);
    }
    this.findAttrArray = tmpAttrArray;
    return this.run(target, attr, nodeName?.toUpperCase());
  }
  run(target, attr, nodeName) {
    const isAccurate = this.accurate;
    const findType = isAccurate ? 'every' : 'some';
    const parent = target.parentNode;
    // console.log('parent', parent);
    let targetAttrArray = Array.from(target.attributes).map(item => `${item.name}-${item.value}`);
    const hasAttr = this.findAttrArray[findType](item => targetAttrArray.indexOf(item) !== -1);
    // console.log('target.attributes', target.attributes);
    // console.log('targetAttrArray', targetAttrArray);
    // console.log('this.findAttrArray', this.findAttrArray);

    if (attr === null || attr === undefined) {
      if (nodeName) {
        if (target.nodeName?.toUpperCase() === nodeName) return target;
      } else {
        return parent;
      }
    }
    if (hasAttr) return target;
    if (target.nodeName?.toUpperCase() === 'BODY') return null;
    return this.run(parent, attr, nodeName);
  }
}

/**
 * NOTE: 오브젝트의 키들을 카멜케이스로 바꿔줍니다.
 */
export function convertObjectKeyToCamelCase(o) {
  let newO;
  let origKey;
  let newKey;
  let value;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === 'object') {
        value = convertObjectKeyToCamelCase(value);
      }
      return value;
    });
  }
  newO = {};
  for (origKey in o) {
    if (o.hasOwnProperty(origKey)) {
      newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
      value = o[origKey];
      if (value instanceof Array || (value !== null && value.constructor === Object)) {
        value = convertObjectKeyToCamelCase(value);
      }
      newO[newKey] = value;
    }
  }

  return newO;
}

/**
 * NOTE: 스트링 "true"나 true 로 들어온 값을 불리언으로 변환해 비교해줍니다.
 * @param {boolean, string} string
 */
export function stringBoolean(string) {
  let value = null;
  if (typeof string === 'string') {
    value = string.toLowerCase().trim();
  } else {
    value = string;
  }
  switch (value) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(string);
  }
}

/**
 * NOTE: target object에 ref.current를 넣으면 해당 스크롤을 바닥으로 유직할 수 있습니다.
 * @param {*} target
 */
export function scrollToBottom(target) {
  const { scrollHeight } = target;
  const height = target.clientHeight;
  const maxScrollTop = scrollHeight - height;
  target.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}

/**
 * 함수 2개를 merge해주는데 두번째인자에 있는 배열의 개수들로 overwrite해준다
 * overwriteArrayToArray(selectedOverwriteList,multiSelectedList,['number']);
 * @param {*} arr1
 * @param {*} arr2
 * @param {*} condi
 */
export function mergeArray(arr1, arr2, condi) {
  let newCloneList = _.cloneDeep(arr1);
  _.forEach(arr2, item => {
    const findObj = _.find(newCloneList, in_item => +in_item[condi] === item[condi]);
    if (findObj) {
      newCloneList = _.filter(newCloneList, d_item => +d_item[condi] !== +findObj[condi]).concat(
        item,
      );
    } else {
      newCloneList.push(item);
    }
  });
  return newCloneList;
}

/**
 * NOTE: scroll이 Bottom에 왔을때 callback이 동작합니다.
 * @param {*} config
 */
export function scrollBottom(config) {
  const { target, callback } = config;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
    callback();
  }
}

/**
 * NOTE: object의 키값중에 string 인 number를 number 타입으로 교체
 * @param {*} propsObj
 */
export function convertStringValueToNumberInObject(propsObj) {
  const newObj = _.reduce(
    propsObj,
    (obj, value, keyName) => {
      obj[keyName] = typeof value !== 'number' ? value : _.parseInt(value);
      // obj[keyName] = _.isNaN(_.parseInt(value)) ? value : _.parseInt(value);
      return obj;
    },
    {},
  );
  return newObj;
}
/**
 * NOTE: object의 형태를 url query형태로 바꿔줌
 * @param {*} query
 */
export function convertObjectToQueryString(query = {}) {
  const newObj = convertStringValueToNumberInObject(query);
  const isEmpty = val => _.isNull(val) || _.isUndefined(val);
  return _.map(newObj, (item, val) => !isEmpty(val) && !isEmpty(item) && `${val}=${item}`).join(
    '&',
  );
}

/**
 * NOTE: url중에 query부분 제거
 * @param {*} locationPathName
 */
export function removeQueryFromUrl(locationPathName) {
  return locationPathName.split('?')[0];
}

/**
 * functional identity
 * @param {*} item
 */
export const identity = item => item;

/**
 * moment를 이용한 timer
 * @param {*} config
 * const timerStartData = {
 *  time: '05:00',
 *  interval: 1000,
 *  format: 'mm:ss',
 *  callback(val) {},
 * }
 */
function timerCapsule() {
  function timer(config) {
    const {
      time = '00:00',
      interval = 0,
      format = 'mm:ss',
      callback = () => {},
      end = () => {},
    } = config;

    let setTimeStamp = moment(time, format).valueOf();

    if (timer.prototype.setTimer) {
      // console.log('clear');
      clearInterval(timer.prototype.setTimer);
    }

    timer.prototype.setTimer = setInterval(() => {
      let setTimeFormat = moment(setTimeStamp).format(format);
      let isEnd = setTimeFormat
        .split(':')
        .map(Number)
        .every(i => i === 0);

      if (isEnd) {
        clearInterval(timer.prototype.setTimer);
      }

      setTimeStamp = setTimeStamp - interval;

      callback(setTimeFormat);
    }, interval);

    end(timer.prototype.setTimer);
  }

  timer.prototype.setTimer = null;
  return timer;
}
export const timer = timerCapsule();

/**
 * NOTE: 스트링 형태를 2번째 인자의 object 닷노테이션으로 트리탐색합니다
 * @param {*} str
 * @param {*} object
 */
export function parseStringToDotNotation(str, object) {
  return str.split('.').reduce((a, c) => a[c], object);
}

/**
 * NOTE: 배열 소팅 함수
 * @param {*} list
 * @param {*} ascending
 */
export function sortArray(config) {
  const { list = [], ascend = 1, match = null } = config;
  const notation = parseStringToDotNotation;
  return [...list].sort((x, y) => {
    const prev = !!match ? notation(match, x) : x;
    const next = !!match ? notation(match, y) : y;
    const type = typeof prev;
    // ascend 1 :오름차순
    // ascend 0 :내림차순
    if (type === 'string') {
      if (ascend === 1) {
        return prev < next ? -1 : prev > next ? 1 : 0;
      } else {
        return prev > next ? -1 : prev < next ? 1 : 0;
      }
    } else if (type === 'number') {
      if (ascend === 1) {
        return prev - next;
      } else {
        return next - prev;
      }
    } else if (type === 'boolean') {
      if (ascend === 1) {
        return Number(prev) - Number(next);
      } else {
        return Number(next) - Number(prev);
      }
    }
    return [];
  });
}

/**
 * NOTE: val의 값이 0일떄 0을 반환합니다.
 * NOTE: val이 ""일떄 ""을 반환합니다.
 * 기본값으로 왠만하면 null을 쓸것
 * @param {*} val
 * @param {*} replace
 */
export function parseValue(val, replace = null) {
  if (val === undefined || val === null) return replace;
  if (val === '') return val;
  if (!isNaN(+val)) return +val;
  return val ? val : replace;
}

/**
 * NOTE: string 날짜 형식을 moment 객체로 변환해줍니다.
 * // group핑하고 text 태그만 찾으면 댐,
  // groupObj but, realDOM
  const convertFormat = {
    elements: Array.from(svgRef.current.querySelectorAll('tspan')),
  };
  convertToothElementToObjectList(convertFormat);
 * @param {*} string
 */
export function unixStringToMoment(string) {
  const firstUnix = moment(string).unix();
  if (firstUnix) {
    return moment.unix(firstUnix);
  }
  return null;
}

// DEBUG: realDOM 건드리는 부분임, teeth의 number를 가지고 g태그인 data-tooth-id 를 찾음
// DEBUG: 가상돔으로 추가 수정 필요
/**
 * NOTE: teeth를 색상 입힐때사용하는 함수입니다.
 * @param {*} config
 */
function settingTeethElementFn(config) {
  // eslint-disable-next-line no-unused-vars
  const { findTag, findAttr, changeId } = config;
  return function (conf) {
    const { teeth = [], list = [] } = conf;
    // console.log('teeth', teeth);
    // console.log('list', list);
    const hasTeethIndexList = teeth.map(item => Number(item.number));
    // console.log('hasTeethIndexList', hasTeethIndexList);
    // eslint-disable-next-line array-callback-return
    list.map(item => {
      const number = Number(item.number);
      // console.log('number', number);
      // const findGtag = Array.from(
      //   document.querySelectorAll(`${findTag}[${findAttr}${item.number}"]`),
      // )[0];
      const findGtag = item.groupElement;
      if (!findGtag) return null;
      const findFillPath = findGtag.querySelector('path[fill^="url"]');
      const getOriginAttrFill = findGtag.getAttribute('data-origin-url');
      // NOTE: path url swap 부분
      // NOTE: 데이터가 있을때
      if (hasTeethIndexList.includes(number)) {
        const findItemInfo = teeth.find(inItem => Number(inItem.number) === number);
        const setChangeId = `${changeId}${findItemInfo?.indicationIdx}`;
        findFillPath.setAttribute('fill', `url(#${setChangeId})`);
        findGtag.classList.add('hasData');
      } else {
        // NOTE: 데이터가 없을때
        findFillPath.setAttribute('fill', getOriginAttrFill);
        findGtag.classList.remove('hasData');
      }
    });
  };
}
/**
 *
 */
export const setTeethElement = settingTeethElementFn({
  findTag: 'g',
  findAttr: 'data-tooth-id="data-group-',
  changeId: 'swap-linear-',
});

/**
 * NOTE: 처음 teeth의 이름을 붙혀줍니다.
 * group핑하고 text 태그만 찾으면 댐, groupObj but, realDOM
  const setTeethFormat = {
    list: mergeTeethList,
    defaultValue: propsTeeth,
  };
  setBasicTeeth(setTeethFormat);
  처음에 class를 넣어주고 세팅해주는 함수. 재각각인 넘버링을 줄세워줍니다.
 * @param {*} config 
 */
export function setBasicTeeth(config) {
  const { list = [], defaultValue = [] } = config;
  // g 태그를 찾고, attr을 붙혀줌
  list.map((item, idx) => {
    const defaultIndex = NOTATION_CONFIG.fdi.list[idx];
    const findGtag = item.groupElement;

    if (findGtag) {
      const findFillPath = findGtag.querySelector('path[fill^="url"]');
      const getOriginAttrFill = findGtag.getAttribute('data-origin-url');
      const getAttiFill = findFillPath.getAttribute('fill');
      if (!getOriginAttrFill) {
        findGtag.setAttribute('data-origin-url', getAttiFill);
      }
      findGtag.setAttribute('data-name', 'tooth-g');
      findGtag.setAttribute('data-tooth-id', `data-group-${defaultIndex}`);
      findGtag.setAttribute('data-tooth-index', idx);
      findGtag.setAttribute('class', 'teethSvg__tooth');
    }
  });

  const setTeethFormat = { list, teeth: defaultValue };
  setTeethElement(setTeethFormat);

  return list;
}

/**
 * NOTE: 처음 tooth rendering 될떄 element 찾아서 넘버링순서 4분면으로 정렬
 * const convertFormat = {
     elements: Array.from(svgRef.current.querySelectorAll('tspan')),
  };
  convertToothElementToObjectList(convertFormat);
 * @param {*} config
 */
export function setMergeSortTeethElement(config) {
  const { elements = [] } = config;
  const findElement = new FindElment();
  const newMap = elements.map(item => {
    item.setAttribute('class', 'teethSvg__text');
    return {
      element: item,
      number: Number(item.textContent),
    };
  });
  // NOTE: 배열을 순회하면서 치아를 4분면으로 나눠 배열로 소팅함
  const sortNewMap = newMap
    .sort((a, b) => a.number - b.number)
    // eslint-disable-next-line array-callback-return
    .sort((prev, next) => {
      const a = prev.number;
      const b = next.number;
      switch (Math.floor(b / 10)) {
        case 1:
          return -19 + a;
        case 2:
          return -21 + b;
        case 3:
          return -39 + a;
        case 4:
          return -41 + b;
        default:
          return null;
      }
    })
    .reduce(
      (acc, curr, idx) => {
        curr.index = idx;
        const findGtag = findElement.findParent(curr.element, null, 'g');
        curr.groupElement = findGtag;
        acc[Math.floor(idx / 8)].push(curr);
        return acc;
      },
      [[], [], [], []],
    );

  const mergeNewMap = sortNewMap.reduce((acc, i) => acc.concat(i), []);
  return mergeNewMap;
}

/**
 * NOTE: bridge의 색상을 칠하고 빼고 하는 함수입니다.
 * @param {*} config
 */
export function setBridgeElement(config) {
  let { element, bridge = [], teethIndexList = [] } = config;
  // console.log(element, 'element');

  bridge = bridge.map(String);
  // console.log(bridge, 'bridgebridgebridge, !!!');

  // const findBridgePath = element.querySelectorAll(`g > path[d^=M${item}][d$="11z"]`)[0];
  const findBridgePath = element.querySelectorAll(`g[data-role="bridge"] > path`);
  // console.log(findBridgePath, 'findBridgePath');
  Array.from(findBridgePath).map((item, idx) => {
    const bridgeNubmer = BRIDGE_NUMBERING[idx];
    const isPosibleClickBridge = bridgeNubmer
      .split(/(\d{2})(?=\d)/)
      .slice(1)
      .map(Number)
      .every(item => teethIndexList.indexOf(item) !== -1);
    const hasBridge = bridge.indexOf(bridgeNubmer) !== -1;
    if (hasBridge) {
      item.classList.add('bridge-active');
      item.classList.remove('hidden');
      item.removeAttribute('hidden');
    } else {
      item.classList.remove('bridge-active');
    }
    if (isPosibleClickBridge) {
      item.classList.remove('bridge-disabled');
    } else {
      item.classList.add('bridge-disabled');
      item.classList.remove('bridge-active');
    }
  });
}

/**
 * NOTE: 처음에 bridge의 클래스와 세팅을 해주는 함수입니다.
 * @param {*} config
 */
export function setBasicBridge(config = {}) {
  const { element, defaultValue = [], isEdit = null, teethIndexList = [] } = config;
  let bridgeList = [];
  const findBridgePath = element.querySelectorAll(`g[data-role="bridge"] > path`);
  // console.log(findBridgePath, 'findBridgePath');

  Array.from(findBridgePath).map((item, idx) => {
    // console.log(item, 'item');
    const bridgeNubmer = BRIDGE_NUMBERING[idx];
    const hasBridge = defaultValue.indexOf(bridgeNubmer) !== -1;

    item.setAttribute('class', 'teethSvg__brdige bridge-disabled');
    item.setAttribute('data-bridge-id', `data-bridge-${BRIDGE_NUMBERING[idx]}`);
    item.setAttribute('data-bridge-index', idx);
    item.setAttribute('data-name', 'tooth-bridge');

    if (!isEdit) {
      item.classList.add('view');
      if (!hasBridge) {
        item.classList.add('hidden');
        item.setAttribute('hidden', 'true');
      } else {
        item.classList.remove('hidden');
        item.removeAttribute('hidden');
      }
    }

    bridgeList.push({
      element: item,
      number: Number(item.getAttribute('data-bridge-id').replace(/\D/g, '')),
      index: idx,
    });
  });

  const setBrdigeFormat = {
    element,
    bridge: defaultValue,
    teethIndexList: teethIndexList,
  };
  setBridgeElement(setBrdigeFormat);

  return bridgeList;
}

/**
 * NOTE: list에 값이 있으면 제거해서 반환하고 없으면 추가하여 반환합니다.
 * @param {*} list array
 * @param {*} value string, number
 */
export function toggleArrayOverLab(list, value) {
  // console.log(list, 'list');
  // console.log(value, 'value');
  const _array = new Set(list);
  _array.has(Number(value)) ? _array.delete(Number(value)) : _array.add(Number(value));
  // console.log([..._array], '[..._array]');
  return [..._array];
}

/**
 * NOTE: 객체로 담긴 배열이 있을때, 두번째 인자로 들어온 값이 있으면 삭제하고 끝에 value로 붙입니다.
 * condition으로 비교할 키값을 string 으로 넣어주면 됩니다.
 * @param {*} list array
 * @param {*} value object or list
 * @param {*} condition string
 */
export function overlappingArrayElements(config) {
  const { list = [], value, condition = '' } = config;
  if (value === null || value === undefined) {
    console.log('function overlappingArrayElements => has not value');
    return list;
  }
  let _filterArray = [];
  if (Array.isArray(value)) {
    const condiList = value.map(item => item[condition]);
    const newFilterList = list
      .filter(item => condiList.indexOf(item[condition]) === -1)
      .concat(...value);
    _filterArray = newFilterList;
  } else {
    _filterArray = new Set([...list].filter(x => x[condition] !== value[condition]).concat(value));
  }

  return _.orderBy([..._filterArray], 'number');
}

/**
 * NOTE: indicationIdx로 Indication group과 item을 찾아주는 함수
 * @param {*} config
 */
export function findIndicationConfig(config) {
  const { indication, material } = config;
  return function (index) {
    const getItem = _.reduce(
      indication,
      (acc, group) => {
        const findItem = _.find(group.list, item => item.id === index);
        if (findItem) {
          acc.group = group;
          acc.indication = findItem;
          return acc;
        }
        return acc;
      },
      {
        group: null,
        indication: null,
      },
    );
    return getItem;
  };
}

/**
 * NOTE: 매개변수로 들어온 값이 10 이하일때 0을 붙혀줍니다.
 * @param {*} num
 */
export const withZeroNum = num => (Number(num) < 10 ? `0${num}` : num);

export const makeCaseIdFn = config => bool => {
  // console.log(config, 'config!!!??? make case id');
  const { companyName = '', caseCount = 0, patientCode = '', caseIdValue = '' } = config;
  const patientName = caseIdValue ? String(caseIdValue).substr(0, 5) + '-' : '';
  const subNickName = bool ? patientName : patientCode + '-';
  // console.log('patientName', patientName);
  // console.log('patientCode', patientCode);
  // console.log('companyName', companyName);
  // console.log('subNickName', subNickName);

  const makeCaseId = `${moment().format('YYYYMMDD')}-${companyName}-${subNickName}${fixedNumbering(
    caseCount,
    4,
  )}`;
  return makeCaseId;
};

/**
 * NOTE: type을 체크하는 class
 */
export class TypeChecker {
  #types = [
    'Arguments',
    'Function',
    'String',
    'Number',
    'Date',
    'RegExp',
    'Error',
    'Symbol',
    'Map',
    'WeakMap',
    'Set',
    'WeakSet',
  ]; // private
  constructor() {
    const _self = this;
    // set fnMap setting
    _self.fnMap = _self.#types.map(item => ({
      name: item,
      boot: obj => _self._tagTester(item)(obj),
    }));
    // set boot method
    _self.#types.forEach(item => (_self[`is${item}`] = obj => _self._tagTester(item)(obj)));
  }

  _tagTester(name) {
    return obj => toString.call(obj) === '[object ' + name + ']';
  }
  isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  isNull(obj) {
    return obj === null;
  }
  isObject(obj) {
    let type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }
  isArray(obj) {
    return Array.isArray(obj);
  }
  isUndefined(obj) {
    return obj === void 0;
  }
  isNaN(obj) {
    return this.isNumber(obj) && isNaN(obj);
  }
}

/**
 * NOTE: 데이터의 Validation를 체크하는 class
 * const validation = new Validation();

const interface = {
  title: 'string',
  name: null,
  bool: 'boolean',
  unun: undefined,
};
const objectobject = {
  title: 'hello',
  name: 'w',
  bool: 'boolean',
  unun: undefined,
};
const objectList = [
  {
    title: 'hello',
    name: {},
    bool: true,
    unun: '',
  },
  {
    title: 'hello',
    name: undefined,
    bool: true,
    unun: undefined,
  },
];
console.log(validation.isObjectToObject(objectobject, interface));;
console.log('result = > ', validation.isObjectInArray(objectList, interface));
console.log(validation.isNaN(NaN));
console.log(validation.isNumber(10), 'isNumber');
 */
export class Validation extends TypeChecker {
  constructor(props) {
    super(props);
  }

  error = key => {
    try {
      throw new Error(`Error ${key}`);
    } catch (e) {
      console.error(e, key);
    }
  };
  validation(value, compare) {
    const _self = this;
    const type = typeof value;

    const checkType = {
      string: val => _self.isString(val),
      object: val => {
        if (compare === 'object') return _self.isObject(val);
        if (_self.isNull(compare)) return _self.isNull(val);
      },
      boolean: val => _self.isBoolean(val),
      number: val => _self.isNumber(val),
      undefined: val => _self.isUndefined(val),
      null: val => _self.isNull(val),
    };
    const getTypeController = checkType[compare];
    if (getTypeController) {
      return getTypeController(value);
    } else {
      this.error('Non types');
    }
  }
  log(value, getInterValue) {
    const _self = this;
    console.log(
      'value=>',
      value,
      // 'value type=>',
      // typeof value,
      `interface=>`,
      getInterValue,
      `result : `,
      _self.validation(value, getInterValue),
    );
  }
  // array, interface, log
  ruleObjectInArray(list, rules, isLog) {
    const _self = this;
    if (list.length === 0) return this.error(`length `);
    return list.every(item => {
      if (!_self.ruleObject(item, rules)) return false;
      return true;
    });
  }
  // object to object compare
  ruleObject(item, rules, isLog) {
    const _self = this;
    const itemEntries = Object.entries(item);
    if (itemEntries.length === 0) return this.error(`length`);
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        const [value, getRulesValue] = [item[key], rules[key]];
        const [ruleskeys, objKeys] = [Object.keys(rules), Object.keys(item)];
        if (ruleskeys.indexOf(key) === -1) return this.error(key);
        if (ruleskeys.length !== objKeys.length) return this.error(`length ${key}`);
        // inter to object valie
        if (isLog) _self.log(value, getRulesValue);
        if (!_self.validation(value, getRulesValue)) {
          return false;
        }
      }
    }
    return true;
  }
}

/**
 * NOTE: Url변경을 위한 object
 */
export const convertUrl = {
  projectDetailLoad: ({ caseCode = '' }) =>
    `${pageUrl.project.detail}?caseCode=${caseCode}&status=load`,
  projectDetailModify: ({ caseCode }) =>
    `${pageUrl.project.detail}?caseCode=${caseCode}&status=modify`,
  projectList: () => pageUrl.project.list,
  partnerList: ({ name = '' }) => `${pageUrl.mypage.partners}?name=${name}&page=1`,
};

// export const makeCaseIdFn = config => {
//   const { companyName, caseCount, patientCode, caseIdPatient } = config;
//   console.log(config, 'config!!!??? make case id');
//   // const subNickName = bool ? caseIdPatient.substr(0, 5) + '' : `-${patientCode}-`;

//   const subNickName = caseIdPatient?.substr(0, 5);
//   // '' : `-${patientCode}-`
//   const makeCaseId = `${moment().format('YYYYMMDD')}${companyName}${subNickName}${fixedNumbering(
//     caseCount,
//     4,
//   )}`;
//   console.log(caseIdPatient, 'caseIdPatient');

//   console.log(makeCaseId, 'makeCaseId');
//   return makeCaseId;
// };

/**
 * NOTE: Element의 텍스트 포함 여부 체크 함수
 * @param {object} node element node
 * @param {string} text
 */
export const contains = (node, text) => {
  return node?.nodeType && node.textContent.indexOf(text) !== -1;
};

/**
 * NOTE: 기간
 * @param {type} string     기간유형 설정(년, 월, 일)
 * @param {duration} number 기간 설정
 * @param {format} string   fotmat 설정(https://momentjs.com/docs/#/parsing/string-format/ 참고)
 * @param {custom} Boolean  리턴값에 대한 스타일 커스텀 여부
 */
export function periodConverter(
  type = 'months',
  duration = 12,
  format = 'YY/MM/DD',
  custom = false,
) {
  const durationTypeConfig = {
    years: 'y',
    months: 'M',
    days: 'd',
  };
  const startPeriod = moment().format(format);
  const endPeriod = moment()
    .add(duration, durationTypeConfig[type])
    .subtract(1, 'd')
    .format(format);

  const period = `${startPeriod} ~ ${endPeriod}`;
  if (!custom) return period;
  if (custom) {
    return {
      startPeriod,
      endPeriod,
    };
  }
}

// NOTE: interval로 들어올 콜백을 즉시 한번 실행시켜준 다음 인터벌딜레이로 넣어줍니다.
export function setImmediateInterval(callback, delay) {
  // const interval = setInterval;
  callback();
  return setInterval(callback, delay);
}

/**
 * To get a page of 1 depth
 * @param {string} str
 */
export function cutUrl(str, depth = 0) {
  return str.substr(1).split('/')[depth];
}

export function px2number(str) {
  const re = /px/gi;
  return String(str).includes('px') ? str.replace(re, '') : str;
}

// chart data converter
// 1주: 1W, 1달: 1M, 1년: 1Y, 10년: 10Y
export function projectChartItemConverter({ items = [], duration = '1W' }) {
  // duration parsing
  let durationStr = '';
  if (duration === '1W') durationStr = 'W1';
  if (duration === '1M') durationStr = 'M1';
  if (duration === '1Y') durationStr = 'Y1';
  if (duration === '10Y') durationStr = 'Y10';

  // parsing된 durationStr 를 매핑하여 data length와 x의 format얻기
  const durationConfig = {
    W1: {
      sliceNum: 5,
      length: moment().diff(moment().subtract(7, 'd'), 'd'),
      format(i) {
        return moment().subtract(i, 'd').format('YYYY-MM-DD');
      },
    },
    M1: {
      sliceNum: 5,
      length: moment().diff(moment().subtract(1, 'M'), 'd'),
      format(i) {
        return moment().subtract(i, 'd').format('YYYY-MM-DD');
      },
    },
    Y1: {
      sliceNum: 2,
      length: moment().diff(moment().subtract(12, 'M'), 'M'),
      format(i) {
        return moment().subtract(i, 'M').format('YYYY-MM');
      },
    },
    Y10: {
      sliceNum: 0,
      length: moment().diff(moment().subtract(10, 'y'), 'y'),
      format(i) {
        return moment().subtract(i, 'y').format('YYYY');
      },
    },
  };

  const data = [...Array(durationConfig[durationStr].length).keys()].map(i => {
    const x = durationConfig[durationStr].format(i);
    const y = items.filter(item => item.groupDate === x)[0]?.totalCount || 0;
    // console.log('x', x);
    // console.log('y', y);
    return {
      x: x.slice(durationConfig[durationStr].sliceNum),
      y,
    };
  });

  return _.orderBy(data, 'x', 'asc');
}

function sameNum(randomArray, n) {
  for (let j = 0; j < randomArray.length; j++) {
    if (n === randomArray[j]) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {number} length
 * @returns
 */
export function randomNumberArray(length) {
  let randomArray = [];
  let i = 0;
  while (i < length) {
    let n = Math.floor(Math.random() * length);
    if (!sameNum(randomArray, n)) {
      // console.log('n', n);
      randomArray.push(n);

      i++;
    }
  }

  return randomArray;
}

/**
 *
 * @param {array} array
 * @returns
 */
export function shuffleArray(array) {
  let returnArray = [];
  let randomArray = [];
  let i = 0;
  while (i < array.length) {
    let n = Math.floor(Math.random() * array.length);
    if (!sameNum(randomArray, n)) {
      // console.log('n', n);
      randomArray.push(n);
      returnArray[i] = array[n];

      i++;
    }
  }

  return returnArray;
}

/**
 * 키보드 입력
 */
// export const bindKeyboard = ({ key, type }) => {
//   const [value, setValue] = useState(new Set());
//   // console.log(value, 'value');

//   if (type === 'keyup') {
//     if (value.has(key.toUpperCase())) {
//       setValue(draft => {
//         draft.delete(key.toUpperCase());
//       });
//     }
//   }

//   if (type === 'keydown') {
//     if (!value.has(key.toUpperCase())) {
//       // value.add(key.toUpperCase());
//       setValue(draft => {
//         draft.add(key.toUpperCase());
//       });
//     }
//   }

//   return value;
// };

// 입력글자 byte 구하기
//참고: https://velog.io/@shin-jaeheon/ES6%EB%A1%9C-%EB%AC%B8%EC%9E%90%EC%97%B4%EC%9D%98-%EB%B0%94%EC%9D%B4%ED%8A%B8Byte-%EC%88%98-%EA%B5%AC%ED%95%98%EA%B8%B0
export const getStringByte = str => {
  return str
    .split('')
    .map(s => s.charCodeAt(0))
    .reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0);
};
