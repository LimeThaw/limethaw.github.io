peer = ""
colors = {}

$(function() {
    peer = new Peer();
    peer.on('open', function(id) {
    	$("#uid").html(id);
	});
	
	$("#connectForm").submit(send)
	
	peer.on('connection', receive);
});

function makeLine(uid, text) {
	return "<div><span style='color:"+uidColor(uid)+"'>" + uid + ":   </span><span>" + text + "</span></div>"
}


function send(event) {
	event.preventDefault();

	const connectUID = $("#connectUID").val()
	const connectText = $("#connectText").val()
	const showUID = peer.id.substring(0, 5)
	
	var conn = peer.connect(connectUID);
	conn.on('open', function() {
		conn.send(connectText);
		line = makeLine(showUID, connectText)
		$("#msgs").append(line) 
		$("#connectText").val("")
	});
}

function receive(conn) {
	conn.on('data', function(data) {
		const showUID = conn.peer.substring(0, 5)
		line = makeLine(showUID, data)
		$("#msgs").append(line) 
	});
}

function getRandomColor() {
  var letters = '0123456789ABCD';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 14)];
  }
  return color;
}

function uidColor(uid) {
	if(!(uid in colors)) {
		colors[uid] = getRandomColor();
	}
	return colors[uid];
}
