import React from "react";
import ReactDOM from "react-dom";
import {MD, loadDocs, openMenu, closeMenu} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import {globalreducer} from './reducers';
import thunk from 'redux-thunk';
import {NotFound} from './notfound';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import {BackOffice} from './backoffice';
import {DocumentManager} from './document-manager';
import {FormView} from './formview';
import {ListView} from './listview';
import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import hashHistory from 'react-router/lib/hashHistory';
import {syncHistory} from 'react-router-redux';

// needed for MUI. remove as of react 15.0.0 ??
import injectTapEventPlugin from 'react-tap-event-plugin'; injectTapEventPlugin();

// stack middlewares for routing and redux async actions
const routerMiddleware = syncHistory(hashHistory)
const store = createStore(globalreducer, applyMiddleware(routerMiddleware, thunk));
routerMiddleware.listenForReplays(store) // for devtools

const APPS = [
    {url: 'bo', title: 'Back Office', desc: 'Stunning offline-first and mobile-first back office'},
    {url: 'pos', title: 'Point of Sale', desc: 'Stunning offline-first and mobile-first point of sale'},
    {url: 'bi', title: 'Business Intelligence', desc: 'Stunning offline-first and mobile-first business intelligence'},
]

const Home = connect(state=>({path: state.path}))(React.createClass({
    displayName: 'Home',
    propTypes: {
      state: React.PropTypes.object,
      path: React.PropTypes.string,
    },
    render() {
        console.log('render: Home');
        return (
            <div className='row center-xs around center-xs start-sm' style={{margin: 0, padding: '1em'}}>
                 {APPS.map((app)=>
                <div key={app.url} className='col-xs-12 col-sm-6 col-md-3' style={{marginBottom: '1em'}}>
                    <a href={`#/${app.url}/`} className="box">
                        <Card>
                            <CardMedia overlay={
                                <CardTitle title={`${app.title}`} subtitle={`${app.desc}`} />
                            }>
                            <div style={{background: 'linear-gradient(45deg, #DDD 0%,#000 100%)', height: '14.5em'}}/>
                            </CardMedia>
                        </Card>
                    </a>
                </div>)}
            </div>);
         }
}));

const Root = connect(state=>(state))((props)=>props.children);

console.log('First render')
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path='/' component={Root}>
                <IndexRoute component={Home}/>
                <Route path='bo' component={BackOffice}>
                    <Route path=':model' component={DocumentManager}>
                        <IndexRedirect to='list'/>
                        <Route path='list' component={ListView}/>
                        <Route path='new' component={FormView}/>
                        <Route path='form/:uuid' component={FormView}/>
                        <Route path='*' component={NotFound}/>
                    </Route>
                </Route>
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
    navigator.serviceWorker.register('/sw.js', {'scope': '/'}).then(function() {
        console.log('Service worker registration succeeded');
    }).catch(function() {
        console.log('Service worker registration failed');
    });
};

