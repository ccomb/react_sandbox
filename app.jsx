import React from 'react';
import ReactDOM from 'react-dom';
import {addContact, changeHash} from './actions';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import globalreducer from './reducers';

let store = createStore(globalreducer);

let ContactItem = React.createClass({
    displayName: 'ContactItem',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    render: function() {
        return (<li className='Contact'>
                <h2 className='Contact-name'>{this.props.name}</h2>
                <a href={this.props.email}>{this.props.email}</a>
                <div>{this.props.description}</div></li>);
        
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
        this.props.dispatch(addContact(contact))
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
            return (<div>
                      <h1>Contacts</h1>
                      <ul>
                          {state.contacts.map(c => <ContactItem {...c}/>)}
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
ReactDOM.render(rootElement, document.getElementById('react-app'));
store.dispatch(changeHash());
