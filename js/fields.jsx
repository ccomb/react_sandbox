import React from 'react';
import {Responsive as ResponsiveReactGridLayout} from 'react-grid-layout';
import WIDGETS from './widgets';
import {EM} from './actions';

var ObjectField = React.createClass({

    propTypes: {
        name: React.PropTypes.string,
        schema: React.PropTypes.object,
        required: React.PropTypes.bool,
    },

    render: function() {
        const {schema} = this.props;
        var self = this;
        const children = Object.keys(schema.properties).map((name) => {
            const Field = FIELDS[schema.properties[name].type];
            return (<div key={name} style={{background: '#EEE'}}>
                    <Field
                        {...self.props}
                        name={name}
                        schema={schema.properties[name]}
                        required={schema.required ? schema.required.indexOf(name)+1 : false}/>
                    </div>
            )
        });
        return (
            <ResponsiveReactGridLayout className="layout" rowHeight={4.5*EM} width={1500} margin={[0,0]}
                                       cols={{lg: 12, md: 8, sm: 6, xs: 4, xxs: 2}}>
            {children}
            </ResponsiveReactGridLayout>
        )
                
    }
});

const StringField = React.createClass({

    propTypes: {
        name: React.PropTypes.string,
        schema: React.PropTypes.object,
        required: React.PropTypes.bool,
    },

    render: function() {
        const {schema} = this.props;
        const Widget = WIDGETS[schema.subtype] || WIDGETS['string'];
        return (
            <Widget {...this.props} required={this.props.required}/>
        )
    }
})

const FIELDS = {
    object: ObjectField,
    string: StringField
}

export default FIELDS;
