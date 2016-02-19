import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import FlatButton from 'material-ui/lib/flat-button';
import Delete from 'material-ui/lib/svg-icons/action/delete';

export const ListView = React.createClass({
    displayName: 'ListView',
    propTypes: {
        status: React.PropTypes.string,
        route: React.PropTypes.object,
        docs: React.PropTypes.object,
        onDelete: React.PropTypes.func,
        changeView: React.PropTypes.func
    },
    onCreate: function() {
        this.props.changeView('new');
    },
    onDelete: function(doc) {
        this.props.onDelete(doc);
    },
    render: function() {
        const {docs, status} = this.props;
        const self = this;
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
                            {status === 'loading' ? <TableRow selectable={false}><TableRowColumn>Loading...</TableRowColumn></TableRow> :
                            Object.keys(docs).map(uuid =>
                            <ListItem
                                key={uuid}
                                doc={docs[uuid]}
                                onDelete={self.onDelete}/>)}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>);
    }
});

export const ListItem = React.createClass({
    displayName: 'ListItem',
    propTypes: {
        doc: React.PropTypes.object,
        onDelete: React.PropTypes.func
    },
    onDelete: function() {
        this.props.onDelete(this.props.doc);
    },
    render: function() {
        const {doc} = this.props;
        const color = {'saving': 'orange', 'deleting': 'orange', 'stored': 'green'}[doc.status] || 'red';
        return (
                <TableRow style={{border: "solid 1px #EEE"}}>
                    <TableRowColumn>
                        Status: <span style={{background: color, color: 'white'}}>{doc.status}</span>
                    </TableRowColumn>
                    <TableRowColumn>
                        {doc.uuid}
                    </TableRowColumn>
                    <TableRowColumn>
                        {doc.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        <IconButton iconClassName='' onClick={this.onDelete}>
                            <Delete/>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>);
        
    }
})



