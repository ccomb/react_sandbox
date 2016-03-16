import React from 'react';
import ResponsiveReactGridLayout from 'react-grid-layout/build/ResponsiveReactGridLayout';
import WidthProvider from 'react-grid-layout/build/components/WidthProvider';
import WIDGETS from './widgets';
import {EM} from '../actions';
const Grid = WidthProvider(ResponsiveReactGridLayout);


const ObjectField = React.createClass({

    propTypes: {
        name: React.PropTypes.string,
        schema: React.PropTypes.object,
        doc: React.PropTypes.object,
        layouts: React.PropTypes.object,
        onLayoutChange: React.PropTypes.func,
        required: React.PropTypes.bool,
    },

    render() {
        const {schema, onLayoutChange} = this.props;
        const children = Object.keys(schema.properties).map((name) => {
            const Field = FIELDS[schema.properties[name].type];
            return (<div key={name} >
                    <Field
                        {...this.props}
                        name={name}
                        schema={schema.properties[name]}
                        required={schema.required.indexOf(name)>=0 ? true : false}/>
                    </div>
            )
        });
        return (
            <Grid
                className="layout"
                rowHeight={4.5*EM}
                margin={[10,0]}
                layouts={this.props.layouts}
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480}}
                cols={{lg: 12, md: 8, sm: 6, xs: 4, xxs: 2}}
                onLayoutChange={onLayoutChange}>
            {children}
            </Grid>
        )
    }
});

const StringField = React.createClass({

    propTypes: {
        name: React.PropTypes.string,
        doc: React.PropTypes.object,
        schema: React.PropTypes.object,
        required: React.PropTypes.bool,
    },

    render() {
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
