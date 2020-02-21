import {
    HTTP
}
from 'meteor/http';
import GifsCollection from '../lib/gifs';
GifsCollection._ensureIndex({search:1})
function random(mn, mx) {
    return Math.floor(Math.random() * (mx - mn) + mn);
}
Meteor.methods({
    "getGif" (search) {
        const text = search;
        const formattedSearch = search.replace(/\s/g, '+');
        search = search.replace(/\s/g, '').toLowerCase();
        const record = GifsCollection.findOne({
            search
        },{
            data:1
        });
        if (record) {
            const updateText = {
                $inc: {
                    count: 1
                }
            };
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate()-5);
            if(new Date(record.dateUpdated) < weekAgo ) {
                console.log('requesting old', search);
                let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
                delete data.pagination;
                delete data.meta;
                updateText.$set = {
                    data: data.data
                };

                GifsCollection.update({
                    _id: record._id
                }, updateText);
                return {
                    count: record ? record.count + 1 : 1,
                    url: record.data[Math.floor(Math.random() * record.data.length)].images.original.url
                };
            } else {
                GifsCollection.update({
                    _id: record._id
                }, updateText);
                return {
                    count:record.count + 1 ,
                    url: record.data[random(0, record.data.length -1)].images.original.url
                };
            }
        }
        else {
            console.log('requesting new', search);

            let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
            delete data.pagination;
            delete data.meta;
            const toInsert = {
                search,
                count: 1,
                data: data.data,
                text
            }
            GifsCollection.insert(toInsert);

            return {
                count: record ? record.count + 1 : 1,
                url: toInsert.data[Math.floor(Math.random() * toInsert.data.length)].images.original.url
            };
        }



    }
})
