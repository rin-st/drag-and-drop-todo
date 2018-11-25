import React, {Component} from 'react';
import './App.scss';

import {firebaseInit, firebaseGet, firebaseSet} from './firebase';
import Todo from './Components/Todo/';
import placeholder from './Components/Placeholder/';
class App extends Component {
  state = {
    todos: [],
    addingTask: false,
    newTask: '',
  };

  componentDidMount () {
    firebaseInit ();
    firebaseGet ().then (data =>
      this.setState ({todos: data.val () || []}, this.sortTodos)
    );
  }

  sortTodos = () => {
    let keysSorted = this.state.todos.sort (
      (a, b) => a.completed - b.completed
    );
    this.setState ({todos: keysSorted});
    firebaseSet (keysSorted);
  };
  onTodoEdit = (index, task) => {
    const updatedTodos = [...this.state.todos];
    updatedTodos[index].task = task;
    this.setState ({todos: updatedTodos});
    firebaseSet (updatedTodos);
  };
  onTodoComplete = index => {
    const updatedTodos = [...this.state.todos];
    updatedTodos[index].completed = true;
    this.setState ({todos: updatedTodos}, this.sortTodos);
  };
  onTodoDelete = index => {
    const updatedTodos = [...this.state.todos];
    updatedTodos.splice (index, 1);
    this.setState ({todos: updatedTodos}, this.sortTodos);
  };
  onAddChange = () => {
    this.setState ({addingTask: !this.state.addingTask});
  };
  onNewTaskChange = e => {
    this.setState ({newTask: e.target.value});
  };
  onAddTask = () => {
    const updatedTodos = [...this.state.todos];
    const newTask = {
      task: this.state.newTask,
      completed: false,
    };
    updatedTodos.unshift (newTask);
    this.setState (
      {
        todos: updatedTodos,
        addingTask: false,
        newTask: '',
      },
      this.sortTodos
    );
  };
  onAddCancel = () => {
    this.setState ({
      ...this.state.todos,
      addingTask: false,
      newTask: '',
    });
  };
  onDragStart = e => {
    this.dragged = e.currentTarget;
    this.over = this.dragged;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData ('text/html', this.dragged);
  };
  onDragEnd = e => {
    this.dragged.style.display = 'flex';
    if (this.over.contains(placeholder) || this.over.parentNode.contains(placeholder)) {
      if (
        this.over.className === 'app__todo-tasks'
        || this.over.className === 'app__completed-tasks'
      ) {
        this.over.removeChild(placeholder);
      } else {
        this.over.parentNode.removeChild (placeholder);
      }
    }
    
    const todos = this.state.todos;
    const from = Number (this.dragged.dataset.id);
    let to = Number (this.over.dataset.id);
    if (from < to) to--;
    if (
      this.over.classList.contains ('todo__completed') 
      || this.over.className === 'app__completed-tasks'
      || this.over.className === 'app__add-block'
      ) {
      todos[from].completed = true;
    } else if (
      this.over.classList.contains ('todo') || this.over.className === 'app__todo-tasks'
    ) {
      todos[from].completed = false;
    }
    todos.splice (to, 0, todos.splice (from, 1)[0]);
    this.setState ({todos});
    firebaseSet (todos);
  };
  onDragOver = e => {
    e.preventDefault ();
    this.dragged.style.display = 'none';
    if (
      e.target.classList.contains ('todo') 
      || e.target.className === 'app__add-block'
    ) {
      this.over = e.target;
      e.target.parentNode.insertBefore (placeholder, e.target);
    } else if (
      e.target.tagName === 'H1'
    ) {
      let nextEl = e.target.nextSibling
      if (nextEl) {
        e.target.parentNode.insertBefore (placeholder, nextEl);
      } else {
        e.target.parentNode.appendChild(placeholder);
      }
      this.over = e.target.parentNode;
    }
  };
  render () {
    const todos = this.state.todos;
    const completedTasks = [];
    const todoTasks = [];
    todos.forEach (task => {
      task.completed ? completedTasks.push (task) : todoTasks.push (task);
    });
    return (
      <div className="app" onDragOver={this.onDragOver}>
        <div className="app__todo-tasks" data-id={0}>
          <h1>Todo tasks</h1>
          {todoTasks.map ((el, i) => (
            <Todo
              task={el.task}
              index={i}
              key={el.task}
              onEdit={this.onTodoEdit}
              onComplete={this.onTodoComplete}
              onDelete={this.onTodoDelete}
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}/>
          ))}
          <div className="todo todo__hidden" data-id={todoTasks.length}></div>
        </div>
        <div className="app__completed-tasks" data-id={todoTasks.length}>
          <h1>Completed tasks</h1>
          {completedTasks.map ((el, i) => (
            <Todo
              task={el.task}
              completed
              index={todoTasks.length+i}
              key={el.task}
              onEdit={this.onTodoEdit}
              onDelete={this.onTodoDelete}
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}/>
          ))}
        </div>
        <div className="app__add-block" data-id={this.state.todos.length}>
          {!this.state.addingTask
            ? <button className="app__add-button" onClick={this.onAddChange}>
                Add task
              </button>
            : <div className="app__add-task">
                <input
                  type="text"
                  onChange={e => this.onNewTaskChange (e)}
                  value={this.state.newTask}/>
                <button
                  onClick={this.onAddTask}
                  disabled={this.state.newTask === ''}>
                  Add task
                </button>
                <button onClick={this.onAddCancel}>Cancel</button>
              </div>}
        </div>
      </div>
    );
  }
}

export default App;