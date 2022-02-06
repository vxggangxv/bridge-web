import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import 'moment-timezone';
import cx from 'classnames';
import { color } from 'styles/utils';
//ant react module
import { DatePicker, TimePicker } from 'antd';
import 'styles/lib/antPicker.css';
// import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { icon_calendar, icon_calendar02 } from 'components/base/images';
import { useTranslation } from 'react-i18next';
import T from 'components/common/text/T';
import { useDidUpdateEffect } from 'lib/utils';

/**
 * @param {*} props
 * @param {Date} defaultValue // moment 객체
 * @param {string} placeholder //
 * @param {boolean} showToday // 하단에 today 버튼 여부
 * @param {function} onChange (date, dateString) // 날짜 변경 데이터를 컨트롤할 함수
 * @param {boolean} disabledDate // 지난 날짜 선택 여부
 * 
 *  <CustomDatePicker
    value={moment.unix(dueDate)}
    className="CreateCase_input date"
    onChange={handleChange('date')}
    style={{ width: '100%', height: '40px' }}
  />
 */
const CustomDatePicker = React.memo(function CustomDatePicker(props) {
  const { t } = useTranslation();
  let {
    type = 'date',
    disabled = false,
    width,
    height,
    fullWidth,
    borderRadius,
    className,
    style,
    value,
    defaultVisibleValue = null,
    defaultValue = null,
    // placeholder = 'Pick a day',
    placeholder = t('PLACEHOLDER_DATE_PICKER'),
    showToday = false,
    showTime = false,
    onChange,
    disabledDate = false,
    disabledDateType = '', // project, etc...
    disabledTimeType = '',
    disabledTime = false,
    renderChangable = false,
    renderChangableType = '',
    minuteStep,
    format = 'YYYY-MM-DD HH:mm',
    isClient = false,
    // format = 'HH:mm',
  } = props;
  const [date, setDate] = useState(null);
  const currentDateFormat = useRef({ day1: null, day2: null });
  const [open, setOpen] = useState(false);
  const [pickDate, setPickDate] = useState(null);
  const [pickHour, setPickHour] = useState(null);
  const [pickMinute, setPickMinute] = useState(null);
  const [inActiveTimeOver, setInActiveTimeOver] = useState(false);

  const isProject = disabledDateType === 'project';
  const kr_holiday = [
    // public
    '2021-01-01',
    '2021-02-11',
    '2021-02-12',
    '2021-02-13',
    '2021-03-01',
    '2021-05-05',
    '2021-05-19',
    '2021-06-06',
    '2021-08-15',
    '2021-09-20',
    '2021-09-21',
    '2021-09-22',
    '2021-10-03',
    '2021-10-09',
    '2021-12-25',
    // sub
    '2021-08-16',
    '2021-10-04',
    '2021-10-11',
  ];
  const min_days = [
    // current와 moment() 비교 중 시간 선택시, 제한 풀리는 현상으로 인해, 최소 날짜를 배열에 넣어둠
    moment().add(1, 'days').format('YYYY-MM-DD'),
    moment().add(2, 'days').format('YYYY-MM-DD'),
  ];

  // 현재 지역의 시간을 한국 기준으로 바꾼 후 하루를 더한 시간
  // TODO: 금요일일 경우 day + 2
  // 현재시간 한국으로 변경
  const koreaMoment = moment.tz('Asia/Seoul');
  // 0(sun) ~ 6(sat), 5(fri)
  let addDay = 1;
  const isExceedTime = moment.tz('Asia/Seoul').add(addDay, 'd').hour() > 17;
  let disabledDates = [moment.tz('Asia/Seoul').add(1, 'd').date()];
  // isExceedTime일 경우 다음날(기본) + 다음날까지 비활성화

  // X - 18시 이상은 다음날도 비활성화(현재날 + 두개날짜가 더 비활성화)
  // O- 18시 이상은 시간기준으로 비활성화
  if (koreaMoment.day() === 5) {
    addDay = addDay + 2; //3
    // 금요일만 다음주 월요일로 비활성화 날짜 변경
    disabledDates = [moment.tz('Asia/Seoul').add(addDay, 'd').date()];
    // if (isExceedTime) {
    // 금욜, 근무시간 넘을 시 [+3(토,일,월), +4(토,일,월,화)]
    // addDay = addDay + 1; //4
    // disabledDates = [
    // ...disabledDates,
    // moment.tz('Asia/Seoul').add(3, 'd').date(),
    // moment.tz('Asia/Seoul').add(4, 'd').date(),
    // ];
    // }
  } else if (koreaMoment.day() === 4 && isExceedTime) {
    // 목욜, 근무시간 넘을 시 [+1다음날(기본), +4(금, 토, 일, 월)
    addDay = addDay + 3; // 4
    // disabledDates = [...disabledDates, moment.tz('Asia/Seoul').add(addDay, 'd').date()];
  } else if (isExceedTime) {
    // 근무시간 넘을 시 [+1다음날(기본), +2(그 다음날)]
    addDay = addDay + 1; // 2
    // disabledDates = [...disabledDates, moment.tz('Asia/Seoul').add(addDay, 'd').date()];
  }

  let oneDayLater = moment.tz('Asia/Seoul').add(addDay, 'd');
  // console.log('oneDayLater', oneDayLater);

  // 한국은 utc기준 +9 시간
  // moment로 시차를 구한후
  // utc로 한국 기준 10시 ~ 18시, 0 ~ 23
  const inActiveStartTime = moment.utc(moment().format('YYYY-MM-DD')).add(9, 'h');
  const inActiveEndTime = moment(inActiveStartTime).add(8, 'h');

  // value가 안 올경우 보여주기식 함수, value가 필수이기때문에 사용이 안됨.
  const handleChangeDate = value => {
    console.log('handleChangeDate', value);
    const dateValue = value ? moment(value) : null;
    setDate(dateValue);

    onChange(value);
  };

  const setDisabledDateByProject = current => {
    // console.log('disabledDateType project');
    let result = false;
    // 1. isMinday?
    // current와 moment() 비교 중 시간 선택시, 제한 풀리는 현상으로 인해, 최소 날짜를 배열에 비교
    const isMinday = min_days.filter(function (obj) {
      return current.format('YYYY-MM-DD') === obj;
    })[0];
    // 2. is holiday?
    const isHoliday = kr_holiday.filter(function (obj) {
      return current.format('YYYY-MM-DD') === obj;
    })[0];
    // 3. is weekend?
    const isWeekend = current.day() === 0 || current.day() === 6 ? true : false;
    // const isWeekend =
    //   moment(moment(current).tz('Asia/Seoul')).day() === 0 || current.day() === 6 ? true : false;

    // 4. disabled tomorrow
    const disabledTomorrow = isExceedTime ? disabledDates.includes(current.date()) : false;

    // 이전 날짜 선택 안됨(당일 선택 불가능)
    // return current && current < moment().endOf('d');

    // console.log('abc', current);
    // console.log('seoul', moment(current).tz('Asia/Seoul'));
    // console.log('newyork', moment(current).tz('America/New_York'));

    // if (isClient) {
    //   if (current && current < moment().endOf('d')) {
    //     // 당일 및 이전 날짜 선택 불가능
    //     result = true;
    //   } else if (isMinday) {
    //     // 최소 기간(오늘 포함 3일 후) 선택 불가능
    //     result = true;
    //   } else if (!!isHoliday) {
    //     // 공휴일 및 대체 공휴일(한국기준) 선택 불가능
    //     result = true;
    //   } else if (isWeekend) {
    //     // 주말 선택 불가능
    //     result = true;
    //   } else {
    //     result = false;
    //   }
    // } else {
    //   if (current < moment().startOf('d')) {
    //     // 이전 날짜 선택 불가능
    //     result = true;
    //   }
    // }
    if (current < moment().endOf('d') || isWeekend || disabledTomorrow) return true;

    // console.log('result __ ', result);
    return result;
    // 이전 날짜 계산하는 함수(당일 선택 가능)
    // return current < moment().startOf('d');
  };

  const setDisabledDate = current => {
    if (disabledDateType === 'project') {
      return setDisabledDateByProject(current);
    }
  };

  const range = (start, end) => {
    const result = [];

    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const setDisabledTimeByProject = () => {
    const convertDisabledTimes = list => {
      return range(0, 24).filter(item => {
        console.log(!list.includes(item));
        return !list.includes(item);
      });
    };

    const koreaWorkTime = Array.from({ length: 8 }).map((item, idx) =>
      moment
        .utc(moment().format('YYYY-MM-DD'))
        .add(1, 'd')
        .add(9 + idx, 'h')
        .hour(),
    );

    // console.log('koreaWorkTime', koreaWorkTime);
    // const defaultDisabledHoursValue = [...convertDisabledTimes(koreaHours)];
    const defaultDisabledHoursValue = [];

    // console.log('pickDate', pickDate);
    // console.log(oneDayLater.date());
    // 날짜 클릭시 적용
    if (pickDate === oneDayLater.date()) {
      // console.log('isEqual');
      let disabledHoursValue = [];
      // 10시 ~ 1&:59 까지는 현재 시간기준으로 비활성화설정
      // if (oneDayLater.hour() >= 10 && oneDayLater.hour() < 18) {
      //   disabledHoursValue = [
      //     range(0, oneDayLater.minute() > 30 ? oneDayLater.hour() + 1 : oneDayLater.hour()),
      //   ];
      // }
      // 근무시간 이후로는 현재 시간 기준 및은 비활성화
      // console.log('oneDayLater.hour()', oneDayLater.hour());
      disabledHoursValue = range(
        0,
        oneDayLater.minute() > 30 ? oneDayLater.hour() + 1 : oneDayLater.hour(),
      );

      let disabledMinutesValue = [];
      // 시간 클릭시 적용
      if (pickHour === oneDayLater.hour()) {
        disabledMinutesValue = range(0, oneDayLater.minute() + 1);
      }

      return {
        disabledHours: () => disabledHoursValue,
        disabledMinutes: () => disabledMinutesValue,
        // disabledHours: () => range(0, 24).splice(0, hour),
        // disabledMinutes: () => range(0, minute),
        // disabledSeconds: () => range(0, second),
      };
    }

    return {
      disabledHours: () => defaultDisabledHoursValue,
    };
  };

  // NOTE: 최소시간 추가할 경우 추가 개발
  const setDisabledTime = () => {
    // const hour = moment().hour();
    // const minute = moment().minute();
    // const second = moment().second();

    if (disabledTimeType === 'project') {
      return setDisabledTimeByProject();
    }
  };

  const dateRenderByProject = (currentDate, today) => {
    // console.log('today.diff(currentDate).day()', moment(today).diff(moment(currentDate)).day());
    // console.log('.day()', currentDate.date());
    let addClassName = '';
    if (currentDate.diff(today) > 0) {
      const currentDateMoment = moment(currentDate);
      const todayDay = today.day();
      let day1 = 0;
      let day2 = 0;
      // 일(0) ~ 토(6)
      if (todayDay === 4) {
        day2 = 2;
      }
      if (todayDay === 5) {
        day1 = 2;
        day2 = 2;
      }
      // 오늘:1, 내일:2, 내일모레: 3
      let diffMoment = moment(currentDateMoment.diff(today));
      const diffDate = diffMoment.date();
      // console.log('current', currentDateMoment.format('MM DD'));
      // console.log('diffDate', diffDate);
      // console.log('todayDay', todayDay);
      // 하루 차이
      if (diffDate === 2) {
        currentDateFormat.current.day1 = currentDateMoment.add(day1, 'd').format('MM DD');
        // console.log('diff2---', currentDateMoment.add(day1, 'd').format('MM DD'));
        // console.log('diff1---', currentDateFormat.current.day1);
      }
      // 이틀 차이
      if (diffDate === 3) {
        currentDateFormat.current.day2 = currentDateMoment.add(day2, 'd').format('MM DD');
        // console.log('diff3---', currentDateMoment.add(day2, 'd').format('MM DD'));
        // console.log('diff2---', currentDateFormat.current.day2);
      }
      // console.log('----------');

      // 추가금액 클래스 추가
      if (
        [currentDateFormat.current.day1, currentDateFormat.current.day2].includes(
          currentDate.format('MM DD'),
        )
      ) {
        addClassName = 'additional-amount';
      }
    }
    return (
      <div className={`ant-picker-cell-inner ${addClassName}`}>{currentDate.format('DD')}</div>
    );
    // return <div className="ant-picker-cell-inner">{currentDate.format('DD')}</div>;
  };

  const handleDateRender = (currentDate, today) => {
    // console.log(
    //   'currentDate, today',
    //   currentDate.format('YYYY MM DD HH:mm'),
    //   today.format('YYYY MM DD HH:mm'),
    // );

    // TODO: 선택 1일차, 2일차 스타일 변경
    if (renderChangableType === 'project') {
      return dateRenderByProject(currentDate, today);
    }

    return <div className="ant-picker-cell-inner">{currentDate.format('DD')}</div>;
  };

  const handleOpenChange = open => {
    // console.log('open', open);
    setOpen(open);
  };

  const defaultHour = oneDayLater.minute() > 30 ? oneDayLater.hour() + 1 : oneDayLater.hour();
  const defaultMinute = oneDayLater.minute() > 30 ? 0 : 30;
  // pick에 따른 disabled hour, time 자동 변경을 위한 setPick
  useEffect(() => {
    if (isProject && open) {
      // setPickDate(defaultHour);
      // setPickHour(defaultHour);
      const pickDateInPanelInnerEl = document.querySelectorAll(
        '.customDatePicker__dropdown .ant-picker-date-panel .ant-picker-cell-inner ',
      );
      pickDateInPanelInnerEl.forEach(el => {
        el.addEventListener('click', e => {
          setPickDate(+e.target.innerText);
          // setPickHour(defaultHour);
        });
      });
      const pickTimeInHourPanelInnerEl = document.querySelectorAll(
        '.customDatePicker__dropdown .ant-picker-time-panel .ant-picker-time-panel-column:first-child .ant-picker-time-panel-cell-inner',
      );
      pickTimeInHourPanelInnerEl.forEach(el => {
        el.addEventListener('click', e => {
          setPickHour(+e.target.innerText);
        });
      });
      const pickTimeInMinutePanelInnerEl = document.querySelectorAll(
        '.customDatePicker__dropdown .ant-picker-time-panel .ant-picker-time-panel-column:last-child .ant-picker-time-panel-cell-inner',
      );
      pickTimeInMinutePanelInnerEl.forEach(el => {
        el.addEventListener('click', e => {
          setPickMinute(+e.target.innerText);
        });
      });
    }
  }, [isProject, open]);

  // NOTE: project일 경우 실행
  // date값 적용 안되었을 경우, oneDayLater.date()일 경우 duedate 기본값 적용
  useDidUpdateEffect(() => {
    if (isProject && open && (!value || value?.date() === oneDayLater.date())) {
      setPickDate(oneDayLater.date());
    }
  }, [isProject, open, !!value]);
  // oneDayLater 날짜 선택시 바로 disabled hour, time 적용
  useDidUpdateEffect(() => {
    // console.log(pickDate);
    // console.log(oneDayLater.date());
    if (isProject && open && pickDate === oneDayLater.date()) {
      handleChangeDate(
        moment.tz('Asia/Seoul').hour(defaultHour).minute(defaultMinute).add(addDay, 'd'),
      );
      // const hourEl = document.querySelectorAll(
      //   '.customDatePicker__dropdown .ant-picker-time-panel .ant-picker-time-panel-column:first-child .ant-picker-time-panel-cell-inner',
      // );
      // const minuteEl = document.querySelectorAll(
      //   '.customDatePicker__dropdown .ant-picker-time-panel .ant-picker-time-panel-column:last-child .ant-picker-time-panel-cell-inner',
      // );

      // const pickHourEl = Array.from(hourEl).find(el => +el.textContent === defaultHour);
      // pickHourEl.click();
      // const pickMinuteEl = Array.from(minuteEl).find(el => +el.textContent === defaultMinute);
      //   pickMinuteEl.click();
    }
  }, [isProject, open, pickDate]);
  // oneDayLater 다른 날 클릭시 초기값 0분 설정
  useDidUpdateEffect(() => {
    if (isProject && open && pickDate && pickDate !== oneDayLater.date()) {
      const minuteEl = document.querySelectorAll(
        '.customDatePicker__dropdown .ant-picker-time-panel .ant-picker-time-panel-column:last-child .ant-picker-time-panel-cell-inner',
      );
      const pickMinuteEl = Array.from(minuteEl).find(el => +el.textContent === 0);
      return pickMinuteEl.click();
    }
    if (isProject && !open) {
      // 설정해논 값이 바뀌기 때문에 초기화
      return setPickDate(null);
    }
  }, [isProject, open, !!pickDate]);

  // console.log(value, 'value');
  // console.log(defaultValue, 'defaultValue');
  // console.log(moment.unix(moment().unix()), 'moment');
  // console.log(moment().unix(), 'moment');
  // ant-picker-cell-selected

  return (
    <Styled.DatePicker
      data-component-name="CustomDatePicker"
      className={cx('datePicker__box', className)}
      width={width}
      height={height}
      fullWidth={fullWidth}
      borderRadius={borderRadius}
    >
      {type === 'date' && (
        <DatePicker
          dropdownClassName="customDatePicker__dropdown"
          disabled={disabled}
          style={style}
          // value={value || defaultVisibleValue || date}
          value={value || defaultVisibleValue || date}
          defaultValue={defaultValue}
          placeholder={placeholder}
          format={format}
          showToday={showToday}
          // showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
          dateRender={renderChangable && handleDateRender}
          showTime={showTime && { format: 'HH:mm' }}
          minuteStep={minuteStep}
          disabledDate={disabledDate && setDisabledDate}
          disabledTime={disabledTime && setDisabledTime}
          // disabledTime={setDisabledTime}
          suffixIcon={<img src={icon_calendar02} alt="calendar" />}
          // suffixIcon={<img src={icon_calendar} alt="calendar" />}
          onChange={handleChangeDate}
          onOpenChange={handleOpenChange}
          className="datePicker__content"
        />
      )}
      {type === 'time' && (
        <TimePicker
          disabled={disabled}
          style={style}
          value={value || defaultVisibleValue || date}
          defaultValue={defaultValue ? defaultValue : moment()}
          placeholder={placeholder}
          // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          // disabledTime={disabledTime && setDisabledTime}
          // disabledTime={setDisabledTime}
          // disabledSeconds
          onChange={handleChangeDate}
          className="datePicker__content"
        />
      )}
      <Styled.GlobalStyles />
    </Styled.DatePicker>
  );
});

const Styled = {
  DatePicker: styled.div`
    position: relative;
    width: ${props => props.width && `${props.width}px`};
    width: ${props => props.fullWidth && `100%`};
    height: ${props => props.height && `${props.height}px`};
    border-radius: ${props => (props.borderRadius ? `${props.borderRadius}px` : `4px`)};
    .MuiOutlinedInput-adornedEnd {
      width: 100%;
    }
    &:not(.ant-picker-focused).error {
      .ant-picker {
        border-color: ${color.red};
      }
    }
    .ant-picker {
      width: 100%;
      height: 100%;
      border-radius: inherit;

      &.ant-picker-focused {
        box-shadow: none;
      }
      .ant-picker-input > input[disabled],
      &.ant-picker-disabled {
        background-color: #fff;
        cursor: default;
      }
      &.ant-picker-disabled {
        border-color: #bbbbbb;
      }
      .ant-picker-suffix {
        display: flex;
      }
      .ant-picker-input:hover .ant-picker-clear {
        padding-left: 8px;
      }
    }
  `,
  GlobalStyles: createGlobalStyle`
    .anticon-calendar {
      color: ${color.black_font};
    }
    .ant-picker-content {
      .ant-picker-cell {
        .ant-picker-cell-inner{
          &.additional-amount {
            /* color: blue; */
          }
        }
      }
      .ant-picker-cell-today,
      .ant-picker-cell-selected
       {
         .ant-picker-cell-inner{
          border-radius: 50%;
          &:before{
            border-radius: 50% !important;
          }
         }
      }
    }
  `,
};

export default CustomDatePicker;
