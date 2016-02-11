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
    <div>
      <div className="row">
      <Paper zDepth={0} className="box"
             style={{padding: "1%", margin: "1%", background: "#EEE"}}>
          header
      </Paper>
      </div>
      <div className="row center-sm"
           style={{margin: '1%', paddingLeft: leftoffset?'256px':'0',
                   transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
        <div>
          <Paper className="box" style={{padding: '3%'}}>
            <Table>
              <TableBody>
                {state.contacts.map(c => {return <ContactItem {...c} key={key++}/>})}
              <ContactForm contacts={state.contacts} dispatch={dispatch}/>
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    </div>)
  }
}
