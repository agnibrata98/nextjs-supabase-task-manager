// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../utils/supabase';
// import { TextField, Button, Typography, Container } from '@mui/material';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: '', password: '', role: 'user' });
//   const router = useRouter();

//   const handleChange = (e) => {
//     const { name, value, role } = e.target;
//     setCredentials({ ...credentials, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password, role } = credentials;
//     // const { data: user, error } = await supabase
//     //   .from('users')
//     //   .select('*')
//     //   .eq('email', email)
//     //   .eq('password', password)
//     //   .single();

//     // if (error) alert('Invalid credentials');
//     // else {
//     //     console.log('User:', user);
//     //     localStorage.setItem('user', JSON.stringify(user));
//     //     router.push(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
//     // }
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });
//     if (error) {
//       alert('Invalid credentials');
//     } else {
//       console.log('User:', data.user);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       // router.push(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
//     }
//     const { data: userData , error: userError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', data.user.id)
//     .single();
//     if (userError) {
//       console.error('Error fetching user:', userError);
//       alert('Invalid credentials');
//     } else {
//       console.log('User:', userData)
//       if (userData.role === role) {
//         router.push(`/${role}/dashboard`);
//       } else {
//         alert(`${role} not found`);
//       }
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>Login</Typography>
//       <form onSubmit={handleLogin}>
//         <TextField label="Email" name="email" value={credentials.email} onChange={handleChange} fullWidth required />
//         <TextField label="Password" name="password" type="password" value={credentials.password} onChange={handleChange} fullWidth required />
//         {/* <TextField label="Role" name="role" value={credentials.role} onChange={handleChange} select SelectProps={{ native: true }} fullWidth>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </TextField> */}
//         <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
//       </form>
//     </Container>
//   );
// };

// export default Login;


// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../utils/supabase';
// import { TextField, Button, Typography, Container } from '@mui/material';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const router = useRouter();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials({ ...credentials, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = credentials;

//     // Authenticate user
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       alert('Invalid credentials');
//       return;
//     }

//     // Get user details from the 'users' table
//     const { data: userData, error: userError } = await supabase
//       .from('users')
//       .select('role')
//       .eq('id', data.user.id)
//       .single();

//     if (userError) {
//       console.error('Error fetching user role:', userError);
//       alert('User not found');
//       return;
//     }

//     console.log('User Role:', userData.role);
//     localStorage.setItem('user', JSON.stringify(data.user));

//     // Redirect based on role
//     if (userData.role === 'admin') {
//       router.push('/admin/dashboard');
//     } else {
//       router.push('/user/dashboard');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>Login</Typography>
//       <form onSubmit={handleLogin}>
//         <TextField label="Email" name="email" value={credentials.email} onChange={handleChange} fullWidth required />
//         <TextField label="Password" name="password" type="password" value={credentials.password} onChange={handleChange} fullWidth required />
//         <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
//       </form>
//     </Container>
//   );
// };

// export default Login;



import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { TextField, Button, Typography, Container, Box, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/store';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {user, setUser} = useUserStore()

  const validate = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { email, password } = credentials;

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Invalid credentials');
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      toast.error('User not found');
      setLoading(false);
      return;
    }

    localStorage.setItem('user', JSON.stringify(authData.user));
    setUser(authData.user);  // ✅ Immediately update Zustand state

    router.push(userData.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

