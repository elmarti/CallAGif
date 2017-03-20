import React, {
    Component
}
from 'react';

import {
    createContainer
}
from 'meteor/react-meteor-data';
import {
    Grid,
    Row,
    Col
}
from 'react-bootstrap';
import {
    IntroModal,
    ImageList
}
from '../';
import annyang from 'annyang';
class App extends Component {
    constructor() {
        super();
        this.state = {
            showModal: true,
            imgUrl: undefined,
            searchString: "Say something!",
            listening: false,
            loading: false,
            oldImages: []
        };
        if (annyang) {
            annyang.start({
                continuous: true
            });
            annyang.addCallback("start", () => {
                this.setState({
                    listening: true
                });
            })
            let oldResult = [];
            annyang.addCallback("result", (result) => {
                annyang.pause();
                const searchString = result[0];
                const oldSearchString = this.state.searchString;
                this.setState({
                    showModal: false,
                    searchString,
                    loading: true
                });
                if (oldResult != result) {
                    oldResult = result;
                    Meteor.call("getGif", searchString, (err, imgUrl) => {
                        if (err) console.log(err);
                        else {
                            let oldImages = this.state.oldImages;
                            if (this.state.imgUrl)
                                oldImages.unshift({img:this.state.imgUrl, title:oldSearchString});

                            this.setState({
                                imgUrl,
                                oldImages
                            });
                            this.setState({
                                loading: false
                            });
                            annyang.resume({
                                continuous: true
                            })
                        }
                    })
                }
            });

        }
    }
    closeModal(start) {
        this.setState({
            showModal: false
        });

    }
    changeImage(image){
        let {searchString, imgUrl, oldImages} = this.state; 
        oldImages.unshift({
            img:imgUrl,
            title:searchString
        });
        this.setState({
            oldImages, 
            imgUrl:image.img, 
            searchString:image.title
        })
    }
    render() {
        const {
            content
        } = this.props;
        return (
            <Grid>
            <IntroModal listening={this.state.listening} recogniser={annyang} show={this.state.showModal} close={this.closeModal.bind(this)}/>
             <Row className="gif_wrapper">
             {this.state.loading ? "Loading..." : 
             this.state.imgUrl ? <img src={this.state.imgUrl} id="the_gif"/> :""}
             </Row>
             <Row className="title_wrapper">
                <h1>{this.state.searchString}</h1>
             </Row>
             <Row className="bottom_row">
             <Col md={6}>
             
             </Col>
             
            <ImageList changeImage={this.changeImage.bind(this)} images={this.state.oldImages}/>
             </Row>
            </Grid>
        )
    }
}

export default createContainer(() => {

    return {};
}, App);
