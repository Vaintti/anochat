import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';

const streamer = new Meteor.Streamer('chat');

streamer.allowRead('all');
streamer.allowWrite('all');

Meteor.startup(() => {
  // code to run on server at startup
});
