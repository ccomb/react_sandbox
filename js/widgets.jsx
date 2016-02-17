import React from 'react';
import ReactQuill from 'react-quill';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

const StringWidget = (props) => 
    <TextField
        {...props}
        id={props.name}
        ref={props.widgetDidMount}
        onEnterKeyDown={props.onSubmit}
        onChange={props.onChangeField}
        floatingLabelText={props.name}
        />;

const TextWidget = (props) => {
    const {onSubmit, ...other} = props;
    return <StringWidget {...other} multiLine={true} />
}

const PasswordWidget = (props) =>
    <StringWidget {...props} type='password' />

const HTMLWidget = (props) => {
  return (
    <div>
      <label>{props.name}</label>
      <ReactQuill
        theme="snow"
        defaultValue={props.placeholder}
        required={props.required}
        onChange={props.onChangeField} />
    </div>
  );
}

const DateWidget = (props) =>
    <DatePicker
        id={props.name}
        hintText={props.name}
        onChange={props.onChangeField}
        mode="landscape" />

const WIDGETS = {
    string: StringWidget,
    text: TextWidget,
    password: PasswordWidget,
    html: HTMLWidget,
    date: DateWidget
}

export default WIDGETS;
