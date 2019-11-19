import React from 'react';

class TodoListCard extends React.Component {
    componentDidMount() {
        this.setState(this.state);
    }
    render() {
        const { todoList } = this.props;
        console.log("TodoListCard, todoList.id: " + todoList.id);
        return (
            <div className="card z-depth-0 todo-list-link cyan lighten-5">
                <div className="card-content teal-text text-accent-4">
                    <span className="card-title">{todoList.name}</span>
                </div>
            </div>
        );
    }
}
export default TodoListCard;