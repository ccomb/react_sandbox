import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Link from 'react-router/lib/Link';
import Add from 'material-ui/lib/svg-icons/content/add';
import {MD} from './actions';

export const ActionButtons = React.createClass({
    propTypes: {
        selectedRows: React.PropTypes.array,
        createLink: React.PropTypes.string,
        onDelete: React.PropTypes.func,
        view: React.PropTypes.string,
    },
    render() {
        const hasSelection = this.props.selectedRows.length>0;
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
                (!hasSelection && mobile && view == 'list') ?
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
