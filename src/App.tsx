import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendarOutline, cogOutline, pieChartOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Preferences from './pages/Preferences';
import Calendar from './pages/Calendar';
import Summary from './pages/Summary';

setupIonicReact({
  rippleEffect: false,
  mode: 'ios',
});

const App: React.FC = () => (
<IonApp>
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/preferences">
          <Preferences/>
        </Route>
        <Route exact path="/calendar">
          <Calendar/>
        </Route>
        <Route path="/summary">
          <Summary/>
        </Route>
        <Route exact path="/">
          <Redirect to="/calendar"/>
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="preferences" href="/preferences">
          <IonIcon icon={cogOutline}/>
        </IonTabButton>
        <IonTabButton tab="calendar" href="/calendar">
          <IonIcon icon={calendarOutline}/>
        </IonTabButton>
        <IonTabButton tab="summary" href="/summary">
          <IonIcon icon={pieChartOutline}/>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
</IonApp>
);

export default App;
