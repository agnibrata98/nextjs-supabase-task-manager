// import { useEffect, useState } from 'react';
// import { supabase } from '../../utils/supabase';
// import { Container, TextField, Button, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
// import { useRouter } from 'next/router';


// const AdminDashboard = () => {
//     const [users, setUsers] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [selectedUserId, setSelectedUserId] = useState('');
//     const [newProject, setNewProject] = useState({ name: '', description: '', userId: '' });
//     const [newTask, setNewTask] = useState({ name: '', projectId: '', status: 'todo', assignedTo: '' });

//     const router = useRouter()

  
//     // Fetch all users and projects on page load
//     useEffect(() => {
//       fetchUsers();
//       fetchProjects();
//     }, []);
  
//     const fetchUsers = async () => {
//       const { data, error } = await supabase.from('users').select('*').eq('role', 'user');
//       if (error) console.error(error);
//       else setUsers(data);
//     };
  
//     const fetchProjects = async () => {
//       const { data, error } = await supabase.from('projects').select('*');
//       if (error) console.error(error);
//       else setProjects(data);
//     };
  
//     const fetchTasks = async (projectId) => {
//       const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
//       if (error) console.error(error);
//       else setTasks(data);
//     };
  
//     const handleAddProject = async (e) => {
//       e.preventDefault();
//       const { name, description, userId } = newProject;
  
//       if (!name || !userId) {
//         alert('Project name and user are required');
//         return;
//       }
  
//       const { data, error } = await supabase
//         .from('projects')
//         .insert([{ name, description, created_by: userId }]);
  
//       if (error) {
//         console.error(error);
//         alert('Failed to add project');
//       } else {
//         alert('Project added successfully');
//         fetchProjects();
//         setNewProject({ name: '', description: '', userId: '' });
//       }
//     };
  
//     const handleAddTask = async (e) => {
//         e.preventDefault();
//         const { name, projectId, status, assignedTo } = newTask;
    
//         if (!name || !projectId || !assignedTo) {
//             alert('Task name, project, and assigned user are required');
//             return;
//         }
    
//         const { data, error } = await supabase
//             .from('tasks')
//             .insert([{ name, status, project_id: projectId, assigned_to: assignedTo }]);
    
//         if (error) {
//             console.error(error);
//             alert('Failed to add task');
//         } else {
//             alert('Task added successfully');
//             // Refresh tasks for the current project
//             fetchTasks(projectId);
//             setNewTask({ name: '', projectId: '', status: 'todo', assignedTo: '' });
//         }
//     };
    
      
  
//     return (
//       <Container>
//         <Typography variant="h4" gutterBottom>
//           Admin Dashboard
//         </Typography>
  
//         {/* Add Project Form */}
//         <form onSubmit={handleAddProject}>
//           <Typography variant="h6">Add Project</Typography>
//           <TextField
//             label="Project Name"
//             fullWidth
//             margin="normal"
//             value={newProject.name}
//             onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             margin="normal"
//             value={newProject.description}
//             onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//           />
//           <TextField
//             select
//             label="Assign to User"
//             fullWidth
//             margin="normal"
//             SelectProps={{ native: true }}
//             value={newProject.userId}
//             onChange={(e) => setNewProject({ ...newProject, userId: e.target.value })}
//           >
//             <option value="">Select User</option>
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.name} ({user.email})
//               </option>
//             ))}
//           </TextField>
//           <Button type="submit" variant="contained" color="primary">
//             Add Project
//           </Button>
//         </form>
  
//         {/* Add Task Form */}
//         <form onSubmit={handleAddTask} style={{ marginTop: '2rem' }}>
//   <Typography variant="h6">Add Task</Typography>
//   <TextField
//     label="Task Name"
//     fullWidth
//     margin="normal"
//     value={newTask.name}
//     onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
//   />
//   <TextField
//     select
//     label="Assign to Project"
//     fullWidth
//     margin="normal"
//     SelectProps={{ native: true }}
//     value={newTask.projectId}
//     onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
//   >
//     <option value="">Select Project</option>
//     {projects.map((project) => (
//       <option key={project.id} value={project.id}>
//         {project.name}
//       </option>
//     ))}
//   </TextField>
//   <TextField
//     select
//     label="Assign to User"
//     fullWidth
//     margin="normal"
//     SelectProps={{ native: true }}
//     value={newTask.assignedTo}
//     onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
//   >
//     <option value="">Select User</option>
//     {users.map((user) => (
//       <option key={user.id} value={user.id}>
//         {user.name} ({user.email})
//       </option>
//     ))}
//   </TextField>
//   <Button type="submit" variant="contained" color="secondary">
//     Add Task
//   </Button>
//         </form>

  
//         {/* Projects List */}
//         <Typography variant="h6" style={{ marginTop: '2rem' }}>
//           Projects List
//         </Typography>
//         <Grid container spacing={2}>
//           {projects.map((project) => (
//             <Grid item xs={12} md={6} key={project.id}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{project.name}</Typography>
//                   <Typography variant="body2">{project.description}</Typography>
//                   <Button
//                     size="small"
//                     color="primary"
//                     // onClick={() => fetchTasks(project.id)}
//                     onClick={() => router.push(`/admin/project/${project.id}`)}
//                   >
//                     View Tasks
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
  
