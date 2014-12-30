/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
	var request = require('request');

	function sendXively(api_key, feed_id, id_data, value, timestamp){
		
		id_data = id_data.split(' ').join('_');
		id_data = id_data.split('\'').join('_');
		
		var date = CreateDate(timestamp);
		
		var msg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><eeml><environment><data id=\""+id_data+"\"><datapoints><value at=\""+date+"\">"+value+"</value></datapoints></data></environment></eeml>";

		console.log(msg);
				
		var myUrl = "https://api.xively.com/v2/feeds/"+feed_id+".xml";
		
		request.put({
			headers : {
				"X-ApiKey" : api_key
			},
			url : myUrl,
			body : msg
		}, function(error, response, body) {
			if(error)
				console.log("\n[Xively] Error sending data\n");
		});
	}
	
	function CreateDate(timestamp){
	
		var date = new Date(timestamp);
		var date_ISO = date.toISOString();
		
		return (date_ISO.substring(0,19) + date_ISO.substring(23));
	}

	function XivelyNode(n) {

		RED.nodes.createNode(this,n);

		this.on("input", function(msg) {
			
			var feed_id = msg.feed_id ||n.feed_id;
			var api_key = msg.api_key||n.api_key;
			var id_data = msg.id_data||n.id_data;
			var value = msg.payload;
			var timestamp = msg.timestamp || Date.now();

			sendXively(api_key, feed_id, id_data, value, timestamp);
		});
	}

	RED.nodes.registerType("xively",XivelyNode);
}