/*
 *  sheets/batch_update.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-03
 *
 *  Copyright [2013-2019] [David P. Janes]
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

const _util = require("./_util")

/**
 */
const _resolve_ranges = _.promise((self, done) => {
    const google = require("..")

    const ranged = {}
    
    self.requests.forEach(request => {
        _.mapObject(request, (valued, key) => {
            if (_.is.Undefined(valued._range)) {
                return
            } else if (_.is.Null(valued._range)) {
                valued.allSheets = true
            } else {
                ranged[valued._range] = null
            }
        })
    })

    if (_.is.Empty(ranged)) {
        return done(null, self)
    }

    _.promise(self)
        .validate(_resolve_ranges)

        .then(google.sheets.sheets)
        .make(sd => {
            _.keys(ranged)
                .forEach(range => {
                    ranged[range] = _util.parse_range(range, sd.sheets)
                })

            self.requests.forEach(request => {
                _.mapObject(request, (valued, key) => {
                    if (_.is.Undefined(valued._range)) {
                        return
                    }

                    valued.range = ranged[valued._range]
                    delete valued._range

                    request[key] = valued
                })
            })
        })

        .end(done, self)
})

_resolve_ranges.method = "_resolve_ranges"
_resolve_ranges.requires = {
}
_resolve_ranges.accepts = {
}
_resolve_ranges.produces = {
}

/**
 */
const _update = _.promise((self, done) => {
    self.google.sheets.spreadsheets.batchUpdate({
        spreadsheetId: self.query.spreadsheetId,
        resource: {
            requests: self.requests,
        },
    }, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        
        done(null, self)
    })
})

_update.method = "_update"
_update.requires = {
}
_update.accepts = {
}
_update.produces = {
}

/**
 */
const batch_update = _.promise((self, done) => {
    _.promise.validate(self, batch_update)

    _.promise(self)
        .then(_resolve_ranges)
        .then(_update)
        .end(done, self, "google$result")
})

batch_update.method = "sheets.batch.update";
batch_update.requires = {
    requests: _.is.Array.of.JSON,
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
batch_update.produces = {
    google$result: _.is.Dictionary,
}

/**
 *  API
 */
exports.batch_update = batch_update;
