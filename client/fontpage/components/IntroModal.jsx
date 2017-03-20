import React, {
    Component
}
from 'react';
import {
    Modal,
    Button
}
from 'react-bootstrap';
import {
    createContainer
}
from 'meteor/react-meteor-data';
class IntroModal extends Component {

    render() {
        let content = "";
        if (this.props.recogniser) {
            content =
                (
                    <p><b>
            Speech recognition works in your browser,    {this.props.listening ? "click the start button below and say something!" : "Please allow access to your microphone"}
            </b></p>);
        }
        else {
            content = <p><b>
            C'mon, what year is this?! Please use a newer browser, or Chrome Mobile!
         </b></p>;
        }
        return (
            <Modal show={this.props.show}>
          <Modal.Body>
            <h1>Welcome to CallAGif!</h1>
            <h4>CallAGif allows you to look up Gifs using your voice!</h4>
           {content}
            </Modal.Body>
          <Modal.Footer>
           {this.props.recogniser ? this.props.listening ? <Button onClick={this.props.close}>Start</Button> : <Button disabled>Please allow access to you microphone</Button> : <Button disabled>Open in a better browser to continue</Button>}
          </Modal.Footer>
        </Modal>

        )
    }
}

export default createContainer(() => {
    return {};
}, IntroModal);
