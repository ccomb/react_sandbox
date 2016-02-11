import React from 'react';
import ReactDOM from 'react-dom';
import {deleteContact} from './actions';
import IconButton from 'material-ui/lib/icon-button';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import {createStore, applyMiddleware} from 'redux';
import {connect} from 'react-redux';

export var ContactItem = connect(state=>({state}))(React.createClass({
    displayName: 'ContactItem',
    propTypes: {
        surname: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    onDelete: function() {
        this.props.dispatch(deleteContact(this.props.email))
    },
    render: function() {
        var status = this.props.status;
        var color = status=='saving' ? 'orange' : status=='saved' ? 'green' : 'red';
        return (<TableRow className='Contact' style={{border: "solid 1px #EEE"}}>
                    <TableRowColumn>
                        Status: <span style={{background: color, color: 'white'}}>{status}</span>
                    </TableRowColumn>
                    <TableRowColumn className='Contact-surname'>
                        {this.props.surname}
                    </TableRowColumn>
                    <TableRowColumn className='Contact-name'>
                        {this.props.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        <a href={this.props.email}>{this.props.email}</a>
                    </TableRowColumn>
                    <TableRowColumn>
                        {this.props.description}
                    </TableRowColumn>
                    <TableRowColumn>
                        <IconButton iconClassName='' onClick={this.onDelete}>
                            <Delete/>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>);
        
    }
})
)


