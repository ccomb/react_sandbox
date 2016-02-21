import React from "react";
import {MD, changeURLHash, closeMenu, toggleMenu} from './actions';
import {connect} from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {DocumentManager} from './document-manager';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

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