//         {/* Tasks List */}
//         {tasks.length > 0 && (
//           <div style={{ marginTop: '2rem' }}>
//             <Typography variant="h6">Tasks</Typography>
//             <List>
//               {tasks.map((task) => (
//                 <ListItem key={task.id}>
//                   <ListItemText primary={task.name} secondary={`Status: ${task.status}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </div>
//         )}
//       </Container>
//     );
//   };
  
//   export default AdminDashboard;
  


// import { useEffect, useState } from 'react';
// import { supabase } from '../../utils/supabase';
// import { Container, TextField, Button, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Box } from '@mui/material';
// import { useRouter } from 'next/router';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [newProject, setNewProject] = useState({ name: '', description: '', userId: '' });
//   const [newTask, setNewTask] = useState({ name: '', projectId: '', status: 'todo', assignedTo: '' });

//   const router = useRouter();

//   // Fetch all users and projects on page load
//   useEffect(() => {
//     fetchUsers();
//     fetchProjects();
//   }, []);

//   const fetchUsers = async () => {
//     const { data, error } = await supabase.from('users').select('*').eq('role', 'user');
//     if (error) console.error(error);
//     else setUsers(data);
//   };

//   const fetchProjects = async () => {
//     const { data, error } = await supabase.from('projects').select('*');
//     if (error) console.error(error);
//     else setProjects(data);
//   };

//   const fetchTasks = async (projectId) => {
//     const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
//     if (error) console.error(error);
//     else setTasks(data);
//   };

//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     const { name, description, userId } = newProject;

//     if (!name || !userId) {
//       toast.error('Project name and user are required');
//       return;
//     }

//     const { data, error } = await supabase
//       .from('projects')
//       .insert([{ name, description, created_by: userId }]);

//     if (error) {
//       console.error(error);
//       toast.error('Failed to add project');
//     } else {
//       toast.success('Project added successfully');
//       fetchProjects();
//       setNewProject({ name: '', description: '', userId: '' });
//     }
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     const { name, projectId, status } = newTask;

//     if (!name || !projectId ) {
//       toast.error('Task name, project are required');
//       return;
//     }

//     const { data, error } = await supabase
//       .from('tasks')
//       .insert([{ name, status, project_id: projectId }]);

//       // console.log(data, "data");
//     if (error) {
//       console.error(error);
//       toast.error('Failed to add task');
//     } else {
//       toast.success('Task added successfully');
//       fetchTasks(projectId);
//       console.log(newTask);
//       setNewTask({ name: '', projectId: '', status: 'todo', assignedTo: '' });
//     }
//   };

//   return (
//     <Container>
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
//         <Typography variant="h4" gutterBottom>
//           Admin Dashboard
//         </Typography>
//       </Box>

//       {/* Add Project Form */}
//       <Box sx={{ marginBottom: '2rem' }}>
//         <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Add Project</Typography>
//         <form onSubmit={handleAddProject}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Project Name"
//                 fullWidth
//                 value={newProject.name}
//                 onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Description"
//                 fullWidth
//                 value={newProject.description}
//                 onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 label="Assign to User"
//                 fullWidth
//                 value={newProject.userId}
//                 onChange={(e) => setNewProject({ ...newProject, userId: e.target.value })}
//                 margin="normal"
//                 SelectProps={{ native: true }}
//               >
//                 <option value="">Select User</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name} ({user.email})
//                   </option>
//                 ))}
//               </TextField>
//             </Grid>
//           </Grid>
//           <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '1rem' }}>
//             Add Project
//           </Button>
//         </form>
//       </Box>

//       {/* Add Task Form */}
//       <Box sx={{ marginBottom: '2rem' }}>
//         <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Add Task</Typography>
//         <form onSubmit={handleAddTask}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Task Name"
//                 fullWidth
//                 value={newTask.name}
//                 onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 label="Assign to Project"
//                 fullWidth
//                 value={newTask.projectId}
//                 onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
//                 margin="normal"
//                 SelectProps={{ native: true }}
//               >
//                 <option value="">Select Project</option>
//                 {projects.map((project) => (
//                   <option key={project.id} value={project.id}>
//                     {project.name}
//                   </option>
//                 ))}
//               </TextField>
//             </Grid>
//             {/* <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 label="Assign to User"
//                 fullWidth
//                 value={newTask.assignedTo}
//                 onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
//                 margin="normal"
//                 SelectProps={{ native: true }}
//               >
//                 <option value="">Select User</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name} ({user.email})
//                   </option>
//                 ))}
//               </TextField>
//             </Grid> */}
//           </Grid>
//           <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ marginTop: '1rem' }}>
//             Add Task
//           </Button>
//         </form>
//       </Box>

