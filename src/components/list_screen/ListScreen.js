import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { taggedTemplateExpression } from '@babel/types';
import { getFirestore } from 'redux-firestore';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    }

    handleChange = (e) => {
        const { target } = e;
        console.log(e.target.value);
        const fireStore = getFirestore();
        if(target.id == "name")
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({name: target.value});
        else if(target.id == "owner")
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({owner: target.value});

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    makeTableHTML(todoList) {
        var result = "<table class=\"table table-striped\"><thead class=\"thead-default\">"
        +"<tr><th>Task</th><th>Due Date</th><th>Status</th></tr></thead><tbody>";
        console.log(todoList.items);
        for(var i=0; i<todoList.items.length; i++) {
            result += "<tr><td>" + todoList.items[i]["description"] + "<br>Assigned To: " + todoList.items[i]["assigned_to"] +"</br></td>";
            result += "<td>" + todoList.items[i]["due_date"] +"</td>";
            result += "<td>" + (todoList.items[i]["completed"] ? "Completed" : "Pending") +"</td></tr>";
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
                <h5 className="grey-text text-darken-3">Todo List</h5>
                <div className="input-field">
                    <label className="active" htmlFor="email">Name</label>
                    <input type="text" name="name" id="name" onChange={this.handleChange} defaultValue={todoList.name} />
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="password">Owner</label>
                    <input type="text" name="owner" id="owner" onChange={this.handleChange} defaultValue={todoList.owner} />
                </div>
                {/*<ItemsList todoList={todoList} />*/}
                <div dangerouslySetInnerHTML={{__html: this.makeTableHTML(todoList)}} />
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