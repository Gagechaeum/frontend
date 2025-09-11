import { defineStore } from 'pinia';
import { Client } from '@stomp/stompjs';

export const useChatStore = defineStore('chat', {
  state: () => ({
    stompClient: null,
    isConnected: false,
	roomId: null,
    messages: [],
  }),
  actions: {
    connect() {
		const token = 'Bearer ' + localStorage.getItem('access_token');

		if (this.stompClient && this.stompClient.connected) {
			return;
		}

		const brokerURL = `ws://${window.location.host}/ws-stomp?token=${token}`;

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

		this.stompClient.activate();
    },

    disconnect() {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.deactivate();
			this.isConnected = false;
		}
    },

	subscribe(roomId) {
		if (this.stompClient && this.stompClient.connected) {
			if (this.roomId) {
				this.unsubscribe();
			}

			this.stompClient.publish({
				destination: `app/chatrooms/${roomId}/enter`,
				body: ''
			});
	
			this.stompClient.subscribe(`topic/chatrooms/${roomId}`, (message) => {
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
			this.stompClient.publish({
				destination: `/app/chatrooms/${this.roomId}/leave`,
				body: ''
			});
	
			this.stompClient.unsubscribe(`/topic/chatrooms/${this.roomId}`);

			this.roomId = null;
		}
	},

    sendMessage(payload) {
		if (this.stompClient && this.stompClient.connected && this.roomId) {
			this.stompClient.publish({
			  destination: `/app/chatrooms/${this.roomId}/send`,
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