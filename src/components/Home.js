import React from 'react';
import $ from 'jquery';
import { Tabs, Spin } from 'antd';
import { GEO_OPTIONS ,POST_KEY, API_ROOT, AUTH_PREFIX , TOKEN_KEY } from "../constants";
import { Gallery } from "./Gallery";
import { CreatePostButton } from "./CreatePostButton"

const TabPane = Tabs.TabPane;


export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        posts: [],
        error: '',
    }
    //do resource loading should be in this life circle
    //No need to use arrow function, because it is automatically binded for life circle functions
    //Only user defined needs them.
    componentDidMount(){
        this.setState({loadingGeoLocation: true, error: ''});
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
            this.setState({error: 'Geolocation is Not supported in this browser '});
        }
    }

    onSuccessLoadGeolocation = (position) => {
        console.log(position);
        this.setState({ loadingGeoLocation: false, error: ''});
        const { latitude, longitude} = position.coords;
        localStorage.setItem(POST_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        this.loadNearbyPosts();
    }

    onFailedLoadGeolocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geolocation'});

    }

    getGalleryContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geolocation..."/>;
        } else if (this.state.loadingPosts){
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            //[1,2,3].map(f) => [f(1),f(2),f(3)]
                const images = this.state.posts.map((post) => {
                    //format the image's attributes
                    return {
                        user: post.user,
                        src: post.url,
                        thumbnail: post.url,
                        thumbnailWidth: 400,
                        thumbnailHeight: 300,
                        caption: post.message,
                    }

            });
                return <Gallery images={images}/>
        } else {
        return null;
        }
    }
    loadNearbyPosts = () => {
        this.setState({loadingPosts: true, error:''});
        //parse the string and use destructor to get lat and lon
        const { lat, lon } = JSON.parse(localStorage.getItem(POST_KEY));
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        }).then((response)=>{
            this.setState({posts: response, loadingPosts: false, error:''});
            console.log(response);
        }, (error)=>{
            this.setState({loadingPosts: false, error: error.responseText});
            console.log(error);
        }).catch((error)=>{
            console.log(error);
        });
    }
    //do clear resource should be in willMount life circle
    //if we want to insert a java script we need to use {} and it must return a value
    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>
        return (
                <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                    <TabPane tab="Posts" key="1">
                    {this.getGalleryContent()}
                        </TabPane>
                    <TabPane tab="Map" key="2">Content of tab 2</TabPane>
                </Tabs>
        )
    }
}