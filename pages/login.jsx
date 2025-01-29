import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { TextField, Button, Typography, Container } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', role: 'user' });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, role } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = credentials;
    // const { data: user, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('email', email)
    //   .eq('password', password)
    //   .single();

    // if (error) alert('Invalid credentials');
    // else {
    //     console.log('User:', user);
    //     localStorage.setItem('user', JSON.stringify(user));
    //     router.push(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    // }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert('Invalid credentials');
    } else {
      console.log('User:', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      // router.push(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    }
    const { data: userData , error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
    if (userError) {
      console.error('Error fetching user:', userError);
      alert('Invalid credentials');
    } else {
      console.log('User:', userData)
      if (userData.role === role) {
        router.push(`/${role}/dashboard`);
      } else {
        alert(`${role} not found`);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField label="Email" name="email" value={credentials.email} onChange={handleChange} fullWidth required />
        <TextField label="Password" name="password" type="password" value={credentials.password} onChange={handleChange} fullWidth required />
        <TextField label="Role" name="role" value={credentials.role} onChange={handleChange} select SelectProps={{ native: true }} fullWidth>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
    </Container>
  );
};

export default Login;
