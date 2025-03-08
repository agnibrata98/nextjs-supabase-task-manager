// import React, { useState, useEffect } from 'react';
// import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
// import { useRouter } from 'next/router';
// import { supabase } from '@/utils/supabase';

// const UserDashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

//       if (sessionError || !sessionData?.session) {
//         console.error('User not logged in. Redirecting to login page.');
//         router.replace('/login'); // Use replace to avoid history stack issues
//         return;
//       }

//       const userId = sessionData.session.user.id;

//       const { data, error } = await supabase
//         .from('projects')
//         .select('*')
//         .eq('created_by', userId);

//       if (error) {
//         console.error('Error fetching projects:', error);
//       } else {
//         setProjects(data);
//       }
//     };

//     fetchSession(); // Fetch session asynchronously

//     // Listen for changes in authentication state
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_OUT' || !session) {
//         router.replace('/login'); // Redirect to login if user signs out
//       } else if (event === 'SIGNED_IN' && session) {
//         router.replace('/user/dashboard'); // Ensure user is redirected to dashboard if logged in
//       }
//     });

//     // Cleanup the auth listener on component unmount
//     return () => {
//       authListener?.subscription?.unsubscribe();
//     };
//   }, [router]);

//   const handleProjectClick = (projectId) => {
//     router.push(`/user/project/${projectId}`);
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         User Dashboard
//       </Typography>
//       <Grid container spacing={3}>
//         {projects.map((project) => (
//           <Grid item xs={12} md={6} key={project.id}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">{project.name}</Typography>
//                 <Typography variant="body2">{project.description}</Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => handleProjectClick(project.id)}
//                 >
//                   View Details
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Grid, Card, CardContent, Button, Drawer, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const UserDashboard = () => {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData?.session) {
        router.replace('/login');
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase.from('projects').select('*').eq('created_by', userId);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
      }
    };

    fetchSession();
  }, [router]);

  const handleProjectClick = (projectId) => {
    router.push(`/user/project/${projectId}`);
  };

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   router.replace('/login');
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1E1E2D',
            color: 'white',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
        </Toolbar>
        <List>
          <ListItem button>
            <DashboardIcon sx={{ mr: 2 }} />
            <ListItemText primary="Projects" />
          </ListItem>
          {/* <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2 }} />
            <ListItemText primary="Logout" />
          </ListItem> */}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: '#6200EA' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>User Dashboard</Typography>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {project.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboard;
