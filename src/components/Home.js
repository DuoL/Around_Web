import React from 'react';
import { Tabs, Button } from 'antd';
import { GEO_OPTIONS } from "../constants";

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
    }
    //do resource loading should be in this life circle
    //No need to use arrow function, because it is automatically binded for life circle functions
    //Only user defined needs them.
    componentDidMount(){
        this.setState({loadingGeoLocation: true});
        this.getGeolocation();
    }

    getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeolocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
        } else {
            /* geolocation IS NOT available */
        }
    }

    onSuccessLoadGeolocation = (position) => {
        console.log(position);
        this.setState({ loadingGeoLocation: false});
    }

    onFailedLoadGeolocation = () => {
        this.setState({ loadingGeoLocation: false});
    }

    getGalleryContent = () => {
        return this.state.loadingGeoLocation ? <span>loading geolocation</span> : null;
    }
    //do clear resource should be in willMount life circle
    //if we want to insert a java script we need to use {} and it must return a value
    render() {
        return (
                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Posts" key="1">
                    {this.getGalleryContent()}
                        </TabPane>
                    <TabPane tab="Map" key="2">Content of tab 2</TabPane>
                </Tabs>
        )
    }
}