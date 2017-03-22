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
export default class App extends Component {
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
                            if (this.state.imgUrl) {
                                oldImages.unshift({
                                    img: this.state.imgUrl,
                                    title: oldSearchString
                                });
                                oldImages.splice(10, 1);
                            }
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
    changeImage(image) {
        let {
            searchString,
            imgUrl,
            oldImages
        } = this.state;
        oldImages.unshift({
            img: imgUrl,
            title: searchString
        });
        oldImages.splice(10, 1);
        this.setState({
            oldImages,
            imgUrl: image.img,
            searchString: image.title
        })
    }
    render() {
        const {
            content
        } = this.props;
        return (
            <div id="page-wrapper">
            <div id="page-container">
            <div id="main-container">
            <header className="navbar navbar-default">
            <h1 style={{paddingLeft:"20px"}}>Call A Gif</h1>
            </header>
            <div id="page-content">
            <Grid>
            <IntroModal listening={this.state.listening} recogniser={annyang} show={this.state.showModal} close={this.closeModal.bind(this)}/>
             <Row className="block" style={{textAlign:"center"}}>
             <div className="block-title">
                    <h2>{this.state.searchString} - {this.state.imgUrl ? "Said " + this.state.imgUrl.count + " times." : ""}</h2>
             </div>
             {this.state.loading ? "Loading..." : 
             this.state.imgUrl ? <img src={this.state.imgUrl.url} id="the_gif"/> :"Say something!!!"}
             </Row>
             <Row style={{paddingBottom:"20px", textAlign:"center", margin:"0px"}}>
             <img src="/giphy.gif" style={{height:"70px"}} />
             </Row>
             <Row className="bottom_row">
             <Col md={6}>
             
             <div className="block">
                <div className="block-title">
                    <h2>TODO</h2>
                </div>
             
             </div>
             </Col>
             
            <ImageList changeImage={this.changeImage.bind(this)} images={this.state.oldImages}/>
             </Row>
            </Grid>
            </div>
            </div>
            </div>
            </div>
        )
    }
}

