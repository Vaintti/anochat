import { Template } from 'meteor/templating';
import './main.html';

Meteor.startup(function(){
	Session.set('Channel', 'null');
});

TempDB = new Mongo.Collection(null);

const streamer = new Meteor.Streamer('chat');

sendMessage = function(user, message) {
	streamer.emit('message', user, message);
	TempDB.insert({user: user, text: message});
};

streamer.on('message', function(user, message) {
	TempDB.insert({user: user, text: message});
});

Template.body.helpers({
	notLogged() {
		return Session.equals('Channel', 'null')
	}
});

Template.chat.helpers({
	messages() {
		return TempDB.find();
	},
	channel() {
		return Session.get('Channel');
	}
});

Template.chat.events({
	'submit .chatform'(event) {
		// Prevent browsers default submit
		event.preventDefault();

		const target = event.target;
		const msg = target.message.value;

		sendMessage(Session.get('Nickname'), msg);

		// Clear field
		target.message.value = '';
	}
})

Template.join.events({
	'submit .join-channel'(event) {
		// Prevent browsers default submit
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