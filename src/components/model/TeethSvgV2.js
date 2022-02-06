import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TeethSvgModelV2 from './TeethSvgModelV2';
// import TeethSvgOriginModel from './TeethSvgOriginModel';
import _ from 'lodash';
import {
  identity,
  FindElment,
  withZeroNum,
  toggleArrayOverLab,
  overlappingArrayElements,
} from 'lib/library';
import { NOTATION_CONFIG } from 'lib/teeth/teethMapper';
import {
  setMergeSortTeethElement,
  setBasicTeeth,
  setBasicBridge,
  setTeethElement,
  setBridgeElement,
} from 'lib/teeth/teethCompiler';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { color, disableDrag } from 'styles/utils';
// fake data
import { indication, indicationFormat } from './teethInformation';
import { enableMapSet } from 'immer';
import { useImmer } from 'use-immer';
import { toothInitValue } from 'lib/teeth/teethMapper';
import { AppActions, UtilActions } from 'store/actionCreators';
import { useTranslation } from 'react-i18next';
import Color from 'color';
import { teeth_v2_bg, teeth_v2_bg_thumbnail } from 'components/base/images';
enableMapSet();

// const svgConfig = {
//   xmlns: 'http://www.w3.org/2000/svg',
//   width: '100%',
//   height: '100%',
//   // xmlSpace: 'preserve',
//   // version: '1.1',
//   // viewBox: '0 0 641 1145',
//   viewBox: '0 -10 641 1145',
//   id: 'teethSvg',
// };

const svgConfig = {
  xmlns: 'http://www.w3.org/2000/svg',
  x: '0',
  y: '0',
  enableBackground: 'new 0 0 480.91 862.17',
  version: '1.1',
  viewBox: '0 0 480.91 862.17',
  xmlSpace: 'preserve',
};
const classNaming = {
  bridge: {
    default: 'teethSvg__brdige',
    disable: 'bridge-disabled',
    active: 'bridge-active',
  },
  tooth: {
    active: 'tooth-active',
  },
};
const findElement = new FindElment();

// let {
//   onClick = () => {},
//   onChange = () => {},
//   isEdit,
//   numbering = 0,
//   indication = {},
//   tooth = {},
//   copiedData = {},
// } = props;
const TeethSvgState = {
  infoToothList: [],
  infoBridgeList: [],
  // numbering: {
  //   value: null,
  //   list: [],
  // },
  keyCombine: {
    keyList: new Set(),
    ctrl: false,
    shift: false,
  },
};

