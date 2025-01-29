// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '@/utils/supabase';
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
// } from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const ProjectDetailsPage = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     if (id) {
//       fetchProjectDetails();
//       fetchTasks();
//     }
//   }, [id]);

//   const fetchProjectDetails = async () => {
//     const { data, error } = await supabase
//       .from('projects')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) console.error(error);
//     else setProject(data);
//   };

//   const fetchTasks = async () => {
//     const { data, error } = await supabase
//       .from('tasks')
//       .select('*')
//       .eq('project_id', id);

//     if (error) console.error(error);
//     else setTasks(data);
//   };

//   const updateTaskStatus = async (taskId, newStatus) => {
//     const { error } = await supabase
//       .from('tasks')
//       .update({ status: newStatus })
//       .eq('id', taskId);

//     if (error) console.error(error);
//     else fetchTasks();
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const { source, destination } = result;

//     // Get the task being dragged
//     const draggedTask = tasks[source.index];

//     // Update the status only if it changed
//     if (draggedTask.status !== destination.droppableId) {
//       updateTaskStatus(draggedTask.id, destination.droppableId);
//     }
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

//       <Typography variant="h6" gutterBottom>
//         Tasks
//       </Typography>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Grid container spacing={2}>
//           {['todo', 'inprogress', 'completed'].map((status) => (
//             <Grid item xs={12} md={4} key={status}>
//               <Typography variant="h6" align="center">
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </Typography>
//               <Droppable droppableId={status}>
//                 {(provided) => (
//                   <div
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                     style={{
//                       minHeight: '200px',
//                       background: '#f4f4f4',
//                       padding: '10px',
//                       borderRadius: '8px',
//                     }}
//                   >
//                     {tasks
//                       .filter((task) => task.status === status)
//                       .map((task, index) => (
//                         <Draggable
//                           key={task.id}
//                           draggableId={task.id.toString()}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <Card
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 marginBottom: '10px',
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               <CardContent>
//                                 <Typography>{task.name}</Typography>
//                               </CardContent>
//                             </Card>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </Grid>
//           ))}
//         </Grid>
//       </DragDropContext>
//     </Container>
//   );
// };

// export default ProjectDetailsPage;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  TASK: 'task',
};

const TaskCard = ({ task, onDrop }) => {
  const [, ref] = useDrag({
    type: ItemType.TASK,
    item: { id: task.id, status: task.status },
  });

  return (
    <Card
      ref={ref}
      style={{
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#ffffff',
      }}
    >
      <CardContent>
        <Typography>{task.name}</Typography>
      </CardContent>
    </Card>
  );
};

const TaskColumn = ({ status, tasks, onDropTask }) => {
  const [, ref] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => onDropTask(item.id, status),
  });

  return (
    <div
      ref={ref}
      style={{
        minHeight: '200px',
        background: '#f4f4f4',
        padding: '10px',
        borderRadius: '8px',
      }}
    >
      <Typography
        variant="h6"
        align="center"
        style={{ marginBottom: '10px' }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Typography>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchTasks();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) console.error(error);
    else setProject(data);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', id);

    if (error) console.error(error);
    else setTasks(data);
  };

  // const updateTaskStatus = async (taskId, newStatus) => {
  //   const { error } = await supabase
  //     .from('tasks')
  //     .update({ status: newStatus })
  //     .eq('id', taskId);

  //   if (error) console.error(error);
  //   else fetchTasks();
  // };

  const updateTaskStatus = async (taskId, newStatus) => {
    const validStatuses = ["todo", "inprogress", "completed"]; // Update as per your DB constraint
  
    if (!validStatuses.includes(newStatus)) {
      console.error("Invalid status:", newStatus);
      return;
    }
  
    // console.log("Updating task:", taskId, "to status:", newStatus);
  
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);
  
    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log("Task status updated successfully.");
      alert("Task status updated successfully to " + newStatus);
      fetchTasks();
    }
  };
  

  const handleDropTask = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        {project && (
          <>
            <Typography variant="h4" gutterBottom>
              {project.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {project.description}
            </Typography>
          </>
        )}

        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>

        <Grid container spacing={2}>
          {['todo', 'inprogress', 'completed'].map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <TaskColumn
                status={status}
                tasks={tasks}
                onDropTask={handleDropTask}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </DndProvider>
  );
};

export default ProjectDetailsPage;
