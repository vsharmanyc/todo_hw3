import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { taggedTemplateExpression, tsAnyKeyword } from '@babel/types';
import { getFirestore } from 'redux-firestore';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    }

    sortIncreasing = true;

    handleChange = (e) => {
        const { target } = e;
        console.log(e.target.value);
        const fireStore = getFirestore();
        if (target.id == "name")
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({ name: target.value });
        else if (target.id == "owner")
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({ owner: target.value });

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    trashClicked = (e) => {
        console.log("TRASH CLICKED");
        const fireStore = getFirestore();
        var todoListRef = fireStore.collection('todoLists').doc(this.props.todoList.id).delete();
        this.props.history.push("/");
    }

    sortTask = (e) => {
        console.log("SORT TASK");
        let items = this.props.todoList.items;
        items.sort(function(a,b){return a["description"] > b["description"]});
        if(!this.sortIncreasing)
            items.reverse();
        for(var i = 0; i < items.length; i++)
            items[i]["key"] = i;
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
        this.sortIncreasing = !this.sortIncreasing;
    }

    sortDueDate = (e) => {
        console.log("SORT DUE DATE");
        let items = this.props.todoList.items;
        items.sort(function(a,b){return a["due_date"] > b["due_date"]});
        if(!this.sortIncreasing)
            items.reverse();
        for(var i = 0; i < items.length; i++)
            items[i]["key"] = i;
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
        this.sortIncreasing = !this.sortIncreasing;
    }

    sortStatus = (e) => {
        console.log("SORT STATUS");
        console.log("SORT DUE DATE");
        let items = this.props.todoList.items;
        items.sort(function(a,b){return (a["completed"]? "Completed" : "Pending") > (b["completed"]? "Completed" : "Pending")});
        if(!this.sortIncreasing)
            items.reverse();
        for(var i = 0; i < items.length; i++)
            items[i]["key"] = i;
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({ items: items });
        this.sortIncreasing = !this.sortIncreasing;
    }

    makeTableHTML(todoList) {
        var result = "<table class=\"table table-striped\"><thead class=\"thead-default\">"
            + "<tr><th>Task</th><th>Due Date</th><th>Status</th></tr></thead><tbody>";
        console.log(todoList.items);
        for (var i = 0; i < todoList.items.length; i++) {
            result += "<tr><td>" + todoList.items[i]["description"] + "<br>Assigned To: " + todoList.items[i]["assigned_to"] + "</br></td>";
            result += "<td>" + todoList.items[i]["due_date"] + "</td>";
            result += "<td>" + (todoList.items[i]["completed"] ? "Completed" : "Pending") + "</td></tr>";
        }
        result += "</tbody></table>";
        return result;
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container white">
                <a class="btn-floating btn-small black right"><i class="material-icons" onClick={this.trashClicked} >delete</i></a>
                <h5 className="grey-text text-darken-3">Todo List</h5>
                <div className="input-field">
                    <label className="active" htmlFor="email">Name</label>
                    <input type="text" name="name" id="name" onChange={this.handleChange} defaultValue={todoList.name} />
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="password">Owner</label>
                    <input type="text" name="owner" id="owner" onChange={this.handleChange} defaultValue={todoList.owner} />
                </div>
                <div className="header">
                    <div class="row">
                        <div class="col s3">
                            <span className="task" onClick={this.sortTask}><font size="4">TASK</font></span>
                        </div>
                        <div class="col s3">
                            <span className="dueDate" onClick={this.sortDueDate}><font size="4">DUE DATE</font></span>
                        </div>
                        <div class="col s3">
                            <span className="status" onClick={this.sortStatus}><font size="4">STATUS</font></span>
                        </div>
                    </div>
                </div>

                <ItemsList todoList={todoList} />
                {/* this code puts items into a table 
                <div dangerouslySetInnerHTML={{__html: this.makeTableHTML(todoList)}} />
                */}
                <center><a class="btn-floating btn-large black"><i class="material-icons">add_circle</i></a></center>
                <br></br>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[id] : null;
    todoList.id = id;

    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ListScreen);