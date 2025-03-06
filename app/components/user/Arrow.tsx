import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style/Arrow.module.css';

const Arrow = ({ direction = 'bottom' }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const windowHeight = 0;

    // ScrollTrigger 인스턴스들을 비활성화
    const triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => trigger.disable());

    if (direction === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollBy({
        top: windowHeight,
        behavior: 'smooth',
      });
    }

    // 스크롤 애니메이션이 완료된 후 ScrollTrigger 다시 활성화
    setTimeout(() => {
      triggers.forEach((trigger) => trigger.enable());
    }, 1000); // 스크롤 시간에 맞춰 조절 가능
  };

  return (
    <a
      href=''
      className={styles[`arrow${direction}`]}
      onClick={handleClick}
    >
      <img
        src={`/img/arrow_${direction}.svg`}
        alt={`arrow ${direction}`}
      />
    </a>
  );
};

export default Arrow;
