import { Template } from 'meteor/templating';
import { Messages } from '../imports/api/messages.js';
import './main.html';

Meteor.startup(function(){
	Session.set('Channel', 'null');
});

const streamer = new Meteor.Streamer('chat');

sendMessage = function(user, message) {
streamer.emit('message', user, message);
console.log('me: ' + message);
};

  streamer.on('message', function(user, message) {
    console.log(user + ': ' + message);
  });

Template.body.helpers({
	notLogged() {
		return Session.equals('Channel', 'null')
	}
});

Template.chat.helpers({
	channel() {
		return Session.get('Channel');
	}
});


Template.join.events({
	'submit .join-channel'(event) {
		// Prevent broswser broser default submit
		event.preventDefault();	

		// Get values from input fields
		const target = event.target;
		const name = target.name.value;
		const channel = target.channel.value;

		// Join channel
		Session.set('Nickname', name);
		Session.set('Channel', channel);

		// Clear fields
		target.name.value = '';
		target.channel.value = '';
	}
});