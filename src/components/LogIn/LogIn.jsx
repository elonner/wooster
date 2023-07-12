import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as usersService from '../../utilities/users-service';
import * as resultsAPI from '../../utilities/results-api';
import '../../pages/AuthPage/AuthPage.css';

export default function LogIn({ setUser, showLogin, setShowLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    }

    async function handleSubmit(e) {
        // Prevent form from being submitted to the server
        e.preventDefault();
        try {
            // The promise returned by the signUp service method 
            // will resolve to the user object included in the
            // payload of the JSON Web Token (JWT)
            const user = await usersService.login(credentials);
            const survey = await resultsAPI.getLatest(user._id);
            setUser(user); 
            survey ? navigate('/results') : navigate('/survey');
        } catch (err) {
            console.log(err)
            setError('Log In Failed - Try Again');
        }
    }

    return (
        <div>
            <div className="form-container">
                <form autoComplete="off" onSubmit={handleSubmit} className="form login">
                    <img src="https://icons.iconarchive.com/icons/sykonist/looney-tunes/256/Foghorn-Leghorn-icon.png" alt="" srcSet="" />
                    <h2 className='form-title'>Wooster</h2>
                    <label>Username:</label>
                    <input type="text" name="username" value={credentials.username} onChange={handleChange} required />
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                    <button type="submit" className='sbmt-btn'>LOG IN</button>
                    <p className="switchForms">First timer?
                        &nbsp;
                        <span onClick={() => setShowLogin(!showLogin)} className="switchLink">Take Quiz</span>
                    </p>
                    <p className="error-message">{error}</p>
                </form>
            </div>
        </div>
    );
}