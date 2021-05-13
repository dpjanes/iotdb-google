/*
 *  gmail/messages.list.js
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
const labels_list = _.promise((self, done) => {
    _.promise.validate(self, labels_list)

    self.google.gmail.users.messages.list({
        userId: 'me',
    }, (error, response) => {
        if (error) {
            return done(error, self)
        }

        self.google$result = response

        const messages = response.data.messages;
        console.log(messages)

        done(null, self)
    })
})

labels_list.method = "gmail.messages.list"
labels_list.requires = {
    google: {
        gmail: _.is.Object,
    },
}
labels_list.accepts = {
}
labels_list.produces = {
    google$result: _.is.Object,
    messages: _.is.Array.of.Dictionary,
}

/**
 *  API
 */
exports.list = labels_list
