import React, { useEffect, useRef, useLayoutEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { contains } from 'lib/library';
import { ResponsiveLine } from '@nivo/line';
import { _font } from 'styles/_variables';
import { color } from 'styles/utils';
import { useImmer } from 'use-immer';

function dummyData(number) {
  return [...Array(number).keys()].map(i => ({
    x: `07-${i < 9 ? '0' + (i + 1) : i + 1}`,
    y: parseInt(Math.random() * 300),
  }));
}

const createdData = dummyData(12);
const uploadedData = dummyData(12);
const downloadedData = dummyData(12);
const completedData = dummyData(12);
// console.log(createdData, 'createData');

export default function LineChart(props) {
  let {
    width = 1140,
    height = 270,
    data = [],
    legendsData = [],
    legendsComponent,
    className = '',
  } = props;
  const containerStyle = {
    width,
    height,
  };
  const chartBoxRef = useRef();
  const legendsBoxRef = useRef();
  const [chartContainerHeight, setChartContainerHeight] = useState(height);

  // SECTION: init set height
  useLayoutEffect(() => {
    if (chartBoxRef.current && legendsBoxRef.current) {
      setChartContainerHeight(
        chartBoxRef.current.clientHeight + legendsBoxRef.current.clientHeight,
      );
    }
  }, [chartBoxRef.current?.height, legendsBoxRef.current?.height]);

  // const createdColor = '#E46666';
  // const uploadedColor = '#F4D35C';
  // const downloadedColor = '#66B895';
  // const completedColor = '#AC7BC3';

  // legendsData = [{ index: 0, label: 'created', color: '#E46666' }];

  // data = [
  //   {
  //     index: 0,
  //     id: 'created',
  //     color: '#e46666',
  //     data: [
  //       { x: '08-13', y: 0 },
  //       { x: '08-12', y: 0 },
  //       { x: '08-11', y: 5 },
  //       { x: '08-10', y: 0 },
  //       { x: '08-09', y: 0 },
  //       { x: '08-08', y: 0 },
  //       { x: '08-07', y: 2 },
  //     ],
  //   },
  // ];

  // data = _.orderBy(data, 'index', 'desc');

  // legendsData = [
  //   {
  //     index: 1,
  //     name: 'Created',
  //     color: createdColor,
  //   },
  //   {
  //     index: 2,
  //     name: 'Uploaded',
  //     color: uploadedColor,
  //   },
  //   {
  //     index: 3,
  //     name: 'Downloaded',
  //     color: downloadedColor,
  //   },
  //   {
  //     index: 4,
  //     name: 'Completed',
  //     color: completedColor,
  //   },
  // ];

  // data = [
  //   {
  //     index: 1,
  //     id: 'Created',
  //     color: createdColor,
  //     data: createdData,
  //   },
  //   {
  //     index: 2,
  //     id: 'Uploaded',
  //     color: uploadedColor,
  //     data: uploadedData,
  //   },
  //   {
  //     index: 3,
  //     id: 'Downloaded',
  //     color: downloadedColor,
  //     data: downloadedData,
  //   },
  //   {
  //     index: 4,
  //     id: 'Completed',
  //     color: completedColor,
  //     data: completedData,
  //   },
  // ];

  const theme = {
    fontFamily: `${_font.muli}`,
    textColor: '#555',
    axis: {
      ticks: {
        text: {
          fontSize: 12,
        },
        line: {
          stroke: '#E2E7EA',
          // strokeWidth: 1
        },
      },
    },
    legends: {
      text: {
        fontSize: 14,
        // textColor: 'white',
      },
    },
    grid: {
      line: {
        stroke: '#E2E7EA',
        // strokeWidth: 2,
        // strokeDasharray: '4 4',
      },
    },
    crosshair: {
      line: {
        stroke: '#F0F7FB',
        // stroke: 'red',
        strokeWidth: 50,
        strokeHeight: 100,
        // strokeOpacity: 0.5,
        strokeDasharray: 0,
        // strokeLinecap: "round"
      },
    },
  };

  const legendsConfig = legendsData
    ? []
    : [
        {
          anchor: 'bottom-left',
          direction: 'row',
          // justify: true,
          translateX: -50,
          translateY: 100,
          itemsSpacing: 5,
          itemDirection: 'left-to-right',
          itemWidth: 110,
          itemHeight: 20,
          // itemOpacity: 0.75,
          symbolSize: 14,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          itemTextColor: '#333',
          effects: [],
        },
      ];

  // useEffect(() => {}, [chartRef]);

  return (
    <Styled.LineChart
      style={{
        ...containerStyle,
        height: chartContainerHeight,
      }}
      data-component-name="LineChart"
      className={className}
    >
      <div className="chart__box" ref={chartBoxRef} style={containerStyle}>
        {!data.length && (
          <div className="chart__no_data" style={containerStyle}>
            Select valid type.
          </div>
        )}
        {!!data.length && (
          <ResponsiveLine
            data={data}
            // margin={{ top: 25, right: 25, bottom: 90, left: 70 }}
            margin={{ top: 10, right: 10, bottom: 60, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 0,
              tickPadding: 15,
              tickRotation: -60,
              // legend: '',
              // legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              // tickSize: 15,
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0,
              // legend: '',
              // legendOffset: 36,
              legendPosition: 'middle',
              format: e => Math.floor(e) === e && e,
            }}
            // enableGridX={false}
            colors={data => data.color}
            pointSize={10}
            pointColor={{ from: 'color', modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            crosshairType="x"
            tooltip={data => (
              <>
                {_.map(data, (e, i) => {
                  // console.log(e, 'e');
                  return (
                    <span key={i} className="chart__tooltip" style={{ background: e.color }}>
                      <span
                        className="chart__tooltip_triangle"
                        style={{ backgroundColor: e.color }}
                      ></span>
                      {e.data.y}
                    </span>
                  );
                })}
              </>
            )}
            useMesh={true}
            // NOTE: 자동너비 불가로 direction row일 경우 커스텀으로 구현
            // NOTE: 기존거 사용시 data에 id 값
            legends={legendsConfig}
            // animate={false}
            motionStiffness={200}
            motionDamping={40}
            theme={theme}
          />
        )}

        <div className="chart__legends_box" ref={legendsBoxRef}>
          {legendsComponent ? (
            <>{legendsComponent}</>
          ) : (
            <div className="chart__legends cf">
              {legendsData.map((item, idx) => (
                <div className="chart__legends_item" key={idx}>
                  <span
                    className="chart__legends_symbol"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="chart__legends_name">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div id="chartdiv" className="chart"></div>
      <div className="legend"></div> */}
      </div>
    </Styled.LineChart>
  );
}

const Styled = {
  LineChart: styled.div`
    position: relative;
    margin: 0 auto;
    background-color: #fff;
    /* margin-top: 100px; */
    /* width: 900px;
    height: 600px; */
    & {
      .chart {
        width: 100%;
        height: 100%;
      }
      .chart__tooltip {
        position: relative;
        top: -10px;
        padding: 7px 8px;
        border-radius: 4px;
        color: #fff;
        .chart__tooltip_triangle {
          position: absolute;
          left: 50%;
          bottom: -8px;
          margin-left: -6px;
          transform: translateX(-50%);
          display: inline-block;
          width: 8px;
          height: 8px;
          transform: rotate(-45deg);
          transform-origin: 0 0;
        }
      }
      .chart__legends_box {
        position: relative;
        top: -20px;
        padding: 0 25px;
      }
      .chart__legends {
        .chart__legends_item {
          display: inline-flex;
          align-items: center;
          &:not(:first-child) {
            margin-left: 12px;
          }
          .chart__legends_symbol {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
          }
          .chart__legends_name {
            margin-left: 5px;
            font-size: 14px;
            color: #333;
          }
        }
      }
      .chart__no_data {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: ${color.gray_week_font};
      }
    }
  `,
};
