import React from 'react';
import ReactDOM from 'react-dom';
import {deleteContact, loadContacts, storeContact, changeHash} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import globalreducer from './reducers';
import thunk from 'redux-thunk';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Table from 'material-ui/lib/table/table'
import TableHeader from 'material-ui/lib/table/table-header'
import TableBody from 'material-ui/lib/table/table-body'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // remove as of react 1.0

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
        return (<TableRow className='Contact' style={{border: "1px"}}>
                <TableRowColumn><button onClick={this.onDelete}>X</button></TableRowColumn>
                <TableRowColumn className='Contact-name'>{this.props.name}</TableRowColumn>
                <TableRowColumn><a href={this.props.email}>{this.props.email}</a></TableRowColumn>
                <TableRowColumn>{this.props.description}</TableRowColumn>
                <TableRowColumn>
                    Status: <span style={{background: color, color: 'white'}}>{status}</span>
                    </TableRowColumn>
                </TableRow>);
        
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
        return (<TableRow><TableRowColumn/>
                    <TableRowColumn><input id='name' ref='name' type='text' placeholder='name'
                           required={true}/></TableRowColumn>
                    <TableRowColumn><input id='email' ref='email' type='text' placeholder='email'
                           required={true}/></TableRowColumn>
                    <TableRowColumn><input id='description' ref='description' type='text' placeholder='description'
                           required={false}/></TableRowColumn>
                    <TableRowColumn><button ref='button' onClick={this.onSubmit}>Add contact</button></TableRowColumn>
                </TableRow>);
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
    _onLeftIconButtonTouchTap(e) { alert('menu'); }
    render(e) {
        const {state, dispatch} = this.props;
        if (state.path == 'contacts') {
            var key = 0;
            return (<div>
                    <AppBar title="Contacts" className="row" style={{margin: 0}}
                            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)} />
                    <LeftNav ref="leftnav" open={false} docked={true}>
                    <SelectableList
                      subheader="Menu">
                      <ListItem
                        value="project/form"
                        primaryText="Contacts"
                      />
                    </SelectableList>
                    </LeftNav>

                      <Table><TableBody>
                          {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
                      <ContactForm contacts={state.contacts} dispatch={dispatch}/>
                      </TableBody></Table>
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
