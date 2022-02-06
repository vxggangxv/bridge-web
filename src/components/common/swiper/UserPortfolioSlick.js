import React, { useEffect } from 'react';
import styled from 'styled-components';
import { default_designer } from 'components/base/images';
import ImgCrop from 'components/common/images/ImgCrop';
import { pageUrl } from 'lib/mapper';
import { useHistory } from 'react-router-dom';
import UserProfilePagingSlick from 'components/common/swiper/UserProfilePagingSlick';

export default React.memo(({ isComment, profileData, isPopup = false, backgroundColor, width }) => {
  const portfolioList = profileData?.portfolio;
  const history = useHistory();
  const widthRatio = 5;
  const heightRatio = 3;
  const convertHeight = !!width ? (heightRatio * width) / widthRatio : null;

  // useEffect(() => {
  //   console.log('background ', background);
  //   console.log('slider ', profileData);
  //   console.log('portfolioList ', portfolioList);
  // }, [profileData, portfolioList]);

  return (
    <Styled.ProjectDesignerProtfolio
      data-component-name="UserPortfolioSlick"
      backgroundColor={backgroundColor}
      width={width || 220}
      height={convertHeight || 132}
    >
      <div
        className="userPortfolioSlick__designer_info_box cursor-pointer"
        onClick={() => {
          if (!isPopup) history.push(`${pageUrl.designer.index}/@${profileData.userCode}`);
        }}
      >
        <div className="userPortfolioSlick__designer_img_box">
          {profileData?.profileImg ? (
            <ImgCrop src={profileData.profileImg} />
          ) : (
            <img src={default_designer} />
          )}
        </div>
        <div className="userPortfolioSlick__designer_id">
          <span>{profileData && profileData.company}</span>
        </div>
      </div>
      <div className="userPortfolioSlick__designer_slick">
        {portfolioList?.length > 0 ? (
          <UserProfilePagingSlick portfolioList={portfolioList} backgroundColor={backgroundColor} />
        ) : (
          <div className="userPortfolioSlick__slider_box"></div>
        )}
      </div>
      {!!isComment ? <div className="userPortfolioSlick__designer_textBox"></div> : ''}
    </Styled.ProjectDesignerProtfolio>
  );
});

const Styled = {
  ProjectDesignerProtfolio: styled.div`
    .userPortfolioSlick__designer_slick {
      width: ${({ width }) => `${width}px`};
      overflow: hidden;
      .userPortfolioSlick__slider_box {
        width: 100%;
        height: ${({ height }) => `${height}px`};

        /* background-color: #ffffff; */
        background-color: ${({ backgroundColor }) =>
          backgroundColor === 'light' ? `#f2f2f2` : `#ffffff`};

        border-radius: 5px;
      }
    }

    .userPortfolioSlick__designer_info_box {
      position: relative;
      padding-bottom: 11px;
      margin-right: 15px;
      .userPortfolioSlick__designer_img_box {
        position: absolute;
        top: 2px;
        left: 0;
        z-index: 2;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        box-shadow: 0px 0px 3px 3px rgba(158, 158, 158, 0.1);
        background-color: #ffffff;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .userPortfolioSlick__designer_id {
        min-height: 20px;
        height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 65px;
        /* padding-right: 15px; */
        font-size: 15px;
      }
    }
    .userPortfolioSlick__designer_text_box {
      margin-top: 15px;
      height: 136px;
      overflow-y: scroll;
      font-size: 13px;
    }
  `,
};
