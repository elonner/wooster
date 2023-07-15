import Results from '../pages/Results/Results'
import Survey from '../pages/Survey/Survey'
import AuthPage from '../pages/AuthPage/AuthPage';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../utilities/users-service';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      {user ?
        <Routes>
          <Route path='/results/:sentResultId' element={<Results user={user} />} />
          <Route path='/results' element={<Results user={user} />} />
          <Route path="/survey" element={<Survey user={user} />} />
          <Route path="/*" element={<Results user={user} />} />
        </Routes>
        :
        <Routes>
          <Route path='/results/:sentResultId' element={<Results user={user} />} />
          <Route path="/*" element={<AuthPage setUser={setUser} />} />
        </Routes>
      }
    </main>
  );
}