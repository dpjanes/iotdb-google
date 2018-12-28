/*
 *  chat/initialize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-12-27
 *
 *  Copyright [2013-2018] David P. Janes
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

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.google
 *  Produces: self.google
 */
const initialize = _.promise.make(self => {
    const google = require("googleapis").google

    _.promise.validate(self, initialize)

    self.google = _.d.clone(self.google)
    self.google.chat = google.chat({
        version: "v1",
        auth: self.google.client
    });
})

initialize.method = "chat.initialize"
initialize.requires = {
    google: {
        client: _.is.Object,
    },
}

/**
 *  API
 */
exports.initialize = initialize;
