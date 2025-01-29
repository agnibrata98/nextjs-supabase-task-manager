import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';

const UserDashboard = () => {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData?.session) {
        console.error('User not logged in. Redirecting to login page.');
        router.replace('/login'); // Use replace to avoid history stack issues
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', userId);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
      }
    };

    fetchSession(); // Fetch session asynchronously

    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login'); // Redirect to login if user signs out
      } else if (event === 'SIGNED_IN' && session) {
        router.replace('/user/dashboard'); // Ensure user is redirected to dashboard if logged in
      }
    });

    // Cleanup the auth listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleProjectClick = (projectId) => {
    router.push(`/user/project/${projectId}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2">{project.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleProjectClick(project.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;



// import React from 'react'

// const dashboard = () => {
//   return (
//     <div>dashboard</div>
//   )
// }

// export default dashboard