/*
 *  gmail/messages.get.js
 *
 *  David Janes
 *  IOTDB.org
 *  2021-05-13
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const labels_get = _.promise((self, done) => {
    _.promise.validate(self, labels_get)

    self.google.gmail.users.messages.get({
        userId: 'me',
        id: self.message.id || self.message,
    }, (error, response) => {
        if (error) {
            return done(error, self)
        }

        self.google$result = response
        self.message = response.data

        done(null, self)
    })
})

labels_get.method = "gmail.messages.get"
labels_get.requires = {
    google: {
        gmail: _.is.Object,
    },
    message: [ _.is.String, _.is.Dictionary ],
}
labels_get.accepts = {
    message: {
        id: _.is.String,
    },
}
labels_get.produces = {
    google$result: _.is.Object,
    message: _.is.Dictionary,
}

/**
 *  API
 */
exports.get = labels_get
