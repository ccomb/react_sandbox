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
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import ContentRemove from 'material-ui/lib/svg-icons/content/remove';
import IconButton from 'material-ui/lib/icon-button';
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Paper from 'material-ui/lib/paper';
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
        return (<TableRow className='Contact' style={{border: "solid 1px #EEE"}}>
                    <TableRowColumn>
                        Status: <span style={{background: color, color: 'white'}}>{status}</span>
                    </TableRowColumn>
                    <TableRowColumn className='Contact-name'>
                        {this.props.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        <a href={this.props.email}>{this.props.email}</a>
                    </TableRowColumn>
                    <TableRowColumn>
                        {this.props.description}
                    </TableRowColumn>
                    <TableRowColumn>
                        <IconButton iconClassName='' onClick={this.onDelete}>
                            <Delete/>
                        </IconButton>
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
            name: this.refs['name'].getValue(),
            email: this.refs['email'].getValue(),
            description: this.refs['description'].getValue()
        }
        this.props.dispatch(storeContact(contact))
        for (var field of ['name', 'email', 'description']) {
            this.refs[field].setValue('');}
    },
    render: function() {
        return (<TableRow>
                    <TableRowColumn/>
                    <TableRowColumn>
                        <TextField id='name' ref='name'floatingLabelText='name' errorText='required'/>
                    </TableRowColumn>
                    <TableRowColumn>
                        <TextField id='email' ref='email' floatingLabelText='email' errorText='required'/>
                    </TableRowColumn>
                    <TableRowColumn>
                        <TextField id='description' ref='description' floatingLabelText='description'/>
                    </TableRowColumn>
                    <TableRowColumn>
                        <FloatingActionButton ref='button' onClick={this.onSubmit} mini={true} zDepth="1">
                            <ContentAdd/>
                        </FloatingActionButton>
                    </TableRowColumn>
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
                      <div className="row center-sm" style={{margin: '1%'}}>
                        <div className="col-xs-12 col-sm-9 col-sm-offset-3
                                        col-md-9 col-md-offset-3 col-lg-10 col-lg-offset-2">
                          <Paper className="box" style={{padding: '3%'}}>
                            <Table>
                              <TableBody>
                                {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
                            <ContactForm contacts={state.contacts} dispatch={dispatch}/>
                              </TableBody>
                            </Table>
                          </Paper>
                        </div>
                      </div>
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {'scope': '/'}).then(function(reg) {
        console.log('Service worker registration succeeded');
    }).catch(function(reg) {
        console.log('Service worker registration failed');
    });
};
