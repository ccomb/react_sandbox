import React from "react";
import ReactDOM from "react-dom";
import {MD, loadRecords, changeURLHash, openMenu, closeMenu} from './actions';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import {globalreducer} from './reducers';
import thunk from 'redux-thunk';
import {NotFound} from './notfound';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import {BackOffice} from './backoffice';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // remove as of react 15.0.0 ??

var store = createStore(globalreducer, applyMiddleware(thunk));


window.addEventListener('hashchange', function() {
        store.dispatch(changeURLHash());
    }, false)


const RootComponent = connect(state=>({path: state.path}))(React.createClass({
    displayName: 'RootComponent',
    propTypes: {
      state: React.PropTypes.object,
      path: React.PropTypes.string,
    },
    render: function() { // routing methods could be moved to an adapter or hoc
        console.log('render: RootComponent');
        const {path} = this.props;
        const segments = path.split("/");
        const current = 0; // we are the root
        const childroute = {segments, current:current+1};
        switch(segments[current+1]) { // TODO make it pluggable
            case undefined:
                return (
                    <div className='row center-xs around center-xs start-sm' style={{margin: 0, padding: '1em'}}>
                        {[{url: 'bo', title: 'Back Office', desc: 'Stunning offline-first and mobile-first back office'},
                          {url: 'pos', title: 'Point of Sale', desc: 'Stunning offline-first and mobile-first point of sale'},
                          {url: 'bi', title: 'Business Intelligence', desc: 'Stunning offline-first and mobile-first business intelligence'},
                         ].map((app)=>
                        <div className='col-xs-12 col-sm-6 col-md-3' style={{marginBottom: '1em'}}>
                            <a href={`#/${app.url}/`} className="box">
                                <Card>
                                    <CardMedia overlay={
                                        <CardTitle title={`${app.title}`} subtitle={`${app.desc}`} />
                                    }>
                                    <div style={{background: 'linear-gradient(45deg, #d8e0de 0%,#aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 60%,#4e5c5a 82%,#0e0e0e 100%)', height: '14.5em'}}/>
                                    </CardMedia>
                                </Card>
                            </a>
                        </div>)}
                    </div>);
            case 'bo':
                return <BackOffice route={childroute}/>;
            default:
                return <NotFound route={childroute}/>;
         }
     },
}));


console.log('First render')
store.dispatch(loadRecords('docs'));
ReactDOM.render(<Provider store={store}><RootComponent/></Provider>, document.getElementById('react-app'));


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
    var db = e.target.result;
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

