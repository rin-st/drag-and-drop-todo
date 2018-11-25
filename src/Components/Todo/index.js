import React, {Component} from 'react';
import './todo.scss';

export default class Todo extends Component {
  state = {
    task: '',
    edit: false
  }
  componentDidMount() {
    this.setState({task: this.props.task})
  }
  onChangeHandler = e => {
    this.setState({task: e.target.value});
  }
  onKeyPressHandler = e => {
    if (e.key === 'Enter') {
      this.onEditHandler();
    }
  }
  onEditHandler = () => {
    if (this.state.edit) {
      this.props.onEdit(this.props.index, this.state.task);
    }
    this.setState({edit: !this.state.edit})
  }
  onCompleteHandler = () => {
    this.props.onComplete(this.props.index);
  }
  onDeleteHandler = () => {
    this.props.onDelete(this.props.index);
  }
  render() {
    const {completed} = this.props;
    return (
      <div className={`todo${completed ? ' todo__completed' : ''}`}
        draggable={true}
        data-id={this.props.index}
        onDragStart={e => this.props.onDragStart(e)}
        onDragEnd={e => this.props.onDragEnd(e)}>
        {this.state.edit 
        ? <input 
            type="text" 
            value={this.state.task} 
            onChange={e=>this.onChangeHandler(e)}
            onKeyPress={e=>this.onKeyPressHandler(e)}/>
        : <span>{this.state.task}</span>}
        <button 
          disabled={this.state.task === ''}
          className="todo__button todo__button--edit"
          onClick={this.onEditHandler}>Edit</button>
        {!completed && <button 
          disabled={this.state.edit}
          className="todo__button todo__button--green"
          onClick={this.onCompleteHandler}>✓</button>}
        <button 
          className="todo__button todo__button--red"
          onClick={this.onDeleteHandler}>✕</button>
      </div>
    )
  }
}