import React from 'react';
import ReactDOM from 'react-dom';
import {deleteContact, loadContacts, storeContact, changeHash} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import globalreducer from './reducers';
import thunk from 'redux-thunk';

var store = createStore(globalreducer, applyMiddleware(thunk));

let ContactItem = connect(select)(React.createClass({
    displayName: 'ContactItem',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    onDelete: function() {
        this.props.dispatch(deleteContact(this.props.email))
    },
    render: function() {
        var status = this.props.status;
        var color = status=='saving' ? 'orange' : status=='saved' ? 'green' : 'red';
        return (<tr className='Contact' style={{border: "1px"}}>
                <td><button onClick={this.onDelete}>X</button></td>
                <td className='Contact-name'>{this.props.name}</td>
                <td><a href={this.props.email}>{this.props.email}</a></td>
                <td>{this.props.description}</td>
                <td>Status: <span style={{background: color, color: 'white'}}>{status}</span></td>
                </tr>);
        
    }
})
)


let ContactForm = React.createClass({
    displayName: 'ContactForm',
    propTypes: {
        contact: React.PropTypes.object,
        onSubmit: React.PropTypes.func
    },
    onSubmit: function(e) {
        e.preventDefault()
        var contact = {
            name: this.refs['name'].value,
            email: this.refs['email'].value,
            description: this.refs['description'].value
        }
        this.props.dispatch(storeContact(contact))
        for (var field of ['name', 'email', 'description']) {
            this.refs[field].value = '';}
    },
    render: function() {
        return (<tr><td/>
                    <td><input id='name' ref='name' type='text' placeholder='name'
                           required={true}/></td>
                    <td><input id='email' ref='email' type='text' placeholder='email'
                           required={true}/></td>
                    <td><input id='description' ref='description' type='text' placeholder='description'
                           required={false}/></td>
                    <td><button ref='button' onClick={this.onSubmit}>Add contact</button></td>
                </tr>);
    }
});


let NotFound = React.createClass({
    displayName: 'NotFound',
    render: function(e){
        return (<p><a href='#/contacts'>Contacts</a></p>);
    }
})

class ContactApp extends React.Component {
    get displayName() {return 'ContactApp'}
    render(e) {
        const {state, dispatch} = this.props;
        if (state.path == 'contacts') {
            var key = 0;
            return (<div>
                      <h1>Contacts</h1>
                      <table>
                          {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
                      <ContactForm contacts={state.contacts} dispatch={dispatch}/>
                      </table>
                    </div>);    
        } else { return <NotFound/> }
    }
}

const select = function(state) {
    return {state: state}
}

var ReduxApp = connect(select)(ContactApp);

window.addEventListener(
    'hashchange',
    function(e) {
        store.dispatch(changeHash());
    }, false)

var rootElement = (<Provider store={store}>
                     <ReduxApp/>
                   </Provider>);
console.log('First render and change hash dispatch')
ReactDOM.render(rootElement, document.getElementById('react-app'));
store.dispatch(changeHash());

let request = window.indexedDB.open('tutodb', 3);
request.onupgradeneeded = function(e) {
    console.log('Upgrading database...')
    var db = e.target.result;
    try {
        db.deleteObjectStore('contacts');
        console.log('Deleted the old database!')
    } catch(e) {}
    let idbstore = db.createObjectStore('contacts', {keyPath: 'email'});
    idbstore.createIndex("email", "email", { unique: true });
    idbstore.createIndex("name", "name", { unique: false });
    console.log('Database upgraded')
};
store.dispatch(loadContacts());
