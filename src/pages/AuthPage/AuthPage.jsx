import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LogIn from '../../components/LogIn/LogIn';
import SignUp from '../../components/SignUp/SignUp';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const compId = location.state?.id;

  return (
    <main className="AuthPage">
      {showLogin ?
        <LogIn
          setUser={setUser}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          compId={compId}
        />
        :
        <SignUp
          setUser={setUser}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          compId={compId}
        />}
    </main>
  );
}