import React from 'react';

class ItemCard extends React.Component {
    render() {
        const { item } = this.props;  
        return (
            <div className="card z-depth-0 todo-list-link pink-lighten-3">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{item.description}</span>
                    <span className="card-title">{"Assigned To: " + item.assigned_to}</span>
                    <span className="card-title">{item.due_date}</span>
                    <span className="card-title">{item.completed ? "Completed" : "Pending"}</span>
                </div>
            </div>
        );
    }
}
export default ItemCard;