/**
 * ISC License
 *
 * Copyright (c) 2017, Antoine POUS and contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

exports = module.exports = function(TS3Bot) {

  // When clientlist event is emitted
  TS3Bot.on("clientlist", function(clients) {

    let pluginConfig = TS3Bot.cfg.plugins.autoafk
    let AFKList = []

    // loop through the clients list
    for(let i =0; i < clients.length; i++) {

      let client = clients[i]

      // If the client is in protected servergroups
      if(TS3Bot.inGroups(client.client_servergroups, pluginConfig.protected_servergroups)) {
        continue
      }

      // If the client is protected
      if(pluginConfig.protected_clients.indexOf(client.client_database_id) > -1) {
        continue
      }

      // If the action is move and the client is already in the AFK channel
      if(pluginConfig.action === 'move' && client.cid === pluginConfig.cid) {
        continue
      }

      // If the client should be moved when headset is muted
      if(pluginConfig.output_muted === true && client.client_output_muted === 1) {

        // Get the output_muted_timestamp
        let output_muted_since = TS3Bot.getClientData(client, 'output_muted_since')

        // If we haven't timestamp stored
        if(!output_muted_since) {
          TS3Bot.setClientData(client, 'output_muted_since', new Date())
        }

        // If the delay is exceeded
        if(pluginConfig.output_delay > 0) {
          AFKList.push(client.clid)
        }
        continue
      } else {
        TS3Bot.delClientData('output_muted_since')
      }

      // If the client should be moved when he's exceed max idle time
      if(pluginConfig.max_idle_time > 0 && clients[i].client_idle_time > (pluginConfig.max_idle_time * 1000 * 60)) {
        AFKList.push(clients[i].clid)
        continue
      }
    }

    // If the action is move
    if(pluginConfig.action === 'move' && AFKList.length > 0) {

      console.log(AFKList)
      // Define the query parameters
      let params = {
        cid: pluginConfig.target_cid,
        clid: AFKList
      }

      // If a password is defined we put it in the parameters
      if(typeof pluginConfig.target_cpw === 'string' && pluginConfig.target_cpw.trim() !== '') {
        params.cpw = pluginConfig.target_cpw
      }

      let ts3utils = require('teamspeak3-utils')
      console.log(ts3utils.buildQuery('clientmove', params, []))
      TS3Bot.query('clientmove', params, [], function(err, res, query) {
        if(err.id > 1) {
          TS3Bot.log.error('plugin - autoafk', '[', err.id, '] ', err.msg)
        }
      })

      // Send a text message to the client
      if(typeof pluginConfig.reason === 'string' && pluginConfig.reason.trim() !== '') {
        TS3Bot.query('sendtextmessage', {
          targetmode: TS3Bot.def.TextMessageTarget_CLIENT,
          target: AFKList,
          msg: pluginConfig.reason
        }, [], function(err, res, query) {
          if(err.id > 1) {
            TS3Bot.log.error('plugin - autoafk', '[', err.id, '] ', err.msg)
          }
        })
      }

    }

    // If the action is kick
    if(pluginConfig.action === 'kick') {

      // Kick the users
      TS3Bot.send('clientkick', {
        clid: AFKList,
        reasonid: TS3Bot.def.REASON_KICK_SERVER,
        reason: pluginConfig.reason
      }, [], function(err, res, query) {
        if(err.id > 1) {
          TS3Bot.log.error('plugin - autoafk', '[', err.id, '] ', err.msg)
        }
      })

    }

  })
}
