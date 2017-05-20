# TeamSpeak3 Bot plugin Auto-AFK
This plugin is designed to perform an action when clients reach the maximum idle time and/or mute his output.

## Install the plugin
```console
$ npm install ts3bot-plugin-autoafk --save
```
**Note:** You should run the command from the [node-teamspeak3-bot](https://github.com/antoine-pous/node-teamspeak3-bot) root directory

## Configuration
The configuration provide some parameters to wich allow you to personalize and adapt this feature to your requirements.

| Parameter | Type | Default | Description |
|----|----|----|----|
| action | [String](mdn-string) | move | Action to perform when the client is AFK, should be `move` or `kick`
| protected_servergroups | [Array](mdn-array) | [] | List of protected sgid, the plugin will ignore them
| protected_clients | [Array](mdn-array) | [] | List of protected cldbid, the plugin will ignore them
| max_idle_time | [Number](mdn-number) | 60 | Max idle time in minutes before performing action
| target_cid | [Number](mdn-number) | 0 | Channel id where are moved idle clients
| output_muted | [Boolean](mdn-boolean) | false | Perform action when the user mute his output
| output_delay | [Number](mdn-number) | 60 | Delay in seconds before performing action when the client output is muted

[mdn-boolean]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
[mdn-array]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
[mdn-number]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
[mdn-string]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