//       {/* Projects List */}
//       <Typography variant="h6" sx={{ marginTop: '2rem' }}>Projects List</Typography>
//       <Grid container spacing={3}>
//         {projects.map((project) => (
//           <Grid item xs={12} md={6} key={project.id}>
//             <Card sx={{ boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{project.name}</Typography>
//                 <Typography variant="body2" sx={{ marginBottom: '1rem' }}>{project.description}</Typography>
//                 <Button
//                   size="small"
//                   color="primary"
//                   fullWidth
//                   onClick={() => router.push(`/admin/project/${project.id}`)}
//                 >
//                   View Tasks
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Tasks List */}
//       {tasks.length > 0 && (
//         <Box sx={{ marginTop: '2rem' }}>
//           <Typography variant="h6">Tasks</Typography>
//           <List>
//             {tasks.map((task) => (
//               <ListItem key={task.id}>
//                 <ListItemText primary={task.name} secondary={`Status: ${task.status}`} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default AdminDashboard;



import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Container, TextField, Button, Typography, Grid, Card, CardContent, Box, Select, MenuItem, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  // const [users, setUsers] = useState([]);
  // const [projects, setProjects] = useState([]);
  // const [tasks, setTasks] = useState([]);
  // const [newProject, setNewProject] = useState({ name: '', description: '', userId: '' });
  // const [newTask, setNewTask] = useState({ name: '', projectId: '', status: 'todo', assignedTo: '' });
  // const router = useRouter();

  // useEffect(() => {
  //   fetchUsers();
  //   fetchProjects();
  // }, []);

  // const fetchUsers = async () => {
  //   const { data, error } = await supabase.from('users').select('*').eq('role', 'user');
  //   if (!error) setUsers(data);
  // };

  // const fetchProjects = async () => {
  //   const { data, error } = await supabase.from('projects').select('*');
  //   if (!error) setProjects(data);
  // };

  // const fetchTasks = async (projectId) => {
  //   const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
  //   if (!error) setTasks(data);
  // };

  // const handleAddProject = async (e) => {
  //   e.preventDefault();
  //   if (!newProject.name || !newProject.userId) return toast.error('Project name and user are required');
  //   const { error } = await supabase.from('projects').insert([{ ...newProject }]);
  //   if (error) toast.error('Failed to add project');
  //   else {
  //     toast.success('Project added successfully');
  //     fetchProjects();
  //     setNewProject({ name: '', description: '', userId: '' });
  //   }
  // };


  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', userId: '' });
  const [newTask, setNewTask] = useState({ name: '', projectId: '', status: 'todo', assignedTo: '' });

  const router = useRouter();

  // Fetch all users and projects on page load
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').eq('role', 'user');
    if (error) console.error(error);
    else setUsers(data);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) console.error(error);
    else setProjects(data);
  };

  const fetchTasks = async (projectId) => {
    const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
    if (error) console.error(error);
    else setTasks(data);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const { name, description, userId } = newProject;

    if (!name || !userId) {
      toast.error('Project name and user are required');
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, created_by: userId }]);

    if (error) {
      console.error(error);
      toast.error('Failed to add project');
    } else {
      toast.success('Project added successfully');
      fetchProjects();
      setNewProject({ name: '', description: '', userId: '' });
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const { name, projectId, status } = newTask;

    if (!name || !projectId ) {
      toast.error('Task name, project are required');
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ name, status, project_id: projectId }]);

      // console.log(data, "data");
    if (error) {
      console.error(error);
      toast.error('Failed to add task');
    } else {
      toast.success('Task added successfully');
      fetchTasks(projectId);
      console.log(newTask);
      setNewTask({ name: '', projectId: '', status: 'todo', assignedTo: '' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Admin Menu</Typography>
            <Button fullWidth variant="contained" onClick={() => fetchProjects()}>Refresh Projects</Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{users.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h4">{projects.length}</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Add Project Form */}
          <Box component="form" onSubmit={handleAddProject} sx={{ my: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Add Project</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Project Name" fullWidth value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Description" fullWidth value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Select fullWidth value={newProject.userId} onChange={(e) => setNewProject({ ...newProject, userId: e.target.value })}>
                  <MenuItem value="">Select User</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>Add Project</Button>
              </Grid>
            </Grid>
          </Box>


          {/* task form */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Add Task</Typography>
            <form onSubmit={handleAddTask}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
               <TextField
                label="Task Name"
                fullWidth
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Assign to Project"
                fullWidth
                value={newTask.projectId}
                onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Assign to User"
                fullWidth
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </TextField>
            </Grid> */}
          </Grid>
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ marginTop: '1rem' }}>
            Add Task
          </Button>
            </form>
          </Box>

          {/* Projects List */}
          <Typography variant="h6" sx={{ mt: 4 }}>Projects</Typography>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ boxShadow: 3, p: 2, cursor: 'pointer' }} onClick={() => router.push(`/admin/project/${project.id}`)}>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2">{project.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

