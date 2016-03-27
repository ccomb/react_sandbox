import React from 'react';
import Table from 'material-ui/lib/Table';
import TableBody from 'material-ui/lib/Table/TableBody';
import TableRow from 'material-ui/lib/Table/TableRow';
import TableRowColumn from 'material-ui/lib/Table/TableRowColumn';

export const ListView = React.createClass({
    propTypes: {
        model: React.PropTypes.string,
        view: React.PropTypes.string,
        device: React.PropTypes.string,
        docs: React.PropTypes.object,
        loading: React.PropTypes.string,
        selection: React.PropTypes.array,
        allowSelection: React.PropTypes.bool,
        onRowClick: React.PropTypes.func,
        onRowSelection: React.PropTypes.func,
        onSearch: React.PropTypes.func,
    },
    componentDidMount() {
        this.props.onSearch();
    },
    firstNonEmptyParentId(node) {
        if (!node) return '';
        if (node.id) return node.id;
        return this.firstNonEmptyParentId(node.parentNode);
    },
    onCellClick(row, col, event) {
        const uuid = this.firstNonEmptyParentId(event.target.parentNode);
        if (col === -1) {
            // 1st cell click (checkbox)
            this.props.onRowSelection(uuid);
        } else {
            // transmit the clicked item upstream
            this.props.onRowClick(uuid);
        }
    },
    createRows(docs, selection) {
        let rows = [], i = 1;
        docs.forEach((doc, uuid)=>{
            const color = {'saving': 'orange', 'deleting': 'orange', 'stored': 'green'}[doc.status] || 'red';
            i += 1;
            rows.push(
                <TableRow onRowClick={undefined} id={uuid}
                          style={{background: i%2 ? '#FFF' : '#FAFAFA', border: "solid 1px #EEE", cursor: 'pointer'}}
                          key={uuid}
                          selected={selection.indexOf(uuid)>=0}>
                    <TableRowColumn>
                        Status: <span style={{background: color, color: 'white'}}>{doc.status}</span>                    </TableRowColumn>
                    <TableRowColumn>
                        {uuid}
                    </TableRowColumn>
                    <TableRowColumn>
                        {doc.payload.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {doc.payload.surname}
                    </TableRowColumn>
                </TableRow>
            );
        })
        return rows;
    },
    render() {
        console.log('render: ListView');
        const {device, docs, loading, selection, allowSelection} = this.props;
        return (
        <div style={{position: 'fixed', top: '110px', bottom: 0, overflowY: 'auto'}}>
            <div className="row" style={{margin: 0}}>
                <div className="col" style={{padding: 0}}>
                    <Table multiselectable={true}
                        onCellClick={this.onCellClick}>
                        <TableBody
                            deselectOnClickaway={false}
                            preScanRows={false}
                            displayRowCheckbox={device !== 'mobile' || allowSelection}>
                            {loading === 'loading' ?
                            <TableRow selectable={false}><TableRowColumn>Loading...</TableRowColumn></TableRow>
                            : this.createRows(docs, selection)}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>);
    }
});
