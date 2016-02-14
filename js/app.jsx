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
import ViewWrapper from './viewwrapper';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // remove as of react 1.0

var store = createStore(globalreducer, applyMiddleware(thunk));


let NotFound = React.createClass({

    displayName: 'NotFound',

    render: function(e){
        return (<p><a href='#/contacts'>Contacts</a></p>);
    }
})


class BackOffice extends React.Component {
    get displayName() {return 'BackOffice'}

    _onLeftIconButtonTouchTap(e) {
        this.props.dispatch(toggleMenu());
    }
    _onRequestChange(e) {
        this.props.dispatch(closeMenu());
    }

    render(e) {
        const {state, dispatch} = this.props;
        console.log('state.path='+state.path);
        if (['#/contacts', '#/newcontact'].indexOf(state.path)>=0) {
            const s = state.menu.floating ? '10' : '1';
            const menushadow = `0px 3px ${s}px rgba(0, 0, 0, 0.16), 0px 3px ${s}px rgba(0, 0, 0, 0.23)`;
            const floating = state.menu.floating;
            return (<div>
                    <AppBar
                        title="Contacts"
                        className="row"
                        style={{margin: 0, zIndex: 2000, height: '50px', background: '#666'}}
                        zDepth={0}
                        onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)} />
                    <LeftNav
                        ref="leftnav"
                        open={state.menu.open}
                        docked={floating?false:true}
                        onRequestChange={this._onRequestChange.bind(this)}
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
                    <ViewWrapper leftoffset={window.innerWidth > MD && state.menu.open} state={state} />
                    </div>);    
        } else { return <NotFound/> }
    }
}

var ReduxApp = connect(state=>({state}))(BackOffice);

window.addEventListener('hashchange', function(e) {
        store.dispatch(changeRoute());
    }, false)

var rootElement = (<Provider store={store}>
                     <ReduxApp/>
                   </Provider>);
console.log('First render and change hash dispatch')
ReactDOM.render(rootElement, document.getElementById('react-app'));

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

