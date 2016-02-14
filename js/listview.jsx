import React from 'react';
import ReactDOM from 'react-dom';
import {deleteContact} from './actions';
import IconButton from 'material-ui/lib/icon-button';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import {createStore, applyMiddleware} from 'redux';
import {connect} from 'react-redux';

export var ListView = connect(state=>({state}))(React.createClass({
    render() {
        const {state} = this.props;
        var key = 0;
        return (
          <div className="row center-sm" style={{margin: '1%'}}>
            <div className="col-xs center">
              <Table>
                <TableBody>
                  {state.contacts.map(c => {return <ListItem {...c} key={key++}/>})}
                </TableBody>
              </Table>
            </div>
          </div>);
    }
}));

export var ListItem = connect(state=>({state}))(React.createClass({
    displayName: 'ListItem',
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


