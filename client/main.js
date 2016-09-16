import { Template } from 'meteor/templating';
import './main.html';

Meteor.startup(function(){
	Session.set('Channel', 'null');
});

// Temporary clientside database
TempDB = new Mongo.Collection(null);

// Scroll to bottom of the chat
function updateScroll(){
	var element = document.getElementById('messages');
	element.scrollTop = element.scrollHeight;
}

// Streamer element that does the data transfer between clients
const streamer = new Meteor.Streamer('chat');

// Send message to channel
sendMessage = function(user, channel, message) {
	// Checks if message has other than whitespace character and sends it if there is
	var patt = /\S/;
	if(patt.test(message)){
		// Send message to streamer
		streamer.emit('message', user, channel, message);
		// Insert message in temp database
		TempDB.insert({user: user, channel:channel, text: message});
		// Scroll to bottom
		updateScroll();
	}
};

// Triggers when message is received
streamer.on('message', function(user, channel, message) {
	// Check if message is for your channel
	if(channel == Session.get('Channel')) {
		// Insert message in temp database
		TempDB.insert({user: user, channel:channel, text: message});
		// Scroll to bottom
		updateScroll();
	}
});

Template.body.helpers({
	// Check if logged in by checking session variable
	notLogged() {
		return Session.equals('Channel', 'null')
	}
});

Template.chat.helpers({
	// Get messages from temp db for the list view
	messages() {
		return TempDB.find();
	},
	// Return your current channel
	channel() {
		return Session.get('Channel');
	}
});

Template.chat.events({
	// Send message when form is submitted
	'submit .chatform'(event) {
		// Prevent browsers default submit
		event.preventDefault();

		// Get message from textfield
		const target = event.target;
		const msg = target.message.value;

		// Call send message function
		sendMessage(Session.get('Nickname'), Session.get('Channel'), msg);

		// Clear field
		target.message.value = '';
	}
});

Template.chat.onRendered(function() {
	document.getElementById('chatmessage').select();
});

Template.join.events({
	'submit .join-channel'(event) {
		// Prevent browsers default submit
		event.preventDefault();	

		// Get values from input fields
		const target = event.target;
		const name = target.name.value;
		const channel = target.channel.value;

		var patt = /\S/;
		if(patt.test(name)){
			// Join channel using nickname
			Session.set('Nickname', name);
		}
		else{
			Session.set('Nickname', 'Anonymous');
		}
		if(patt.test(channel)){
			Session.set('Channel', channel);
		}
		else{
			Session.set('Channel', 'General')
		}

		// Clear fields
		target.name.value = '';
		target.channel.value = '';
	}
});