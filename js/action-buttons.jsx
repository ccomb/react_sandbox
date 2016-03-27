import React from 'react';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import FlatButton from 'material-ui/lib/FlatButton';
import FloatingActionButton from 'material-ui/lib/FloatingActionButton';
import Link from 'react-router/lib/Link';
import Add from 'material-ui/lib/svg-icons/content/add';
import IconMenu from 'material-ui/lib/IconMenu';
import MenuItem from 'material-ui/lib/MenuItem';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Check from 'material-ui/lib/svg-icons/navigation/check';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/lib/IconButton';
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import Checkbox from 'material-ui/lib/Checkbox'
import {toggleMenu} from './actions';

export const HeaderActions = React.createClass({
    propTypes: {
        selection: React.PropTypes.array,
        createLink: React.PropTypes.string,
        onDelete: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        view: React.PropTypes.string,
        device: React.PropTypes.string,
    },
    render() {
        const hasSelection = this.props.selection.length>0;
        const {device, view, onDelete, onCancel, onSubmit, createLink} = this.props;
        return (
            <div className="row start">
                {view === 'list' && device !== 'mobile' ?
                    <Link to={createLink}
                          style={{padding: 0, margin: '0.5em'}}>
                        <FlatButton label="Create"/>
                    </Link> : undefined}
                {view === 'list' && device === 'mobile' ?
                    <Link to={createLink}
                          key="floatingcreatebutton">
                        <FloatingActionButton
                            style={{position: 'fixed', right: '1em', bottom: '1em', zIndex: 1000}}>
                            <Add/>
                        </FloatingActionButton>
                    </Link> : undefined}
                {hasSelection && device !== 'mobile' && ['form', 'new'].indexOf(view)<0 ?
                    <FlatButton className="col" style={{padding: 0, margin: '0.5em'}}
                        label="Delete"
                        onClick={onDelete}
                        primary={true}/> : undefined}
                {['form', 'new'].indexOf(view)>=0 && device !== 'mobile' ?
                    <FlatButton className="col" style={{padding: 0, margin: '0.5em'}}
                        label="Save"
                        onClick={onSubmit}
                        primary={true}/> : undefined}
                {['form', 'new'].indexOf(view)>=0 && device !== 'mobile' ?
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
        selection: React.PropTypes.array,
        selectColumn: React.PropTypes.bool,
        view: React.PropTypes.string,
        device: React.PropTypes.string,
    },
    render() {
        const {device, view, selection, onSubmit, onDelete,
               selectColumn, onToggleSelectColumn} = this.props;
        const hasSelection = selection.length>0;
        return (
            device === 'mobile' && view === 'list' ?
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
            : device == 'mobile' && ['form', 'new'].indexOf(view)>=0 ?
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
        device: React.PropTypes.string,
    },
    render() {
        const {device, dispatch, onCancel, menuOpen, view} = this.props;
        return (
            device === 'mobile' && ['form', 'new'].indexOf(view)>=0 ?
            <IconButton onClick={onCancel}>
                <ArrowBack color="white"/>
            </IconButton>
            : menuOpen && device === 'mobile' ?
            <IconButton onClick={()=>dispatch(toggleMenu())}>
                <Close color="white"/>
            </IconButton>
            : <IconButton onClick={()=>dispatch(toggleMenu())}>
                <NavigationMenu color="white"/>
            </IconButton>
        );
    }
})
