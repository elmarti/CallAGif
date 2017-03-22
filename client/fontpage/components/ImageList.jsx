import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';
import {
    createContainer
}
from 'meteor/react-meteor-data';
export default class ImageList extends Component{
    changeImage(image){
        this.props.changeImage(image);
    }
    render(){
        console.log(this.props.images)
        return (
             <Col md={6}>
             <div className="block image_block">
             <div className="block-title">
                <h2>History</h2>
             </div>
             <div className="image_list">
             {
                 this.props.images.map((image, index)=>(
                 <Row>
                 <img onClick={this.changeImage.bind(this, image)} src={image.img.url} key={index} className="image_history_item"/>
                 <h4 className="image_history_title">
                 {image.title}
                 </h4>
                 </Row>
                 ))
             }
             </div>
             </div>
             </Col>
            );
    }
}
