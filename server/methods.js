import {
    HTTP
}
from 'meteor/http';
import GifsCollection from '../lib/gifs';
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
            let updateText = {
                $inc: {
                    count: 1
                }
            };
            if ((record.count / 1000) % 1 !== 0) {
                let data = JSON.parse(HTTP.call("GET", 'https://api.giphy.com/v1/gifs/search?q=' + formattedSearch + '&api_key=dc6zaTOxFJmzC&limit=5').content);
                delete data.pagination;
                delete data.meta;
                updateText.$set = {
                    data: data.data
                };
            }
            GifsCollection.update({
                search
            }, updateText);
            return {
                count: record ? record.count + 1 : 1,
                url: record.data[Math.floor(Math.random() * record.data.length)].images.original.url
            };
        }
        else {
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
