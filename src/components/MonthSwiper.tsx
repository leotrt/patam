import { Swiper as ISwiper, Virtual } from 'swiper';
import { formatMonth, generateMonths } from '../utils/dates';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import React, { useState } from 'react';
import { addMonths, differenceInMonths, startOfMonth, subMonths } from 'date-fns';
import { calendarStore } from '../store/calendar.repository';
import { setProp } from '@ngneat/elf';
import './MonthSwiper.css';

interface MonthSwiperProps {
  month: Date;
  setMonth: (month: Date) => void;
}

const MonthSwiper: React.FC<MonthSwiperProps> = ({ children, month, setMonth }) => {
  const [monthRange, setMonthRange] = useState([1, 1])
  const [monthSwiperRef, setMonthSwiperRef] = useState<ISwiper | null>(null);

  const prevMonth = () => {
    const [before, after] = monthRange;
    const minDate = subMonths(startOfMonth(new Date()), before);
    const newMonth = subMonths(month, 1);

    if (Math.abs(differenceInMonths(month, minDate)) <= 2) {
      setMonthRange([before + 1, after]);
    }
    setMonth(newMonth);
    calendarStore.update(setProp('currentMonth', newMonth));
    monthSwiperRef!.slidePrev();
  }

  const nextMonth = () => {
    const [before, after] = monthRange;
    const maxDate = addMonths(startOfMonth(new Date()), after);
    const newMonth = addMonths(month, 1);
    if (Math.abs(differenceInMonths(maxDate, month)) <= 2) {
      setMonthRange([before, after + 1]);
    }
    setMonth(newMonth);
    monthSwiperRef!.slideNext();

    calendarStore.update(setProp('currentMonth', newMonth));
  }

  return (<Swiper className="month-swiper"
                  onSwiper={setMonthSwiperRef}
                  modules={[Virtual]}
                  allowTouchMove={false}
                  virtual>
    {
      generateMonths(monthRange).map((monthInRange, i) =>
      <SwiperSlide key={monthInRange.getTime()} virtualIndex={i}>
        <div className="calendar-ctr">
          <div className="calendar-title-ctr">
            <IonButton fill="clear" expand="block" onClick={prevMonth}>
              <IonIcon icon={chevronBack} slot="icon-only"/>
            </IonButton>
            <div className="calendar-title">
              {formatMonth(month)}
            </div>
            <IonButton fill="clear" expand="block" onClick={nextMonth}>
              <IonIcon icon={chevronForward} slot="icon-only"/>
            </IonButton>
          </div>
          {children}
        </div>
      </SwiperSlide>
      )
    }
  </Swiper>)
}

export default MonthSwiper;
