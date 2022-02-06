import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styled from 'styled-components';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu';

import { overlappingArrayElements, withZeroNum } from 'lib/library';
import { NOTATION_CONFIG } from 'lib/teeth/teethMapper';
import { useImmer } from 'use-immer';
import { useDidUpdateEffect } from 'lib/utils';

function TeethContextMenu(props) {
  const {
    component: Component = null,
    copyData = {},
    // items = {},
    teethContextActions = { value: { copy: {}, paste: {}, delete: {} } },
    onChange = () => {},
    teeth = {},
    tooth = {},
    numbering = {},
    onChangeToothValue = () => {},
    // multiSelectedList = [],
  } = props;
  // console.log('---- render TeethContextMenu');
  // console.log(teeth, 'teeth');
  // onChange state
  const teethContextActionsValue = teethContextActions.value;
  const [contextMenuValue, setContextMenuValue] = useImmer({
    copy: {
      id: 1,
      name: 'copy',
      title: 'Copy',
      active: teethContextActionsValue.copy.active || false,
      hidden: teethContextActionsValue.copy.hidden || false,
    },
    paste: {
      id: 2,
      name: 'paste',
      title: 'Paste',
      active: teethContextActionsValue.paste.active || false,
      hidden: teethContextActionsValue.paste.hidden || false,
    },
    delete: {
      id: 3,
      name: 'delete',
      title: 'Delete',
      active: teethContextActionsValue.delete.active || false,
      hidden: teethContextActionsValue.delete.hidden || false,
    },
  });

  const contextId = 'projectTeethContextMenu';
  // const selectedToothNumber = tooth.value.number;
  const originIndex = NOTATION_CONFIG.fdi.list.indexOf(tooth.value.number);
  const typeNumbering = _.find(NOTATION_CONFIG, item => item.index === numbering.value);
  const selectedNumber = typeNumbering?.list[originIndex];

  const [isContainsClick, setIsContainsClick] = useState(null);
  const contenxtTitle = `${withZeroNum(selectedNumber)} Tooth Selection`;
  const contextMenuTriggerRef = useRef();
  const contextMenuRef = useRef();

  // console.log(numbering, 'numbering');
  // console.log(typeNumbering);
  // console.log(selectedNumber, 'selectedNumber');
  // console.log(tooth, 'tooth');

  // teethContextActionsValue listener
  // useDidUpdateEffect(() => {
  //   console.log('tooth?.value', tooth?.value);
  //   // setContextMenuValue(draft => {
  //   //   // draft.map((item) => )
  //   //   Object.keys(draft).reduce((acc, curr) => {
  //   //     draft[curr].active = !!tooth?.value;
  //   //     return Object.assign(acc, curr);
  //   //   }, {});
  //   // });
  // }, [tooth?.value]);

  useDidUpdateEffect(() => {
    setContextMenuValue(draft => {
      draft.copy = { ...draft.copy, ...teethContextActionsValue.copy };
    });
  }, [teethContextActionsValue.copy]);

  useDidUpdateEffect(() => {
    setContextMenuValue(draft => {
      draft.paste = { ...draft.paste, ...teethContextActionsValue.paste };
    });
  }, [teethContextActionsValue.paste]);

  useDidUpdateEffect(() => {
    setContextMenuValue(draft => {
      draft.delete = { ...draft.delete, ...teethContextActionsValue.delete };
    });
  }, [teethContextActionsValue.delete]);

  // NOTE: contextMenu item click
  const handleClickMenuItem = (e, data) => {
    e.preventDefault();
    const target = e.target;
    // console.log('handleClick target', target);
    // if (target) {
    //   target.blur();
    // }

    if (data.name === 'copy') {
      const currentToothData = teeth.value.find(i => i.number === tooth.value.number);
      copyData.setValue({ ...currentToothData, hasData: true });
      teethContextActions.setValue(draft => {
        draft.paste.active = true;
      });

      // onChange({
      //   type: 'teethSvg',
      //   name: 'copy',
      //   tooth: {
      //     ...tooth,
      //     // ...tooth?.selectedTeethData,
      //   },
      // });
    }
    if (data.name === 'delete') {
      // console.log('delete');
      // console.log(teeth.value, 'teeth.value');
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
      //   tooth: {
      //     ...tooth,
      //     // ...tooth?.selectedTeethData,
      //   },
      // });
    }
    if (data.name === 'paste') {
      const pasteToothData = {
        ...copyData.value,
        number: tooth.value.number,
      };
      teeth.setValue(draft =>
        overlappingArrayElements({ list: draft, value: pasteToothData, condition: 'number' }),
      );
      // console.log('pasteToothData', pasteToothData);
      onChangeToothValue(pasteToothData);

      // onChange({
      //   type: 'teethSvg',
      //   name: 'paste',
      //   tooth: {
      //     ...tooth,
      //     // ...tooth?.selectedTeethData,
      //   },
      // });
    }
    // if (data.name === 'paste') {
    //   onChange({
    //     multiSelectedList: props.multiSelectedList.concat(tooth),
    //     name: data.name,
    //     type: 'teeth',
    //     tooth,
    //     e,
    //   });
    // } else {
    //   onChange({
    //     name: data.name,
    //     type: 'teeth',
    //     tooth,
    //     e,
    //   });
    // }
  };

  // 사용X
  // e.type === 'REACT_CONTEXTMENU_SHOW' | 'REACT_CONTEXTMENU_HIDE;
  const handleChange = config => {
    const { type, name, e } = config;
    console.log('teethContext', config);
    // if (type === 'visible') {
    //   const isShow = e.type === 'REACT_CONTEXTMENU_SHOW';
    //   onChange &&
    //     onChange({
    //       type: 'teeth',
    //       name: 'multiTeethSelected',
    //       value: 'context',
    //       data: isShow,
    //     });
    // }
  };

  // 마우스 왼쪽 클릭시 ContextMenu 사라짐 기능 추가
  const handleClickOutside = e => {
    // console.log('handleClickOutside', e.target);
    // console.log(contextMenuRef?.current);
    // console.log(contextMenuRef?.current?.contains(e.target));
    // trigger요소 안 && contextMenu 클릭 안 했을 경우
    // isContainsClick 클래스로 스타일 override
    if (
      contextMenuTriggerRef?.current?.contains(e.target) &&
      !contextMenuRef?.current?.contains(e.target)
    ) {
      console.log('handleClickOutside work');
      setIsContainsClick(false);
    }
  };

  const menuList = _.map(contextMenuValue, item => {
    // console.log('item', item);
    // console.log(!tooth?.value);
    return (
      <MenuItem
        className={cx('contextMenu__list', {
          disable: !item.active,
          hidden: item.hidden,
        })}
        key={item.id}
        onClick={handleClickMenuItem}
        data={item}
      >
        {item.title}
      </MenuItem>
    );
  });

  return (
    <Styled.TeethContextMenu
      data-component-name="TeethContextMenu"
      onClick={handleClickOutside}
      isContainsClick={isContainsClick}
    >
      <ContextMenuTrigger id={contextId}>
        <div className="contextMenu__trigger_container" ref={contextMenuTriggerRef}>
          {Component}
        </div>
      </ContextMenuTrigger>
      {!!tooth?.value && (
        <ContextMenu
          id={contextId}
          className="contextMenu"
          holdToDisplay={1000}
          // onShow={e => handleChange({ e, type: 'visible', name: 'open' })}
          onShow={e => setIsContainsClick(true)}
          onHide={e => setIsContainsClick(false)}
        >
          <div className="contextMenu__container" ref={contextMenuRef}>
            <div className="contextMenu__title">
              {isContainsClick && selectedNumber ? contenxtTitle : 'Click on the tooth'}
            </div>
            {menuList}
          </div>
        </ContextMenu>
      )}
    </Styled.TeethContextMenu>
  );
}

