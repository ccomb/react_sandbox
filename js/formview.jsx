import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import {SchemaForm} from "./schemaform";
import {schema} from "./schema";
import Paper from 'material-ui/lib/paper';


export const FormView = React.createClass({
    displayName: 'FormView',
    propTypes: {
        doc: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        onStore: React.PropTypes.func,
        onChangeField: React.PropTypes.func,
        changeView: React.PropTypes.func,
        route: React.PropTypes.object,
        initialfocus: React.PropTypes.string,
    },
    onCancel: function(e) {
        e.preventDefault();
        this.props.changeView('list');
    },
    onSubmit: function(e) {
        e.preventDefault();
        this.props.onStore();
    },
    getInitialState: function() {
        return { shouldfocus: this.props.initialfocus }
    },
    onChangeField: function(event) {
        this.props.onChangeField(event);
    },
    widgetDidMount: function(input) {
        if (input != null && ['text', 'password'].indexOf(input.props.type)+1
            && this.state.shouldfocus == input.props.name){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
    },
    render: function() {
        return (
      <div className="row center-sm" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
            <SchemaForm
                schema={schema}
                widgetDidMount={this.widgetDidMount}
                onChangeField={this.onChangeField}
                onChange={()=>console.log("changed")}
                onSubmit={this.onSubmit}
                onError={()=>console.log("errors")} />
                <FlatButton
                    label="Save"
                    onClick={this.onSubmit}
                    primary={true}/>
                <FlatButton
                    label="Cancel"
                    onClick={this.onCancel}
                    cancel={true}/>
            </form>
          </Paper>
        </div>
      </div>);
    }
});


