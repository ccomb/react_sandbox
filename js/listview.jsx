import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import {MD} from './actions';

export const ListView = React.createClass({
    propTypes: {
        listview: React.PropTypes.object,
        formview: React.PropTypes.object,
        route: React.PropTypes.object,
        params: React.PropTypes.object,
        onChangeView: React.PropTypes.func,
        onRowSelection: React.PropTypes.func,
        onSearch: React.PropTypes.func,
    },
    componentDidMount() {
        this.props.onSearch();
    },
    onCellClick(row, col) {
        if (col === -1) {
            // 1st cell click (checkbox)
            this.props.onRowSelection(row);
        } else {
            // enter the record on row click
            this.props.onChangeView(this.props.params.model, 'form',
                                    this.props.listview.docs[row].uuid);
        }
    },
    render() {
        console.log('render: ListView');
        const {docs, listStatus, docStatus, selectedUuids, selectColumn} = this.props.listview;
        const mobile = window.innerWidth < MD;
        return (
        <div style={{position: 'fixed', top: '110px', bottom: 0, overflowY: 'auto'}}>
            <div className="row" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Table multiselectable={true}
                        onCellClick={this.onCellClick}>
                        <TableBody
                            deselectOnClickaway={false}
                            preScanRows={false}
                            displayRowCheckbox={!mobile || selectColumn}>
                            {listStatus === 'loading' ? <TableRow selectable={false}><TableRowColumn>Loading...</TableRowColumn></TableRow> :
                            docs.map((doc, i)=>{
                            const color = {'saving': 'orange', 'deleting': 'orange', 'stored': 'green'}[docStatus[doc.uuid]] || 'red';
                            return (<TableRow onRowClick={undefined}
                                              style={{background: i%2 ? '#FFF' : '#FAFAFA', border: "solid 1px #EEE", cursor: 'pointer'}}
                                              key={doc.uuid}
                                              selected={selectedUuids.indexOf(doc.uuid)>=0}>
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
