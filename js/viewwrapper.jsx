import React from "react";
import Paper from 'material-ui/lib/paper';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import {ContactItem} from "./listview";
import {ContactForm} from "./formview";

export default class ViewWrapper extends React.Component {
  render() {
    var key = 0;
    const {state, dispatch, leftoffset} = this.props;
    return (
    <div
        style={{
            background: '#EEE',
            paddingLeft: leftoffset?'256px':'0',
            transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
        <div
            className="row between-sm"
            style={{
                margin: 0,
                background: "#EEE",
                width: '100%'}}>
            <div className='col-sm-2 start-sm'>
                <div className='box' style={{textAlign: 'center'}}>
                    buttons
                </div>
            </div>
            <div className='col-sm-2 center-sm'>
                <div className='box' style={{textAlign: 'center'}}>
                    actions
                </div>
            </div>
            <div className='col-sm-2 end-md'>
                <div className='box' style={{textAlign: 'center'}}>
                    views
                </div>
            </div>
        </div>
      <div className="row center-sm" style={{margin: '1%'}}>
        <div className="col-xs center">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <Table>
              <TableBody>
                {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
              </TableBody>
            </Table>
            <ContactForm contacts={state.contacts} dispatch={dispatch}/>
          </Paper>
        </div>
      </div>
    </div>)
  }
}
