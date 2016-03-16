import React from 'react';
import {schema} from "../schema";
import Paper from 'material-ui/lib/paper';
import {clearFormData, changeField, changeLayout} from './actions';
import FIELDS from './fields';

export const FormView = React.createClass({
    propTypes: {
        uuid: React.PropTypes.string,
        model: React.PropTypes.string,
        view: React.PropTypes.string,
        doc: React.PropTypes.object,
        layouts: React.PropTypes.object,
        initialFocus: React.PropTypes.string, // TODO compute in mapstatetoprops
        onSubmit: React.PropTypes.func,
        onLayoutChange: React.PropTypes.func,
        loadLayouts: React.PropTypes.func,
        dispatch: React.PropTypes.func,
        loadDoc: React.PropTypes.func,
    },
    onKeyDown(event) {
        if (event.nativeEvent.keyCode === 13) {
            event.preventDefault();
            this.props.onSubmit(event);
        }
    },
    getInitialState() {
        return {shouldfocus: this.props.initialFocus};
    },
    onChangeField(event) {
        this.props.dispatch(changeField(this.props.uuid, event.target));
    },
    widgetDidMount(input) {
        if (input != null && ['text', 'password'].indexOf(input.props.type)>=0
            && this.state.shouldfocus == input.props.name){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
    },
    componentWillUnmount() {
        this.props.dispatch(clearFormData());
    },
    componentWillMount() {
    if (!this.props.layouts)
        this.props.loadLayouts();
    },
    componentDidMount() {
        if (this.props.loadDoc) this.props.loadDoc();
    },
    onLayoutChange(layout, layouts) {
        this.props.dispatch(changeLayout(this.props.model, layouts));
    },
    render() {
        console.log('render: FormView');
        const Field = FIELDS[schema.type];
        const {doc, layouts} = this.props;
        return (
      <div className="row center-xs" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
                <Field
                    onKeyDown={this.onKeyDown}
                    schema={schema}
                    doc={doc}
                    layouts={layouts}
                    onChangeField={this.onChangeField}
                    onLayoutChange={this.onLayoutChange}
                    widgetDidMount={this.widgetDidMount}
                />
            </form>
          </Paper>
        </div>
      </div>);
    }
});
