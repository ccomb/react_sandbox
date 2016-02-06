import React from 'react';
import ReactDOM from 'react-dom';
import {loadContacts, storeContact, changeHash} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import globalreducer from './reducers';
import thunk from 'redux-thunk';

var store = createStore(globalreducer, applyMiddleware(thunk));

let ContactItem = React.createClass({
    displayName: 'ContactItem',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    render: function() {
        var status = this.props.status;
        var color = status=='saving' ? 'orange' : status=='saved' ? 'green' : 'red';
        return (<li className='Contact'>
                <h2 className='Contact-name'>{this.props.name}</h2>
                <a href={this.props.email}>{this.props.email}</a>
                <div>{this.props.description}</div>
                Status: <span style={{background: color, color: 'white'}}>{status}</span>
                </li>);
        
    }
});


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
        return (<div>
                    <input id='name' ref='name' type='text' placeholder='name'
                           required={true}/>
                    <input id='email' ref='email' type='text' placeholder='email'
                           required={false}/>
                    <input id='description' ref='description' type='text' placeholder='description'
                           required={false}/>
                    <button ref='button' onClick={this.onSubmit}>Add contact</button>
                </div>);
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
                      <ul>
                          {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
                      </ul>
                      <ContactForm contacts={state.contacts} dispatch={dispatch}/>
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
