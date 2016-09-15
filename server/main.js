import { Meteor } from 'meteor/meteor';

const streamer = new Meteor.Streamer('chat');

streamer.allowRead('all');
streamer.allowWrite('all');

Meteor.startup(() => {
  // code to run on server at startup
});
