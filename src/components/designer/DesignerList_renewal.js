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
import DesignerListCard_renewal from './DesignerListCard_renewal';
import { icon_bulb } from 'components/base/images';

export default function DesignerList_renewal({
  supportCountryList,
  language,
  order,
  keyword,
  designerList,
  likeUserSetData,
  onLike,
  onSearch,
  onViewMore,
}) {
  const history = useHistory();

  return (
    <Styled.DesignerList data-component-name="DesignerList">
      <div className="designerList__layout_wrapper ">
        <div className="designerList__search_bar">
          <div className="designerList__search_bar_icon_wrapper">
            <img src={icon_bulb} />
          </div>
          <div className="designerList__search_bar_comment">Find your partners!</div>
          <MuiWrapper className="designerList__search_wrapper sm">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search for the Designer"
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
              <span>Language</span>
              <MuiWrapper className="designerList__select_wrapper language sm" isGlobalStyle={true}>
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
              <span>View</span>
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
                          {item.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </div>
          </div>

          <DesignerListCard_renewal
            designerList={designerList}
            likeUserSetData={likeUserSetData}
            onLike={onLike}
            onViewMore={onViewMore}
          />
        </div>
      </div>
    </Styled.DesignerList>
  );
}

const Styled = {
  DesignerList: styled.div`
    background-color: #0d176c;
    .designerList__layout_wrapper {
      width: 1280px;

      margin: 0 auto;
      .designerList__search_bar {
        display: flex;
        padding-top: 60px;
        padding-bottom: 55px;

        .designerList__search_bar_icon_wrapper {
          width: 60px;
          height: 60px;
          padding-top: 5px;
          text-align: center;
          img {
            width: 34px;
            height: 48px;
          }
        }
        .designerList__search_bar_comment {
          color: #ffffff;
          font-size: 27px;
          padding-top: 11px;
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
      padding: 40px 60px 25px 60px;
    }
    .designerList__filter_box {
      display: flex;
      & > *:not(:first-child) {
        margin-left: 15px;
      }
      span {
        padding-top: 7px;
        font-weight: lighter;
        font-size: 15px;
      }
      &.order {
        margin-left: 50px;
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
  `,
};
