import { FC, useState } from 'react';
import styles from './style/Type.module.css';

interface TypeProps {
  onTypeChange: (type: string) => void;
  types?: string[];
  defaultType?: string;
}

const Type: FC<TypeProps> = ({
  onTypeChange,
  types = ['Month', 'Week', 'Day'],
  defaultType = 'Month',
}) => {
  const [activeType, setActiveType] = useState(defaultType);

  const handleTypeClick = (
    type: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    setActiveType(type);
    onTypeChange(type);
  };

  return (
    <div className={styles.typeWrap}>
      <ul>
        {types.map((type) => (
          <li key={type}>
            <a
              href=''
              className={
                activeType === type ? styles.on : ''
              }
              onClick={(e) => handleTypeClick(type, e)}
            >
              {type}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Type;
