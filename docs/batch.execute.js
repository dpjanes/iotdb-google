/*
 *  docs/batch.execute.js
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
batch.execute = _.promise((self, done) => {
    _.promise(self)
        .validate(batch.execute)

        .make((sd, sdone) => {
            sd.google.docs.documents.batchUpdate({
                resource: {
                    requests: sd.google$requests,
                },
                documentId: sd.path,
            }, (error, result) => {
                if (error) {
                    error.self = sd
                    return sdone(error)
                }

                sd.google$result = result.data
                sd.google$requests = []

                sdone(null, sd)
            })
        })

        .end(done, self, batch.execute)
})

batch.execute.method = "docs.batch.execute"
batch.execute.requires = {
    google: {
        docs: _.is.Object,
    },
    path: _.is.String,
    google$requests: _.is.Array,
}
batch.execute.accepts = {
}
batch.execute.produces = {
    google$result: _.is.Object,
    google$requests: _.is.Array,
}

/**
 *  API
 */
exports.batch = batch