const Styled = {
  TeethContextMenu: styled.div`
    & {
      z-index: -1;
      .contextMenu__title {
        cursor: default;
        padding: 5px;
        background: #eee;
      }
      .contextMenu {
        z-index: 1;
        background: white;
        border: 1px solid #eee;
        outline: none;
        transition: opacity 0.25s 0.25s;
        opacity: ${({ isContainsClick }) => isContainsClick === true && '1 !important'};
        opacity: ${({ isContainsClick }) => isContainsClick === false && '0 !important'};

        &.active {
          display: block;
        }
      }
      .contextMenu__list {
        cursor: pointer;
        padding: 5px;
        &:hover {
          background: #eee;
        }
        &.disable {
          pointer-events: none;
          opacity: 0.5;
        }
        &.hidden {
          display: none;
        }
      }
    }
  `,
};

export default React.memo(TeethContextMenu);

// NOTE: 오른쪽버튼 open, close 컨택스트 메뉴 observable
// useEffect(() => {
//   const targetElement = document.querySelector(".react-contextmenu.contextMenu[role='menu']");

//   const observerConfig = {
//     attributes: true,
//     attributeFilter: ["class"],
//     childList: false,
//     characterData: false,
//     subtree: false,
//   };

//   const observer = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       const targetElem = mutation.target;
//       const targetElemClassList = targetElem.className.split(" ");
//       const isTargetElemVisible = targetElemClassList.indexOf("react-contextmenu--visible") !== -1;
//       onChange && onChange({type:"contextMenu",name:"visible",value:isTargetElemVisible});
//     });
//   });

//   observer.observe(targetElement, observerConfig);

//   return () => {
//     observer.disconnect();
//   }
// }, [contextMenuRef]);
