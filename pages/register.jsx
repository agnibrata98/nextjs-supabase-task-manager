// import { useState } from 'react';
// import { supabase } from '../utils/supabase';
// import { TextField, Button, Typography, Container } from '@mui/material';

// const Register = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, password, role } = formData;
  
//     console.log('Submitting data:', { name, email, password, role });
//     const {data: userData, error: userError} = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//           role,
//         },
//       },
//     });
  
//     // console.log(userData, userError);
    
//     // if (userError) {
//     //   console.error('Insert error:', userError);
//     //   alert(`Error: ${userError.message}`);
//     // } else {
//     //   console.log('Insert success:', userData);
//     //   // alert('User registered successfully');
//     // }
//     // const id = userData.user.id;
//     const { data, error } = await supabase
//       .from('users')
//       .insert([{ name, email, password, role }])
//       .select('*');
//       if (data) alert('User registered successfully', data);
//       else alert('Error registering user', error);
//   };

  
  

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>Register</Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
//         <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
//         <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
//         {/* <TextField label="Role" name="role" value={formData.role} onChange={handleChange} select SelectProps={{ native: true }} fullWidth>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </TextField> */}
//         <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
//       </form>
//     </Container>
//   );
// };

// export default Register;

import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setServerError(null);
    setSuccessMessage(null);
    const { name, email, password } = formData;
    
    try {
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'user' } },
      });
      console.log(userData, "userData");
      
      if (userError) throw new Error(userError.message);
      
      await supabase.from('users').insert([{ id: userData.user.id ,name, email, password, role: 'user' }]);
      
      setSuccessMessage('User registered successfully!');
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom align="center">Register</Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
