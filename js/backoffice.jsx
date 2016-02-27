import React from "react";
import {MD, closeMenu, toggleMenu} from './actions';
import {connect} from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import hashHistory from 'react-router/lib/hashHistory';
import {AppbarActions} from './action-buttons';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);

export const BackOffice = connect(state=>({menu: state.menu}))(React.createClass({
    propTypes: {
      menu: React.PropTypes.object,
      location: React.PropTypes.object,
      children: React.PropTypes.object,
      dispatch: React.PropTypes.func,
    },
    onLeftIconButtonTouchTap() {
        this.props.dispatch(toggleMenu());
    },
    onRequestChange() {
        this.props.dispatch(closeMenu());
    },
    onMenuItemClick() {
        if (this.props.menu.open && window.innerWidth < MD)
            this.props.dispatch(closeMenu());
    },
    onClick() {
        hashHistory.push('/bo/contact/list');
    },
    render() {
        console.log('render: BackOffice');
        const {menu} = this.props;
        const menushadow = `0px 3px 1px rgba(0, 0, 0, 0.16), 0px 3px 1px rgba(0, 0, 0, 0.23)`;
        const floating = menu.floating;
        return (<div style={{paddingTop: '51px'}}>
                <AppBar
                    title="Contacts"
                    className="row"
                    style={{margin: 0, zIndex: 1100, height: '50px', background: '#666', position: 'fixed', top: 0}}
                    zDepth={0}
                    onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap} 
                    iconElementRight={<AppbarActions/>}
                />
                <LeftNav
                    ref="leftnav"
                    open={menu.open}
                    docked={floating?false:true}
                    onRequestChange={this.onRequestChange}
                    zDepth={menu.floating ? 3 : 0}
                    containerStyle={{
                        boxShadow: menu.floating ? undefined : menushadow,
                        marginTop: '64px'}}>
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
