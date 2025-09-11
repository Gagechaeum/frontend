import { defineStore } from 'pinia';
import { Client } from '@stomp/stompjs';

export const useChatStore = defineStore('chat', {
  state: () => ({
    stompClient: null,
    isConnected: false,
	roomId: null,
    messages: [],
	token: null
  }),
  actions: {
    connect(token) {
		console.log('STOMP 연결 시도, 전달된 토큰:', token);

		if (this.stompClient && this.stompClient.connected) {
			return;
		}

		const brokerURL = `ws://localhost:8080/ws-stomp?token=${token}`;

		this.stompClient = new Client({
			brokerURL: brokerURL,
			debug: (str) => console.log(str),
			reconnectDelay: 5000,
		});
			
		this.stompClient.onConnect = () => {
			this.isConnected = true;
			console.log('STOMP 연결 완료');
		};

		this.stompClient.onWebSocketClose = () => {
			this.isConnected = false;
			console.log('STOMP 연결 종료');
		}

		this.stompClient.onWebSocketError = (error) => {
			console.error('Error with websocket', error);
		};

		this.stompClient.onStompError = () => {
			console.error('Broker reported error: ' + frame.headers['message']);
			console.error('Additional details: ' + frame.body);
		}

		this.stompClient.activate();
    },

    disconnect() {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.deactivate();
			this.isConnected = false;
			this.token = null;
		}
    },

	subscribe(roomId) {
		if (this.stompClient && this.stompClient.connected) {
			if (this.roomId) {
				this.unsubscribe();
			}

			this.stompClient.publish({
				destination: `/app/chatrooms/${roomId}/enter`,
				body: ''
			});
	
			this.stompClient.subscribe(`/topic/chatrooms/${roomId}`, (message) => {
				console.log('수신 메시지: ', message.body);
			});

			this.roomId = roomId;
			console.log(`STOMP subscribe 성공: ${roomId}`);
		}
		else {
			console.log('STOMP subscribe 실패');
		}
	},

	unsubscribe() {
		if (this.stompClient && this.stompClient.connected && this.roomId) {
			this.stompClient.unsubscribe(`/topic/chatrooms/${this.roomId}`);

			this.roomId = null;
		}
	},

	leaveRoom() {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.publish({
				destination: `/app/chatrooms/${this.roomId}/leave`,
				body: ''
			});

			this.roomId = null;
		}
	},

    sendMessage(payload) {
		if (this.stompClient && this.stompClient.connected && this.roomId) {
			this.stompClient.publish({
			  destination: `/app/chatrooms/${this.roomId}/send`,
			  headers: {
                'content-type': 'application/json'
              },
			  body: JSON.stringify(payload),
			});
		}
		else {
			console.log('STOMP send 실패');
		}
    },
	
    addMessage(message) {
		this.messages.push(message);
    },
  },
});