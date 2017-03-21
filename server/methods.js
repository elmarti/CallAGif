import {
    HTTP
}
from 'meteor/http';
import GifsCollection from '../lib/gifs';
Meteor.methods({
    "getGif" (search) {
        const record = GifsCollection.findOne({
            search
        });
        if (record) {
            let updateText = {
                $inc: {
                    count: 1
                }
            };
            if ((record.count / 1000) % 1 !== 0) {
                const formattedSearch = search.replace(/\s/g, '+');
                let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
                delete data.pagination;
                delete data.meta;
                updateText.$set = {
                    data
                };
            }
            GifsCollection.update({
                search
            }, updateText);
            return {
                count: record ? record.count + 1 : 1,
                url: record.data.data[Math.floor(Math.random() * record.data.data.length)].images.original.url
            };
        }
        else {
            const formattedSearch = search.replace(/\s/g, '+');
            let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
            delete data.pagination;
            delete data.meta;
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



    }
})
