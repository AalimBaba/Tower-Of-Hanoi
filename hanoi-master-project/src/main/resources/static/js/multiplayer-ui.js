let socket = new SockJS('/ws-hanoi');
let stompClient = Stomp.over(socket);

function joinMatch(roomId) {
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        
        // Listen for opponent moves
        stompClient.subscribe('/topic/room/' + roomId, function (payload) {
            const message = JSON.parse(payload.body);
            if (message.sender !== myUsername) {
                updateOpponentProgress(message);
            }
        });
    });
}

function updateOpponentProgress(data) {
    const oppMoves = document.getElementById('opponent-moves');
    const oppProgress = document.getElementById('opponent-progress-bar');
    
    if (oppMoves) oppMoves.innerText = data.moves;
    
    // Visual progress: (Discs on target peg / Total Discs) * 100
    if (oppProgress) {
        const percentage = (data.discsOnTarget / discCount) * 100;
        oppProgress.style.width = percentage + "%";
    }
}

// Call this every time a disc is dropped in game-logic.js
function broadcastMove() {
    const targetPegId = (level === 5) ? 'stack-4' : 'stack-3';
    const discsOnTarget = document.getElementById(targetPegId).childElementCount;

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
        sender: myUsername,
        moves: moves,
        discsOnTarget: discsOnTarget,
        type: 'MOVE'
    }));
}