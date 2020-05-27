/*
 *  docs/batch.start.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-05-27
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
const batch = {}
batch.start = _.promise(self => {
    _.promise.validate(self, batch.start)

    self.google$requests = []
})

batch.start.method = "docs.batch.start"
batch.start.requires = {
}
batch.start.accepts = {
}
batch.start.produces = {
    google$requests: _.is.Array,
}

/**
 *  API
 */
exports.batch = batch
