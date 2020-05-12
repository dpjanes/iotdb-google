/*
 *  auth/service_account.js
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

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

/**
 */
const service_account = _.promise((self, done) => {
    const google = require("googleapis").google

    _.promise(self)
        .validate(service_account)
        .then(fs.read.json.p(self.google$cfg.service_account_path))
        .make((sd, sdone) => {
            const gkeys = sd.json
            const jwt_client = new google.auth.JWT(gkeys.client_email, null, gkeys.private_key, sd.scopes)
            
            jwt_client.authorize((error, tokens) => {
                if (error) {
                    return done(error)
                }

                self.google.client.setCredentials(tokens)
                done(null, self)
            })
        })
        .end(done, self)
})

service_account.method = "auth.service_account"
service_account.requires = {
    google: _.is.Dictionary,
    google$cfg: {
        service_account_path: _.is.String,
    },
    scopes: _.is.Array.of.String,
}

/**
 *  API
 */
exports.service_account = service_account
