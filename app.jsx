import React from 'react';
import ReactDOM from 'react-dom';

var ContactItem = React.createClass({
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


var ContactForm = React.createClass({
    displayName: 'ContactForm',
    propTypes: {
        contact: React.PropTypes.object,
        onChange: React.PropTypes.func
    },
    onChange: function(e) {
        var contact = Object.assign({}, this.props.state.newContact)
        const state = Object.assign({}, this.props.state)
        contact[e.target.id] = e.target.value
        state.newContact = contact
        render_state(state)
    },
    onSubmit: function(e) {
        e.preventDefault()
        if (this.props.state.newContact.name) {
            this.props.addContact(this.props.state.newContact);
        }
    },
    
    /*componentDidMount: function() {
        this.refs.button.onClick = this.props.onclick
        this.refs.root.forceUpdate();
    },*/
    render: function() {
        const contact = this.props.state.newContact;
        return (<div>
                    <input id='name' ref='name' type='text' placeholder='name'
                           required={true} value={contact.name} onChange={this.onChange}/>
                    <input id='email' ref='email' type='text' placeholder='email'
                           required={false} value={contact.email} onChange={this.onChange}/>
                    <input id='description' ref='description' type='text' placeholder='description'
                           required={false} value={contact.description} onChange={this.onChange}/>
                    <button ref='button' onClick={this.onSubmit}>Add contact</button>
                </div>);
    }
});


var NotFound = React.createClass({
    displayName: 'NotFound',
    render: function(e){
        return (<p><a href='#/contacts'>Contacts</a></p>);
    }
})

var ContactView = React.createClass({
    displayName: 'ContactView',
    addContact: function(contact) {
        var state = Object.assign({}, this.props.state)
        state.contacts.push(contact)
        state.newContact = {name: undefined}
        render_state(state)
    },
    render: function(e) {
        return (<div>
                    <h1>Contacts</h1>
                    <ul>
                        {this.props.state.contacts.map(c => <ContactItem {...c}/>)}
                    </ul>
                    <ContactForm state={this.props.state}
                                 addContact={this.addContact} 
                                 onChange={this.onChange}/>
                </div>);
    }
});


const render_state = function(state) {
    if (state.path == 'contacts') {
        var rootElement = <ContactView state={state}/>;
    } else {
        var rootElement = <NotFound/>;
    }
    ReactDOM.render(rootElement, document.getElementById('react-app'));
}

// initial state
const initial_state = {
    contacts: [
        {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
        {key: 2, name: "Jim", email: "jim@example.com"},
        {key: 3, name: "Joe"},
    ],
    newContact: {name: undefined, email: undefined, description: undefined},
    path: '/'
};

const navigated = function(e) {
    let path = window.location.hash.split('/').slice(1);
    render_state(Object.assign(initial_state, {path: path}));
}
window.addEventListener('hashchange', navigated, false)
navigated()
