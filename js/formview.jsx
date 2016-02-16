import React from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import FlatButton from 'material-ui/lib/flat-button';
import {connect} from 'react-redux';
import {changeView, storeDoc, focusField, changeField} from './actions';
import {SchemaForm} from "./schemaform";
import {schema} from "./schema";
import Paper from 'material-ui/lib/paper';


export const FormView = connect(state=>({state}))(React.createClass({
    displayName: 'FormView',
    propTypes: {
        doc: React.PropTypes.object,
        onSubmit: React.PropTypes.func
    },
    onCancel: function(e) {
        e.preventDefault()
        changeView(this.props.route, 'list');
    },
    onSubmit: function(e) {
        e.preventDefault()
        const doc = this.props.state.form.data;
        this.props.dispatch(storeDoc(doc))
        changeView(this.props.route, 'list');
    },
    getInitialState: function() {
        // antipattern power, we init state with props
        return { shouldfocus: this.props.initialfocus }
    },
    onChangeField: function(event) {  // TODO remove
        this.props.dispatch(changeField(event.target))
    },
    widgetDidMount: function(input) {
        if (input != null && input.props.type == 'text'
            && this.state.shouldfocus == input.props.id){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
        if (input && this.props.state.form.data[input.props.id])
            input.setValue(this.props.state.form.data[input.props.id]);
    },
    render: function() {
        return (
      <div className="row center-sm" style={{margin: '1%'}}>
        <div className="col-xs center">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
            <SchemaForm
                schema={schema}
                formData={{}}
                widgetDidMount={this.widgetDidMount}
                onChangeField={this.onChangeField}
                onChange={()=>console.log("changed")}
                onSubmit={()=>console.log("submit")}
                onError={()=>console.log("errors")} />
                <FlatButton
                    label="Cancel"
                    onClick={this.onCancel}
                    cancel={true}/>
                <FlatButton
                    label="Save"
                    onClick={this.onSubmit}
                    primary={true}/>
            </form>
          </Paper>
        </div>
      </div>);
    }
}));


