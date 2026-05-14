import './App.css';
import RegistrationForm from './auth/pages/RegistrationForm';

function App() {
  return (
    <RegistrationForm
      onBack={() => console.log('voltar')}
      onSubmit={(data) => console.log('enviado:', data)}
    />
  );
}

export default App;