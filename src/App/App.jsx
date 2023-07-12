import Results from '../pages/Results/Results'
import Survey from '../pages/Survey/Survey'
import AuthPage from '../pages/AuthPage/AuthPage';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../utilities/users-service';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      {user ?
        <Routes>
          <Route path='/results/:id' element={<Results user={user} />} />
          <Route path='/results' element={<Results user={user} />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/*" element={<Survey />} />
        </Routes>
        :
        <Routes>
          <Route path='/results/:id' element={<Results user={user} />} />
          <Route path="/*" element={<AuthPage setUser={setUser} />} />
        </Routes>
      }
    </main>
  );
}