import './CalendarDaySwiper.css';
import React from 'react';
import { Virtual } from 'swiper';
import { days$, formatDay } from '../../utils/dates';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonIcon, IonLabel } from '@ionic/react';
import { calendar, fastFoodOutline, home, homeOutline, sunny, sunnyOutline, timeOutline } from 'ionicons/icons';
import { isSameMonth } from 'date-fns';
import { useObservable } from '@ngneat/react-rxjs';
import { pinFormatter } from './CalendarDayModal';

interface CalendarDayProps {
  month: Date;
  openModal: Function;
  setCurrentDay: Function;
}

const CalendarDaySwiper: React.FC<CalendarDayProps> = ({ month, openModal, setCurrentDay }) => {
  const [days] = useObservable(days$);
  const initialDayIndex = isSameMonth(month, new Date()) ? new Date().getDate() - 1 : 0;

  return (<>
    <Swiper initialSlide={initialDayIndex} rewind={true} modules={[Virtual]}
            className="paid-days" virtual>
      {
        days?.map((paidDay, index) =>
        <SwiperSlide key={paidDay.day} virtualIndex={index}>
          <div className={`paid-day ${paidDay.active ? '' : 'inactive'} ${paidDay.edited ? 'edited' : ''}`}
               key={paidDay.day}
               onClick={() => {
                 setCurrentDay(paidDay);
                 openModal();
               }}
          >
            <h3>{formatDay(paidDay.day, month)}</h3>
            <div className="paid-day-info-ctr">
              <div className={'inner-wrapper'}>
                <div className="paid-day-info">
                  <IonIcon icon={timeOutline}></IonIcon>
                  <IonLabel>{pinFormatter(paidDay.nbHours)}</IonLabel>
                </div>
                <div className="paid-day-info">
                  <IonIcon icon={fastFoodOutline}></IonIcon>
                  <IonLabel>{(paidDay.mealCost || 0).toFixed(2).replace(',', '.')}€</IonLabel>
                </div>
              </div>
              <div className={`paid-day-info pto ${paidDay.pto ? 'emphasized' : ''}`}>
                <IonIcon icon={paidDay.pto ? sunny : sunnyOutline}></IonIcon>
                <IonLabel>Congé</IonLabel>
              </div>
              {(paidDay.out &&
                  <div className={`paid-day-info out ${paidDay.out ? 'emphasized' : ''}`}>
                      <IonIcon icon={paidDay.out ? home : homeOutline}></IonIcon>
                      <IonLabel>Maison</IonLabel>
                  </div>)}
              {(paidDay.bankHoliday &&
                  <div className={`paid-day-info bank emphasized`}>
                      <IonIcon icon={calendar}></IonIcon>
                      <IonLabel>Férié</IonLabel>
                  </div>)}
            </div>
          </div>
        </SwiperSlide>
        )
      }
    </Swiper>
  </>)
}

export default CalendarDaySwiper;
