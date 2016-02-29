import React from 'react';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Link from 'react-router/lib/Link';
import Add from 'material-ui/lib/svg-icons/content/add';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Check from 'material-ui/lib/svg-icons/navigation/check';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/lib/icon-button';
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import Checkbox from 'material-ui/lib/checkbox'
import {MD, toggleMenu} from './actions';

export const HeaderActions = React.createClass({
    propTypes: {
        selectedUuids: React.PropTypes.array,
        createLink: React.PropTypes.string,
        onDelete: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        view: React.PropTypes.string,
    },
    render() {
        const hasSelection = this.props.selectedUuids.length>0;
        const mobile = window.innerWidth < MD;
        const {view, onDelete, onCancel, onSubmit, createLink} = this.props;
        return (
            <div className="row start">
                {view === 'list' && !mobile ?
                    <Link to={createLink}
                          style={{padding: 0, margin: '0.5em'}}>
                        <FlatButton label="Create"/>
                    </Link> : undefined}
                {view === 'list' && mobile ?
                    <Link to={createLink}
                          key="floatingcreatebutton">
                        <FloatingActionButton
                            style={{position: 'fixed', right: '1em', bottom: '1em', zIndex: 1000}}>
                            <Add/>
                        </FloatingActionButton>
                    </Link> : undefined}
                {hasSelection && !mobile && view !== 'new' ?
                    <FlatButton className="col" style={{padding: 0, margin: '0.5em'}}
                        label="Delete"
                        onClick={onDelete}
                        primary={true}/> : undefined}
                {['form', 'new'].indexOf(view)>=0 && !mobile ?
                    <FlatButton className="col" style={{padding: 0, margin: '0.5em'}}
                        label="Save"
                        onClick={onSubmit}
                        primary={true}/> : undefined}
                {['form', 'new'].indexOf(view)>=0 && !mobile ?
                    <FlatButton className="col" style={{padding: 0, margin: '0.5em'}}
                        label="Cancel"
                        onClick={onCancel}
                        secondary={true}/> : undefined}
            </div>);
    }
})

export const AppBarRightElement = React.createClass({
    propTypes: {
        onDelete: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        onToggleSelectColumn: React.PropTypes.func,
        selectedUuids: React.PropTypes.array,
        selectColumn: React.PropTypes.bool,
        view: React.PropTypes.string,
    },
    render() {
        const {view, selectedUuids, onSubmit, onDelete,
               selectColumn, onToggleSelectColumn} = this.props;
        const hasSelection = selectedUuids.length>0;
        const mobile = window.innerWidth < MD;
        return (
            mobile && view === 'list' ?
            <IconMenu
                iconButtonElement={<IconButton><MoreVert color='white'/></IconButton>}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                {view == 'list' ?
                <MenuItem
                    primaryText="Select"
                    leftIcon={<Checkbox checked={selectColumn}/>}
                    onTouchTap={onToggleSelectColumn}/> : undefined}
                {view == 'form' || hasSelection ?
                <MenuItem
                    primaryText="Delete"
                    leftIcon={<Delete/>}
                    onTouchTap={onDelete}/> : undefined}
            </IconMenu>
            : mobile && ['form', 'new'].indexOf(view)>=0 ?
            <IconButton onClick={onSubmit}>
                <Check color="white"/>
            </IconButton>
            : <div/>);
    }
})

export const AppBarLeftElement = React.createClass({
    propTypes: {
        dispatch: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        menuOpen: React.PropTypes.bool,
        view: React.PropTypes.string,
    },
    render() {
        const {dispatch, onCancel, menuOpen, view} = this.props;
        const mobile = window.innerWidth < MD;
        return (
            ['form', 'new'].indexOf(view)>=0 ?
            <IconButton onClick={onCancel}>
                <ArrowBack color="white"/>
            </IconButton>
            : menuOpen && mobile ?
            <IconButton onClick={()=>dispatch(toggleMenu())}>
                <Close color="white"/>
            </IconButton>
            : <IconButton onClick={()=>dispatch(toggleMenu())}>
                <NavigationMenu color="white"/>
            </IconButton>
        );
    }
})
