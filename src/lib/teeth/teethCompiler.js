import { FindElment } from 'lib/library';
import { NOTATION_CONFIG, BRIDGE_NUMBERING } from 'lib/teeth/teethMapper';

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
      const findFillPath = findGtag.querySelector('g[data-role="teeth"] > path');
      // const getOriginAttrFill = findGtag.getAttribute('data-origin-url');
      // NOTE: path url swap 부분
      // NOTE: 데이터가 있을때
      if (hasTeethIndexList.includes(number)) {
        const findItemInfo = teeth.find(inItem => Number(inItem.number) === number);
        const setChangeId = `${changeId}${findItemInfo?.indicationIdx}`;
        findFillPath.setAttribute('fill', `url(#${setChangeId})`);
        findGtag.classList.add('hasData');
      } else {
        // NOTE: 데이터가 없을때
        findFillPath.setAttribute('fill', 'rgba(255,255,255,.1)');
        // findFillPath.setAttribute('stroke', '#000');
        // findFillPath.setAttribute('stroke-width', '1px');
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
      const findFillPath = findGtag.querySelector('g[data-role="teeth"] > path');
      // const findFillPath = findGtag.querySelector('path[fill^="url"]');
      // const getOriginAttrFill = findGtag.getAttribute('data-origin-url');
      // const getAttiFill = findFillPath.getAttribute('fill');
      // if (!getOriginAttrFill) {
      //   findGtag.setAttribute('data-origin-url', getAttiFill);
      // }
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
 * @config bridge array item, teethIndexList item : String
 */
export function setBridgeElement(config) {
  let { element, bridge = [], teethIndexList = [] } = config;
  // console.log(element, 'element');

  bridge = bridge.map(String);
  // bridge = bridge.map(String);
  // console.log('bridge', bridge);
  // console.log(bridge, 'bridgebridgebridge, !!!');

  // const findBridgePath = element.querySelectorAll(`g > path[d^=M${item}][d$="11z"]`)[0];
  const findBridgePath = element.querySelectorAll(`g[data-role="bridge"] > *`);
  // console.log(findBridgePath, 'findBridgePath');
  Array.from(findBridgePath).map((item, idx) => {
    const bridgeNubmer = BRIDGE_NUMBERING[idx];
    // console.log('bridgeNubmer', bridgeNubmer);
    // console.log('bridgeNubmer.split(/(d{2})(?=d)/)', bridgeNubmer.split(/(\d{2})(?=\d)/));
    // console.log('bridgeNubmer.split(/(d{2})(?=d)/)', bridgeNubmer.split(/(\d{2})/));
    const isPosibleClickBridge = String(bridgeNubmer)
      .split(/(\d{2})(?=\d)/)
      .slice(1)
      .map(String)
      .every(item => teethIndexList.indexOf(item) !== -1);
    // console.log('teethIndexList', teethIndexList);
    // console.log('isPosibleClickBridge', isPosibleClickBridge);
    const hasBridge = bridge.indexOf(String(bridgeNubmer)) !== -1;
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
  const findBridgePath = element.querySelectorAll(`g[data-role="bridge"] > *`);
  // console.log(findBridgePath, 'findBridgePath');

  Array.from(findBridgePath).map((item, idx) => {
    // console.log(item, 'item');
    const bridgeNubmer = BRIDGE_NUMBERING[idx];
    const hasBridge = defaultValue.indexOf(bridgeNubmer) !== -1;

    item.setAttribute('class', 'teethSvg__brdige bridge-disabled');
    item.setAttribute('data-bridge-id', `data-bridge-${BRIDGE_NUMBERING[idx]}`);
    item.setAttribute('data-bridge-index', idx);
    item.setAttribute('data-name', 'tooth-bridge');

    // createPage아닐경우
    if (!isEdit) {
      item.classList.add('view');
      if (!hasBridge) {
        // NOTE: 영업팀 요청으로 hidden제거
        // item.classList.add('hidden');
        // item.setAttribute('hidden', 'true');
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
