'use client';

import { usePricingMutation } from '@/app/hooks/mutations/admin/pricing/usePricingMutation';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './style/Table.module.css';

const FeatureLimit = ({ data }) => {
  const [mode, setMode] = useState('list');
  const [newData, setNewData] = useState({
    price_model: 0,
    feature1: 0,
    feature2: 0,
    feature3: 0,
    feature4: 0,
    feature5: 0,
    feature6: 0,
    feature7: 0,
    feature8: 0,
    feature9: 0,
    feature10: 0,
    feature11: 0,
    feature12: 0,
    feature13: 0,
    feature14: 0,
    feature15: 0,
    notice_at: '',
    apply_at: '',
    expired_at: '',
  });
  const [editData, setEditData] = useState(data);
  const [announcementDate, setAnnouncementDate] =
    useState(null);
  const [applicationDate, setApplicationDate] =
    useState(null);

  const { createFeature, updateFeature } =
    usePricingMutation();

  const featureData = [
    { name: 'Security', type: 'checkbox' },
    { name: 'Multi Language', type: 'checkbox' },
    { name: 'Connection Password', type: 'checkbox' },
    { name: 'Monitoring', type: 'checkbox' },
    { name: 'To Remote Connection', type: 'text' },
    { name: 'From Remot Connection', type: 'text' },
    { name: 'Login account', type: 'text' },
    { name: 'Mobile Device', type: 'checkbox' },
    { name: 'File Transfer', type: 'checkbox' },
    { name: 'Address Group', type: 'text' },
    { name: 'Adderss', type: 'text' },
    { name: 'Favorites', type: 'text' },
    { name: 'Recently', type: 'text' },
    { name: 'Wed - Mypage', type: 'checkbox' },
    {
      name: 'Chat / Voice / Sereen Recording',
      type: 'checkbox',
    },
  ];

  const handleInputChange = (
    index: number,
    columnIndex: number,
    value: any,
  ) => {
    const featureKey = `feature${index + 1}`;

    // feature type에 따라 다른 값을 저장
    const featureType = featureData[index].type;
    let processedValue;

    if (featureType === 'checkbox') {
      processedValue = value ? 1 : 0;
    } else {
      processedValue = value === '' ? null : Number(value);
    }

    setNewData((prev) => ({
      ...prev,
      [featureKey]: processedValue,
    }));
  };

  const handleEditInputChange = (
    index: number,
    columnIndex: number,
    value: any,
  ) => {
    const featureKey = `feature${index + 1}`;
    const featureType = featureData[index].type;
    let processedValue;

    if (featureType === 'checkbox') {
      processedValue = value ? 1 : 0;
    } else {
      processedValue = value === '' ? null : Number(value);
    }

    setEditData((prev) => ({
      ...prev,
      [featureKey]: Number(processedValue),
    }));
  };

  const handleDateChange = (date) => {
    console.log('Selected date:', date);
    setAnnouncementDate(date);

    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    console.log('Application date:', nextMonth);
    setApplicationDate(nextMonth);

    // mode에 따라 적절한 상태 업데이트
    if (mode === 'new') {
      setNewData((prev) => ({
        ...prev,
        notice_at: date.toISOString().split('T')[0],
        apply_at: nextMonth.toISOString().split('T')[0],
        expired_at: nextMonth.toISOString().split('T')[0],
      }));
    } else if (mode === 'edit') {
      setEditData((prev) => ({
        ...prev,
        notice_at: date.toISOString().split('T')[0],
        apply_at: nextMonth.toISOString().split('T')[0],
        expired_at: nextMonth.toISOString().split('T')[0],
      }));
    }
  };

  const handleEditMode = () => {
    setEditData({ ...data }); // 기존 데이터로 초기화

    // 기존 날짜 데이터 설정
    if (data.notice_at) {
      const noticeDate = new Date(data.notice_at);
      setAnnouncementDate(noticeDate);

      const applyDate = new Date(data.apply_at);
      setApplicationDate(applyDate);
    }

    setMode('edit');
  };

  return (
    <table
      className={`${styles.table} ${mode === 'new' || mode === 'edit' ? styles.on : ''}`}
    >
      <thead className={styles.featTableHead}>
        <tr>
          <th>Key Feadture</th>
          <th>Free</th>
          <th>Basic Price</th>
          <th>Premium Price</th>
          <th>Business Price</th>
        </tr>
      </thead>
      <tbody className={styles.featTableBody}>
        {featureData.map((feature, index: number) => (
          <tr key={index}>
            <td>{feature.name}</td>
            {[...Array(4)].map((_, i) => (
              <td key={i}>
                {feature.type === 'checkbox' ? (
                  <input
                    type='checkbox'
                    disabled={mode === 'list'}
                    checked={
                      mode === 'edit'
                        ? editData[
                            `feature${index + 1}`
                          ] === 1
                        : mode === 'new'
                          ? newData[
                              `feature${index + 1}`
                            ] === 1
                          : data?.[
                              `feature${index + 1}`
                            ] === 1
                    }
                    onChange={(e) => {
                      if (mode === 'edit') {
                        handleEditInputChange(
                          index,
                          i,
                          e.target.checked,
                        );
                      } else if (mode === 'new') {
                        handleInputChange(
                          index,
                          i,
                          e.target.checked,
                        );
                      }
                    }}
                  />
                ) : (
                  <input
                    type='number'
                    disabled={mode === 'list'}
                    value={
                      mode === 'new'
                        ? newData[`feature${index + 1}`] ||
                          ''
                        : mode === 'edit'
                          ? editData[
                              `feature${index + 1}`
                            ] || ''
                          : data?.[`feature${index + 1}`] ||
                            ''
                    }
                    onChange={(e) =>
                      mode === 'new'
                        ? handleInputChange(
                            index,
                            i,
                            e.target.value,
                          )
                        : mode === 'edit'
                          ? handleEditInputChange(
                              index,
                              i,
                              e.target.value,
                            )
                          : null
                    }
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
        {mode === 'list' ? (
          <tr className={styles.btnWrap}>
            <td>
              <button onClick={() => setMode('new')}>
                New Feature
              </button>
              <button onClick={handleEditMode}>Edit</button>
            </td>
          </tr>
        ) : mode == 'new' ? (
          <>
            <tr className={styles.newFeature}>
              <td>
                <p>공시 30일 후 적용</p>
                <div className={styles.dateWrap}>
                  <div>
                    <p>공시일자</p>
                    <div className={styles.calenderWrapper}>
                      <div className={styles.calenderWrap}>
                        <DatePicker
                          selected={announcementDate}
                          onChange={handleDateChange}
                          className={styles.datepickerInput}
                          dateFormat='yyyy / MM / dd'
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>적용일자</p>
                    <input
                      type='text'
                      value={
                        applicationDate
                          ? applicationDate
                              .toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                              .replace(/\. /g, ' / ')
                              .replace('.', '')
                          : ''
                      }
                      readOnly
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr className={styles.btnWrap}>
              <td>
                <button
                  onClick={() => setMode('list')}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMode('list');
                    createFeature(newData);
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
          </>
        ) : mode == 'edit' ? (
          <>
            <tr className={styles.editFeature}>
              <td>
                <p>공시 30일 후 적용</p>
                <div className={styles.dateWrap}>
                  <div>
                    <p>공시일자</p>
                    <div className={styles.calenderWrapper}>
                      <div className={styles.calenderWrap}>
                        <DatePicker
                          selected={announcementDate}
                          onChange={handleDateChange}
                          className={styles.datepickerInput}
                          dateFormat='yyyy / MM / dd'
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>적용일자</p>
                    <input
                      type='text'
                      value={
                        applicationDate
                          ? applicationDate
                              .toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                              .replace(/\. /g, ' / ')
                              .replace('.', '')
                          : ''
                      }
                      readOnly
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr className={styles.btnWrap}>
              <td>
                <button
                  onClick={() => setMode('list')}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMode('list');
                    const processedData = {
                      ...editData,
                      feature1: Number(editData.feature1),
                      feature2: Number(editData.feature2),
                      feature3: Number(editData.feature3),
                      feature4: Number(editData.feature4),
                      feature8: Number(editData.feature8),
                      feature9: Number(editData.feature9),
                      feature14: Number(editData.feature14),
                      feature15: Number(editData.feature15),
                    };
                    updateFeature(processedData);
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
          </>
        ) : null}
      </tbody>
    </table>
  );
};

export default FeatureLimit;
