import React from 'react';
import ReactQuill from 'react-quill';
import TextField from 'material-ui/lib/TextField';
import DatePicker from 'material-ui/lib/DatePicker';

const StringWidget = (props) => {
    return <TextField
        {...props}
        name={props.name}
        value={props.doc !== undefined ? props.doc.payload !== undefined ? props.doc.payload[props.name] : undefined : undefined}
        ref={props.widgetDidMount}
        onKeyDown={props.onKeyDown}
        onChange={props.onChangeField}
        floatingLabelText={props.name}
        underlineStyle={{borderColor: props.required ? 'red' : undefined}}
        underlineFocusStyle={{borderColor: props.required ? 'red' : undefined}}
        style={{height: '100%'}}
        fullWidth={true}
        />;}

const TextWidget = (props) => {
    const {onKeyDown, ...other} = props;
    return <StringWidget {...other} multiLine={true} />
}

const PasswordWidget = (props) =>
    <StringWidget {...props} type='password' />

const HTMLWidget = (props) => {
  return (
    <div style={{height: '100%'}}>
      <label>{props.name}</label>
      <ReactQuill
        theme="snow"
        defaultValue={props.placeholder}
        required={props.required}
        onChange={props.onChangeField} />
    </div>
  );
}

const DateWidget = React.createClass({
    onChange(e, date) {
        // we simulate an event object
        this.props.onChangeField({
            target: {
                name: this.props.name,
                value: date
            }
        });
    },
    render() {
    return  <DatePicker
        id={this.props.name}
        hintText={this.props.name}
        onChange={this.onChange}
        style={{height: '100%'}}
        textFieldStyle={{width: '100%'}}
        mode="landscape" />
    }
});

const WIDGETS = {
    string: StringWidget,
    text: TextWidget,
    password: PasswordWidget,
    html: HTMLWidget,
    date: DateWidget
}

export default WIDGETS;
