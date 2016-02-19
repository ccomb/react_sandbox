import React from "react";
import ReactDOM from "react-dom";
import {MD, loadRecords, changeURLHash, openMenu, closeMenu, toggleMenu} from './actions';
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
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // remove as of react 1.0

var store = createStore(globalreducer, applyMiddleware(thunk));

export const BackOffice = connect(state=>({state}))(React.createClass({
    displayName: 'BackOffice',
    propTypes: {
      route: React.PropTypes.object,
      state: React.PropTypes.object,
      dispatch: React.PropTypes.func,
    },

    onLeftIconButtonTouchTap: function() {
        this.props.dispatch(toggleMenu());
    },

    onRequestChange: function() {
        this.props.dispatch(closeMenu());
    },

    handleRequestChangeList: function(event, value) {
        changeURLHash(value);
    },

    getSelectedIndex: function() {
        return this.segments.slice(0, this.current+2).join('/');
    },
    render: function() {
        const {state, route} = this.props;
        const {segments, current} = route;
        this.segments = segments, this.current = current;
        const childroute = {...route, current: current+1};
        const s = state.menu.floating ? '10' : '1';
        const menushadow = `0px 3px ${s}px rgba(0, 0, 0, 0.16), 0px 3px ${s}px rgba(0, 0, 0, 0.23)`;
        const floating = state.menu.floating;
        return (<div>
                <AppBar
                    title="Contacts"
                    className="row"
                    style={{margin: 0, zIndex: 2000, height: '50px', background: '#666'}}
                    zDepth={0}
                    onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap} />
                <LeftNav
                    ref="leftnav"
                    open={state.menu.open}
                    docked={floating?false:true}
                    onRequestChange={this.onRequestChange}
                    style={{
                        marginTop: floating?0:'64px',
                        boxShadow: menushadow,
                        zIndex: floating?3000:0}}>
                    <SelectableList
                        subheader="Logo"
                        valueLink={{
                            value: this.getSelectedIndex(),
                            requestChange: this.handleRequestChangeList,
                        }}
                    >
                    <ListItem
                        value="#/bo/contact"
                        primaryText="Contacts"
                    />
                    </SelectableList>
                </LeftNav>
                <DocumentManager
                    leftoffset={window.innerWidth > MD && state.menu.open}
                    state={state}
                    route={childroute}/>
                </div>);
    }
}));

window.addEventListener('hashchange', function() {
        store.dispatch(changeURLHash());
    }, false)


const RootComponent = connect(state=>({state}))(React.createClass({
    displayName: 'RootComponent',
    propTypes: {
      route: React.PropTypes.object,
      state: React.PropTypes.object,
    },
    component: function() { // routing methods could be moved to an adapter or hoc
        const {state} = this.props;
        const segments = state.path.split("/");
        const current = 0; // we are the root
        const childroute = {segments, current:current+1};
        switch(segments[current+1]) { // TODO make it pluggable
            case undefined:
                return (<div className='row center-xs around center-xs start-sm' style={{margin: 0, padding: '1em'}}>
                    <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3' style={{marginBottom: '1em'}}>
                        <a href='#/bo/' className="box">
                            <Card>
                                <CardMedia overlay={
                                    <CardTitle title="Back Office" subtitle="Stunning offline-first and mobile-first back office" />
                                }>
                                <img src="http://lorempixel.com/g/320/198/abstract/1" />
                                </CardMedia>
                            </Card>
                        </a>
                    </div>
                    <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3'>
                        <a href='#/pos/' className="box">
                            <Card>
                                <CardMedia overlay={
                                    <CardTitle title="Point of Sale" subtitle="Stunning offline-first and mobile-first point of sale" />
                                }>
                                <img src="http://lorempixel.com/g/320/198/abstract/2" />
                                </CardMedia>
                            </Card>
                        </a>
                    </div>
                    <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3'>
                        <a href='#/bi/' className="box">
                            <Card>
                                <CardMedia overlay={
                                    <CardTitle title="Business Intelligence" subtitle="Stunning offline-first and mobile-first business intelligence" />
                                }>
                                <img src="http://lorempixel.com/g/320/198/abstract/3" />
                                </CardMedia>
                            </Card>
                        </a>
                    </div>
                </div>);
            case 'bo':
                return <BackOffice route={childroute}/>;
            default:
                return <NotFound route={childroute}/>;
         }
     },
    render: function() {
        return this.component();
    }
}));


console.log('First render and change hash dispatch')
ReactDOM.render(<Provider store={store}><RootComponent/></Provider>, document.getElementById('react-app'));

store.dispatch(changeURLHash());

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
store.dispatch(loadRecords('docs'));

/**** Service Worker ****/
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {'scope': '/'}).then(function() {
        console.log('Service worker registration succeeded');
    }).catch(function() {
        console.log('Service worker registration failed');
    });
};

