//original source from : https://www.pusher.com/tutorials/todo-app-react-hooks

import React, {useEffect, useState} from 'react';
import lightFormat from 'date-fns/lightFormat'
// import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import './todo.css';


function Task({task, index, completeTask, removeTask}) {
    return (
        <div
            className="task"
            style={{textDecoration: task.completed ? "line-through" : ""}}
        >
            {task.title}
            <button style={{background: "red"}} onClick={() => removeTask(index)}>x</button>
            <button onClick={() => completeTask(index)}>Complete</button>
            <br/>

            <div className="description">
                {task.description}
            </div>

            {'Started: '}
            {task.startTime ? (task.startTime) : ""}
            <br/>
            {'Done: '}
            {task.endTime ? (task.endTime) : ""}
            <br/>
            {'Duration: '}
            {task.endTime ? (displayDurationString(task.duration)) : ""}
        </div>
    );
}

function calcDuration(start,end){
    return differenceInSeconds(new Date(end), new Date(start))
}

function displayDurationString(differenceInSeconds) {
    let totalSeconds = differenceInSeconds;

    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds'
}

function CreateTask({addTask}) {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!title) return;

        addTask(title, desc);
        setTitle("");
        setDesc("")
    };

    /*const handleInputChange = (event) => {
        const {name, value} = event.target;
        setValues(values => ({...values, [name]: value}))
    };*/

    return (
        <form>
            <input
                type="text"
                className="nameInput"
                value={title}
                placeholder="Title"
                onChange={e => setTitle(e.target.value)}
            />
            <input
                type="text"
                className="descriptionInput"
                value={desc}
                placeholder="Description"
                onChange={e => setDesc(e.target.value)}
            />
            <button onClick={handleSubmit}>Add</button>
        </form>
    );
}

function Todo() {
    const [tasksRemaining, setTasksRemaining] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const [tasks, setTasks] = useState([
        {
            title: "Grab some Pizza",
            description: "Something something pizza",
            startTime: lightFormat(new Date(2019, 9, 1, 12, 0, 0), 'yyyy-MM-dd HH:mm:ss'),
            endTime: lightFormat(new Date(2019, 9, 1, 17, 0, 0), 'yyyy-MM-dd HH:mm:ss'),
            duration: calcDuration((new Date(2019, 9, 1, 12, 0, 0)), (new Date(2019, 9, 1, 17, 0, 0))),
            completed: true
        },
        {
            title: "Do your workout",
            description: "Muscles!",
            startTime: lightFormat(new Date(2019, 9, 1, 12, 1, 0), 'yyyy-MM-dd HH:mm:ss'),
            endTime: lightFormat(new Date(2019, 9, 1, 16, 0, 0), 'yyyy-MM-dd HH:mm:ss'),
            duration: calcDuration((new Date(2019, 9, 1, 12, 1, 0)), (new Date(2019, 9, 1, 16, 0, 0))),
            completed: true
        },
        {
            title: "Hangout with friends",
            description: "Beer tasting...",
            startTime: lightFormat(new Date(2019, 9, 1, 12, 2, 0), 'yyyy-MM-dd HH:mm:ss'),
            completed: false
        }
    ]);

    useEffect(() => {
        setTasksRemaining(tasks.filter(task => !task.completed).length)
        setTotalDuration(tasks.filter(task => task.duration)
            .map(task => task.duration)
            .reduce((total, duration)=> total + duration))
    }, [tasks]);

    const addTask = (title, description) => {
        const newTasks = [...tasks, {
            title,
            description,
            startTime: lightFormat(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
            completed: false
        }];
        console.log(newTasks)
        setTasks(newTasks);
    };

    const completeTask = index => {
        const newTasks = [...tasks];
        newTasks[index].completed = true;
        newTasks[index].endTime = lightFormat(Date.now(), 'yyyy-MM-dd HH:mm:ss');
        newTasks[index].duration = calcDuration(newTasks[index].startTime, newTasks[index].endTime);
        setTasks(newTasks);
    };

    const removeTask = index => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    return (
        <div className="todo-container">
            <div className="header">Pending tasks ({tasksRemaining})</div>
            <div className="header">Total duration ({displayDurationString(totalDuration)})</div>
            <div className="tasks">
                {tasks.map((task, index) => (
                    <Task
                        task={task}
                        index={index}
                        completeTask={completeTask}
                        removeTask={removeTask}
                        key={index}
                    />
                ))}
            </div>
            <div className="create-task">
                <CreateTask addTask={addTask}/>
            </div>
        </div>
    );
}


export default Todo;
