/*
 *  token/interactive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-29
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

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: 
 *  Produces: 
 */
const interactive = rules => _.promise.make((self, done) => {
    const method = "token.interactive";

    assert.ok(self.google, `${method}: expected self.google`)
    assert.ok(self.google.client, `${method}: expected self.google.client`)
    assert.ok(rules.read, `${method}: expected rules.read`)
    assert.ok(rules.write, `${method}: expected rules.write`)
    assert.ok(rules.prompt, `${method}: expected rules.code`)

    _.promise.make(self)
        .then(rules.read)
        .then(_.promise.bail.conditional(sd => sd.token))

        .then(rules.prompt)
        .then(_.promise.make(sd => {
            assert.ok(sd.code, `${method}: expected sd.code after rules.prompt`)

            self.google.client.getToken(sd.code, (error, token) => {
                if (error) {
                    return done(error)
                }

                self.token = token

            })
        }))
        .then(rules.write)

        .catch(_.promise.unbail)
        .then(_.promise.make(sd => {
            sd.google.client.setCredentials(sd.token)
        }))
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  API
 */
exports.interactive = interactive;
