import React from "react";
import ReactDOM from "react-dom";
import {isLaptop, openMenu, closeMenu, changeDevice, getDevice} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import {globalreducer} from './reducers';
import thunk from 'redux-thunk';
import {NotFound} from './notfound';
import {DocumentManager} from './document-manager';
import Router from 'react-router/lib/Router';
import Redirect from 'react-router/lib/Redirect';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import hashHistory from 'react-router/lib/hashHistory';
import {syncHistoryWithStore} from 'react-router-redux'
import {Home} from './home';

// needed for MUI. remove as of react 15.0.0 ??
import injectTapEventPlugin from 'react-tap-event-plugin'; injectTapEventPlugin();

// stack middlewares for routing and redux async actions
const store = createStore(globalreducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(hashHistory, store)
//routerMiddleware.listenForReplays(store) // for devtools

/**** indexedDB ****/
let request = window.indexedDB.open('tutodb', 1);
request.onupgradeneeded = function(e) {
    console.log('Upgrading database...')
    const db = e.target.result;
    try {
        db.deleteObjectStore('docs');
        console.log('Deleted the old database!')
    } catch(e) {}
    let idbstore = db.createObjectStore('docs', {keyPath: 'uuid'});
    idbstore.createIndex('uuid', 'uuid', { unique: true });
    idbstore.createIndex('layouts', ['model', 'rel']);
    console.log('Database upgraded')
};

/**** Service Worker ****/
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js', {'scope': '/'}).then(function() {
        console.log('Service worker registration succeeded');
    }).catch(function() {
        console.log('Service worker registration failed');
    });
};

const Root = connect(state=>(state))((props)=>props.children);

console.log('First render')
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={Root}>
                <IndexRoute component={Home}/>
                <Route path='bo/:model/:view(/:uuid)' component={DocumentManager}/>
                <Redirect from='bo/' to='bo/contact/list'/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('react-app'));


window.addEventListener('resize', function() {
    store.dispatch(changeDevice(getDevice()));
    if (store.getState().menu.open && !isLaptop()) {
        store.dispatch(closeMenu());
    } else if (!store.getState().menu.open && isLaptop()) {
        store.dispatch(openMenu());
    }
}, false)