function TeethSvg(props) {
  let {
    onClick = () => {},
    onChange = () => {},
    // temp
    isEdit = false,
    numbering = null,
    tooth = { value: { ...toothInitValue }, setValue: () => {} },
    // indication = {},
    teeth = { value: [], setValue: () => {} },
    bridge = { value: '', setValue: () => {} },
    teethContextActions = { value: {}, setValue: () => {} },
    indicationSeq = { value: '', setValue: () => {}, onChange: () => {} },
    copyData = { value: null, setValue: () => {} },
    // copiedData = {},
    hiddenToothText = false,
    onToggleTooth = () => {},
    onChangeToothValue = () => {},
  } = props;
  const { t } = useTranslation();
  // const { indicationFormat } = useShallowSelector(state => ({
  //   indicationFormat: state.util.indicationFormat.data?.indicationFormat,
  // }));
  // const indicationListInfo = indicationFormat?.indication || [];
  // const partList = indicationListInfo.reduce((acc, item) => acc.concat(...item.list), []);
  const { indicationInfo } = useShallowSelector(state => ({
    indicationInfo: state.util.indicationInfo.data?.indicationInfo,
  }));
  // const indicationListInfo = indicationFormat?.indication || [];
  const partList = indicationInfo?.partList || [];
  // console.log(partList, 'partList');
  const [values, setValues] = useImmer(TeethSvgState);
  const svgRef = useRef(null);

  // SECTION: init indication 없을 경우를 위해
  useEffect(() => {
    if (!indicationInfo) {
      // UtilActions.fetch_teeth_indication_format_request({ language: 'EN' });
      UtilActions.fetch_teeth_indication_info_request();
    }
  }, []);
  // const [toothList, setToothList] = useState([]);
  // const [bridgeList, setBridgeList] = useState([]);
  // console.log(indication, 'indication');
  // console.log(toothList, 'toothList');
  // console.log(bridgeList, 'bridgeList');
  // fake data
  // const teethProps = indication.teeth || [];
  // const bridgeProps = indication.bridgeList || [];
  numbering = numbering?.value || null;
  // legacy code 호환
  // const copiedData = copyData?.value;
  const teethProps = teeth?.value || [];
  const bridgeProps = bridge?.value || [];
  // nubmering.value 변경
  // numbering = numbering?.value || 0;
  // console.log(teethProps, 'teethProps');
  // console.log(bridgeProps, 'bridgeProps');
  const hasTeethIndexList = teethProps?.map(item => String(item?.number));
  //
  const selectedConf = {
    number: tooth?.value.number,
    type: 'teeth',
    list: [],
  };

  // const selectedData = tooth?.value.selectedTeethData; // DEBUG: 나중에 teethData로 수정하기
  const hasCopiedData = !!copyData?.value?.number;
  const hasSelectedData = !!tooth?.value?.hasData;
  const isSelected = !!tooth?.value.number;
  const keyCombineList = values.keyCombine.keyList;
  const hasBackspaceKey = keyCombineList.has('BACKSPACE');
  // const hasControlKey = keyCombineList.has('CONTROL');
  const hasDeleteKey = keyCombineList.has('DELETE');
  const hasShiftKey = keyCombineList.has('SHIFT');
  const hasCtrlKey = keyCombineList.has('CONTROL');
  const hasCKey = keyCombineList.has('C');
  const hasVkey = keyCombineList.has('V');
  const isCopyKeyCombine = hasCtrlKey && hasCKey;
  const isPasteKeyCombine = hasCtrlKey && hasVkey;

  // data
  // let setIndication = { teeth: [], bridge: [] };
  // const setIndication = {
  //   ...indication,
  //   bridge: indication.bridgeList,
  // };
  // const indicationListInfo = indicationFormat.indication || [];
  // const partList = indicationListInfo.reduce((acc, item) => acc.concat(...item.list), []);
  // console.log(partList, 'partList');

  // 최초 svgRef init
  // NOTE: svg bind 됬을떄 text들어있는 태그들 가져와서 재소팅 후 infoToothList 값 넣음
  useEffect(() => {
    if (!!svgRef.current) {
      // console.log('work??');
      const setBridgeFormat = {
        element: svgRef.current,
        defaultValue: bridgeProps,
        teethIndexList: hasTeethIndexList,
        isEdit,
      };
      // tooth init convert함수에서 merge해줌과 동시에 tooth setting도 해줌, 따로 분리할 필요가 있음
      const convertFormat = {
        elements: Array.from(svgRef.current.querySelectorAll('text')),
        // elements: Array.from(svgRef.current.querySelectorAll('tspan')),
      };
      // teeth init
      const setTeethFormat = {
        list: setMergeSortTeethElement(convertFormat),
        defaultValue: teethProps,
      };

      // setToothList(setBasicTeeth(setTeethFormat));
      // setBridgeList(setBasicBridge(setBridgeFormat));
      setValues(draft => {
        draft.infoToothList = setBasicTeeth(setTeethFormat);
        draft.infoBridgeList = setBasicBridge(setBridgeFormat);
      });
    }
  }, [!!svgRef.current]);

  // create, update bridge teeth
  useEffect(() => {
    // teeth
    const setTeethFormat = {
      teeth: teethProps,
      list: values.infoToothList,
    };
    setTeethElement(setTeethFormat);

    // bridge
    const setBrdigeFormat = {
      element: svgRef.current,
      bridge: bridgeProps,
      teethIndexList: hasTeethIndexList,
    };
    setBridgeElement(setBrdigeFormat);

    svgRef.current.focus();
    // }, [teethProps, bridgeProps]);
  }, [!!svgRef.current, teethProps, bridgeProps]);

  // numbering change
  useEffect(() => {
    // console.log(numbering, 'numbering');
    const numberingFormat = {
      mergeToothList: values.infoToothList,
      numbering,
    };
    setNumberingElement(numberingFormat);
  }, [values.infoToothList, numbering]);

  // selected useEffect, outline color
  useDidUpdateEffect(() => {
    // console.log(tooth, 'tooth');
    if (isEdit) {
      values.infoToothList.map(item => {
        if (item.number === tooth.value.number) {
          item.groupElement.classList.add(classNaming.tooth.active);
        } else {
          item.groupElement.classList.remove(classNaming.tooth.active);
        }
      });
    }
  }, [tooth.value]);

  // const handleKeyBoard = ({ key, type }) => {
  //   // console.log(type, 'type');
  //   if (type === 'keyup') {
  //     if (values.keyCombine.keyList.has(key.toUpperCase())) {
  //       setValues(draft => {
  //         draft.keyCombine.keyList.delete(key.toUpperCase());
  //       });
  //     }
  //   }
  //   if (type === 'keydown') {
  //     if (!values.keyCombine.keyList.has(key.toUpperCase())) {
  //       setValues(draft => {
  //         draft.keyCombine.keyList.add(key.toUpperCase());
  //       });
  //     }
  //   }
  // };

  // useEffect(() => {
  //   console.log('values.keyCombine.keyList', values.keyCombine.keyList);
  // }, [values.keyCombine.keyList]);

  // const keyDownEventFn = _.throttle(e => {
  //   if (document.activeElement.nodeName !== 'BODY') return;
  //   handleKeyBoard({ key: e.key, type: 'keydown' });
  // }, 300);
  const keyDownEventFn = e => {
    if (document.activeElement.nodeName !== 'BODY') return;
    // handleKeyBoard({ key: e.key, type: 'keydown' });
    const key = e.key;
    if (!values.keyCombine.keyList.has(key.toUpperCase())) {
      setValues(draft => {
        draft.keyCombine.keyList.add(key.toUpperCase());
      });
    }
  };
  const keyUpEventFn = e => {
    // handleKeyBoard({ key: e.key, type: 'keyup' });
    const key = e.key;
    if (values.keyCombine.keyList.has(key.toUpperCase())) {
      setValues(draft => {
        draft.keyCombine.keyList.delete(key.toUpperCase());
      });
    }
  };

  const handleClickTeethSvg = config => {
    // TEST:
    // console.log(config, 'config handleClickTeethSvg');
    // toggle용
    const hasTooth = tooth.value.number === config.tooth.number;
    // check right click
    const isRightClick = config.type === 'contextmenu';
    let selectedFormat = {
      ...config.tooth,
      number: !isRightClick && hasTooth ? null : config.tooth.number,
      hasData: config.tooth?.hasData,
      // index: hasTooth ? null : config.tooth.index,
      // hasData: config.tooth?.hasData && !hasTooth,
      // selectedTeethData: hasTooth ? null : config.tooth.selectedTeethData,
    };

    tooth.setValue(selectedFormat);
    onToggleTooth(config.tooth.number);

    // 초기화, reclick 처리
    const isReclickTooth = selectedFormat.number === null;
    if (isReclickTooth) {
      // tooth.setValue(toothInitValue);
      // console.log('config.tooth.number', config.tooth.number);
      tooth.setValue({ reNumber: config.tooth.number });
    }
  };

  const copyFailPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      title: t('MODAL_FAIL_COPY_TITLE'),
      content: t('MODAL_FAIL_COPY_CONTENT'),
      isTitleDefault: true,
      isContentDefault: true,
    });
  }, []);
  const pasteFailPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      title: t('MODAL_FAIL_PASTE_TITLE'),
      content: t('MODAL_FAIL_PASTE_CONTENT'),
      isTitleDefault: true,
      isContentDefault: true,
    });
  }, []);

  // const handleClickRight = e => {
  //   console.log('handleClickRight e.target', e.target);
  //   console.log(e.type);
  // };

  const handleClick = config => {
    const { e, type } = config;
    // console.log('handleClick', config);
    // const toothRangeTagList = ['PATH', 'TEXT', 'TSPAN'];
    // const toothRangeTagList = ['PATH', 'TEXT', 'CIRCLE'];
    // const tagName = target.tagName.toUpperCase();
    // const parentTagName = parent.tagName.toUpperCase();
    const target = e.target;
    const parentTarget = target.parentElement;
    let targetElement = target;
    let isToothClick = null;
    let isBridgeClick = null;
    const parentTargetAttrArray = Array.from(parentTarget.attributes).map(
      item => `${item.name}-${item.value}`,
    );
    const targetAttrArray = Array.from(target.attributes).map(item => `${item.name}-${item.value}`);
    const comparisonArray = [...parentTargetAttrArray, ...targetAttrArray];
    if (comparisonArray.some(item => item === 'data-name-tooth-g')) {
      targetElement = parentTarget;
      isToothClick = true;
    } else if (comparisonArray.some(item => item === 'data-name-tooth-bridge')) {
      isBridgeClick = true;
    }
    // console.log('parentTargetAttrArray', parentTargetAttrArray);
    // console.log('targetAttrArray', targetAttrArray);
    // console.log('isToothClick', isToothClick);
    // console.log('isBridgeClick', isBridgeClick);
    // return false;

    const isRightClick = e.type === 'contextmenu';

    // NOTE: bridge
    // check right click
    if (isBridgeClick && isEdit && !isRightClick) {
      // console.log('isBridgeClick');
      const getBridgeDataTooth = targetElement.getAttribute('data-bridge-id');
      const getBridgeValue = getBridgeDataTooth?.replace(/\D/g, '');
      const getBridgeIndex = targetElement.getAttribute('data-bridge-index');

      const selected = {
        id: getBridgeDataTooth,
        number: getBridgeValue,
        index: getBridgeIndex,
        element: targetElement,
      };
      // console.log('bridge.value', bridge.value);
      console.log('selected', selected);
      // onClick({ ...selected, type: 'teethSvg', name: 'bridge' });
      bridge.setValue(toggleArrayOverLab(bridge.value, selected.number));
    }
    // NOTE: tooth
    if (isToothClick) {
      const getToothDataTooth = targetElement.getAttribute('data-tooth-id');
      const getToothValue = Number(getToothDataTooth?.replace(/\D/g, ''));
      const getToothIndex = Number(targetElement.getAttribute('data-tooth-index'));
      // console.log(getToothDataTooth, 'getToothDataTooth');
      // console.log(getToothValue, 'getToothValue');
      // console.log(getToothIndex, 'getToothIndex');
      // console.log(isEdit, 'isEdit');

      if (!isEdit) {
        // onClick({ tooth: { number: getToothValue }, type: 'teethSvg', name: 'tooth' });
        handleClickTeethSvg({ tooth: { number: getToothValue } });
        return;
      }

      // check right click
      if (isRightClick) {
        console.log('normal click on mouse right');

        const currentToothData = teethProps.find(item => item.number === getToothValue);
        // console.log('currentToothData', currentToothData);

        // toggle(선택 여부)에 따른 contextMenu active변경
        // TODO: ProjectDetail에서 치아 클릭시 우측 설명 slideToggle가능여부 체크
        teethContextActions.setValue(draft => {
          draft.paste.active = copyData.value?.hasData;
          // console.log('copyData.value?.hasData', copyData.value?.hasData);

          if (currentToothData) {
            draft.copy.active = true;
            draft.delete.active = true;
          } else {
            draft.copy.active = false;
            draft.delete.active = false;
          }
        });

        // tooth click, focus
        handleClickTeethSvg({
          tooth: { ...currentToothData, number: getToothValue, hasData: !!currentToothData },
          type: e.type,
        });

        return;
      }

      if (hasShiftKey) {
        console.log('shift 누르고 치아 클릭');
        // const currentCopyData = hasCopiedData ? copyData.value : tooth.value;
        // const currentCopyData = copyData.value;
        const currentCopyData = tooth.value;
        // console.log(currentCopyData, 'currentCopyData');
        // console.log(currentCopyData?.number, 'currentCopyData.number');
        // console.log(!currentCopyData?.hasData, '!currentCopyData?.hasData');
        // console.log(getToothIndex, 'getToothIndex');
        // if (!currentCopyData?.number || !tooth.value.number || getToothIndex === null)
        //   return console.log('선택된(시작 치아) 또는 카피된 치아 없음');
        // if (!currentCopyData?.hasData) {
        //   pasteFailPopup();
        //   return console.log('카피된 데이터 없음');
        // }
        // console.log('shift 누르고 동작하면댐');
        if (tooth.value.number === getToothValue)
          return console.log('shift 누르고 같은 치아 클릭 ');

        if (!currentCopyData?.number || !currentCopyData?.hasData) {
          setValues(draft => {
            draft.keyCombine.keyList = new Set([]);
          });
          // if (!currentCopyData?.number) {
          //   copyFailPopup();
          //   return console.log('선택된 또는 카피된 치아 없음');
          // }
          if (!currentCopyData?.hasData || !currentCopyData?.number) {
            pasteFailPopup();
            return console.log('카피된 데이터 없음');
          }
        }

        // 잡은 치아 기준으로 셀렉트
        let multiSelectedList = [];
        let errorType;
        const startNumber = NOTATION_CONFIG.fdi.list.indexOf(+tooth.value.number);
        const endNumber = +getToothIndex;
        const dirention = endNumber - startNumber > 0 ? 'front' : 'back';

        let toothRange = '';
        // 상악 범위  0~15, 하악 범위16 ~31
        if (startNumber <= 15 && endNumber > 15) {
          errorType = 'errorTopTeethRange'; // return console.log('현재 치아에서는 상악 범위내에서만 선택 가능');
          toothRange = t('GLOBAL_MAXILLA');
          AppActions.add_popup({
            isOpen: true,
            title: t('MODAL_FAIL_TOOTH_RANGE_COPY_TITLE', { toothRange }),
            content: t('MODAL_FAIL_TOOTH_RANGE_COPY_CONTENT', { toothRange }),
            isTitleDefault: true,
            isContentDefault: true,
          });
          return;
        } else if (startNumber >= 16 && endNumber < 16) {
          errorType = 'errorBottomTeethRange'; // return console.log('현재 치아에서는 하악 범위내에서만 선택 가능');
          toothRange = t('GLOBAL_MANDIBLE');
          AppActions.add_popup({
            isOpen: true,
            title: t('MODAL_FAIL_TOOTH_RANGE_COPY_TITLE', { toothRange }),
            content: t('MODAL_FAIL_TOOTH_RANGE_COPY_CONTENT', { toothRange }),
            isTitleDefault: true,
            isContentDefault: true,
          });
          return;
        } else {
          if (dirention === 'front') {
            for (let i = startNumber; i <= endNumber; i++) {
              multiSelectedList.push({
                ...currentCopyData,
                number: NOTATION_CONFIG.fdi.list[i],
                type: 'tooth',
              });
            }
          } else if (dirention === 'back') {
            for (let i = startNumber; i >= endNumber; i--) {
              multiSelectedList.push({
                ...currentCopyData,
                number: NOTATION_CONFIG.fdi.list[i],
                type: 'tooth',
              });
            }
          }
        }

        // console.log(startNumber, endNumber, dirention, multiSelectedList);
        teeth.setValue(draft =>
          overlappingArrayElements({ list: draft, value: multiSelectedList, condition: 'number' }),
        );
        tooth.setValue(draft => ({ ...draft, number: getToothValue }));
        // tooth.setValue()

        // onChange({
        //   multiSelectedList,
        //   type: 'teethSvg',
        //   name: 'multiSelectedList',
        //   errorType: errorType,
        // });
      } else if (hasCtrlKey) {
        // 치아를 선택 후 ctrl누른 상태에서 다른 치아에 복사하는 기능
        console.log('ctrl 누르고 치아 클릭');
        // const currentCopyData = hasCopiedData ? copyData.value : tooth.value;
        // const currentCopyData = copyData.value;
        const currentCopyData = tooth.value;
        // console.log(currentCopyData, 'currentCopyData');
        // 선택된 치아 또는 카피된 데이터 없음
        // console.log(currentCopyData, 'currentCopyData');
        // console.log(currentCopyData?.number, 'currentCopyData.number');
        // console.log(!currentCopyData?.hasData, '!currentCopyData?.hasData');
        // if (!currentCopyData?.number || !tooth.value.number)
        if (tooth.value.number === getToothValue) return console.log('ctrl 누르고 같은 치아 클릭 ');

        if (!currentCopyData?.number || !currentCopyData?.hasData) {
          setValues(draft => {
            draft.keyCombine.keyList = new Set([]);
          });
          // if (!currentCopyData?.number) {
          //   copyFailPopup();
          //   return console.log('선택된 또는 카피된 치아 없음');
          // }
          if (!currentCopyData?.hasData || !currentCopyData?.number) {
            pasteFailPopup();
            return console.log('카피된 데이터 없음');
          }
        }

        const pasteToothData = {
          ...currentCopyData,
          number: getToothValue,
        };
        teeth.setValue(draft =>
          overlappingArrayElements({ list: draft, value: pasteToothData, condition: 'number' }),
        );
        tooth.setValue(draft => ({ ...draft, number: getToothValue }));

        // const pasteData = {
        //   ...copiedData,
        //   number: getToothValue,
        //   index: getToothIndex,
        // };
        // console.log(pasteData);
        // onChange({
        //   type: 'teethSvg',
        //   name: 'paste',
        //   index: 'ctrl',
        //   tooth: pasteData,
        // });
      } else {
        console.log('normal click');
        // 그냥 tooth click
        const currentToothData = teethProps.find(item => item.number === getToothValue);
        // console.log(currentToothData, 'currentToothData');
        handleClickTeethSvg({
          tooth: { ...currentToothData, number: getToothValue, hasData: !!currentToothData },
        });

        // const selected = {
        //   ...findSelectedData,
        //   id: getToothDataTooth,
        //   number: getToothValue,
        //   index: getToothIndex,
        //   element: targetElement,
        //   hasData: !!findSelectedData,
        //   // selectedTeethData: findSelectedData,
        // };
        // onClick({ tooth: { ...selected }, type: 'teethSvg', name: 'tooth' });
      }
    }

    // 치아 클릭 하지 않았을 경우 초기화
    // ContextMenu active 초기화
    // if (!isBridgeClick && !isToothClick) {
    if (!isToothClick) {
      console.log('!isToothClick');
      // tooth.setValue(toothInitValue);
      tooth.setValue({});
      if (isEdit) {
        teethContextActions.setValue(draft => {
          draft.copy.active = false;
          draft.paste.active = false;
          draft.delete.active = false;
        });
        // copyData.setValue({});
      }
    }
  };

  // NOTE: keyboard event
  const handleCombineKey = () => {
    if (!isEdit) return;
    // console.log('keyboard useEffect');
    // if (hasSelectedItem || selectedConf.list.length !== 0) {
    // const findNumberToToothData = item => +item.number === +selectedConf.number;
    // const currentToothData = teethProps.find(findNumberToToothData);
    // const beCopiedData = teethProps.find(findNumberToToothData); // 카피할 데이터
    // const deleteData = teethProps.find(findNumberToToothData);
    // const beCopiedData = teethProps.find(findNumberToToothData); // 카피할 데이터
    const keyCombineDelete = hasDeleteKey || hasBackspaceKey;

    //NOTE: copy
    if (isCopyKeyCombine) {
      console.log('copy : ctrl + c');
      if (!isSelected) {
        console.log('선택 된 데이터가 없습니다.');
      } else if (isSelected && !hasSelectedData) {
        console.log('선택 됐으나 데이터가 없습니다.');
        copyFailPopup();
      } else {
        const currentToothData = teeth.value.find(i => i.number === tooth.value.number);
        copyData.setValue({ ...currentToothData, hasData: true });
        teethContextActions.setValue(draft => {
          draft.paste.active = true;
        });

        // onChange({
        //   type: 'teethSvg',
        //   name: 'copy',
        //   tooth: {
        //     ...beCopiedData,
        //     selectedTeethData: tooth.value.selectedTeethData,
        //   },
        // });
      }
    } else if (isPasteKeyCombine) {
      console.log('paste : ctrl + v');
      // NOTE: paste
      if (!isSelected) {
        console.log('선택 된 치아가 없습니다.');
      } else if (isSelected && !hasCopiedData) {
        console.log('선택 됐으나 데이터가 없습니다.');
        pasteFailPopup();
      } else {
        // 카피된 데이터가 있을때
        // console.log('복사한 데이터 ', hasCopiedData, copiedData);
        // console.log('붙혀넣기 될 치아 : ', tooth);
        const pasteToothData = {
          ...copyData.value,
          number: tooth.value.number,
        };
        teeth.setValue(draft =>
          overlappingArrayElements({ list: draft, value: pasteToothData, condition: 'number' }),
        );
        onChangeToothValue(pasteToothData);

        // const pasteToothData = {
        //   ...copiedData,
        //   number: Number(tooth.value.number),
        //   index: Number(tooth.value.index),
        // };
        // onChange({
        //   type: 'teethSvg',
        //   name: 'paste',
        //   tooth: pasteToothData,
        // });
      }
    } else if (keyCombineDelete) {
      // NOTE: delete
      console.log('delete');
      if (!isSelected) {
        console.log('선택 된 데이타가 없습니다.');
      } else if (isSelected && !hasSelectedData) {
        console.log('선택 됐으나 데이터가 없습니다.');
      } else {
        teeth.setValue(draft => draft.filter(i => i.number !== tooth.value.number));
        const emptyData = { number: null, hasData: false };
        tooth.setValue(emptyData);
        if (tooth.value.number === copyData.value.number) {
          copyData.setValue(emptyData);
          teethContextActions.setValue(draft => {
            draft.paste.active = false;
          });
        }
        teethContextActions.setValue(draft => {
          draft.copy.active = false;
          draft.delete.active = false;
        });

        // onChange({
        //   type: 'teethSvg',
        //   name: 'delete',
        //   tooth: deleteData,
        // });
      }
    }
  };

  // NOTE: keyboard event
  useEffect(() => {
    if (!isEdit) return;

    handleCombineKey();

    window.addEventListener('keydown', keyDownEventFn);
    window.addEventListener('keyup', keyUpEventFn);

    return () => {
      window.removeEventListener('keydown', keyDownEventFn);
      window.removeEventListener('keyup', keyUpEventFn);
    };
  }, [keyCombineList]);

  // useEffect(() => {
  //   if (!!svgRef.current) {
  //     window.addEventListener('keydown', keyDownEventFn);
  //     window.addEventListener('keyup', keyUpEventFn);
  //   }
  //   return () => {
  //     window.removeEventListener('keydown', keyDownEventFn);
  //     window.removeEventListener('keyup', keyUpEventFn);
  //   };
  // }, [svgRef.current]);

  // console.log(partList, 'partList');
  // 색상 적용
  const swapLinearComponent = <SwapLinearGradient items={partList} />;

  return (
    <Styled.TeethSvg
      data-component-name="TeethSvg"
      className={`teethSvg`}
      hiddenToothText={hiddenToothText}
      teethBg={hiddenToothText ? teeth_v2_bg_thumbnail : teeth_v2_bg}
    >
      <svg
        {...svgConfig}
        ref={svgRef}
        onClick={e => handleClick({ type: 'svg', e })}
        onContextMenu={e => handleClick({ type: 'svg', e })}
      >
        <TeethSvgModelV2 swapLinearComponent={swapLinearComponent} />
        {/* <TeethSvgModel swapLinearComponent={swapLinearComponent} /> */}
      </svg>
    </Styled.TeethSvg>
  );
}

