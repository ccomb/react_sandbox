import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import {schema, layouts} from "./schema";
import Paper from 'material-ui/lib/paper';
import FIELDS from './fields';


export const FormView = React.createClass({
    propTypes: {
        route: React.PropTypes.object,
        form: React.PropTypes.object,
        onStore: React.PropTypes.func,
        initialfocus: React.PropTypes.string,
        onChangeField: React.PropTypes.func,
        changeView: React.PropTypes.func,
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
        console.log('render: FormView');
        const Field = FIELDS[schema.type];
        const {data} = this.props.form;
        return (
      <div className="row center-xs" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
            <Field
                onSubmit={this.onSubmit}
                schema={schema}
                data={data}
                layouts={layouts}
                onChangeField={this.onChangeField}
                widgetDidMount={this.widgetDidMount}
                />
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


