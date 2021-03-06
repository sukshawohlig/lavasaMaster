var schema = new Schema({
    name: String,
    city: String,
    headerImage: String,
    footerImage: String,
    content: String,
    sponsorType: String,
    logoCaption: String,
    logoLink: String,
    logoName: String,
    insidePage: String,
    status: String,
    video: {
        link: String,
        videotype: String,
        videoimage: String,
    },
    gallery: [{
        image: String,
        galleryType: {
            type: String,
            default: 'image'
        }
    }],
    videoGallery: [{
        vimage: String,
        vlink: String,
        vtype: String,
        videoType: {
            type: String,
            default: 'video'
        }
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('SponsorPage', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAggregatePipeLine: function (data) {
        var pipeline = [
            // Stage 1
            {
                $sort: {
                    'sponsorType': 1
                }
            },

            // Stage 2
            {
                $group: {
                    _id: "$sponsorType",
                    info: {
                        $push: {
                            "_id": "$_id",
                            "name": "$name",
                            "city": "$city",
                            "sponsorType": "$sponsorType",
                            "headerImage": "$headerImage",
                            "footerImage": "$footerImage",
                            "insidePage": "$insidePage",
                            "status": "$status",
                            "logoCaption": "$logoCaption"
                        }
                    }
                }
            },

            // Stage 3
            {
                $sort: {
                    _id: -1,
                }
            },

        ];
        return pipeline;
    },
    getAllBySponsorType: function (data, callback) {
        var pipeLine = SponsorPage.getAggregatePipeLine(data);
        SponsorPage.aggregate(pipeLine, function (err, totals) {
            if (err) {
                callback(err, "error in mongoose");
            } else {
                if (_.isEmpty(totals)) {
                    callback(null, []);
                } else {
                    console.log("data", totals);
                    callback(null, totals);
                }
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);