import { FC } from 'react';
import styles from './style/Group.module.css';

const Group: FC = () => {
  return (
    <div className={styles.group}>
      <p>그룹표임</p>
      <select>
        <option value='' className={styles.groupSelect}>
          그룹을 선택하세요.
        </option>
      </select>
    </div>
  );
};

export default Group;
