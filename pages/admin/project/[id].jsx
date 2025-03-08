// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/utils/supabase';
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Paper,
// } from '@mui/material';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useRouter } from 'next/router';

// const TaskCard = ({ task, moveTask }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'TASK',
//     item: { id: task.id, status: task.status },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <Card
//       ref={drag}
//       style={{
//         marginBottom: '10px',
//         opacity: isDragging ? 0.5 : 1,
//         cursor: 'move',
//       }}
//     >
//       <CardContent>
//         <Typography>{task.name}</Typography>
//       </CardContent>
//     </Card>
//   );
// };

// const TaskColumn = ({ status, tasks, moveTask }) => {
//   const [, drop] = useDrop(() => ({
//     accept: 'TASK',
//     drop: (item) => moveTask(item.id, status),
//   }));

//   return (
//     <Paper
//       ref={drop}
//       style={{
//         minHeight: '200px',
//         padding: '10px',
//         backgroundColor: '#f4f4f4',
//         borderRadius: '8px',
//       }}
//     >
//       <Typography
//         variant="h6"
//         align="center"
//         style={{ marginBottom: '10px' }}
//       >
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Typography>
//       {tasks.map((task) => (
//         <TaskCard key={task.id} task={task} moveTask={moveTask} />
//       ))}
//     </Paper>
//   );
// };

// const SingleProjectDetails = () => {
//   const router = useRouter();
//   const { id } = router.query; // Fix: Correctly extract `id`
//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (id) {
//       console.log('Project ID:', id); // Debug
//       fetchProjectDetails();
//       fetchTasks();
//     }
//   }, [id]);

//   const fetchProjectDetails = async () => {
//     const { data, error } = await supabase
//       .from('projects')
//       .select('*, user:assigned_user_id(name, email)')
//       .eq('id', id)
//       .single();

//     if (error) console.error('Error fetching project details:', error.message);
//     else {
//       console.log('Fetched project:', data); // Debug
//       setProject(data);
//       setUser(data.user);
//     }
//   };

//   const fetchTasks = async () => {
//     const { data, error } = await supabase
//       .from('tasks')
//       .select('*')
//       .eq('project_id', id);

//     if (error) console.error('Error fetching tasks:', error.message);
//     else {
//       console.log('Fetched tasks:', data); // Debug
//       setTasks(data);
//     }
//   };

//   const moveTask = async (taskId, newStatus) => {
//     const { error } = await supabase
//       .from('tasks')
//       .update({ status: newStatus })
//       .eq('id', taskId);

//     if (error) console.error(error);
//     else fetchTasks();
//   };

//   return (
//     <Container>
//       {project && (
//         <>
//           <Typography variant="h4" gutterBottom>
//             {project.name}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             {project.description}
//           </Typography>
//         </>
//       )}
//       {user && (
//         <Typography variant="body2" gutterBottom>
//           Assigned to: {user.name} ({user.email})
//         </Typography>
//       )}

//       <Typography variant="h6" gutterBottom>
//         Tasks
//       </Typography>

//       <DndProvider backend={HTML5Backend}>
//         <Grid container spacing={2}>
//           {['todo', 'inprogress', 'completed'].map((status) => (
//             <Grid item xs={12} md={4} key={status}>
//               <TaskColumn
//                 status={status}
//                 tasks={tasks.filter((task) => task.status === status)}
//                 moveTask={moveTask}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </DndProvider>
//     </Container>
//   );
// };

// export default SingleProjectDetails;


import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import {
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const TaskCard = ({ task, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Paper
      ref={drag}
      style={{
        marginBottom: '10px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '10px',
      }}
    >
      <Typography>{task.name}</Typography>
    </Paper>
  );
};

const TaskColumn = ({ status, tasks, moveTask }) => {
  const [, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, status),
  }));

  return (
    <Paper
      ref={drop}
      style={{
        minHeight: '200px',
        padding: '10px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" align="center" style={{ marginBottom: '10px' }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Typography>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} moveTask={moveTask} />
      ))}
    </Paper>
  );
};

const SingleProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchTasks();
    }
  }, [id]);

//   const fetchProjectDetails = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('projects')
//         .select('*, user:assigned_user_id(name, email)')
//         .eq('id', id)
//         .single();

//       if (error) throw error;

//       setProject(data);
//       setUser(data.user);
//     } catch (error) {
//       console.error('Error fetching project details:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          created_by (
            name,
            email
          )
        `)
        .eq('id', id)
        .single();
  
      if (error) throw error;
  
      console.log('Fetched project:', data); // Debugging here
  
      setProject(data);
      setUser(data.created_by); // Use the correct reference to the user data
    } catch (error) {
      console.error('Error fetching project details:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id);

      if (error) throw error;

      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      else{
        // console.log("Task moved successfully");
        toast.success("Task status updated successfully to " + newStatus);
      }
      fetchTasks();
    } catch (error) {
      // console.error('Error moving task:', error.message);
      toast.error('Error moving task:', error.message)
    }
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Container>
      {project ? (
      <>
        <Typography variant="h4" gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {project.description}
        </Typography>
      </>
    ) : (
      <Typography variant="h6">Project not found.</Typography>
    )}

    {user ? (
      <Typography variant="body2" gutterBottom>
        Assigned to: {user.name} ({user.email})
      </Typography>
    ) : (
      <Typography variant="body2" gutterBottom>
        No user assigned.
      </Typography>
    )}

      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>

      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={2}>
          {['todo', 'inprogress', 'completed'].map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <TaskColumn
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
                moveTask={moveTask}
              />
            </Grid>
          ))}
        </Grid>
      </DndProvider>
    </Container>
  );
};

export default SingleProjectDetails;
