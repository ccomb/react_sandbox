import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Link from 'react-router/lib/Link';
import Add from 'material-ui/lib/svg-icons/content/add';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import IconButton from 'material-ui/lib/icon-button';
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import {MD} from './actions';

export const HeaderActions = React.createClass({
    propTypes: {
        selectedUuids: React.PropTypes.array,
        createLink: React.PropTypes.string,
        onDelete: React.PropTypes.func,
        view: React.PropTypes.string,
    },
    render() {
        const hasSelection = this.props.selectedUuids.length>0;
        const mobile = window.innerWidth < MD;
        const {view} = this.props;
        return (
            <div className="row start">
                {[(!mobile) ?
                 <div key="createbutton"
                      className="col"
                      style={{padding: 0, margin: '0.5em'}}>
                  <Link to={this.props.createLink}>
                      <FlatButton label="Create"/>
                  </Link>
                 </div> : undefined,
                 (hasSelection && !mobile) ?
                 <div key="deletebutton"
                      className="col"
                      style={{padding: 0, margin: '0.5em'}}>
                  <FlatButton
                    label="Delete"
                    onClick={this.props.onDelete}
                    primary={true}/>
                 </div>: undefined,
                (mobile && view == 'list') ?
                <Link to={this.props.createLink}
                      key="floatingcreatebutton">
                    <FloatingActionButton
                        iconClassName=''
                        style={{position: 'fixed', right: '1em', bottom: '1em', zIndex: 1000}}>
                        <Add/>
                    </FloatingActionButton>
                </Link> : undefined]}
            </div>);
    }
})

export const AppbarActions = React.createClass({
    propTypes: {
        onDelete: React.PropTypes.func,
        selectedUuids: React.PropTypes.bool,
        view: React.PropTypes.object,
    },
    render() {
        const {view, selectedUuids, onDelete} = this.props;
        const hasSelection = selectedUuids.length>0;
        const mobile = window.innerWidth < MD;
        return (mobile ?
            <IconMenu
                iconButtonElement={<IconButton><MoreVert color='white'/></IconButton>}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            {view == 'form' || selectedUuids.length>0 ?
            <MenuItem
                id={(view == 'form' || hasSelection) ? 'delete' : undefined}
                primaryText="Delete"
                leftIcon={<Delete/>}
                onTouchTap={onDelete}/> : undefined}
            </IconMenu> : <div/>);
    }
})
