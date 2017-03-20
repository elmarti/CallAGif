import {
    HTTP
}
from 'meteor/http'
Meteor.methods({
    "getGif" (search) {
        search = search.replace(/\s/g, '+');
        let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=dc6zaTOxFJmzC&limit=5').content);
        return data.data[Math.floor(Math.random() * data.data.length)].images.original.url;
    }
})
