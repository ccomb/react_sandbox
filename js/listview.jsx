import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import FlatButton from 'material-ui/lib/flat-button';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Link from 'react-router/lib/Link';

export const ListView = React.createClass({
    propTypes: {
        status: React.PropTypes.object,
        route: React.PropTypes.object,
        docs: React.PropTypes.object,
        params: React.PropTypes.object,
        onDelete: React.PropTypes.func,
        onRead: React.PropTypes.func,
    },
    onDelete(e) {
        this.props.onDelete(this.props.docs[e.target.id.slice(1)]);
    },
    onRowClick(row) {
        this.props.onRead(this.props.docs[row])
    },
    render() {
        console.log('render: ListView');
        const {docs, status, params} = this.props;
        const model = params.model;
        return (
        <div>
            <div className="row start" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Link to={`/bo/${model}/new`}><FlatButton label="Create" primary={true}/></Link>
                </div>
            </div>
            <div className="row" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Table onCellClick={this.onRowClick}>
                        <TableBody>
                            {status.list === 'loading' ? <TableRow selectable={false}><TableRowColumn>Loading...</TableRowColumn></TableRow> :
                            docs.map((doc, i) =>{
                            const color = {'saving': 'orange', 'deleting': 'orange', 'stored': 'green'}[doc.status] || 'red';
                            return (<TableRow style={{border: "solid 1px #EEE"}} key={doc.uuid}>
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
                                            {doc.surname}
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <IconButton iconClassName='' onClick={this.onDelete} id={'d' + i}>
                                                <Delete/>
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>);
    }
});
