import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import { signIn, confirmResetPassword } from 'aws-amplify/auth'; // Ensure this is correctly imported
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import awsConfig from '../../aws-exports'; // Import your awsConfig
import CryptoJS from 'crypto-js';

// Configure Amplify
Amplify.configure(awsConfig);



function calculateSecretHash(username) {
  const clientId = '23o9a1596acr5ohr92p8fnhlu8'; // Your app client ID
  const clientSecret = '167sugnk8j2bktishom8qad6pat5tu4e8kj4d60l6o5neq0vce87'; // Use your client secret securely
  const userPoolId = 'ap-south-1_6otCpX4GV'; // Your User Pool ID

  const message = userPoolId + username;
  const hash = CryptoJS.HmacSHA256(message, clientSecret);
  return CryptoJS.enc.Base64.stringify(hash);
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState('login'); // login or newPassword
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const secretHash = calculateSecretHash(username);
      const user = await signIn({username, password});
      // Check if the user needs to set a new password
      if (user.isSignedIn == false && user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setUser(user); // Store the user object
        setStage('newPassword'); // Move to new password step
      } else {
        console.log('Logged in successfully!', user);
        // Continue with post-login actions
      }
      navigate('/chat');
    } catch (err) {
      setError(err.message);
      console.error("Login failed", err);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Complete the new password challenge
      const completedUser = await confirmResetPassword(user, newPassword);
      console.log('Password updated successfully!', completedUser);
      // You can now proceed with logged-in user
      setStage('login'); // Go back to login step
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className="login-paper">
        {stage === 'login' && (
          <>
            <Typography variant="h5" align="center" className="login-title">Login</Typography>
            {error && <Typography color="error" className="login-error">{error}</Typography>}
            <form onSubmit={handleLogin} className="login-form">
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
              >
                Login
              </Button>
            </form>
          </>
        )}

        {stage === 'newPassword' && (
          <>
            <Typography variant="h5" align="center" className="login-title">Set New Password</Typography>
            {error && <Typography color="error" className="login-error">{error}</Typography>}
            <form onSubmit={handleNewPassword} className="login-form">
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="login-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
              >
                Set Password
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
