import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { TextField, Button, Typography, Container } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
  
    console.log('Submitting data:', { name, email, password, role });
    const {data: userData, error: userError} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });
  
    console.log(userData, userError);
    
    if (userError) {
      console.error('Insert error:', userError);
      alert(`Error: ${userError.message}`);
    } else {
      console.log('Insert success:', userData);
      // alert('User registered successfully');
    }
    const id = userData.user.id;
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, name, email, password, role }])
      .select('*');
      if (data) alert('User registered successfully');
      else alert('Error registering user', error);
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
        <TextField label="Role" name="role" value={formData.role} onChange={handleChange} select SelectProps={{ native: true }} fullWidth>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
      </form>
    </Container>
  );
};

export default Register;
