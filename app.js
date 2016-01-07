var contacts = [
    {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
    {key: 2, name: "Jim", email: "jim@example.com"},
    {key: 3, name: "Joe"},
];

newContact = {name: undefined, email: undefined, description: undefined};

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
    
    /*componentDidMount: function() {
        this.refs.button.onClick = this.props.onclick
        this.refs.root.forceUpdate();
    },*/
    render: function() {
        return React.createElement('div', {},
            React.createElement('input', {id: 'name', ref: 'name', type: 'text', placeholder: 'name', required: true, value: this.props.contact.name, onChange: this.props.onChange}),
            React.createElement('input', {id: 'email', ref: 'email', type: 'text', placeholder: 'email', value: this.props.contact.email, onChange: this.props.onChange}),
            React.createElement('input', {id: 'description', ref: 'description', type: 'textarea', placeholder: 'description', value: this.props.contact.description, onChange: this.props.onChange}),
            React.createElement('button', {ref: 'button'}, 'Add contact')
        )
    }
})


var contactView = React.createClass({
    displayName: 'contactView',
    onChange: function(e) {
        newContact = Object.assign({}, newContact)
        newContact[e.target.id] = e.target.value
        console.log(newContact)
    },
    render: function(e) {
        return React.createElement('div', {},
            React.createElement('h1', {}, "Contacts"),
            React.createElement('ul', {}, contactListElements),
            React.createElement(contactForm, {contact: newContact, onChange: this.onChange})
        );
    }
        })


contactListElements =
        [for (c of contacts)
            React.createElement(contactItem, c)]


var rootElement = React.createElement(contactView, {})


ReactDOM.render(rootElement, document.getElementById('react-app'));
