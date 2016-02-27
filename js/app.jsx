import React from "react";
import ReactDOM from "react-dom";
import {MD, openMenu, closeMenu} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import {globalreducer} from './reducers';
import thunk from 'redux-thunk';
import {NotFound} from './notfound';
import {DocumentManager} from './document-manager';
import {FormView} from './formview';
import {ListView} from './listview';
import Router from 'react-router/lib/Router';
import Redirect from 'react-router/lib/Redirect';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
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
                <Route path='bo/:model' component={DocumentManager}>
                    <IndexRedirect to='list'/>
                    <Route path='list' component={ListView}/>
                    <Route path='new' component={FormView}/>
                    <Route path='form/:uuid' component={FormView}/>
                    <Route path='*' component={NotFound}/>
                </Route>
                <Redirect from='bo/*' to='bo/contact'/>
                <Route path='*' component={NotFound}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('react-app'));


window.addEventListener('resize', function() {
    if (store.getState().menu.open && window.innerWidth <= MD) {
        store.dispatch(closeMenu());
    } else if (!store.getState().menu.open && window.innerWidth >= MD) {
        store.dispatch(openMenu());
    }
}, false)

