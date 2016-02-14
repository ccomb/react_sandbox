import React from "react";
import {ListView} from "./listview";
import {FormView} from "./formview";

export default class ViewWrapper extends React.Component {
  render() {
    const {state, dispatch, leftoffset} = this.props;
    console.log('state.path→'+state.path);
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
        {state.path == '#/bo/contacts' ? <ListView/> : state.path == '#/bo/newcontact' ? <FormView/> : ''}
    </div>)
  }
}
