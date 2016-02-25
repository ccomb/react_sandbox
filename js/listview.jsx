import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

export const ListView = React.createClass({
    propTypes: {
        listStatus: React.PropTypes.string,
        docStatus: React.PropTypes.object,
        route: React.PropTypes.object,
        docs: React.PropTypes.array,
        params: React.PropTypes.object,
        onDelete: React.PropTypes.func,
        onChangeView: React.PropTypes.func,
        onRowSelection: React.PropTypes.func,
        selectedRows: React.PropTypes.array,
        onSearch: React.PropTypes.func,
    },
    componentDidMount() {
        this.props.onSearch();
    },
    onCellClick(row, col) {
        console.log('onCellClick', row, col)
        if (col != 0) {
            this.props.onChangeView(this.props.params.model, 'form',
                                    this.props.docs[row].uuid);
        }
    },
    render() {
        console.log('render: ListView');
        const {docs, listStatus, docStatus} = this.props;
        return (
        <div style={{position: 'fixed', top: '110px', bottom: 0, overflowY: 'auto'}}>
            <div className="row" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Table
                        onCellClick={this.onCellClick}
                        multiSelectable={true}
                        onRowSelection={this.props.onRowSelection}>
                        <TableBody deselectOnClickaway={false}>
                            {listStatus === 'loading' ? <TableRow selectable={false}><TableRowColumn>Loading...</TableRowColumn></TableRow> :
                            docs.map(doc=>{
                            const color = {'saving': 'orange', 'deleting': 'orange', 'stored': 'green'}[docStatus[doc.uuid]] || 'red';
                            return (<TableRow style={{border: "solid 1px #EEE"}} key={doc.uuid} selected={this.props.selectedRows.indexOf(doc.uuid)+1 ? true : false}>
                                        <TableRowColumn>
                                            Status: <span style={{background: color, color: 'white'}}>{docStatus[doc.uuid]}</span>
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
                                    </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>);
    }
});
