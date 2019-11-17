import React from 'react';
import { Modal, Button } from 'react-materialize';
import { getFirestore } from 'redux-firestore';

class ItemCard extends React.Component {
    moveDown = (e) => {
        console.log("MOVE DOWN");
        const fireStore = getFirestore();
        const { item } = this.props;
        let key = item["key"];
        let items = this.props.todoList.items;
        if (key != items.length - 1) {
            let temp = items[key + 1];
            items[key + 1] = items[key]
            items[key] = temp;
            items[key + 1]["key"] += 1;
            items[key]["key"] -= 1;

            fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
        }
    }

    moveUp = (e) => {
        console.log("MOVE UP");
        const fireStore = getFirestore();
        const { item } = this.props;
        let key = item["key"];
        if (key != 0) {
            let items = this.props.todoList.items;
            let temp = items[key - 1];
            items[key - 1] = items[key]
            items[key] = temp;
            items[key - 1]["key"] -= 1;
            items[key]["key"] += 1;

            fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
        }
    }

    deleteItem = (e) => {
        console.log("DELETE ITEM");
        const fireStore = getFirestore();
        const { item } = this.props;
        let key = item["key"];
        let items = this.props.todoList.items;
        items.splice(key, 1);
        for (var i = 0; i < items.length; i++)
            items[i]["key"] = i;

        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
    }

    render() {
        const { item } = this.props;
        console.log("FDFDFDFDFDFDF");

        return (
            <div className="card z-depth-0 todo-list-link pink-lighten-3">
                <div className="card-content grey-text text-darken-3">
                    <div class="row">
                        <div class="col s3">
                            <span className="card-title">{item.description}</span>
                            <span className="card-title">{"Assigned To: " + item.assigned_to}</span>
                        </div>
                        <div class="col s3">
                            <span className="card-title">{item.due_date}</span>
                        </div>
                        <div class="col s3">
                            <span className="card-title">{item.completed ? "Completed" : "Pending"}</span>
                        </div>
                        <Button
                            floating
                            fab={{
                                direction: 'left',
                                hoverEnabled: true,
                            }}
                            className="red"
                            large
                        >
                            <Button floating icon={<i class="material-icons">arrow_upward</i>} className="red" onClick={this.moveUp} />
                            <Button floating icon={<i class="material-icons">arrow_downward</i>} className="yellow darken-1" onClick={this.moveDown} />
                            <Button floating icon={<i class="material-icons">cancel</i>} className="green" onClick={this.deleteItem} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ItemCard;