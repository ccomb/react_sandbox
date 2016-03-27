import React from "react";
import {connect} from 'react-redux';
import Card from 'material-ui/lib/Card';
import CardTitle from 'material-ui/lib/Card/CardTitle';
import CardMedia from 'material-ui/lib/Card/CardMedia';

const APPS = [
    {url: 'bo', title: 'Back Office', desc: 'Stunning offline-first and mobile-first back office'},
    {url: 'pos', title: 'Point of Sale', desc: 'Stunning offline-first and mobile-first point of sale'},
    {url: 'bi', title: 'Business Intelligence', desc: 'Stunning offline-first and mobile-first business intelligence'},
]

export const Home = connect(state=>({path: state.path}))(React.createClass({
    displayName: 'Home',
    propTypes: {
      state: React.PropTypes.object,
      path: React.PropTypes.string,
    },
    render() {
        console.log('render: Home');
        return (
            <div className='row center-xs around center-xs start-sm' style={{margin: 0, padding: '1em'}}>
                 {APPS.map((app)=>
                <div key={app.url} className='col-xs-12 col-sm-6 col-md-3' style={{marginBottom: '1em'}}>
                    <a href={`#/${app.url}/`} className="box">
                        <Card>
                            <CardMedia overlay={
                                <CardTitle title={`${app.title}`} subtitle={`${app.desc}`} />
                            }>
                            <div style={{background: 'linear-gradient(45deg, #DDD 0%,#000 100%)', height: '14.5em'}}/>
                            </CardMedia>
                        </Card>
                    </a>
                </div>)}
            </div>);
         }
}));
