/*
 *  sheets/batch.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-03
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
const errors = require("iotdb-errors")

const _util = require("./_util")
const logger = require("../logger")(__filename)

/**
 */
const _merge_similar = _.promise(self => {
    self.google$requests = [ ... self.google$requests ]

    const seend = {}

    self.google$requests.forEach(request => {
        _.mapObject(request, (valued, key) => {
            if (!_.is.Dictionary(valued)) {
                return
            }

            const mkey = [ key, valued._range || "" ].join("@@")

            if (seend[mkey]) {
                const fields_1 = valued.fields
                const fields_2 = seend[mkey].fields

                seend[mkey] = _.d.compose.deep(valued, seend[mkey])
                delete request[key]

                if (fields_1 && fields_2 && (fields_1 !== fields_2)) {
                    const match_1 = fields_1.match(/^(.*)[(](.*)[)]/)
                    const match_2 = fields_2.match(/^(.*)[(](.*)[)]/)

                    if (match_1 && match_2) {
                        if (match_1[1] !== match_2[1]) {
                            throw new errors.Invalid("don't know how to merge '" + fields_1 + "' and '" + fields_2 + "'")
                        }

                        const fields = Array.from(new Set(_.flatten([ match_1[2].split(","), match_2[2].split(",") ])))

                        seend[mkey].fields = `${match_1[1]}(${fields.join(",")})`
                    }

                }
            } else {
                seend[mkey] = valued
            }
        })
    })

    self.google$requests.forEach(request => {
        _.mapObject(request, (valued, key) => {
            if (!_.is.Dictionary(valued)) {
                return
            }

            const mkey = [ key, valued._range || "" ].join("@@")
            request[key] = seend[mkey]
        })
    })

    self.google$requests = self.google$requests.filter(r => !_.is.Empty(r))
})

/**
 */
const _resolve_ranges = _.promise((self, done) => {
    const google = require("..")

    const ranged = {}
    
    self.google$requests.forEach(request => {
        _.mapObject(request, (valued, key) => {
            if (!_.is.Dictionary(valued)) {
                return
            } else if (_.is.Undefined(valued._range)) {
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

            self.google$requests.forEach(request => {
                _.mapObject(request, (valued, key) => {

                    if (_.is.Undefined(valued._range)) {
                        return
                    }

                    if (!_.is.Dictionary(valued)) {
                        return
                    } 

                    request[key] = _.d.clone(valued)

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
    if (self.verbose) {
        console.log("-", batch.method, "request", JSON.stringify(self.google$requests, null, 2))
    }

    self.google.sheets.spreadsheets.batchUpdate({
        spreadsheetId: self.google$range.spreadsheetId,
        resource: {
            requests: self.google$requests,
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
const batch = _.promise((self, done) => {
    _.promise.validate(self, batch)

    _.promise(self)
        .then(_merge_similar)
        .then(_resolve_ranges)
        .then(_update)
        .make(sd => {
            sd.google$requests = []
        })
        .end(done, self, "google$result,google$requests")
})

batch.method = "sheets.batch";
batch.requires = {
    google$requests: _.is.Array.of.JSON,
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
batch.produces = {
    google$result: _.is.Dictionary,
    google$requests: _.is.Array,
}

/**
 */
const start = _.promise(self => {
    self.google$batch = true
    self.google$requests = []
})

start.method = "sheets.batch.start"
start.description = ``
start.requires = {
}
start.accepts = {
}
start.produces = {
    google$batch: _.is.Boolean,
    google$requests: _.is.Array,
}

/**
 *  API
 */
exports.batch = batch
exports.batch.start = start
