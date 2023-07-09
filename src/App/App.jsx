import Results from '../pages/Results/Results'
import Survey from '../pages/Survey/Survey'
import AuthPage from '../pages/AuthPage/AuthPage';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../utilities/users-service';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [hasResults, setHasResults] = useState(true);

  return (
    <main className="App">
      {user ?
        <Routes>
          <Route path='/results' element={<Results hasResults={hasResults} />} />
          <Route path="/survey" element={<Survey setHasResults={setHasResults}/>} />
          <Route path="/*" element={<Survey />} />
        </Routes>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );
}