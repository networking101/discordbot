# discordbot

## Setup

```
npm install discord.js

npm i @discordjs/opus
```

## Configurations

Edit config.json before deploying.

```
  
{
    "bot" : "bottestingserver",             # Does nothing, used to keep track of which bot this config file belongs to
    "token"  : "{insert bot token here}",   # Insert the bot token here. Approx 59 characters long
    "prefix" : "+",                         # Do not change
    "command" : "$",                        # Prefix to send command to bot
    "timeout" : 120,                        # Timeout for adding rules or echo
    "path"  : "./",                         # Path to working directory.  Use to find configs and audio directory
    "defaultText" : "701795436767215689",   # Default text channel ID that will be used if not specified in rules or echo
    "defaultVoice" : "701795436767215690",  # Default voice channel ID that will be used if not specified in rules
    "botid" : "701795534100234340",         # ID of bot
    "myid" : "141019900993994753",          # Your ID.  Used to send you a copy of direct messages sent to bot
    "playing" : "RocketLeague"              # Status message that the bot will show when active
}
```

## Help

In chat, type ```$?``` to list the different command options.

```
Bot Management

$list     ->    list rules                ('$list' or '$list rulename 1, rulename 2, ...')
$add      ->    add rule                  (follow prompt)
$delete   ->    delete rule               ('delete rulename 1')
$audio    ->    list local audio files    ('$audio' to list or '$audio audiofile 1' to play file
$echo     ->    bot will echo message     ('$echo [channel or person]' Next message is echoed)
```

### List

In chat, type ```$list``` to show all the currently active rules.  To view the specifics of a rule, type ```$list rule1, rule2,...```

### Add

In chat, type ```$add``` to add a new rule.  A rule can trigger on one of 2 types of events-A message event or voice event.  Every condition needs to be met to trigger the rule.  If a condition has more than one entry, either of those entries will trigger the rule.

For example:
```
Rule List:

Parameters for test rule
"conditions":
"message user":[]
"message contents":["rocket league","car soccer"]
"message user role":[]
"message channel":["585642950361612300"]
"message file":false

"response":
"message contents":""
"message attachment":[]
"message channel":""
"message react emoji":[":soccer:"]
"message reply":false
"message delete":false
"voice play audio":""
"voice channel":""
```
This rule will trigger if the words "rocket league" or "car soccer" appear AND if the message appeared in channel "585642950361612300".  When triggered, the bot will react with a soccer emoji to the message that met this rule.

```if ("rocket league" or "car soccer") and channel "585642950361612300"```

### Delete

In chat, type ```$delete rule1, rule2,...``` to delete the following rules.

### Audio

In chat, type ```$audio``` to list the different locally saved audio files.  To sample an audio file, type ```$audio song1.mp3```.

(URL links to mp3 files work too but the quality us usually better if a file is stored locally)

### Echo

In chat or direct message, type ```$echo```.  An argument can be provided such as ```$echo General``` to send to a specific channel or user.  Otherwise, message will be sent to "defaultText" in config.json.  When you get "Ready" back, the next message you send will be echoed as if the bot wrote it.
