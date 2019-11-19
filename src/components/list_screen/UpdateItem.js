import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { taggedTemplateExpression, tsAnyKeyword } from '@babel/types';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';

class UpdateItem extends Component {

    itemDict = {
        assigned_to: "",
        completed: false,
        description: "",
        due_date: "",
        key: this.props.todoList.items.length
    };

    handleChange = (e) => {
        const { target } = e;
        console.log(e.target.value);

        const fireStore = getFirestore();
        if (target.id == "task")
            this.itemDict["description"] = target.value;
        else if (target.id == "assigned_to")
            this.itemDict["assigned_to"] = target.value
        else if (target.id == "item_due_date_picker")
            this.itemDict["due_date"] = target.value.toString();
        else
            this.itemDict["completed"] = e.target.checked;

        console.log(this.itemDict);
    }

    submit = (e) => {
        if (this.props.history["location"]["pathname"].includes("id=")) {
            let key = parseInt(this.props.history["location"]["pathname"].split("=")[1]);
            this.props.todoList.items[key] = this.itemDict;
        }
        else
            this.props.todoList.items.push(this.itemDict);
        const fireStore = getFirestore();
        console.log(this.props.todoList.items);
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: this.props.todoList.items });
        this.props.history.push("/todoList/" + this.props.todoList.id);
    }

    cancel = (e) => {
        this.props.history.push("/todoList/" + this.props.todoList.id);
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        let key = "";

        if (this.props.history["location"]["pathname"].includes("id=")) {
            key = parseInt(this.props.history["location"]["pathname"].split("=")[1]);
            console.log("key = " + key);
            this.itemDict = this.props.todoList.items[key];
            console.log(this.itemDict);
        }


        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        console.log("ITEM UPDATE JS");

        return (
            <div id="todo_item">
                <h3 id="item_heading">Item</h3>
                <div id="item_form_container">

                    <label for="task"><font color="black" size="3">Task:</font></label>
                    <input placeholder="Task" id="task" type="text" class="validate" onChange={this.handleChange}
                        defaultValue={this.itemDict["description"]} /><br></br><br></br>

                    <label for="assigned_to"> <font color="black" size="3">Assigned To:</font></label>
                    <input placeholder="Assigned To" id="assigned_to" type="text" class="validate" onChange={this.handleChange}
                        defaultValue={this.itemDict["assigned_to"]} /><br></br><br></br>

                    <div id="item_due_date_prompt" class="item_prompt" ><font size="3">Due Date:</font></div>
                    <input id="item_due_date_picker" class="item_input" type="date" onChange={this.handleChange}
                        defaultValue={this.itemDict["due_date"]} /><br></br><br></br>

                    <label>
                        <input type="checkbox" class="filled-in" onChange={this.handleChange}
                            defaultChecked={this.itemDict["completed"] ? "checked" : ""} />
                        <span>Completed</span>
                    </label><br></br><br></br>

                </div>
                <button id="item_form_submit_button" class="item_button" onClick={this.submit}>Submit</button>
                <button id="item_form_cancel_button" class="item_button" onClick={this.cancel}>Cancel</button>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[id] : null;
    if (todoList)
        todoList.id = id;

    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists'},
    ]),
)(UpdateItem);