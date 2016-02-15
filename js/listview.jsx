import React from 'react';
import ReactDOM from 'react-dom';
import {deleteDoc} from './actions';
import IconButton from 'material-ui/lib/icon-button';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import FlatButton from 'material-ui/lib/flat-button';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import {createStore, applyMiddleware} from 'redux';
import {connect} from 'react-redux';
import {changeView} from './actions';

export const ListView = connect(state=>({state}))(React.createClass({
    onCreate: function() {
        const {route} = this.props;
        changeView(route, 'new');
    },
    render: function() {
        const {state} = this.props;
        var key = 0; // FIXME
        return (
        <div>
            <div className="row start" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <FlatButton label="Create" onClick={this.onCreate} primary={true}/>
                </div>
            </div>
            <div className="row" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Table>
                        <TableBody>
                        {state.docs.map(c => {return <ListItem {...c} key={key++}/>})}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>);
    }
}));

export const ListItem = connect(state=>({state}))(React.createClass({
    displayName: 'ListItem',
    propTypes: {
        surname: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    onDelete: function() {
        this.props.dispatch(deleteDoc(this.props.email))
    },
    render: function() {
        const status = this.props.status;
        const color = status=='saving' ? 'orange' : status=='saved' ? 'green' : 'red';
        return (
                <TableRow className='Contact' style={{border: "solid 1px #EEE"}}>
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


