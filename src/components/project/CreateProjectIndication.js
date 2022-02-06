import {
  ButtonGroup,
  FormControl,
  Grid,
  IconButton,
  ListSubheader,
  MenuItem,
  Select,
  Slider,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import cx from 'classnames';
import CheckIcon from 'components/base/icons/CheckIcon';
import TrashIcon from 'components/base/icons/TrashIcon';
import { icon_has_bridge } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import MuiWrapper from 'components/common/input/MuiWrapper';
import UnitSlider from 'components/common/slider/UnitSlider';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import TeethSvgV2 from 'components/model/TeethSvgV2';
import TeethContextMenu from 'components/project/TeethContextMenu';
import ProjectUploadContainer from 'containers/project/ProjectUploadContainer';
import { getMapperTeethNumbering, overlappingArrayElements, withZeroNum } from 'lib/library';
import {
  ceramicMetalIconList,
  occlusalSurfaceIconList,
  restorationPonticIconList,
} from 'lib/teeth/teethDesignMapper';
import { materialImgList } from 'lib/teeth/teethMaterialMapper';
import { useDidUpdateEffect } from 'lib/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { AppActions } from 'store/actionCreators';
import styled from 'styled-components';
import { color, paper, paperSubtitle } from 'styles/utils';

export default React.memo(function CreateProjectIndication({
  indicationFormat,
  indicationInfo,
  toothShade,
  numbering,
  tooth,
  teeth,
  bridge,
  teethContextActions,
  copyData,
  indicationSeq,
  indication,
  material,
  implant,
  checkSituScan,
  checkGingivaScan,
  gapWithCement,
  minimalTickness,
  millingToolDiameter,
  isValidRequiredValue,
  onCreate,
  restorationPontic,
  occlusalSurface,
  ceramicMetal,
  onClickTooth,
  onToggleTooth,
  onChangeToothValue,
}) {
  console.log('-------------------------- render CreateProjectIndication');
  console.log('indicationFormat', indicationFormat);
  console.log('indicationInfo', indicationInfo);
  const history = useHistory();
  const teethListTableRef = useRef();
  const isScrollTeethList = teeth.value?.length >= 6;
  // const [indicationModalOpen, setIndicationModalOpen] = useState(false);
  // const [materialModalOpen, setMaterialModalOpen] = useState(false);
  // const [implantModalOpen, setimplantModalOpen] = useState(false);
  const GROUP = 'group';
  const MATERIAL = 'material';
  const IMPLANT = 'implant';
  const [indicationModalOpenType, setIndicationModalOpenType] = useState(''); // 'group', 'material', 'implant'
  const isIndicationModalOpenType = indicationModalOpenType === GROUP;
  const isMaterialModalOpenType = indicationModalOpenType === MATERIAL;
  const isImplantModalOpenType = indicationModalOpenType === IMPLANT;

  // state
  // parsing for Mui Fragment issue
  const toothShadeList = useMemo(
    () =>
      [...indicationInfo?.toothShadeList].reduce((acc, curr) => {
        let currArr = [{ group: curr.id }, ...curr.list];
        return acc.concat(currArr);
      }, []),
    [indicationInfo?.toothShadeList],
  );
  // console.log(toothShadeList, 'toothShadeList');
  // indicationSeq(group단위), indicationFormat
  const indicationSeqList = indicationFormat?.indication;
  // indication(part단위)
  const matchingIndicationPartList =
    indicationSeqList.find(item => item.seq === indicationSeq.value)?.list || [];
  const matchingMaterialList =
    matchingIndicationPartList.find(item => item.seq === indication.value.seq)?.materialList || [];
  const matchingImplantList =
    matchingMaterialList.find(item => item.seq === material.value)?.implantList || [];
  const {
    groupList: indicationGroupList = [],
    partList: indicationPartList = [],
    materialList = [],
    implantList = [],
  } = indicationInfo;

  console.log('indicationSeqList', indicationSeqList);
  console.log('matchingIndicationPartList', matchingIndicationPartList);
  console.log('matchingMaterialList', matchingMaterialList);
  console.log('matchingImplantList', matchingImplantList);
  console.log('indicationGroupList', indicationGroupList);
  console.log('indicationPartList', indicationPartList);
  console.log('materialList', materialList);
  console.log('implantList', implantList);
  console.log('indicationSeq.value', indicationSeq.value);
  console.log('indication.value.seq', indication.value.seq);
  console.log('material.value', material.value);
  console.log('implant.value', implant.value);

  // teeth number와 NOTATION_CONFIG 타입 numbering 매칭, teeth 가운데 보여주기
  const copyNumber = getMapperTeethNumbering(copyData.value?.number, numbering.value);
  const toothNumber = getMapperTeethNumbering(tooth.value?.number, numbering.value);

  const [partHovering, setPartHovering] = useState(false);

  // TEST:
  useEffect(() => {
    console.log('teeth.value', teeth.value);
  }, [teeth.value]);
  useEffect(() => {
    console.log('indication.value', indication.value);
  }, [indication.value]);

  // SECTION: function

  const handleApply = () => {
    if (!tooth.value.number) return;

    let applyToothData = {
      number: tooth.value.number,
      preparationType: indicationSeq.value, // indication Seq
      indicationIdx: indication.value.seq, // indication Id, materialList 대분류, 기존 id -> seq로 변경
      reconstructionType: indication.value.seq, // 색상 요소, materialList 소분류
      color: indication.value.color || color.blue, // TODO: temp
      material: +material.value,
      implantType: implant.value,
      situScan: checkSituScan.value,
      separateGingivaScan: checkGingivaScan.value,
      gapWithCement: parseFloat(gapWithCement.value),
      minimalTickness: parseFloat(minimalTickness.value),
      millingToolDiameter: parseFloat(millingToolDiameter.value),
    };
    // apply 시점 발생 이벤트
    // copyData, tooth.hasData = true, TeethContextMenu paste active, set teeth
    teeth.setValue(draft =>
      overlappingArrayElements({ list: draft, value: applyToothData, condition: 'number' }),
    );
    tooth.setValue({ ...applyToothData, hasData: true });
    // copyData.setValue({ ...applyToothData, hasData: true });
    // initial
    // gapWithCement.setValue(0.08);
    // minimalTickness.setValue(0.6);
    // millingToolDiameter.setValue(1.2);
  };

  const handleDeleteTooth = (e, number) => {
    e.stopPropagation();
    tooth.setValue({});
    if (copyData.value?.number === number) copyData.setValue({});
    teeth.setValue(draft => draft.filter(i => i.number !== number));
    // teethContextActions.setValue(draft => {
    //   draft.copy.active = false;
    //   draft.delete.active = false;
    // });
  };

  // TEST:
  // useEffect(() => {
  //   console.log(copyData.value, 'copyData.value');
  //   console.log(teeth.value, 'teeth.value');
  //   console.log(tooth.value, 'tooth.value');
  // }, [copyData.value, teeth.value, tooth.value]);
  // useEffect(() => {
  //   console.log(bridge.value, 'bridge.value');
  // }, [bridge.value]);

  const handleClearAll = () => {
    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      title: <T>MODAL_ALL_CLEAR_PROJECT_TITLE</T>,
      content: <T>MODAL_ALL_CLEAR_PROJECT_CONTENT</T>,
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        teethContextActions.setValue(draft => {
          draft.copy.active = false;
          draft.paste.active = false;
          draft.delete.active = false;
        });
        tooth.setValue({});
        copyData.setValue({});
        teeth.setValue([]);
      },
    });
  };

  const handleToggleIndicationModal = type => {
    // type : 'group', 'material', 'implant'
    if (indicationModalOpenType === type) {
      return setIndicationModalOpenType('');
    }
    setIndicationModalOpenType(type);
  };

  // blur시 모달창 닫기
  const handleBlurModal = e => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setIndicationModalOpenType('');
      }
    }, 0);
  };

  const handleChooseIndicationPart = data => {
    const { groupSeq, partSeq } = data;
    console.log('handleChooseIndicationPart', data);
    indicationSeq.setValue(groupSeq);

    const currentPartList = indicationSeqList.find(item => item.seq === groupSeq)?.list || [];
    const currentPart = currentPartList.find(item => item.seq === partSeq);
    const currentPartColor = indicationPartList.find(item => item.idx === currentPart.seq)?.color;
    indication.setValue({
      seq: partSeq,
      color: currentPartColor,
    });

    if (indication.value.seq !== partSeq && currentPart) {
      material.setValue(currentPart.materialList[0].seq);
      implant.setValue(currentPart.materialList[0].implantList[0].seq);
    }

    // close modal and open materialModal
    setIndicationModalOpenType(MATERIAL);
  };

  const handleChooseMaterial = seq => {
    if (material.value !== seq) {
      const currentPartList = matchingIndicationPartList.find(i => i.seq === indication.value.seq);
      const initialImplant = currentPartList?.materialList?.find(i => i.seq === seq)
        ?.implantList[0];
      implant.setValue(initialImplant.seq);
    }
    material.setValue(seq);
    setIndicationModalOpenType('');
  };

  const handleChooseImplant = seq => {
    implant.setValue(seq);
    setIndicationModalOpenType('');
  };

  // TEST:
  // useEffect(() => {
  //   console.log('indicationModalOpenType', indicationModalOpenType);
  // }, [indicationModalOpenType]);

  // SECTION: DidUpdate
  // teeth click에 따른 teeth list table scroll 높이 조절
  useDidUpdateEffect(() => {
    if (!!teeth.value?.find(item => item.number === tooth.value?.number) && isScrollTeethList) {
      const activeNumber = 7; //6
      const boxHeight = 287;
      const rowHeight = 40;
      const currentTeethRow = teethListTableRef.current.querySelector(
        '.projectIndication__table_row.on',
      );
      const currentTeethRowIndex = currentTeethRow.dataset?.index;
      const teethRowPositionTop = !!currentTeethRowIndex
        ? rowHeight * (currentTeethRowIndex - 1)
        : 0;
      // console.log('teethRowPositionTop', teethRowPositionTop);
      // console.log('currentTeethRow', currentTeethRow);
      const teethListTableScrollTop = teethListTableRef.current.scrollTop;
      const teethListTableScrollHeight = teethListTableRef.current.scrollHeight;
      // const sideHalfHeight = (teethListTableScrollHeight - boxHeight) / 2;
      // console.log('sideHalfHeight', sideHalfHeight);
      // 경계점 sideHalfHeight, boxHeight + sideHalfHeight
      const scrollIndex = currentTeethRowIndex % activeNumber;
      // index 1(2번쨰) 이상 클릭부터 높이 row 1개를 보이개
      if (currentTeethRowIndex == 0) {
        teethListTableRef.current.scrollTop = 0;
      }
      if (currentTeethRowIndex >= 1) {
        if (teethListTableScrollHeight - boxHeight < teethRowPositionTop) {
          teethListTableRef.current.scrollTop = teethListTableScrollHeight;
          return;
        }
        teethListTableRef.current.scrollTop = teethRowPositionTop;
      }
    }
  }, [tooth.value, teeth.value, teethListTableRef.current]);

  // onChange indication.value.seq
  useDidUpdateEffect(() => {
    if (!!indication.value.seq) {
      handleApply();
    }
  }, [
    indication.value.seq,
    material.value,
    implant.value,
    checkSituScan.value,
    checkGingivaScan.value,
    gapWithCement.value,
    minimalTickness.value,
    millingToolDiameter.value,
  ]);

  // tooth number 변경 시 preparationType(indicationSeq) 유무에 따라 indication Modal 등장
  useDidUpdateEffect(() => {
    if (tooth.value.number) {
      const currentTooth = teeth.value?.find(item => item.number === tooth.value.number);
      console.log('currentTooth?.preparationType', currentTooth?.preparationType);
      if (!currentTooth?.preparationType) {
        setIndicationModalOpenType(GROUP);
      } else {
        setIndicationModalOpenType('');
      }
    }
  }, [tooth.value.number]);

  // TEST:
  // useEffect(() => {
  //   AppActions.add_popup({
  //     isOpen: true,
  //     type: 'confirm',
  //     title: 'Alert',
  //     content: 'Content',
  //     // isTitleDefault: true,
  //     // isContentDefault: true,
  //     // onClick() {
  //     //   teethContextActions.setValue(draft => {
  //     //     draft.copy.active = false;
  //     //     draft.paste.active = false;
  //     //     draft.delete.active = false;
  //     //   });
  //     //   tooth.setValue({});
  //     //   teeth.setValue([]);
  //     //   copyData.setValue([]);
  //     // },
  //   });
  // }, []);

  // return <div>Indication</div>;

  return (
    <Styled.CreateProjectIndication className={`projectIndication__container`}>
      <h1 className="sr-only">Project Indication</h1>
      <h2 className="projectIndication__content_title">
        <T>PROJECT_DETAILS</T>
      </h2>
      <div className="projectIndication__grid_wrapper">
        <Grid container alignItems="flex-start">
          {/* teeth */}
          <Grid item container className="projectIndication__content_item teeth">
            <Grid item xs={12}>
              {useMemo(
                () => (
                  <ButtonGroup color="primary" className="projectIndication__numbering_tab_box">
                    <MuiButton
                      data-type="radio"
                      className={cx('projectIndication__numbering_tab sm', {
                        active: numbering.value === 0,
                      })}
                      onClick={() => numbering.onChange({ value: 0 })}
                    >
                      <T>PROJECT_FDI</T>
                    </MuiButton>
                    <MuiButton
                      data-type="radio"
                      className={cx('projectIndication__numbering_tab sm', {
                        active: numbering.value === 1,
                      })}
                      onClick={() => numbering.onChange({ value: 1 })}
                    >
                      <T>PROJECT_UNS</T>
                    </MuiButton>
                  </ButtonGroup>
                ),
                [numbering.value],
              )}
              <MuiWrapper className="projectIndication__shading_list_box sm">
                <FormControl variant="outlined" fullWidth>
                  {useMemo(
                    () => (
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                          marginThreshold: 10,
                        }}
                        size="small"
                        displayEmpty
                        name="toothShade"
                        value={toothShade.value}
                        onChange={toothShade.onChange}
                      >
                        <MenuItem disabled value="">
                          <T>PROJECT_SHADE_OPTION</T>
                        </MenuItem>
                        {toothShadeList?.length > 0 &&
                          toothShadeList.map((item, index) => {
                            if (item.group) {
                              return <ListSubheader key={index}>{item.group}</ListSubheader>;
                            }
                            if (!item.group) {
                              return (
                                <MenuItem key={index} value={item.seq}>
                                  {item.name}
                                </MenuItem>
                              );
                            }
                          })}
                      </Select>
                    ),
                    [toothShade.value, toothShadeList],
                  )}
                </FormControl>
              </MuiWrapper>
            </Grid>
            <Grid item xs={12}>
              <div className="projectIndication__teeth_box">
                {useMemo(
                  () => (
                    <TeethContextMenu
                      component={
                        <TeethSvgV2
                          isEdit={true}
                          numbering={numbering}
                          teeth={teeth}
                          tooth={tooth}
                          bridge={bridge}
                          copyData={copyData}
                          teethContextActions={teethContextActions}
                          onToggleTooth={onToggleTooth}
                          onChangeToothValue={onChangeToothValue}
                        />
                      }
                      numbering={numbering}
                      teeth={teeth}
                      tooth={tooth}
                      copyData={copyData}
                      teethContextActions={teethContextActions}
                      onChangeToothValue={onChangeToothValue}
                    />
                  ),
                  [
                    numbering.value,
                    teeth.value,
                    tooth.value,
                    bridge.value,
                    copyData.value,
                    teethContextActions.value,
                  ],
                )}
                <div
                  className="projectIndication__selected_number_box"
                  style={{
                    backgroundColor: tooth.value?.color,
                    color: tooth.value?.color ? '#fff' : color.black_font,
                    borderColor: tooth.value?.color
                      ? 'transparent'
                      : tooth.value?.number
                      ? 'gray'
                      : 'transparent',
                  }}
                >
                  {copyData.value?.number && (
                    <p className="projectIndication__copied_number">Copy No. {copyNumber}</p>
                  )}
                  {tooth.value?.number && (
                    <div className="projectIndication__selected_number_in_box">
                      <p className="projectIndication__selected_number_text">
                        <T>PROJECT_TOOTH_NUMBER</T>
                      </p>
                      <p className="projectIndication__selected_number">{toothNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>

          {/* indication */}
          <Grid item container className="projectIndication__content_item indication">
            <Grid item container spacing={2}>
              <Grid item container>
                <div className="projectIndication__tooth_number">
                  {tooth.value.number ? (
                    `Tooth ${withZeroNum(toothNumber)}`
                  ) : (
                    <T>PROJECT_SELECTED_TOOTH</T>
                  )}
                </div>
              </Grid>

              <Grid
                item
                container
                alignItems="center"
                className="projectIndication__grid_item indicator"
              >
                <Grid item xs={3}>
                  <label className="form__label indication">
                    <T>PROJECT_INDICATORS</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  {useMemo(
                    () => (
                      <>
                        {tooth.value.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={GROUP}
                            onBlur={handleBlurModal}
                          >
                            {!!indicationSeq.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(GROUP)}
                              >
                                {/* {indicationPartList.find(i => i.idx === indication.value.seq)?.name} */}
                                {
                                  matchingIndicationPartList.find(
                                    i => i.seq === indication.value.seq,
                                  )?.name
                                }
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                onClick={() => handleToggleIndicationModal(GROUP)}
                              >
                                {!isIndicationModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Indication
                              </MuiButton>
                            )}
                            {isIndicationModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container indication">
                                <div className="projectIndication__choose_indication_modal indication chooseIndicationModal">
                                  <div className="chooseIndicationModal__body">
                                    {!!indicationSeqList?.length &&
                                      indicationSeqList.map((groupItem, groupIdx) => {
                                        return (
                                          <div
                                            key={groupItem.seq}
                                            className="chooseIndicationModal__group"
                                          >
                                            <div className="chooseIndicationModal__group_name_box">
                                              <span
                                                className="chooseIndicationModal__group_mark"
                                                dangerouslySetInnerHTML={{
                                                  __html: `&#${97 + groupIdx};)`,
                                                }}
                                              ></span>
                                              {groupItem.name}
                                            </div>
                                            <ul className="chooseIndicationModal__part_list">
                                              {groupItem.list.map((partItem, partIdx) => {
                                                const exceptPartList = [17, 18];
                                                const selectDisabled = exceptPartList.includes(
                                                  partItem.seq,
                                                );
                                                // if (exceptPartList.includes(partItem.seq)) return;
                                                const isEqualPart =
                                                  indication.value.seq === partItem.seq;
                                                const currentPartItemColor =
                                                  indicationPartList.find(
                                                    indicationPart =>
                                                      indicationPart.idx === partItem.seq,
                                                  )?.color || color.blue;

                                                // console.log('currentPartItemColor', currentPartItemColor);
                                                const versionMarkList = [6, 21];
                                                const partListLastIdx = groupItem.list.length;
                                                const divideLastIdx = partListLastIdx % 3;
                                                const noBorderBottomIdxList = Array.from({
                                                  length: 3,
                                                }).map((_, idx) => partListLastIdx - idx);
                                                const currentIdx = partIdx + 1;
                                                let isNoBorderBottom = null;
                                                if (
                                                  divideLastIdx === 0 &&
                                                  noBorderBottomIdxList.includes(currentIdx)
                                                ) {
                                                  isNoBorderBottom = true;
                                                } else if (
                                                  noBorderBottomIdxList
                                                    .slice(0, divideLastIdx)
                                                    .includes(currentIdx)
                                                ) {
                                                  isNoBorderBottom = true;
                                                }
                                                return (
                                                  <li
                                                    key={partItem.seq}
                                                    className={cx(
                                                      'chooseIndicationModal__part_item',
                                                      {
                                                        'no-border-bottom': isNoBorderBottom,
                                                        disabled: selectDisabled,
                                                      },
                                                    )}
                                                  >
                                                    <button
                                                      disabled={selectDisabled}
                                                      className={cx(
                                                        'chooseIndicationModal__part_item_btn btn-reset',
                                                        { on: isEqualPart },
                                                      )}
                                                      style={{
                                                        backgroundColor:
                                                          isEqualPart && currentPartItemColor,
                                                      }}
                                                      // onMouseEnter={() => setPartHovering(true)}
                                                      // onMouseEnter={() => setPartHovering(false)}
                                                      onMouseEnter={e =>
                                                        (e.target.style.backgroundColor =
                                                          currentPartItemColor)
                                                      }
                                                      onMouseLeave={e => {
                                                        !isEqualPart &&
                                                          (e.target.style.backgroundColor =
                                                            'white');
                                                      }}
                                                      onClick={() =>
                                                        handleChooseIndicationPart({
                                                          groupSeq: groupItem.seq,
                                                          partSeq: partItem.seq,
                                                        })
                                                      }
                                                    >
                                                      <span className="chooseIndicationModal__part_item_check_icon">
                                                        <CheckIcon width={9} />
                                                      </span>{' '}
                                                      {partItem.name}
                                                      {versionMarkList.includes(partItem.seq) && (
                                                        <div className="chooseIndicationModal__part_item_version_mark">
                                                          Galway or later
                                                        </div>
                                                      )}
                                                    </button>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_TOOTH_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      indicationSeq.value,
                      tooth.value,
                      indication.value.seq,
                      indicationPartList,
                      matchingIndicationPartList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectIndication__grid_item">
                <Grid item xs={3}>
                  <label className="form__label indication">
                    <T>PROJECT_MATERIAL</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  {useMemo(
                    () => (
                      <>
                        {tooth.value.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={MATERIAL}
                            onBlur={handleBlurModal}
                          >
                            {!!material.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(MATERIAL)}
                              >
                                {matchingMaterialList.find(i => i.seq === material.value)?.name}
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                disabled={!indication.value?.seq}
                                onClick={() => handleToggleIndicationModal(MATERIAL)}
                              >
                                {!isMaterialModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Material
                              </MuiButton>
                            )}
                            {isMaterialModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container material">
                                <div className="projectIndication__choose_indication_modal material chooseMaterialModal">
                                  <div className="chooseMaterialModal__body">
                                    <ul className="chooseMaterialModal__part_list">
                                      {!!matchingMaterialList?.length &&
                                        matchingMaterialList.map((partItem, partIdx) => {
                                          const isEqualMaterial = material.value === partItem.seq;
                                          const materialImg = materialImgList.find(
                                            i => i.id === partItem.seq,
                                          );

                                          const partListLastIdx = matchingMaterialList.length;
                                          const divideLastIdx = partListLastIdx % 2;
                                          const noBorderBottomIdxList = Array.from({
                                            length: 2,
                                          }).map((_, idx) => partListLastIdx - idx);
                                          const currentIdx = partIdx + 1;
                                          let isNoBorderBottom = null;
                                          if (
                                            divideLastIdx === 0 &&
                                            noBorderBottomIdxList.includes(currentIdx)
                                          ) {
                                            isNoBorderBottom = true;
                                          } else if (
                                            noBorderBottomIdxList
                                              .slice(0, divideLastIdx)
                                              .includes(currentIdx)
                                          ) {
                                            isNoBorderBottom = true;
                                          }
                                          return (
                                            <li
                                              key={partItem.seq}
                                              className={cx('chooseMaterialModal__part_item', {
                                                'no-border-bottom': isNoBorderBottom,
                                              })}
                                            >
                                              <button
                                                className={cx(
                                                  'chooseMaterialModal__part_item_btn btn-reset',
                                                  { on: isEqualMaterial },
                                                )}
                                                onClick={() => {
                                                  handleChooseMaterial(partItem.seq);
                                                }}
                                              >
                                                <span className="chooseMaterialModal__part_item_check_icon">
                                                  <CheckIcon width={9} />
                                                </span>{' '}
                                                <CustomSpan width={50} marginRight={10}>
                                                  {materialImg?.src && (
                                                    <img src={materialImg.src} alt="material" />
                                                  )}
                                                </CustomSpan>
                                                {partItem.name}
                                              </button>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_INDICATOR_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      tooth.value.number,
                      indication.value.seq,
                      material.value,
                      matchingMaterialList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectIndication__grid_item">
                <Grid item xs={3}>
                  <label className="form__label indication">
                    <T>PROJECT_SCAN_ABUTMENT</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  {useMemo(
                    () => (
                      <>
                        {tooth.value.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={IMPLANT}
                            onBlur={handleBlurModal}
                          >
                            {!!implant.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(IMPLANT)}
                              >
                                {matchingImplantList.find(i => i.seq === implant.value)?.name}
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                disabled={!indication.value?.seq}
                                onClick={() => handleToggleIndicationModal(IMPLANT)}
                              >
                                {!isImplantModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Implant
                              </MuiButton>
                            )}
                            {isImplantModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container implant">
                                <div className="projectIndication__choose_indication_modal implant chooseImplantModal">
                                  <div className="chooseImplantModal__body">
                                    <ul className="chooseImplantModal__part_list">
                                      {!!matchingImplantList?.length &&
                                        matchingImplantList.map((partItem, partIdx) => {
                                          const isEqualImplant = implant.value === partItem.seq;
                                          return (
                                            <li
                                              key={partItem.seq}
                                              className={cx(
                                                'chooseImplantModal__part_item cursor-pointer',
                                                {
                                                  on: isEqualImplant,
                                                },
                                              )}
                                              onClick={() => handleChooseImplant(partItem.seq)}
                                            >
                                              <button className="btn-reset">{partItem.name}</button>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* <MuiWrapper className="form__input_box" config={{ height: '45px' }}>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  MenuProps={{
                                    anchorOrigin: {
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    },
                                    getContentAnchorEl: null,
                                    marginThreshold: 10,
                                  }}
                                  displayEmpty
                                  labelId="implant"
                                  name="implant"
                                  value={implant.value}
                                  onChange={implant.onChange}
                                >
                                  {matchingImplantList?.length > 0 &&
                                    matchingImplantList.map(item => {
                                      return (
                                        <MenuItem key={item.seq} value={item.seq}>
                                          {item.name}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              </FormControl>
                            </MuiWrapper> */}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_INDICATOR_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      tooth.value.number,
                      indication.value.seq,
                      implant.value,
                      matchingImplantList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid item container className="projectIndication__grid_item">
                <Grid item xs={3}>
                  <label className="form__label indication flex-start-children">
                    <T>GLOBAL_OPTION</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <div className="form__option_checkbox_box">
                    <label className="form__option_checkbox_label cursor-pointer">
                      <CustomCheckbox
                        checked={checkSituScan.value}
                        marginRight={10}
                        onChange={checkSituScan.onChange}
                      />
                      <span>
                        <T>PROJECT_OPTION_SCAN_PRE_OP</T>
                      </span>
                    </label>
                  </div>
                  <div className="form__option_checkbox_box">
                    <label className="form__option_checkbox_label cursor-pointer">
                      <CustomCheckbox
                        checked={checkGingivaScan.value}
                        marginRight={10}
                        onChange={checkGingivaScan.onChange}
                      />
                      <span>
                        <T>PROJECT_OPTION_SCAN_GINGIVA</T>
                      </span>
                    </label>
                  </div>
                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_GAP_WIDTH</T> <T>PROJECT_OPTION_GAP_WIDTH_RANGE</T>
                    </p>
                    <UnitSlider
                      ariaLabelledby="gapWithCement-slider"
                      data={gapWithCement}
                      min={0}
                      max={0.2}
                      step={0.001}
                      digit={6}
                    />
                  </div>
                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_THICKNESS</T> <T>PROJECT_OPTION_THICKNESS_RANGE</T>
                    </p>
                    {
                      <UnitSlider
                        ariaLabelledby="minimalTickness-slider"
                        data={minimalTickness}
                        min={0.4}
                        max={1}
                      />
                    }
                  </div>
                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_DIAMETER</T> <T>PROJECT_OPTION_DIAMETER_RANGE</T>
                    </p>
                    <UnitSlider
                      ariaLabelledby="millingToolDiameter-slider"
                      data={millingToolDiameter}
                      min={0}
                      max={1.5}
                    />
                  </div>
                </Grid>
              </Grid>

              {/* design */}
              <Grid
                item
                container
                className="projectIndication__grid_item projectIndication__tooth_design_container"
              >
                <Grid item className="tooth_design_box pontic">
                  <div className="tooth_design_classify pontic">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_RESTORATION_PONTIC</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {restorationPonticIconList.map((item, index) => {
                        const checked = item.id === Number(restorationPontic.value);
                        // const checked = item.id === Number(restorationPontic.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label pontic', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="restorationPontic"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={restorationPontic.onChange}
                              onChange={() => {
                                if (restorationPontic.value === item.id) {
                                  restorationPontic.onChange({ value: 0 });
                                } else {
                                  restorationPontic.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
                <Grid item className="tooth_design_box ceramic">
                  <div className="tooth_design_classify ceramic">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_CERAMIC_METAL</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {ceramicMetalIconList.map((item, index) => {
                        const checked = item.id === Number(ceramicMetal.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label ceramic', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="ceramicMetal"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={ceramicMetal.onChange}
                              onChange={() => {
                                if (ceramicMetal.value === item.id) {
                                  ceramicMetal.onChange({ value: 0 });
                                } else {
                                  ceramicMetal.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
                <Grid item className="tooth_design_box occlusal">
                  <div className="tooth_design_classify occlusal">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_OCCLUSAL_SURFACE</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {occlusalSurfaceIconList.map((item, index) => {
                        const checked = item.id === Number(occlusalSurface.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label occlusal', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="occlusalSurface"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={occlusalSurface.onChange}
                              onChange={() => {
                                if (occlusalSurface.value === item.id) {
                                  occlusalSurface.onChange({ value: 0 });
                                } else {
                                  occlusalSurface.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
              </Grid>

              {/* // */}
            </Grid>
          </Grid>

          {/* teeth table */}
          <Grid item container className="projectIndication__table_container">
            {useMemo(
              () => (
                <>
                  {!!teeth.value?.length && (
                    <Grid item container justify="flex-end">
                      <MuiButton
                        config={{
                          bgColor: '#fff',
                          borderColor: '#b5b7c1',
                          width: '105px',
                        }}
                        className="xs projectIndication__reset_btn"
                        variant="outlined"
                        onClick={handleClearAll}
                      >
                        Reset
                      </MuiButton>
                    </Grid>
                  )}
                </>
              ),
              [teeth.value],
            )}

            <div className="projectIndication__table">
              <div className="projectIndication__table_head">
                <Grid
                  item
                  container
                  alignItems="center"
                  xs={12}
                  className="projectIndication__table_row"
                >
                  {/* <Grid item xs={1} className="projectIndication__table_cell">
                  </Grid> */}
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>
                      <T>PROJECT_TOOTH</T>
                    </div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="projectIndication__table_cell"
                  >
                    <div>
                      <T>PROJECT_INDICATORS</T>
                    </div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="projectIndication__table_cell"
                  >
                    <div>
                      <T>PROJECT_MATERIAL</T>
                    </div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="projectIndication__table_cell"
                  >
                    <div>abutment</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>Pre-op</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>Gingiva</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>Gap</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>Minimal</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="center"
                    className="projectIndication__table_cell"
                  >
                    <div>Milling</div>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justify="flex-end"
                    className="projectIndication__table_cell"
                  >
                    <div>
                      <CustomSpan style={{ padding: '0 12px' }}>
                        <TrashIcon />
                      </CustomSpan>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div ref={teethListTableRef} className="projectIndication__table_body">
                {teeth.value?.length > 0 &&
                  teeth.value.map((item, index) => {
                    const indicationName = indicationPartList.find(
                      i => i.idx === item.indicationIdx,
                      // i => i.idx === item.reconstructionIdx,
                    )?.name;
                    const materialName = materialList.find(i => i.idx === item.material)?.name;
                    // item.material !== 0
                    //   ? materialList.find(i => i.idx === item.material)?.name
                    //   : '-';
                    const hasBridge = bridge.value?.some(bridgeItem => {
                      const frontNumber = String(bridgeItem).slice(0, 2);
                      const backNumber = String(bridgeItem).slice(2);
                      const sortedNumber = [frontNumber, backNumber].sort((a, b) => a - b);
                      return String(sortedNumber).slice(2).includes(item.number);
                    });
                    const implantName = implantList.find(i => i.idx === item.implantType)?.type;
                    // item.implantType !== 1
                    //   ? implantList.find(i => i.idx === item.implantType)?.type
                    //   : '-';
                    const isNoBorderBottom = index >= 6 && index === teeth.value.length - 1;
                    // console.log('hasBridge', hasBridge);
                    // console.log('item', item);
                    // color: "#9F00A7"
                    // gapWithCement: 0.08
                    // implantType: 1
                    // indicationIdx: 1
                    // material: 1
                    // millingToolDiameter: 1.2
                    // minimalTickness: 0.6
                    // number: 26
                    // preparationType: 1
                    // reconstructionType: 11
                    // separateGingivaScan: false
                    // situScan: false
                    return (
                      <Grid
                        item
                        container
                        alignItems="center"
                        xs={12}
                        key={item.number}
                        data-index={index}
                        className={cx('projectIndication__table_row', {
                          on: item.number === tooth.value.number,
                          bridge: hasBridge,
                        })}
                        style={{
                          borderBottom: isNoBorderBottom && 'none',
                        }}
                        onClick={() => onClickTooth(item.number)}
                      >
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div className="flex-center">
                            {withZeroNum(item.number)}
                            <span
                              className="tooth_color"
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          className="projectIndication__table_cell"
                          title={indicationName}
                        >
                          <div>{indicationName}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          className="projectIndication__table_cell"
                          title={materialName}
                        >
                          <div>{materialName}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          className="projectIndication__table_cell"
                          title={implantName}
                        >
                          <div>{implantName}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div>{item.situScan ? 'o' : '-'}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div>{item.separateGingivaScan ? 'o' : '-'}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div>{item.gapWithCement}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div>{item.minimalTickness}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="center"
                          className="projectIndication__table_cell"
                        >
                          <div>{item.millingToolDiameter}</div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justify="flex-end"
                          className="projectIndication__table_cell"
                        >
                          <span className="vertical_division"></span>
                          <div>
                            {/* <button
                              className="btn-reset"
                              onClick={e => handleDeleteTooth(e, item.number)}
                            >
                              <CustomSpan width={35}>
                                <TrashIcon />
                              </CustomSpan>
                            </button> */}
                            <IconButton
                              className="btn-reset"
                              onClick={e => handleDeleteTooth(e, item.number)}
                            >
                              <TrashIcon />
                            </IconButton>
                          </div>
                          {/* <ClearRoundedIcon
                            htmlColor={color.navy}
                            onClick={e => handleDeleteTooth(e, item.number)}
                          /> */}
                        </Grid>
                      </Grid>
                    );
                  })}
              </div>
            </div>
          </Grid>

          {/* // */}
        </Grid>
      </div>

      <h3 className="projectIndication__content_data_title">Data</h3>
      <div className="projectIndication__grid_wrapper">
        {/* data table */}
        <Grid container className="projectIndication__content_item data_table_container">
          <Grid item xs={12}>
            <ProjectUploadContainer />
          </Grid>
        </Grid>
      </div>
    </Styled.CreateProjectIndication>
  );
});

const Styled = {
  CreateProjectIndication: styled.section`
    &.projectIndication__container {
      ${paper};
      margin-top: 10px;
      padding-bottom: 70px;
      .projectIndication__content_title {
        ${paperSubtitle};
      }
      .projectIndication__grid_wrapper {
        padding: 0 50px;
      }
      .projectIndication__content_item {
        /* teeth */
        &.teeth {
          width: calc(100% - 660px);

          .projectIndication__shading_list_box,
          .projectIndication__numbering_tab_box {
            display: inline-flex;
          }
          .projectIndication__numbering_tab_box {
            margin-right: 10px;
            .projectIndication__numbering_tab {
              width: 70px;
            }
          }
          .projectIndication__shading_list_box {
            width: 200px;
          }
          .projectIndication__teeth_box {
            position: relative;
            margin-left: 25px;
            margin-top: 50px;
            width: 385px;
            .projectIndication__selected_number_box {
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              width: 80px;
              height: 80px;
              border: 1px solid transparent;
              border-radius: 10px;
              text-align: center;
              .projectIndication__selected_number_in_box {
              }
              .projectIndication__selected_number_text {
                font-size: 16px;
              }
              .projectIndication__selected_number {
                margin-top: 12px;
                font-size: 28px;
              }
              .projectIndication__copied_number {
                position: absolute;
                top: -20px;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }

        /* teeth indication form */
        &.indication {
          width: 660px;
          .projectIndication__grid_item {
            min-height: 56px;

            .MuiGrid-grid-xs-3 {
              flex-grow: 0;
              max-width: 22%;
              flex-basis: 22%;
            }
            .MuiGrid-grid-xs-9 {
              flex-grow: 0;
              max-width: 78%;
              flex-basis: 78%;
            }
            &.indicator_sub_list {
              min-height: 50px;
              padding-top: 0;
              padding-bottom: 0;
              align-items: flex-start;
            }

            .projectIndication__tooth_number {
              display: flex;
              align-items: center;
              height: 34px;
              font-size: 19px;
              font-weight: 500;
            }
            /* material modal */
            .projectIndication__choose_indication_box {
              position: relative;
              font-size: 15px;
              .projectIndication__indication_name {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                height: 45px;
                padding: 0 15px;
                border: 1px solid ${color.gray_b5};
                border-radius: 5px;
              }
              .projectIndication__choose_indication_btn {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                height: 45px;
                padding: 0 15px;
                /* background-color: ${color.blue}; */
                border-radius: 5px;
                color: white;
                svg {
                  position: relative;
                  top: 1px;
                }
              }
              /* chooseIndicationModal */
              .projectIndication__choose_indication_modal_container {
                z-index: 5;
                position: absolute;
                right: 0;
                top: 45px;
                width: 100%;
                &:not(.implant):before {
                  content: '';
                  display: block;
                  position: absolute;
                  top: -7px;
                  right: 20px;
                  width: 13px;
                  height: 13px;
                  transform: rotate(45deg);
                  background-color: white;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);

                  /* top: -20px;
                  right: 15px;
                  width: 1px;
                  border: 10px solid transparent;
                  border-left-width: 8px;
                  border-right-width: 8px; 
                  border-bottom-color: white; */
                }
              }
              .projectIndication__choose_indication_modal {
                position: relative;
                background-color: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
                border-radius: 5px;
                &.indication,
                &.material {
                  width: 660px;
                  padding: 5px;
                  [class*='Modal__body'] {
                    padding: 20px;
                  }
                }
                &.indication {
                }
                &.material {
                }
                &.implant {
                  width: 100%;
                }
              }
              .chooseIndicationModal {
                .chooseIndicationModal__body {
                  border: 1px solid #e9e9ec;
                  border-radius: 5px;
                  .chooseIndicationModal__group {
                    &:not(:first-child) {
                      margin-top: 20px;
                    }
                    .chooseIndicationModal__group_name_box {
                      font-size: 13px;
                      font-weight: 500;
                      .chooseIndicationModal__group_mark {
                        margin-right: 10px;
                      }
                    }
                    .chooseIndicationModal__part_list {
                      display: flex;
                      flex-wrap: wrap;
                      margin-top: 10px;
                      border: 1px solid ${color.gray_b5};
                      border-radius: 5px;
                      .chooseIndicationModal__part_item {
                        width: 33.33%;
                        &:not(.no-border-bottom) {
                          border-bottom: 1px solid ${color.gray_da};
                        }
                        &:nth-child(3n-1),
                        &:nth-child(3n-2) {
                          border-right: 1px solid ${color.gray_da};
                        }
                        &.disabled {
                          background-color: ${color.gray_da};
                          pointer-events: none;
                          button {
                            background-color: transparent !important;
                          }
                        }
                        .chooseIndicationModal__part_item_btn {
                          display: flex;
                          align-items: center;
                          position: relative;
                          width: 100%;
                          height: 40px;
                          padding: 0 10px;
                          border-radius: 5px;
                          font-size: 12px;
                          color: ${color.gray_b5};
                          line-height: 1;
                          * {
                            pointer-events: none;
                          }
                          .chooseIndicationModal__part_item_check_icon {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            top: 1px;
                            margin-right: 10px;
                            width: 15px;
                            height: 15px;
                            border: 1px solid ${color.gray_b5};
                            border-radius: 50%;
                            svg path {
                              stroke: ${color.gray_b5};
                            }
                          }
                          .chooseIndicationModal__part_item_version_mark {
                            position: absolute;
                            bottom: 2px;
                            right: 10px;
                            font-size: 10px;
                            color: #888;
                          }

                          &:hover,
                          &.on {
                            color: white;
                            font-weight: 500;
                            .chooseIndicationModal__part_item_check_icon {
                              border-color: white;
                              svg path {
                                stroke: white;
                              }
                            }
                            .chooseIndicationModal__part_item_version_mark {
                              color: white;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              .chooseMaterialModal {
                .chooseMaterialModal__body {
                  border: 1px solid #e9e9ec;
                  border-radius: 5px;
                  .chooseMaterialModal__part_list {
                    display: flex;
                    flex-wrap: wrap;
                    border: 1px solid ${color.gray_da};
                    border-radius: 5px;
                    .chooseMaterialModal__part_item {
                      width: 50%;
                      &:not(.no-border-bottom) {
                        border-bottom: 1px solid ${color.gray_da};
                      }
                      &:nth-child(2n-1) {
                        border-right: 1px solid ${color.gray_da};
                      }

                      .chooseMaterialModal__part_item_btn {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 40px;
                        padding: 0 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        color: ${color.gray_b5};
                        line-height: 0;
                        background-color: white;

                        .chooseMaterialModal__part_item_check_icon {
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                          position: relative;
                          top: 1px;
                          margin-right: 10px;
                          width: 15px;
                          height: 15px;
                          border: 1px solid ${color.gray_b5};
                          border-radius: 50%;
                          svg path {
                            stroke: ${color.gray_b5};
                          }
                        }

                        &:hover,
                        &.on {
                          background-color: ${color.blue};
                          color: white;
                          font-weight: 500;
                          .chooseMaterialModal__part_item_check_icon {
                            border-color: white;
                            svg path {
                              stroke: white;
                            }
                          }
                        }
                        &:hover {
                          background-color: #33b7e7;
                        }
                      }
                    }
                  }
                }
              }
              .chooseImplantModal {
                .chooseImplantModal__body {
                  border-radius: 5px;
                  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
                  .chooseImplantModal__part_list {
                    display: flex;
                    flex-wrap: wrap;
                    .chooseImplantModal__part_item {
                      display: flex;
                      align-items: center;
                      width: 100%;
                      height: 45px;
                      padding: 0 15px;
                      font-size: 12px;
                      &.on {
                        background-color: rgba(0, 0, 0, 0.04);
                      }
                      &:hover {
                        background-color: rgba(0, 0, 0, 0.08);
                      }
                    }
                  }
                }
              }
            }

            /* indicators sub item */
            .projectIndication__sub_list {
              display: flex;
              .projectIndication__sub_item {
                position: relative;
                width: calc(100% / 4);
                height: 45px;
                padding: 4px;
                cursor: pointer;
                border-radius: 4px;
                &:not(:first-child) {
                  margin-left: 5px;
                }
                .projectIndication__sub_item_content {
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                  text-align: center;
                  font-size: 13px;
                  color: #fff;
                  letter-spacing: -0.2px;
                  &.on {
                    border: 1px solid #fff;
                    border-radius: 4px;
                    &:before {
                      /* content: ''; */
                      display: block;
                      position: absolute;
                      top: 0;
                      right: 0;
                      border: 5px solid transparent;
                      border-top-color: #fff;
                      border-right-color: #fff;
                    }
                  }
                }
              }
            }

            .form__option_checkbox_box {
              padding: 10px 0;
            }

            .form__option_slider_box {
              /* width: 290px; */
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              margin-top: 15px;
              padding: 8px 0;
              .form__option_slider_label {
                width: 100%;
                margin-bottom: 5px;
              }
            }

            &.projectIndication__tooth_design_container {
              margin-top: 10px;
              &:before {
                content: '';
                display: block;
                width: 100%;
                border-top: 1px dashed #bababa;
              }
              .tooth_design_box {
                width: 100%;

                margin-top: 30px;
                &:not(:first-child) {
                }
                &.occlusal {
                  /* padding-top: 35px; */
                }
                .tooth_design_classify {
                  display: flex;
                  align-items: flex-start;
                  .design_title_box {
                    display: inline-flex;
                    align-items: flex-start;
                    margin-bottom: 15px;
                    width: 160px;
                    .design_title_icon {
                      position: relative;
                      transform: translateY(-25%);
                      margin-right: 5px;
                    }
                    .design_title {
                      p {
                        font-size: 13px;
                        margin-bottom: 5px;
                        font-weight: 500;
                      }
                      span {
                        font-size: 11px;
                      }
                    }
                  }
                  .design_icon_box {
                    display: inline-flex;
                    flex-wrap: wrap;
                    padding-left: 20px;
                    width: calc(100% - 160px);

                    .design_icon_radio_label {
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      position: relative;
                      margin-bottom: 10px;
                      width: 40px;
                      height: 40px;
                      /* border: 1px solid #bbb; */
                      border: 1px solid transparent;
                      box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
                      border-radius: 5px;
                      text-align: center;
                      cursor: pointer;
                      user-select: none;

                      &:not(:first-child) {
                        margin-left: 12px;
                      }
                      &.active {
                        background-color: #e6e6e6;
                        border-color: ${color.blue};
                      }
                      &.pontic {
                        align-items: flex-end;
                        img {
                          height: 82%;
                        }
                      }
                      &.ceramic img {
                        height: 65%;
                      }
                      &.occlusal img {
                        width: 75%;
                      }
                      .tooth_design_input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 0;
                        width: 0;
                        overflow: hidden;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .projectIndication__content_data_title {
        ${paperSubtitle};
        margin-top: 30px;
        padding-bottom: 30px;
        font-size: 19px;
      }
      .data_table_container {
        .projectUpload__table_body_local {
          border-top: none;
        }
      }

      .projectIndication__apply__btn {
        padding: 0 30px;
        font-size: 16px;
        & + .button {
          margin-left: 5px;
        }
      }

      .projectIndication__table_container {
        margin-top: 50px;
      }
      .projectIndication__table {
        position: relative;
        margin-top: 12px;
        width: 100%;
        overflow: hidden;
        .projectIndication__table_row {
          /* cursor: pointer; */
          position: relative;
          &.bridge {
            /* background-color: ${color.blue};
            color: #fff; */
            &:after {
              content: '';
              display: block;
              position: absolute;
              top: -12.5px;
              left: 72px;
              width: 25px;
              height: 25px;
              background: ${`url(${icon_has_bridge}) no-repeat center`};
            }
          }
          &.on {
            background-color: ${color.blue_week};
          }
        }
        .projectIndication__table_cell {
          font-size: 14px;
          text-align: center;
          padding: 0 5px;
          min-height: 40px;
          line-height: 1.3;
          > div {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .tooth_color {
            display: inline-block;
            margin-left: 5px;
            width: 13px;
            height: 13px;
            border-radius: 2px;
          }
          .vertical_division {
            display: inline-block;
            position: relative;
            left: -4px;
            height: 40px;
            border-left: 1px dashed ${color.gray_b5};
          }
        }
        .projectIndication__table_head,
        .projectIndication__table_body {
          position: relative;
          overflow-y: overlay;
          overflow-x: hidden;
          /* &.scroll {
            overflow-y: scroll;
          } */
          .projectIndication__table_cell {
            &:nth-child(1) {
              width: 7%;
            }
            &:nth-child(2) {
              width: 17%;
              padding-left: 30px;
            }
            &:nth-child(3) {
              width: 10%;
            }
            &:nth-child(4) {
              width: 13%;
            }
            &:nth-child(5) {
              width: 7%;
            }
            &:nth-child(6) {
              width: 7%;
            }
            &:nth-child(7) {
              width: 7%;
            }
            &:nth-child(8) {
              width: 7%;
            }
            &:nth-child(9) {
              width: 7%;
            }
            &:nth-child(10) {
              width: 18%;
              /* padding-right: 10px; */
            }
          }
        }

        .projectIndication__table_head {
          /* border-bottom: 1px solid ${color.gray_bg2}; */
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          .projectIndication__table_cell {
            min-height: 35px;
            border-top: none;
            text-transform: capitalize;
            background-color: #0782ed;
            color: white;
            &:not(:first-child) {
              /* border-left: 1px solid ${color.gray_bg2}; */
            }
          }
        }
        .projectIndication__table_body {
          height: 287px;
          /* border: 1px solid ${color.gray_bg2}; */
          border: 1px solid #0782ed;
          border-top: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          .projectIndication__table_row {
            border-bottom: 1px dashed ${color.gray_b5};
          }
          .projectIndication__table_cell {
            /* min-height: 40px; */
          }
        }
      }

      .create__btn_box {
        margin-top: 30px;
        .button {
          min-width: 140px;
          font-size: 18px;
          svg {
            font-size: 15px;
          }
        }
        .create__cancel_btn {
        }
        .create__btn {
        }
      }
    }
  `,
};

/* <Grid item container justify="space-between" className="create__btn_box">
  <MuiButton
    config={{
      startIcon: <ArrowBackIosRoundedIcon />,
      iconMarginAlign: 15,
    }}
    disableElevation
    variant="outlined"
    color="default"
    className="create__cancel_btn"
    onClick={() => history.push(pageUrl.project.list)}
    // href={pageUrl.project.list}
  >
    <T>GLOBAL_CANCEL</T>
  </MuiButton>
  <MuiButton
    config={{
      endIcon: <ArrowForwardIosRoundedIcon />,
      iconMarginAlign: 15,
    }}
    disableElevation
    variant="contained"
    color="primary"
    className="create__btn"
    disabled={!isValidRequiredValue}
    onClick={onCreate}
  >
    <T>GLOBAL_CREATE</T>
  </MuiButton>
</Grid> */

// <MuiWrapper className="form__input_box">
//   <FormControl fullWidth variant="outlined">
//     <Select
//       MenuProps={{
//         anchorOrigin: {
//           vertical: 'bottom',
//           horizontal: 'left',
//         },
//         getContentAnchorEl: null,
//         marginThreshold: 10,
//       }}
//       displayEmpty
//       name="indicationSeq"
//       value={indicationSeq.value}
//       onChange={e => {
//         indicationSeq.onChange(e);
//         // indication.setValue({});

//         // indicationSeq 변경시 초기화
//         const currentIndicationList = indicationSeqList.find(
//           item => item.seq === e.target.value,
//         )?.list;
//         const currentIndicationColor = indicationPartList.find(
//           item => item.idx === currentIndicationList[0].seq,
//         )?.color;
//         indication.setValue({
//           // id: currentIndicationList[0].seq,
//           // color: currentIndicationList[0].color,
//           seq: currentIndicationList[0].seq,
//           color: currentIndicationColor,
//         });
//         material.setValue(currentIndicationList[0].materialList[0].seq);
//         implant.setValue(
//           currentIndicationList[0].materialList[0].implantList[0].seq,
//         );
//         checkSituScan.setValue(false);
//         checkGingivaScan.setValue(false);
//       }}
//     >
//       <MenuItem disabled value={''}>
//         <T>PROJECT_SELECT_OPTION</T>
//       </MenuItem>
//       {indicationSeqList?.length > 0 &&
//         indicationSeqList.map(item => (
//           <MenuItem key={item.seq} value={item.seq}>
//             {item.name}
//           </MenuItem>
//         ))}
//     </Select>
//   </FormControl>
// </MuiWrapper>
