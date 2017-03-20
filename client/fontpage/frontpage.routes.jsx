import React, {
    Component
}
from 'react';
import {
    FlowRouter
}
from 'meteor/kadira:flow-router-ssr';
import {
    mount
}
from 'react-mounter';
import {
    App
}
from './';

FlowRouter.route("/", {
    name: "frontpage",
    action() {
        mount(App);
    }
})
