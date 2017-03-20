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
             <Col className="image_list" md={6}>
             {
                 this.props.images.map((image, index)=>(
                 <Row>
                 <img onClick={this.changeImage.bind(this, image)} src={image.img} key={index} className="image_history_item"/>
                 <h4>
                 {image.title}
                 </h4>
                 </Row>
                 ))
             }
             </Col>
            );
    }
}
