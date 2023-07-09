import { useState } from 'react';
import LogIn from '../../components/LogIn/LogIn';
import SignUp from '../../components/SignUp/SignUp';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="AuthPage">
      {showLogin ?
        <LogIn
          setUser={setUser}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
        :
        <SignUp
          setUser={setUser}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />}
    </main>
  );
}