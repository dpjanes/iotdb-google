/*
 *  initialize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-28
 *
 *  Copyright [2013-2018] [David P. Janes]
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

const assert = require("assert")

/**
 *  Requires: self.googled
 *  Produces: self.google
 */
const initialize = _.promise.make((self, done) => {
    const method = "initialize";
    const google = require("googleapis").google

    assert.ok(self.googled, `${method}: expected self.googled`)
    assert.ok(self.googled.credentials, `${method}: expected self.googled.credentials`)

    _.promise.make(self)
        .then(_.promise.make(sd => {
            const credentials = self.googled.credentials.installed

            sd.google = {
                client: new google.auth.OAuth2(
                    credentials.client_id, 
                    credentials.client_secret, 
                    credentials.redirect_uris[0]
                ),
            }
        }))
        .then(_.promise.done(done, self, "google"))
        .catch(done)
})

/**
 *  API
 */
exports.initialize = initialize;
