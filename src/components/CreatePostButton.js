import React from 'react';
import { Modal, Button, message } from 'antd';
import $ from 'jquery';
import { API_ROOT, POST_KEY, AUTH_PREFIX, TOKEN_KEY } from "../constants";
import { WrappedCreatePostForm } from "./CreatePostForm";

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {


        this.form.validateFields((err, values) =>{
            if (!err) {
                const {lat, lon} = JSON.parse(localStorage.getItem(POST_KEY));
                //this is like a map : key,value pair used to wrapper the data into one
                //we use a random hash to split the location into diff parts
                const formData = new FormData();
                formData.set('lat', lat + Math.random() * 0.1 - 0.05);
                formData.set('lon', lon + Math.random() * 0.1 - 0.05);
                formData.set('message', values.message);
                formData.set('image', values.image[0]);

                this.setState({ confirmLoading: true});
                $.ajax({
                    method: 'POST',
                    url: `${API_ROOT}/post`,
                    dataType: 'text',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                    processData: false,
                    contentType: false,
                }).then((response) => {
                    this.form.resetFields();
                    console.log("Success");
                    message.success('created a post successfully.');
                },(error) => {
                    this.form.resetFields();
                    message.error(error.responseText);
                }).then(() => {
                    this.props.loadNearbyPosts().then(() => {
                        this.setState({visible: false, confirmLoading: false});
                    });
                }).catch((error) => {
                    message.error('create post failed');
                    console.log(error);
                });
            }
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    saveFomRef = (form) => {
        this.form = form;
    }
    render() {
        const { visible, confirmLoading} = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                       cancelText="Cancel"
                >
                    <WrappedCreatePostForm ref={this.saveFomRef}/>
                </Modal>
            </div>
        );
    }
}