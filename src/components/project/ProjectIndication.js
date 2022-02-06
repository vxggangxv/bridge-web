import { Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import cx from 'classnames';
import { icon_restoration_pontic_1 } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import TeethSvgV2 from 'components/model/TeethSvgV2';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import useInput from 'lib/hooks/useInput';
import { getMapperTeethNumbering } from 'lib/library';
import {
  iconCeramicMetalList,
  iconOcclusalSurfaceList,
  iconRestorationPonticList,
} from 'lib/teeth/teethDesignMapper';
import { useDidUpdateEffect } from 'lib/utils';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { color, paperSubtitle } from 'styles/utils';
import PropTypes from 'prop-types';

function ProjectIndication({ indicationFormat, indicationInfo, projectInfo }) {
  const indication = indicationFormat?.indication;
  const { materialList, implantList } = indicationInfo;
  const {
    teeth,
    bridgeList: bridge,
    notation: numbering,
    restorationPonticDesign,
    occlusalSurfaceDesign,
    ceramicMetalDesign,
  } = projectInfo.indication;
  const tooth = useInput({
    number: null,
  });
  const checkTooth = useCheckSetInput(new Set([]));
  const teethListTableRef = useRef();
  // const isScrollTeethList = teeth.value?.length >= 14;
  const selectedRestorationPontic = iconRestorationPonticList.find(
    item => item.id === restorationPonticDesign,
  );
  const selectedceramicMatel = iconCeramicMetalList.find(item => item.id === ceramicMetalDesign);
  const selectedOcclusalSurface = iconOcclusalSurfaceList.find(
    item => item.id === occlusalSurfaceDesign,
  );

  // SECTION: onChange
  useDidUpdateEffect(() => {
    const isRe = tooth.value.number === undefined;
    checkTooth.onChange({ value: isRe ? tooth.value.reNumber : tooth.value.number });
  }, [tooth.value]);

  // useEffect(() => {
  //   console.log('teeth', teeth);
  // }, [teeth]);

  // teeth click에 따른 teeth list table scroll 높이 조절
  useDidUpdateEffect(() => {
    if (teethListTableRef.current && !!teeth?.find(item => item.number === tooth.value?.number)) {
      const rowGutter = 43; // height + marginTop
      const currentTeethRow = teethListTableRef.current.querySelector(
        `div[data-tooth="${tooth.value.number}"]`,
      );
      const currentTeethRowPositionTop = currentTeethRow.offsetTop;
      setTimeout(() => {
        teethListTableRef.current.scrollTop = currentTeethRowPositionTop - rowGutter;
      }, 250);
    }
  }, [tooth.value, teeth.value, teethListTableRef.current]);

  // TEST:
  // useEffect(() => {
  //   console.log(teeth, 'teeth');
  //   console.log(tooth.value.number, 'tooth.value.number');
  //   console.log(tooth.value.reNumber, 'tooth.value.reNumber');
  // }, [tooth.value]);

  // useDidUpdateEffect(() => {
  //   console.log(checkTooth.value, 'checkTooth.value');
  // }, [checkTooth.value]);

  return (
    <Styled.ProjectIndication
      data-component-name="ProjectIndication"
      className="projectIndication__container"
    >
      {/* <h2 className="projectIndication__content_title">
        <T>PROJECT_INDICATION</T>
      </h2> */}
      <div className="projectIndication__content_grid_wrapper">
        <Grid container className="projectIndication__grid_container">
          <Grid item xs={6}>
            <div className="projectIndication__teeth_box">
              <TeethSvgV2
                isEdit={false}
                tooth={tooth}
                numbering={{ value: numbering }}
                teeth={{ value: teeth }}
                bridge={{ value: bridge }}
              />
              {/* <TeethSvg
              isEdit={false}
              tooth={tooth}
              numbering={{ value: numbering }}
              teeth={{ value: teeth }}
              bridge={{ value: bridge }}
            /> */}
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="projectIndication__tooth_list" ref={teethListTableRef}>
              {teeth?.length > 0 &&
                teeth.map(item => {
                  // const toothNumberIndex = NOTATION_CONFIG.fdi.list.indexOf(item.number);
                  // let teethNumberList = NOTATION_CONFIG.fdi.list;
                  // if (numbering === 1) teethNumberList = NOTATION_CONFIG.universal.list;
                  // const toothNumber = teethNumberList[toothNumberIndex];
                  const toothNumber = getMapperTeethNumbering(item.number, numbering);

                  return (
                    <div
                      key={item.number}
                      data-tooth={item.number}
                      className="projectIndication__tooth_item"
                    >
                      <div
                        className="projectIndication__tooth_number"
                        onClick={() => tooth.setValue({ number: item.number })}
                      >
                        {!![...checkTooth.value].find(i => i === item.number) ? (
                          <RemoveIcon
                            className="projectIndication__fold_icon unfold"
                            // style={{ backgroundColor: '#fff' }}
                          />
                        ) : (
                          <AddIcon
                            className="projectIndication__fold_icon fold"
                            // style={{ backgroundColor: '#fff' }}
                          />
                        )}
                        <T>PROJECT_TOOTH</T> {toothNumber}
                        <span
                          className="projectIndication__fold_color"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      </div>

                      <div
                        className={cx('projectIndication__tooth_detail', {
                          on: !![...checkTooth.value].find(i => i === item.number),
                        })}
                      >
                        <Grid
                          container
                          spacing={2}
                          className="projectIndication__tooth_detail_grid_container"
                        >
                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_TYPE</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {indication.find(i => i.seq === item.preparationType)?.name}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_INDICATION</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {
                              indication
                                .find(i => i.seq === item.preparationType)
                                ?.list.find(o => o.seq === item.indicationIdx)?.name
                            }
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_MATERIAL</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {materialList.find(i => i.idx === item.material)?.name}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_IMPLANT</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {implantList.find(i => i.idx === item.implantType)?.type}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_OPTION_GAP_WIDTH</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {item.gapWithCement}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_OPTION_THICKNESS</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {item.minimalTickness}
                          </Grid>
                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_OPTION_DIAMETER</T>
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {item.millingToolDiameter}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_OPTION_SCAN_PRE_OP</T>?
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {item.situScan ? 'Yes' : 'No'}
                          </Grid>

                          <Grid item xs={5} className="projectIndication__tooth_detail_label">
                            - <T>PROJECT_OPTION_SCAN_GINGIVA</T>?
                          </Grid>
                          <Grid item xs={7} className="projectIndication__tooth_detail_text">
                            {item.separateGingivaScan ? 'Yes' : 'No'}
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  );
                })}
            </div>
            <ul className="projectIndication__tooth_design_list">
              {selectedRestorationPontic && (
                <li className="projectIndication__tooth_design_item">
                  <figure className="pontic">
                    <img src={selectedRestorationPontic?.src} alt="tooth design" />
                  </figure>
                  <div className="projectIndication__tooth_design_name">
                    Restoration
                    <br />
                    Pontic Design
                  </div>
                </li>
              )}
              {selectedceramicMatel && (
                <li className="projectIndication__tooth_design_item">
                  <figure className="ceramic">
                    <img src={selectedceramicMatel?.src} alt="tooth design" />
                  </figure>
                  <div className="projectIndication__tooth_design_name">
                    Ceramic
                    <br />
                    Matel Design
                  </div>
                </li>
              )}
              {selectedOcclusalSurface && (
                <li className="projectIndication__tooth_design_item">
                  <figure className="occlusal">
                    <img src={selectedOcclusalSurface?.src} alt="tooth design" />
                  </figure>
                  <div className="projectIndication__tooth_design_name">
                    Occlusal
                    <br />
                    Surface Design
                  </div>
                </li>
              )}
              {/* item.id === Number(restorationPonticDesign) */}
            </ul>
          </Grid>
        </Grid>
      </div>
      {/* <div className="projectIndication__content_tooth_design">
        <img src={icon_restoration_pontic_list.find(i => i.id === restorationPonticDesign).src} />
        <img src={icon_occlusal_surface_list.find(i => i.id === occlusalSurfaceDesign).src} />
        <img src={icon_ceramic_metal_list.find(i => i.id === ceramicMetalDesign).src} />
        
      </div> */}
      {/* <Grid container className="projectIndication__content_tooth_design tooth_design">
        <Grid item container spacing={2} className="projectIndication__tooth_design_box left">
          <Grid item container className="left_box">
            <div className="projectIndication__tooth_design_classify restoration">
              <div className="design_title_box">
                <AddIcon className="design_title_icon" color="primary" fontSize="large" />
                <div className="design_title">
                  <p>
                    <T>PROJECT_OPTION_RESTORATION_PONTIC</T>
                  </p>
                  <CustomSpan fontColor={'#9F9F9F'}>Select Design</CustomSpan>
                </div>
              </div>
              <div className="design_icon_box">
                {iconRestorationPonticList.map((item, index) => {
                  const checked = item.id === Number(restorationPonticDesign);
                  return (
                    <label
                      className={cx('design_icon_radio_label', {
                        active: checked,
                      })}
                      key={item.id}
                    >
                      <img src={item.src} />
                      <input
                        type="checkbox"
                        name="restorationPontic"
                        className="restorationPontic_input"
                        value={item.id}
                        // checked={checked}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="projectIndication__tooth_design_classify occlusal">
              <div className="design_title_box">
                <AddIcon className="design_title_icon" color="primary" fontSize="large" />
                <div className="design_title">
                  <p>Occlusal Surface Design</p>
                  <CustomSpan fontColor={'#9F9F9F'}>Select Design</CustomSpan>
                </div>
              </div>
              <div className="design_icon_box">
                {iconOcclusalSurfaceList.map((item, index) => {
                  const checked = item.id === Number(occlusalSurfaceDesign);
                  return (
                    <label
                      className={cx('design_icon_radio_label', {
                        active: checked,
                      })}
                      key={item.id}
                    >
                      <img src={item.src} />
                      <input
                        type="checkbox"
                        name="restorationPontic"
                        className="restorationPontic_input"
                        value={item.id}
                        // checked={checked}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid item container spacing={2} className="projectIndication__tooth_design_box right">
          <Grid item container className="right_box">
            <div className="projectIndication__tooth_design_classify ceramic">
              <div className="design_title_box">
                <AddIcon className="design_title_icon" color="primary" fontSize="large" />
                <div className="design_title">
                  <p>Ceramic Metal Design</p>
                  <CustomSpan fontColor={'#9F9F9F'}>Select Design</CustomSpan>
                </div>
              </div>
              <div className="design_icon_box">
                {iconCeramicMetalList.map((item, index) => {
                  const checked = item.id === Number(ceramicMetalDesign);
                  return (
                    <label
                      className={cx('design_icon_radio_label', {
                        active: checked,
                      })}
                      key={item.id}
                    >
                      <img src={item.src} />
                      <input
                        type="checkbox"
                        name="restorationPontic"
                        className="restorationPontic_input"
                        value={item.id}
                        // checked={checked}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid> */}
    </Styled.ProjectIndication>
  );
}

ProjectIndication.propTypes = {
  indicationFormat: PropTypes.shape({
    indication: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  indicationInfo: PropTypes.shape({
    groupList: PropTypes.arrayOf(PropTypes.object),
    partList: PropTypes.arrayOf(PropTypes.object),
    materialList: PropTypes.arrayOf(PropTypes.object),
    implantList: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  projectInfo: PropTypes.object.isRequired,
};

export default React.memo(ProjectIndication);

const Styled = {
  ProjectIndication: styled.div`
    margin-top: 50px;
    .projectIndication__content_title {
      ${paperSubtitle};
    }
    .projectIndication__content_grid_wrapper {
      /* padding: 0 50px; */
    }
    .projectIndication__grid_container {
      margin-top: 50px;
    }
    .projectIndication__teeth_box {
      width: 260px;
      margin: 0 auto;
    }
    .projectIndication__tooth_list {
      /* padding-left: 20px; */
      position: relative;
      height: 460px;
      overflow-y: overlay;
      overflow-x: hidden;
      .projectIndication__tooth_item {
        & + .projectIndication__tooth_item {
          /* margin-top: 25px; */
          margin-top: 15px;
        }
        .projectIndication__tooth_number {
          display: flex;
          align-items: center;
          font-size: 16px;
          /* font-weight: 700; */
          cursor: pointer;
          .projectIndication__fold_icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 15px;
            border-radius: 3px;
            border: 1px solid ${color.blue};
            background-color: ${color.blue};
            color: #fff;
            &.unfold {
              background-color: #fff;
              color: ${color.blue};
            }
          }
          .projectIndication__fold_color {
            margin-left: 15px;
            width: 16px;
            height: 16px;
          }
        }
        .projectIndication__tooth_detail {
          padding-left: 45px;
          height: 0;
          transition: all 0.25s;
          overflow: hidden;
          font-size: 12px;
          &.on {
            height: 256px;
          }
          .projectIndication__tooth_detail_grid_container {
            margin-top: 0px;
          }
          .projectIndication__tooth_detail_label {
            letter-spacing: -0.3px;
            font-weight: 300;
          }
          .projectIndication__tooth_detail_text {
            color: ${color.gray_font};
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .projectIndication__tooth_design_list {
      display: flex;
      align-items: center;
      margin-top: 5px;
      padding-top: 30px;
      border-top: 1px dashed ${color.gray_da};
      .projectIndication__tooth_design_item {
        display: flex;
        align-items: flex-end;
        width: 33.33%;
        figure {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 40px;
          height: 40px;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
          border-radius: 5px;
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
        }
        .projectIndication__tooth_design_name {
          margin-left: 10px;
          width: calc(100% - 50px);
          font-size: 11px;
          line-height: 1.2;
        }
      }
    }
  `,
};
