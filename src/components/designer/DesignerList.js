import React from 'react';
import {
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import styled from 'styled-components';
import { color } from 'styles/utils';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';
import { projectOrderList, pageUrl } from 'lib/mapper';
import DesignerListCard from './DesignerListCard';
import { icon_bulb } from 'components/base/images';
import ViewMore from 'components/common/pagination/ViewMore';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(
  ({
    supportCountryList,
    language,
    order,
    keyword,
    designerList,
    likeUserSetData,
    pageChecker,
    onLike,
    onSearch,
    // onViewMore,
    page,
    pagingData,
  }) => {
    const history = useHistory();
    const { t } = useTranslation();

    return (
      <Styled.DesignerList data-component-name="DesignerList">
        <div className="designerList__layout_wrapper main-layout">
          <div className="designerList__search_bar">
            <div className="designerList__search_bar_icon_wrapper">
              <img src={icon_bulb} />
            </div>
            <div className="designerList__search_bar_comment">
              <T>DESIGNER_FIND_PARTNERS</T>
            </div>
            <MuiWrapper className="designerList__search_wrapper sm">
              <TextField
                variant="outlined"
                fullWidth
                placeholder={t('PLACEHOLDER_SEARCH_DESIGNER')}
                value={keyword.value}
                onChange={keyword.onChange}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
                className="designerList__search_textfield"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        color="primary"
                        fontSize="default"
                        className="cursor"
                        onClick={onSearch}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </MuiWrapper>
          </div>
          <div className="designerList__list_box">
            <div className="designerList__filter_bar">
              <div className="designerList__filter_box language">
                {/* <span>Language</span> */}
                <MuiWrapper
                  className="designerList__select_wrapper language sm"
                  isGlobalStyle={true}
                >
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
                      multiple
                      name="language"
                      value={language.value}
                      onChange={language.onChange}
                      renderValue={selected => {
                        if (selected.length === 0) {
                          return 'Language';
                        }
                        const selectedLabelList = supportCountryList.reduce((acc, curr) => {
                          if (selected.includes(curr.language)) return acc.concat(curr.language);
                          return acc;
                        }, []);

                        return selectedLabelList.join(', ');
                      }}
                    >
                      {supportCountryList?.length > 0 &&
                        supportCountryList.map((item, index) => (
                          <MenuItem key={index} value={item.language}>
                            <Checkbox
                              color="primary"
                              checked={language.value.includes(item.language)}
                            />
                            {item.locale}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MuiWrapper>
              </div>
              <div className="designerList__filter_box order">
                {/* <span>View</span> */}
                <MuiWrapper className="designerList__select_wrapper sm order">
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
                      name="order"
                      value={order.value}
                      onChange={order.onChange}
                    >
                      {projectOrderList?.length > 0 &&
                        projectOrderList.map(item => (
                          <MenuItem key={item.id} value={String(item.id)}>
                            {/* {item.label} */}
                            {t(`GLOBAL_SELECT_${item.label}`)}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MuiWrapper>
              </div>
            </div>

            <DesignerListCard
              designerList={designerList}
              likeUserSetData={likeUserSetData}
              onLike={onLike}
              className="designerListCard__container"
            />
            <ViewMore count={pagingData?.totalPage} page={page} padding="40px 0" />

            {/* <div className="designerListCard__viewmore">
              {!pageChecker && <span onClick={onViewMore}>+ View more</span>}
            </div> */}
          </div>
        </div>
      </Styled.DesignerList>
    );
  },
);

const Styled = {
  DesignerList: styled.div`
    .designerList__layout_wrapper {
      .designerList__search_bar {
        height: 170px;
        display: flex;
        /* padding-top: 60px;
        padding-bottom: 55px; */
        align-items: center;

        .designerList__search_bar_icon_wrapper {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 34px;
            height: 48px;
          }
        }
        .designerList__search_bar_comment {
          color: #ffffff;
          font-size: 27px;
          margin-right: 40px;
        }
      }
      .designerList__list_box {
        border-radius: 10px;
        box-shadow: 0 0 10px 0 #000629;
        background-color: #ffffff;
      }
    }
    .designerList__filter_bar {
      display: flex;
      padding: 40px 60px;
    }
    .designerList__filter_box {
      display: flex;
      align-items: center;
      & > *:not(:first-child) {
        margin-left: 15px;
      }
      span {
        font-weight: lighter;
        font-size: 15px;
      }
      &.order {
        /* margin-left: 50px; */
        margin-left: 5px;
      }
    }
    .designerList__search_wrapper {
      width: 515px;
      height: 60px;
      .designerList__search_textfield {
        border: 2px solid #1da7e0;
        border-radius: 5px;
        .MuiOutlinedInput-root {
          background-color: transparent;
          fieldset {
            border-color: transparent;
          }
          &:hover fieldset {
            border-color: transparent;
          }
          &.Mui-focused fieldset {
            border-color: transparent;
          }

          input {
            font-size: 15px;
            color: #ffffff;
            &::placeholder {
              font-size: 15px;
              color: #ffffff;
              /* opacity: 1; */
            }
          }
        }
      }
    }
    .designerList__select_wrapper {
      &.language {
        width: 140px;
      }
      &.order {
        width: 120px;
      }
    }

    .designerListCard__viewmore {
      padding: 60px 0 40px 0;
      text-align: center;
      span {
        font-size: 19px;
        color: #00a6e2;
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .designerListCard__container {
      padding-bottom: 15px;
    }
  `,
};