// make setting swap svg LinearGradient element
function SwapLinearGradient(props) {
  const { items = [] } = props;
  // console.log('itmes-', items);
  return (
    <>
      {items.map((item, idx) => (
        <linearGradient id={`swap-linear-${item.idx}`} key={idx}>
          {/* <stop stopColor={Color(item.color).alpha(0.3)}></stop> */}
          <stop stopColor={item.color}></stop>
        </linearGradient>
      ))}
    </>
  );
}

// setting numbering element, numbering null check
function setNumberingElement(config = {}) {
  const { mergeToothList = [], numbering = null } = config;
  // console.log(mergeToothList, 'mergeToothList');
  const findNotationList = _.find(NOTATION_CONFIG, item => {
    const indexInfo = numbering === null ? 0 : numbering;
    return item.index === indexInfo;
  })?.list;

  // numbering mapping
  mergeToothList.map((item, idx) => {
    if (item.element) {
      const changeNumber = findNotationList[idx];

      item.element.textContent = withZeroNum(changeNumber);
    }
  });
}

const Styled = {
  TeethSvg: styled.div`
    /* height: 700px; */
    /* padding: 15px;
    width: 90%; */
    position: relative;
    background: ${({ teethBg }) => `url(${teethBg}) no-repeat center / cover`};

    svg path,
    tspan,
    text {
      cursor: pointer;
    }
    .teethSvg__tooth {
      /* stroke-width: 0.1; */
      ${disableDrag};
      pointer-events: ${({ hiddenToothText }) => hiddenToothText && 'none'};
      &:hover {
        /* stroke: #79baf7; */
      }
      &.tooth-active,
      &.tooth-fixed {
        path {
          stroke: ${color.blue};
          stroke-width: 1.5px;
        }
        /* fill: #eee; */
        & .teethSvg__text {
          /* stroke-width: 0.25; */
        }
      }
      &.hasData {
        path {
          fill-opacity: 0.5;
        }
        .teethSvg__text {
          /* stroke: #fafafa !important;
          fill: #fff; */
        }
      }
      .teethSvg__text {
        font-weight: 700;
        display: ${({ hiddenToothText }) => hiddenToothText && 'none'};
        /* stroke: #333; */
      }
    }

    .teethSvg__brdige {
      fill: #fff;
      &:not(.bridge-active) {
        &:hover {
          fill: #eee;
        }
      }
      /* &.bridge-disabled:not(.view) {
        fill: #ddd;
      } */
      &:not(.view):not(.bridge-disabled) {
        cursor: pointer;
      }
      &.view,
      &.bridge-disabled {
        fill: #ddd;
        pointer-events: none;
      }
      &.view {
        /* fill: ${color.blue}; */
      }
      &.bridge-active {
        fill: ${color.blue};
      }
    }

    width: 100%;
    /* height: 100%; */
    &.isView {
      .teethSvg__tooth.tooth-active {
        stroke: red;
        stroke-width: 0;
        /* fill: #eee; */
        & .teethSvg__text {
          stroke-width: 0.1;
        }
      }
    }
  `,
};

export default React.memo(TeethSvg);
