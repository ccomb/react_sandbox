import React from 'react';
import ReactDOM from 'react-dom';
import {XS, MD, loadContacts, changeRoute, openMenu, closeMenu, toggleMenu} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import {globalreducer} from './reducers';
import thunk from 'redux-thunk';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {DocumentManager} from './document-manager';
import {NotFound} from './notfound';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // remove as of react 1.0

var store = createStore(globalreducer, applyMiddleware(thunk));


export var BackOffice = connect(state=>({state}))(React.createClass({
    displayName: 'BackOffice',

    _onLeftIconButtonTouchTap: function(e) {
        this.props.dispatch(toggleMenu());
    },
    _onRequestChange: function(e) {
        this.props.dispatch(closeMenu());
    },

    render: function(e) {
        const {state, dispatch, route} = this.props;
        const s = state.menu.floating ? '10' : '1';
        const menushadow = `0px 3px ${s}px rgba(0, 0, 0, 0.16), 0px 3px ${s}px rgba(0, 0, 0, 0.23)`;
        const floating = state.menu.floating;
        return (<div>
                <AppBar
                    title="Contacts"
                    className="row"
                    style={{margin: 0, zIndex: 2000, height: '50px', background: '#666'}}
                    zDepth={0}
                    onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap} />
                <LeftNav
                    ref="leftnav"
                    open={state.menu.open}
                    docked={floating?false:true}
                    onRequestChange={this._onRequestChange}
                    style={{
                        marginTop: floating?0:'64px',
                        boxShadow: menushadow,
                        zIndex: floating?3000:0}}>
                    <SelectableList
                      subheader="Logo">
                      <ListItem
                        value="project/form"
                        primaryText="Contacts"
                      />
                    </SelectableList>
                </LeftNav>
                <DocumentManager
                    leftoffset={window.innerWidth > MD && state.menu.open}
                    state={state}
                    route={route}/>
                </div>);
    }
}));

window.addEventListener('hashchange', function(e) {
        store.dispatch(changeRoute());
    }, false)


var RootComponent = connect(state=>({state}))(React.createClass({
    component: function() { // routing methods could be moved to an adapter or hoc
        const {state} = this.props;
        const path=state.path;
        const segments = path.split("/").slice(1);
        const current = 0;
        const route = {segments, current:current+1};
        switch(segments[current]) { // TODO make it pluggable
            case 'bo':
                return (<BackOffice route={route}/>);
            default:
                return (<NotFound/>);
         }
     },
    render: function() {
        return this.component();
    }
}));


console.log('First render and change hash dispatch')
ReactDOM.render(<Provider store={store}><RootComponent/></Provider>, document.getElementById('react-app'));

store.dispatch(changeRoute());

window.addEventListener('resize', function(e) {
    if (store.getState().menu.open && window.innerWidth <= MD) {
        store.dispatch(closeMenu());
    } else if (!store.getState().menu.open && window.innerWidth >= MD) {
        store.dispatch(openMenu());
    }
}, false)

/**** indexedDB ****/
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

/**** Service Worker ****/
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {'scope': '/'}).then(function(reg) {
        console.log('Service worker registration succeeded');
    }).catch(function(reg) {
        console.log('Service worker registration failed');
    });
};

