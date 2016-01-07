
var contactItem = React.createClass({
    displayName: 'contactItem',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    render: function() {
        return React.createElement('li', {className: 'Contact'},
                React.createElement('h2', {className: 'Contact-name'}, this.props.name),
                React.createElement('a', {href: this.props.email}, this.props.email),
                React.createElement('div', {}, this.props.description)
                );
        
    }
});


var contactForm = React.createClass({
    displayName: 'contactForm',
    propTypes: {
        contact: React.PropTypes.object,
        onChange: React.PropTypes.func
    },
    onChange: function(e) {
        newContact = Object.assign({}, this.props.state.newContact)
        newState = Object.assign({}, this.props.state)
        newContact[e.target.id] = e.target.value
        newState.newContact = newContact
        setState(newState)
    },
    onSubmit: function(e) {
        e.preventDefault()
        this.props.addContact(this.props.state.newContact)
    },
    
    /*componentDidMount: function() {
        this.refs.button.onClick = this.props.onclick
        this.refs.root.forceUpdate();
    },*/
    render: function() {
        contact = this.props.state.newContact
        return React.createElement('div', {},
            React.createElement('input', {id: 'name', ref: 'name', type: 'text', placeholder: 'name', required: true, value: contact.name, onChange: this.onChange}),
            React.createElement('input', {id: 'email', ref: 'email', type: 'text', placeholder: 'email', value: contact.email, onChange: this.onChange}),
            React.createElement('input', {id: 'description', ref: 'description', type: 'textarea', placeholder: 'description', value: contact.description, onChange: this.onChange}),
            React.createElement('button', {ref: 'button', onClick: this.onSubmit}, 'Add contact')
        )
    }
})


var contactView = React.createClass({
    displayName: 'contactView',
    addContact: function(contact) {
        var newState = Object.assign({}, this.props.state)
        newState.contacts.push(newContact)
        newState.newContact = {name: undefined}
        setState(newState)
    },
    render: function(e) {
        return React.createElement('div', {},
            React.createElement('h1', {}, "Contacts"),
            React.createElement('ul', {}, [for (c of this.props.state.contacts) React.createElement(contactItem, c)]),
            React.createElement(contactForm, {state: this.props.state, addContact: this.addContact, onChange: this.onChange})
        );
    }
})



const setState = function(state) {
    var rootElement = React.createElement(contactView, {state: state})
    ReactDOM.render(rootElement, document.getElementById('react-app'));
}

// initial state
setState({
    contacts: [
        {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
        {key: 2, name: "Jim", email: "jim@example.com"},
        {key: 3, name: "Joe"},
    ],
    newContact: {name: undefined, email: undefined, description: undefined}
})
