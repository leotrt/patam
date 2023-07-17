import './Calendar.css';
import PageContainer from '../components/page-container/PageContainer';
import React, { useState } from 'react';
import { startOfMonth } from 'date-fns'
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import CalendarDaySwiper from '../components/calendar-day/CalendarDaySwiper';
import { IonModalCustomEvent } from '@ionic/core/dist/types/components';
import { OverlayEventDetail } from '@ionic/core';
import CalendarDayModal from '../components/calendar-day/CalendarDayModal';
import { PaidDayUI, upsertPaidDay } from '../store/paid-days.repository';
import { calendarStore } from '../store/calendar.repository';
import { setProp } from '@ngneat/elf';
import MonthSwiper from '../components/MonthSwiper';


const Calendar: React.FC = () => {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [dayEditing, setDayEditing] = useState(false);
  const [currentDay, setCurrentDay] = useState<PaidDayUI | null>(null);

  calendarStore.update(setProp('currentMonth', month));

  const onDayModalWillDismiss = (ev: IonModalCustomEvent<OverlayEventDetail>) => {
    setDayEditing(false);
    if (ev.detail.data) {
      const date = month;
      date.setDate(currentDay!.day);
      upsertPaidDay(date, ev.detail.data);
    }

  }

  return (
  <PageContainer title="Calendrier">
    <div className="calendar-inner">
      <MonthSwiper month={month} setMonth={setMonth}>
        <CalendarDaySwiper month={month} setCurrentDay={setCurrentDay} openModal={() => setDayEditing(true)}/>
      </MonthSwiper>
    </div>
    <CalendarDayModal currentDay={currentDay!} isOpen={dayEditing} onWillDismiss={onDayModalWillDismiss}/>
  </PageContainer>
  );
};

export default Calendar;
