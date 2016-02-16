import React from 'react';
import ReactDOM from 'react-dom';
import TextWidget from 'material-ui/lib/text-field';
import ReactGridLayout from 'react-grid-layout';

const WIDGETS = {
    string: TextWidget
}

export var ObjectField = React.createClass({
    displayName: 'ObjectField',

//input val = self.props.state.form[name]

    render: function() {
        const {schema} = this.props;
        var i = 0, self = this;
        const children = Object.keys(schema.properties).map(function(name) {
            return (<div key={name + i++}
                         _grid={{x: 0, y: 2*i, w: 3, h: 1.5}}>
                    {React.createElement(WIDGETS[schema.properties[name].type] || ObjectField,
                                         {schema: schema.properties[name],
                                          onChange: self.props.onChangeField,
                                          id: name,
                                          ref: self.props.widgetDidMount,
                                          floatingLabelText: name})}
                    </div>
            )
        });
        return (
            <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1500}>
            {children}
            </ReactGridLayout>
        )
                
    }
});

export var StringField = React.createClass({
    displayName: 'StringField',
    render: function() {
        const {schema} = this.props;
        const Widget = WIDGETS[schema.widget] || TextWidget;
        return (
            <Widget />
        )
    }
})


const FIELDS = {
    object: ObjectField,
    string: StringField
}

export var SchemaForm = React.createClass({
    displayName: 'SchemaForm',
    render: function() {
        const {schema} = this.props;
        const Field = FIELDS[schema.type];
        return <Field
                schema={schema}
                onChangeField={this.props.onChangeField}
                widgetDidMount={this.props.widgetDidMount}/>;
    }
})
