import MuiButton from 'components/common/button/MuiButton';
import {
  StyledInShadowButtonOuter,
  StyledNoneShadowButtonOuter,
  StyledPlainButtonOuter,
} from 'components/common/styled/Button';
import { ENV_MODE_DEV } from 'lib/setting';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { color } from 'styles/utils';
import CreateProjectIndication from './CreateProjectIndication';
import CreateProjectInformation from './CreateProjectInformation';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import { useParams } from 'react-router';

export default React.memo(function CreateProject({
  // currentPage,
  stage,
  timeline,
  supportCountryList,
  projectTitle,
  caseId,
  dueDate,
  senderMemo,
  manager,
  preferedProgram,
  language,
  isSubmit,
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
  onCreateProject,
  restorationPontic,
  occlusalSurface,
  ceramicMetal,
  totalPrice,
  onClickTooth,
  onToggleTooth,
  onChangeToothValue,
}) {
  const { t } = useTranslation();
  const { pcode: projectCodeParam } = useParams();

  return (
    <Styled.CreateProject data-component-name="CreateProject" className="notranslate">
      <div className="project__container main-layout">
        {/* <div className="project__timeline_box">
          <StageTimeLine stage={stage} timeline={timeline} />
        </div> */}

        {ENV_MODE_DEV && (
          <div className="test_box">
            <MuiButton
              variant="outlined"
              disableElevation
              onClick={() => {
                projectTitle.setValue('Jun Dental');
                // patient.setValue('Test patient');
                dueDate.setValue(moment().add(1, 'M'));
                preferedProgram.setValue(1);
                manager.setValue('Jun');
                // language.setValue([7, 8]);
                senderMemo.setValue('Hi, ');
              }}
            >
              Test
            </MuiButton>
          </div>
        )}

        <CreateProjectInformation
          supportCountryList={supportCountryList}
          projectTitle={projectTitle}
          caseId={caseId}
          dueDate={dueDate}
          senderMemo={senderMemo}
          manager={manager}
          preferedProgram={preferedProgram}
          language={language}
          isSubmit={isSubmit}
        />

        <CreateProjectIndication
          indicationFormat={indicationFormat}
          indicationInfo={indicationInfo}
          toothShade={toothShade}
          numbering={numbering}
          tooth={tooth}
          teeth={teeth}
          bridge={bridge}
          teethContextActions={teethContextActions}
          copyData={copyData}
          indicationSeq={indicationSeq}
          indication={indication}
          material={material}
          implant={implant}
          checkSituScan={checkSituScan}
          checkGingivaScan={checkGingivaScan}
          gapWithCement={gapWithCement}
          minimalTickness={minimalTickness}
          millingToolDiameter={millingToolDiameter}
          isValidRequiredValue={isValidRequiredValue}
          onCreateProject={onCreateProject}
          restorationPontic={restorationPontic}
          occlusalSurface={occlusalSurface}
          ceramicMetal={ceramicMetal}
          onClickTooth={onClickTooth}
          onToggleTooth={onToggleTooth}
          onChangeToothValue={onChangeToothValue}
        />

        <div className="project__submit_box">
          <StyledInShadowButtonOuter
            width={390}
            marginTop={-30}
            height={60}
            bgColor={color.navy_blue}
          >
            <MuiButton
              config={{
                width: '370px',
                color: color.blue,
              }}
              disabled={!isValidRequiredValue}
              disableElevation
              variant="contained"
              onClick={onCreateProject}
              className="md border-radius-round projectInformation__create_btn"
            >
              {!totalPrice ? (
                <T>GLOBAL_CREATE</T>
              ) : (
                <>
                  <CustomSpan fontWeight={400} marginRight={10}>
                    <T>GLOBAL_POINTS</T>
                  </CustomSpan>{' '}
                  {totalPrice}{' '}
                  <CustomSpan marginLeft={15} marginRight={15}>
                    l
                  </CustomSpan>{' '}
                  {projectCodeParam ? <T>GLOBAL_MODIFY</T> : <T>GLOBAL_CREATE</T>}
                </>
              )}
              <ChevronRightIcon style={{ fontSize: '34px' }} />
            </MuiButton>
          </StyledInShadowButtonOuter>
        </div>
        {/* <div className="submit__box">
          <>
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              className="submit__btn lg"
            >
              <T>global.cancel</T>
            </MuiButton>
            <MuiButton
              disableElevation
              variant="contained"
              color="primary"
              className="submit__btn lg"
              onClick={onCreateProject}
            >
              <T>global.create</T>
            </MuiButton>
          </>
        </div> */}
      </div>
    </Styled.CreateProject>
  );
});

const Styled = {
  CreateProject: styled.div`
    padding-top: 100px;
    background-color: ${color.navy_blue};

    .test_box {
      position: absolute;
      top: -50px;
    }
    .project__timeline_box {
      padding-top: 50px;
    }
    .paper {
      position: relative;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px #000629;
      &:not(:first-of-type) {
        margin-top: 20px;
      }
    }
    .paper_subtitle {
      display: flex;
      align-items: center;
      font-size: 22px;
      margin-bottom: 40px;
      &:before {
        content: '';
        width: 50px;
        height: 4px;
        margin-right: 15px;
        background-color: ${color.blue};
      }
    }
    .grid__wrapper {
      padding: 0 50px;
    }
    .form__label {
      font-size: 15px;
      font-weight: 500;
      &.memo {
        position: relative;
        top: 12px;
      }
      &.indication {
        display: inline-block;
        /* width: 150px; */
      }
      &.flex-start-children {
        position: relative;
        top: 10px;
      }
    }
    .form__input_box {
      &.indication {
        width: 400px;
      }
    }
    .form__option_checkbox_label {
      display: inline-flex;
      align-items: center;
    }
    .submit__box {
      margin-top: 80px;
      text-align: center;
      .button {
        min-width: 140px;
        &:not(:first-child) {
          margin-left: 5px;
        }
      }
    }
    .project__submit_box {
      margin-bottom: 20px;
      .projectInformation__create_btn {
        svg {
          position: absolute;
          right: 0;
        }
      }
    }
  `,
};
