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

export const BackOffice = connect(state=>({menu: state.menu}))(React.createClass({
    propTypes: {
      route: React.PropTypes.object,
      menu: React.PropTypes.object,
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
    onMenuItemClick() {
        if (this.props.menu.open && window.innerWidth < MD)
            this.props.dispatch(closeMenu());
    },

    getSelectedIndex: function() {
        return this.segments.slice(0, this.current+2).join('/');
    },
    render: function() {
        console.log('render: BackOffice');
        const {menu, route} = this.props;
        const {segments, current} = route;
        this.segments = segments, this.current = current;
        const childroute = {...route, current: current+1};
        const s = menu.floating ? '10' : '1';
        const menushadow = `0px 3px ${s}px rgba(0, 0, 0, 0.16), 0px 3px ${s}px rgba(0, 0, 0, 0.23)`;
        const floating = menu.floating;
        return (<div>
                <AppBar
                    title="Contacts"
                    className="row"
                    style={{margin: 0, zIndex: 2000, height: '50px', background: '#666'}}
                    zDepth={0}
                    onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap} />
                <LeftNav
                    ref="leftnav"
                    open={menu.open}
                    docked={floating?false:true}
                    onRequestChange={this.onRequestChange}
                    style={{
                        marginTop: '64px',
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
                        onClick={this.onMenuItemClick}
                    />
                    </SelectableList>
                </LeftNav>
                <DocumentManager
                    leftoffset={window.innerWidth > MD && menu.open}
                    route={childroute}/>
                </div>);
    }
}));

window.addEventListener('hashchange', function() {
        store.dispatch(changeURLHash());
    }, false)


const RootComponent = connect(state=>({path: state.path}))(React.createClass({
    propTypes: {
      state: React.PropTypes.object,
      path: React.PropTypes.string,
    },
    component: function() { // routing methods could be moved to an adapter or hoc
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
    render: function() {
        console.log('render: RootComponent');
        return this.component();
    }
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

