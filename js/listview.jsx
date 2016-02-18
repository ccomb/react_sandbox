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
import {loadRecords} from './actions';

export const ListView = connect(state=>({state}))(React.createClass({
    onCreate: function() {
        const {route} = this.props;
        changeView(route, 'new');
    },
    render: function() {
        const {dispatch, state} = this.props;
        if (!Object.keys(state.docs).length) {
            dispatch(loadRecords('contact'));
        }
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
                        {Object.keys(state.docs).map(key => {return <ListItem {...state.docs[key]} key={key}/>})}
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
        uuid: React.PropTypes.string,
        surname: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        date: React.PropTypes.string,
        email: React.PropTypes.string,
        description: React.PropTypes.string
    },
    onDelete: function() {
        this.props.dispatch(deleteDoc(this.props.uuid))
    },
    render: function() {
        const status = this.props.status;
        const color = status=='saving' ? 'orange' : status=='saved' ? 'green' : 'red';
        return (
                <TableRow style={{border: "solid 1px #EEE"}}>
                    <TableRowColumn>
                        Status: <span style={{background: color, color: 'white'}}>{status}</span>
                    </TableRowColumn>
                    <TableRowColumn>
                        {this.props.surname}
                    </TableRowColumn>
                    <TableRowColumn>
                        {this.props.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {this.props.date.toLocaleString()}
                    </TableRowColumn>
                    <TableRowColumn>
                        <a href={'mailto:' + this.props.email}>{this.props.email}</a>
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


