import { IonAvatar, IonButton, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/react';
import { refreshCircleOutline, saveOutline } from 'ionicons/icons';
import './Preferences.css';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import PageContainer from '../components/page-container/PageContainer';
import { useForm } from 'react-hook-form'
import { ConfigProps, configStore, updateConfig } from '../store/config.repository';

const initialAvatarUrl = 'https://avatars.dicebear.com/api/open-peeps/initial.svg?head=afro,bangs,bangs2,bantuKnots,bun,bun2,buns,cornrows,cornrows2,dreads1,dreads2,grayBun,grayMedium,long,longAfro,longBangs,longCurly,medium1,medium2,medium3,mediumBangs,mediumBangs2,mediumBangs3,mediumStraight,short3&facialHairProbability=0&face=awe,calm,cute,lovingGrin1,smile,smileLOL&accessories=glasses,glasses2,glasses3,glasses4,glasses5&accessoriesProbability=33&maskProbability=0';

const Preferences: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useLocalStorage('patam-avatarUrl', initialAvatarUrl)
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useLocalStorage('patam-name', 'Delphine')
  const nannyNameInput = useRef<HTMLIonInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConfigProps>({
    defaultValues: configStore.value
  });

  const onSubmit = (data: ConfigProps) => {
    debugger;
    updateConfig(data);
  }

  const updateAvatar = () => {
    setAvatarUrl(initialAvatarUrl.replace('initial', `${Math.random()}`));
  }

  useEffect(() => {
    if (editingName) {
      setTimeout(() => nannyNameInput.current?.setFocus());
    }
  }, [editingName]);

  return (
  <PageContainer title="Préférences">

    <div className="page-inner">
      <div className="avatar-ctr">
        {
          editingName ?
          <IonInput className="nanny-name"
                    value={name}
                    ref={nannyNameInput}
                    onIonChange={e => setName(e.detail.value!)}
                    onBlur={() => setEditingName(false)}></IonInput> :
          <h1 onClick={() => setEditingName(true)}>
            {name}
          </h1>
        }

        <IonAvatar>
          <img src={avatarUrl} alt="Avatar Nounou"/>
        </IonAvatar>
        <IonButton fill="clear" onClick={updateAvatar}>
          <IonIcon slot="icon-only" icon={refreshCircleOutline}/>
        </IonButton>
      </div>
      <div className="preferences-form">
        <IonItem lines="none">
          <IonLabel position="stacked">Salaire mensuel de base</IonLabel>
          <IonInput {...register('baseSalary', { required: true, min: 0, valueAsNumber: true })}
                    placeholder="345,67" type="number"></IonInput>
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked">Coût horaire</IonLabel>
          <IonInput {...register('hourlyCost', { required: true, min: 0, valueAsNumber: true })}
                    placeholder="3,20" type="number"></IonInput>
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked">Frais d'entretien journaliers</IonLabel>
          <IonInput {...register('dailyMaintenanceFees', { required: true, min: 0, valueAsNumber: true })}
                    placeholder="3,10" type="number"></IonInput>
        </IonItem>
        <h2>Nombre d'heures par jour</h2>
        <div className="days-grid">
          <div className="day">
            <IonLabel>Dim.</IonLabel>
            <IonInput {...register('hoursPerDay.0', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Lun.</IonLabel>
            <IonInput  {...register('hoursPerDay.1', { required: true, min: 0, valueAsNumber: true })}
                       placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Mar.</IonLabel>
            <IonInput {...register('hoursPerDay.2', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Mer.</IonLabel>
            <IonInput {...register('hoursPerDay.3', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Jeu.</IonLabel>
            <IonInput {...register('hoursPerDay.4', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Ven.</IonLabel>
            <IonInput {...register('hoursPerDay.5', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Sam.</IonLabel>
            <IonInput {...register('hoursPerDay.6', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
        </div>
        <h2>Coût Repas par jour</h2>
        <div className="days-grid">
          <div className="day">
            <IonLabel>Dim.</IonLabel>
            <IonInput {...register('mealCost.0', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Lun.</IonLabel>
            <IonInput {...register('mealCost.1', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Mar.</IonLabel>
            <IonInput {...register('mealCost.2', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Mer.</IonLabel>
            <IonInput {...register('mealCost.3', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Jeu.</IonLabel>
            <IonInput {...register('mealCost.4', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Ven.</IonLabel>
            <IonInput {...register('mealCost.5', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
          <div className="day">
            <IonLabel>Sam.</IonLabel>
            <IonInput {...register('mealCost.6', { required: true, min: 0, valueAsNumber: true })}
                      placeholder="0" type="number"></IonInput>
          </div>
        </div>
        <IonButton disabled={!isValid} className="preferences-save-btn" expand="block"
                   onClick={handleSubmit(onSubmit)}>
          <IonIcon slot="start" icon={saveOutline}/>
          Enregistrer
        </IonButton>

      </div>
    </div>

  </PageContainer>
  );
};

export default Preferences;
