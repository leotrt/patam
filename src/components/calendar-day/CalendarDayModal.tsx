import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRange,
  IonToggle,
  IonToolbar
} from '@ionic/react';
import { calendarOutline, close, fastFoodOutline, homeOutline, save, sunnyOutline, timeOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { IonModalCustomEvent } from '@ionic/core/dist/types/components';
import { OverlayEventDetail } from '@ionic/core';
import { deletePaidDay, PaidDayUI } from '../../store/paid-days.repository';

interface CalendarDayModalProps {
  currentDay: PaidDayUI;
  isOpen: boolean;
  onWillDismiss: (event: IonModalCustomEvent<OverlayEventDetail>) => void;
}

export const pinFormatter = (value: number): string => {
  const hours = Math.floor(value);
  const min = value - hours;

  return `${hours}h${min ? ` ${(60 * min)}` : ''}`;
}


const CalendarDayModal: React.FC<CalendarDayModalProps> = ({ currentDay, isOpen, onWillDismiss }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  let [editingDay, setEditingDay] = useState<PaidDayUI | null>(null);

  useEffect(() => {
    if (currentDay) {
      setEditingDay(currentDay);
    }
  }, [currentDay]);

  const toggleOut = (e: CustomEvent) => {
    const checked = e.detail.checked;
    const values: PaidDayUI = { ...(editingDay || currentDay), out: checked };

    if (checked) {
      values.pto = false;
      values.bankHoliday = false;
      values.mealCost = 0;
    }

    setEditingDay(values);
  }

  const toggleBankHoliday = (e: CustomEvent) => {
    const checked = e.detail.checked;
    const values: PaidDayUI = { ...(editingDay || currentDay), bankHoliday: checked };

    if (checked) {
      values.pto = false;
      values.out = false;
      values.mealCost = 0;
    }

    setEditingDay(values);
  }

  return <IonModal ref={modal}
                   isOpen={isOpen}
                   initialBreakpoint={0.5}
                   breakpoints={[0, 0.5, 0.8]}
                   onWillDismiss={onWillDismiss}>
    <IonHeader className={'settings-modal-header'}>
      <IonToolbar>
        <IonButtons>
          <IonButton color={'dark'} onClick={() => modal?.current?.dismiss()}>
            <IonIcon slot={'start'} icon={close}></IonIcon>
            <IonLabel>Cancel</IonLabel>
          </IonButton>
        </IonButtons>
        <IonButton slot={'end'} color={'primary'} onClick={() => modal?.current?.dismiss(editingDay)}>
          <IonIcon slot={'start'} icon={save}></IonIcon>
          <IonLabel>Save</IonLabel>
        </IonButton>
      </IonToolbar>
    </IonHeader>
    <IonContent className={'settings-modal-content'}>
      <div className={'setting-wrapper'}>
        <IonIcon icon={timeOutline}></IonIcon>
        <IonRange mode={'ios'} pinFormatter={pinFormatter} value={editingDay?.nbHours} min={0}
                  max={12}
                  onIonChange={({ detail }) => setEditingDay({
                    ...editingDay!,
                    nbHours: Number(detail.value)
                  })}
                  step={.25}></IonRange>
        <div className={'hour-range-label'}>{pinFormatter(editingDay?.nbHours || 0)}</div>
      </div>
      <div className={'setting-wrapper'}>
        <IonIcon icon={fastFoodOutline}></IonIcon>
        <IonRange disabled={editingDay?.out || editingDay?.bankHoliday} mode={'ios'} pinFormatter={pinFormatter}
                  value={editingDay?.mealCost} min={0}
                  max={12}
                  onIonChange={({ detail }) => setEditingDay({
                    ...editingDay!,
                    mealCost: Number(detail.value)
                  })}
                  step={.1}></IonRange>
        <div className={'hour-range-label'}>{(editingDay?.mealCost || 0).toFixed(2)}€</div>
      </div>
      <IonItem className={'pto-wrapper'} lines={'none'}>
        <div style={{ display: 'flex', marginRight: 10 }} className={'ion-align-items-center'}>
          <IonIcon icon={sunnyOutline}></IonIcon>
        </div>
        <IonToggle disabled={editingDay?.out || editingDay?.bankHoliday} checked={editingDay?.pto}
                   onIonChange={(e: CustomEvent) => setEditingDay({
                     ...editingDay!,
                     pto: e.detail.checked
                   })}></IonToggle>
      </IonItem>
      <IonItem className={'pto-wrapper'} lines={'none'}>
        <div style={{ display: 'flex', marginRight: 10 }} className={'ion-align-items-center'}>
          <IonIcon icon={homeOutline}></IonIcon>
        </div>
        <IonToggle disabled={editingDay?.bankHoliday} checked={editingDay?.out} onIonChange={toggleOut}></IonToggle>
      </IonItem>
      <IonItem className={'pto-wrapper'} lines={'none'}>
        <div style={{ display: 'flex', marginRight: 10 }} className={'ion-align-items-center'}>
          <IonIcon icon={calendarOutline}></IonIcon>
        </div>
        <IonToggle disabled={editingDay?.out} checked={editingDay?.bankHoliday}
                   onIonChange={toggleBankHoliday}></IonToggle>
      </IonItem>
      {
      editingDay?.edited &&
          <IonButton expand={'block'} color={'danger'} fill={'clear'} onClick={() => {
            deletePaidDay(editingDay!.id);
            modal?.current?.dismiss();
          }}>
              <IonLabel>Reset</IonLabel>
              <IonIcon slot={'end'} icon={close}></IonIcon>
          </IonButton>
      }
    </IonContent>
  </IonModal>
}

export default CalendarDayModal;
