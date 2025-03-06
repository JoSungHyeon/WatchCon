import { FC, useState } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import styles from './style/Graph.module.css';
import Type from './Type';

const Graph: FC = () => {
  const [lineChartType, setLineChartType] =
    useState<number>(1);
  const [barChartType, setBarChartType] =
    useState<number>(1);

  const handleLineChartTypeChange = (type: string) => {
    switch (type) {
      case 'Month':
        setLineChartType(1);
        break;
      case 'Week':
        setLineChartType(0);
        break;
      default:
        setLineChartType(1);
    }
  };

  const handleBarChartTypeChange = (type: string) => {
    switch (type) {
      case 'Month':
        setBarChartType(1);
        break;
      case 'Week':
        setBarChartType(0);
        break;
      default:
        setBarChartType(3);
    }
  };

  return (
    <div className={styles.graphWrapper}>
      <div className={styles.connectionWrap}>
        <div className={styles.connectionTop}>
          <div className={styles.name}>
            <strong>접속자 / 사용자</strong>
            <div className={styles.type}>
              <span>Free</span>
              <span>Pro</span>
            </div>
          </div>
          <Type
            types={['Month', 'Week']}
            defaultType='Month'
            onTypeChange={handleLineChartTypeChange}
          />
        </div>
        <div className={styles.connectionBottom}>
          <div className={styles.graph}>
            <LineChart
              type={lineChartType === 0 ? 'Week' : 'Month'}
            />
          </div>
        </div>
      </div>
      <div className={styles.downloadWrap}>
        <div className={styles.downloadTop}>
          <div className={styles.name}>
            <strong>다운로드</strong>
            <div className={styles.type}>
              <span>Free</span>
              <span>Pro</span>
            </div>
          </div>
          <Type
            types={['Month', 'Week']}
            defaultType='Month'
            onTypeChange={handleBarChartTypeChange}
          />
        </div>
        <div className={styles.downloadBottom}>
          <div className={styles.graph}>
            <BarChart
              type={barChartType === 0 ? 'Week' : 'Month'}
            />
          </div>
        </div>
        {/* <div className={styles.downloadSub}>
          <div className={styles.subItem}>
            <span>60%</span>
            <p>Free</p>
          </div>
          <div className={styles.subItem}>
            <span>30%</span>
            <p>Pro</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Graph;
