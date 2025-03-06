//ts-nocheck
//ts-ignore

'use client';
import { useEffect, useRef, useState } from 'react';

import { NotificationModal } from '@/app/components/common/modals';
import { useMainQuery } from '@/app/hooks/queries/main/useMainQuery';
import { useModalStore } from '@/app/store/modal.store';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Character from '../components/user/Character';
import Example from '../components/user/Example';
import Faq from '../components/user/Faq';
import Intro from '../components/user/Intro';
import Pricing from '../components/user/Pricing';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeModalId, setActiveModalId] = useState<
    number | null
  >(null);
  const { downloadOptions, noticeData } = useMainQuery();

  const modalStore = useModalStore();

  const [positions, setPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  const dragRef = useRef<{
    isDragging: boolean;
    currentId: number | null;
    initialX: number;
    initialY: number;
    offsetX: number;
    offsetY: number;
  }>({
    isDragging: false,
    currentId: null,
    initialX: 0,
    initialY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // 윈도우 크기 상태 추가
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  const [openModals, setOpenModals] = useState<Set<number>>(
    new Set(),
  );

  const handleCloseModal = (noticeId: number) => {
    setOpenModals((prev) => {
      const newSet = new Set(prev);
      newSet.delete(noticeId);
      return newSet;
    });
  };

  useEffect(() => {
    // 초기에 모든 모달을 열어둠
    if (noticeData) {
      setOpenModals(
        new Set(
          noticeData
            .filter((notice) => notice.is_notice_pop === 1)
            .map((notice) => notice.id),
        ),
      );
    }
  }, [noticeData]);

  // useEffect로 윈도우 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (
    e: React.MouseEvent,
    noticeId: number,
    index: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setActiveModalId(noticeId); // zIndex 높게하려고

    dragRef.current = {
      isDragging: true,
      currentId: noticeId,
      initialX: positions[noticeId]?.x ?? index * 550,
      initialY: positions[noticeId]?.y ?? 200,
      offsetX,
      offsetY,
    };
  };

  const calculateInitialPosition = (index: number) => {
    const modalWidth = 500; // 모달의 예상 너비
    const modalHeight = 400; // 모달의 예상 높이
    const padding = 20; // 모달 간의 간격
    const headerHeight = 150; // 헤더의 높이

    const viewportWidth =
      window.innerWidth - modalWidth - padding;
    const viewportHeight =
      window.innerHeight - modalHeight - padding;

    // 한 행에 2개씩 배치
    const row = Math.floor(index / 2);
    const col = index % 2;

    const x = padding + col * (modalWidth + padding);
    const y =
      headerHeight +
      padding +
      row * (modalHeight + padding); // 헤더 높이를 고려하여 시작 위치 조정

    // 화면 범위 내로 제한
    return {
      x: Math.min(x, viewportWidth),
      y: Math.min(y, viewportHeight),
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;

    const { currentId, offsetX, offsetY } = dragRef.current;
    if (currentId === null) return;

    const modalWidth = 500; // 모달의 예상 너비
    const modalHeight = 400 - 120; // 모달의 예상 높이

    // 새로운 위치 계산
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // 화면 경계 체크
    newX = Math.max(
      0,
      Math.min(newX, window.innerWidth - modalWidth),
    );
    newY = Math.max(
      0,
      Math.min(newY, window.innerHeight - modalHeight),
    );

    setPositions((prev) => ({
      ...prev,
      [currentId]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    dragRef.current.currentId = null;
    // setActiveModalId(null); // zIndex 초기화
  };

  return (
    <>
      <Header />
      <main
        ref={mainRef}
        className='h-[calc(100vh-header-height-footer-height)] overflow-y-auto scroll-smooth'
      >
        <Intro downloadOptions={downloadOptions} />
        <section className='character-section'>
          <Character />
        </section>
        <Example />
        <Pricing />
        <Faq />
        <Footer />
      </main>

      {modalStore.ModalStates.MAIN.notification &&
        windowWidth > 1100 && (
          <div className='fixed top-0 right-0 p-4 flex flex-col gap-4'>
            {noticeData?.map((notice, index: number) => {
              const initialPos =
                calculateInitialPosition(index);
              return (
                notice.is_notice_pop === 1 && (
                  <div
                    key={notice.id}
                    style={{
                      position: 'fixed',
                      top: `${positions[notice.id]?.y ?? initialPos.y}px`,
                      left: `${positions[notice.id]?.x ?? initialPos.x}px`,
                      zIndex:
                        activeModalId === notice.id
                          ? 9999
                          : index + 1000,
                    }}
                  >
                    <NotificationModal
                      key={notice.id}
                      isOpen={
                        modalStore.ModalStates.MAIN
                          .notification
                      }
                      onClose={() =>
                        handleCloseModal(notice.id)
                      }
                      title={notice.title}
                      content={notice.content}
                      noticeId={notice.id}
                      onDragStart={(e) =>
                        handleMouseDown(e, notice.id, index)
                      }
                      onDragMove={handleMouseMove}
                      onDragEnd={handleMouseUp}
                    />
                  </div>
                )
              );
            })}
          </div>
        )}
    </>
  );
}
