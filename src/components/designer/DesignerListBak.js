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
import { icon_face } from 'components/base/images';
import MuiWrapper from 'components/common/input/MuiWrapper';
import styled from 'styled-components';
import { color } from 'styles/utils';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import SearchIcon from '@material-ui/icons/Search';
// import CustomPagination from 'components/common/pagination/CustomPagination';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { useHistory } from 'react-router-dom';
import { projectOrderList, pageUrl } from 'lib/mapper';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import StarScore from 'components/common/score/StarScore';
import ImgCrop from 'components/common/images/ImgCrop';
import DesignerListCard from './DesignerListCard';

export default function DesignerList({
  supportCountryList,
  language,
  order,
  keyword,
  page,
  pagingData,
  designerList,
  onLike,
  onSearch,
}) {
  const history = useHistory();

  return (
    <Styled.DesignerList data-component-name="DesignerList">
      <div className="designerList__filter_bar main-layout">
        <div className="designerList__filter_box language">
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
                    if (selected.includes(curr.language_idx)) return acc.concat(curr.language);
                    return acc;
                  }, []);

                  return selectedLabelList.join(', ');
                }}
              >
                {supportCountryList?.length > 0 &&
                  supportCountryList.map((item, index) => (
                    <MenuItem key={index} value={item.language_idx}>
                      <Checkbox
                        color="primary"
                        checked={language.value.includes(item.language_idx)}
                      />
                      {item.locale}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* <FormControl fullWidth variant="outlined">
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
                name="language"
                value={language.value}
                onChange={language.onChange}
              >
                <MenuItem disabled value="">
                  Language
                </MenuItem>
                {languageList?.length > 0 &&
                  languageList.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl> */}
          </MuiWrapper>
        </div>
        <div className="designerList__filter_box order">
          <MuiWrapper className="designerList__search_wrapper sm">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search for the Designer"
              value={keyword.value}
              onChange={keyword.onChange}
              onKeyPress={e => e.key === 'Enter' && onSearch()}
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

      <DesignerListCard designerList={designerList} onLike={onLike} />

      {/* <CustomPagination
        className="pagination__container"
        onClick={value => setPage(value.page)}
        pagingData={pagingData}
      /> */}
      <div className="pagination__container">
        <MuiPagination
          count={pagingData?.totalPage}
          page={page.value}
          onChange={(e, value) => page.setValue(value)}
        />
      </div>
    </Styled.DesignerList>
  );
}

const Styled = {
  DesignerList: styled.div`
    .designerList__filter_bar {
      display: flex;
      justify-content: space-between;
      margin-top: 100px;
      margin-bottom: 30px;
    }
    .designerList__filter_box {
      display: flex;
      & > *:not(:first-child) {
        margin-left: 10px;
      }
    }
    .designerList__search_wrapper {
      width: 300px;
    }
    .designerList__select_wrapper {
      &.language {
        width: 140px;
      }
      &.order {
        width: 120px;
      }
    }

    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
