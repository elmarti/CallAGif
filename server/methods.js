import {
    HTTP
}
from 'meteor/http';
import GifsCollection from '../lib/gifs';
Meteor.methods({
    "getGif" (search) {

        const formattedSearch = search.replace(/\s/g, '+');
        let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
        const record = GifsCollection.findOne({
            search
        });
        if (record)
            GifsCollection.update({
                search
            }, {
                $inc: {
                    count: 1
                }
            });
        else
            GifsCollection.insert({
                search,
                count: 1,
                data: data.data
            });

        return {
            count: record ? record.count + 1 : 1,
            url: data.data[Math.floor(Math.random() * data.data.length)].images.original.url
        };
    }
})
