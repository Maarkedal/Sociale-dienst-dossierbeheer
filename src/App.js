import './styles/reset.css';
import './styles/vars.css';
import './App.css';
import Authentication from './pages/authentication/authentication';
import RootStoreProvider from './contexts/RootStoreProvider';

const App = () => {

  return (
    <RootStoreProvider>
      <Authentication/>
    </RootStoreProvider>
  );
}


export default App;
