import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import { _font } from 'styles/_variables';
import { color } from 'styles/utils';
import { useImmer } from 'use-immer';
import { PieChart } from 'react-minimal-pie-chart';

export default function DonutChart({ width = 250, data = [], legendsData = [], children = null }) {
  const containerStyle = {
    width,
    height: width,
  };

  const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };

  return (
    <Styled.PieChart style={containerStyle}>
      {!data.length && (
        <div className="chart__no_data" style={containerStyle}>
          Select state type.
        </div>
      )}
      <div className="chart__box">
        {children}
        <PieChart
          data={data}
          lineWidth={35}
          animate
          startAngle={-90}
          // lengthAngle={180}
          // label={({ dataEntry }) => dataEntry.value}
          // label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
          // labelStyle={index => ({
          //   ...defaultLabelStyle,
          //   // fill: '#000',
          //   fill: data[index].color,
          // })}
          // labelPosition={80}
          // radius={42}
        />
      </div>
    </Styled.PieChart>
  );
}
