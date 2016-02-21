import React from "react";
import {MD, changeURLHash, closeMenu, toggleMenu} from './actions';
import {connect} from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {routeActions} from 'react-router-redux';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

export const BackOffice = connect(state=>({menu: state.menu}))(React.createClass({
    propTypes: {
      menu: React.PropTypes.object,
      location: React.PropTypes.object,
      children: React.PropTypes.object,
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
    onClick() {
        this.props.dispatch(routeActions.push('/bo/contact/list'));
    },
    render: function() {
        console.log('render: BackOffice');
        const {menu} = this.props;
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
                            value: this.props.location.pathname,
                            requestChange: this.handleRequestChangeList,
                        }}
                    >
                    <ListItem primaryText="Contacts" value="/bo/contact/list" onClick={this.onClick}/>
                    </SelectableList>
                </LeftNav>
                {this.props.children ?
                 React.cloneElement(this.props.children, {
                    leftoffset: window.innerWidth > MD && menu.open}) : undefined}
                </div>);
    }
}));
