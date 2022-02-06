import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styled from 'styled-components';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import { NOTATION_CONFIG, withZeroNum } from 'lib/library';

function TeethContextMenu(props) {
  const {
    component: Component,
    items = {},
    onChange = () => {},
    tooth = {},
    numbering = 0,
    // multiSelectedList = [],
  } = props;

  const contextId = 'some_unique_identifier';
  const selectedToothNumber = tooth.number;
  const originIndex = NOTATION_CONFIG.fdi.list.indexOf(selectedToothNumber);
  const typeNumbering = _.find(NOTATION_CONFIG, item => item.index === numbering);
  const selectedNumber = typeNumbering.list[originIndex];

  // console.log(typeNumbering);
  // console.log(selectedNumber, 'selectedNumber');
  // console.log(tooth, 'tooth');

  // NOTE: contextMenu item click
  const handleClick = (e, data) => {
    e.preventDefault();
    const target = e.target;
    if (target) {
      target.blur();
    }

    if (data.name === 'copy') {
      onChange({
        type: 'teethSvg',
        name: 'copy',
        tooth: {
          ...tooth,
          ...tooth?.selectedTeethData,
        },
      });
    }
    if (data.name === 'delete') {
      onChange({
        type: 'teethSvg',
        name: 'delete',
        tooth: {
          ...tooth,
          ...tooth?.selectedTeethData,
        },
      });
    }
    if (data.name === 'paste') {
      onChange({
        type: 'teethSvg',
        name: 'paste',
        tooth: {
          ...tooth,
          ...tooth?.selectedTeethData,
        },
      });
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

  const menuList = _.map(items, item => (
    <MenuItem
      className={cx('contextMenu__list', { disable: !item.active }, { hidden: item.hidden })}
      key={item.id}
      onClick={handleClick}
      data={item}
    >
      {item.title}
    </MenuItem>
  ));

  const handleChange = config => {
    const { type, name, e } = config;
    if (type === 'visible') {
      const isShow = e.type === 'REACT_CONTEXTMENU_SHOW';
      onChange &&
        onChange({
          type: 'teeth',
          name: 'multiTeethSelected',
          value: 'context',
          data: isShow,
        });
    }
  };

  const contenxtTitle = `${withZeroNum(selectedNumber)} Tooth Selection`;

  return (
    <Styled.TeethContextMenu>
      <ContextMenuTrigger id={contextId}>{Component}</ContextMenuTrigger>
      <ContextMenu
        id={contextId}
        className="contextMenu"
        holdToDisplay={1000}
        onShow={e => handleChange({ e, type: 'visible', name: 'open' })}
        onHide={e => handleChange({ e, type: 'visible', name: 'close' })}
      >
        <div className="contextMenu__title">
          {selectedNumber ? contenxtTitle : 'Click on the tooth'}
        </div>
        {menuList}
      </ContextMenu>
    </Styled.TeethContextMenu>
  );
}

export default TeethContextMenu;

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
        background: white;
        border: 1px solid #eee;
        outline: none;
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
