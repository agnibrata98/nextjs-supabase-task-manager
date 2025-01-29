import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Container, TextField, Button, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [newProject, setNewProject] = useState({ name: '', description: '', userId: '' });
    const [newTask, setNewTask] = useState({ name: '', projectId: '', status: 'todo', assignedTo: '' });

    const router = useRouter()

  
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
        alert('Project name and user are required');
        return;
      }
  
      const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description, created_by: userId }]);
  
      if (error) {
        console.error(error);
        alert('Failed to add project');
      } else {
        alert('Project added successfully');
        fetchProjects();
        setNewProject({ name: '', description: '', userId: '' });
      }
    };
  
    const handleAddTask = async (e) => {
        e.preventDefault();
        const { name, projectId, status, assignedTo } = newTask;
    
        if (!name || !projectId || !assignedTo) {
            alert('Task name, project, and assigned user are required');
            return;
        }
    
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ name, status, project_id: projectId, assigned_to: assignedTo }]);
    
        if (error) {
            console.error(error);
            alert('Failed to add task');
        } else {
            alert('Task added successfully');
            // Refresh tasks for the current project
            fetchTasks(projectId);
            setNewTask({ name: '', projectId: '', status: 'todo', assignedTo: '' });
        }
    };
    
      
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
  
        {/* Add Project Form */}
        <form onSubmit={handleAddProject}>
          <Typography variant="h6">Add Project</Typography>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <TextField
            select
            label="Assign to User"
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
            value={newProject.userId}
            onChange={(e) => setNewProject({ ...newProject, userId: e.target.value })}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Add Project
          </Button>
        </form>
  
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} style={{ marginTop: '2rem' }}>
  <Typography variant="h6">Add Task</Typography>
  <TextField
    label="Task Name"
    fullWidth
    margin="normal"
    value={newTask.name}
    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
  />
  <TextField
    select
    label="Assign to Project"
    fullWidth
    margin="normal"
    SelectProps={{ native: true }}
    value={newTask.projectId}
    onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
  >
    <option value="">Select Project</option>
    {projects.map((project) => (
      <option key={project.id} value={project.id}>
        {project.name}
      </option>
    ))}
  </TextField>
  <TextField
    select
    label="Assign to User"
    fullWidth
    margin="normal"
    SelectProps={{ native: true }}
    value={newTask.assignedTo}
    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
  >
    <option value="">Select User</option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.email})
      </option>
    ))}
  </TextField>
  <Button type="submit" variant="contained" color="secondary">
    Add Task
  </Button>
        </form>

  
        {/* Projects List */}
        <Typography variant="h6" style={{ marginTop: '2rem' }}>
          Projects List
        </Typography>
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2">{project.description}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    // onClick={() => fetchTasks(project.id)}
                    onClick={() => router.push(`/admin/project/${project.id}`)}
                  >
                    View Tasks
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Tasks List */}
        {tasks.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Typography variant="h6">Tasks</Typography>
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemText primary={task.name} secondary={`Status: ${task.status}`} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </Container>
    );
  };
  
  export default AdminDashboard;
  