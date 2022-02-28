<template>
	<div>
		<chat-window
			height="89vh"
			:current-user-id="currentUserId"
			:rooms="rooms"
			:rooms-loaded="true"
			:messages="messages"
			:messages-loaded="messagesLoaded"
      :text-messages="textMessages"
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
		/>
	</div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
// import ChatWindow from '../../vue-advanced-chat/src/ChatWindow'

export default {
	name: 'Chat',

	components: {
		ChatWindow
	},

	data() {
		return {
			currentUserId: 1234,
			rooms: [
				{
					roomId: 1,
					roomName: 'Room 1',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: 1234, username: 'John Doe' },
						{ _id: 4321, username: 'John Snow' }
					]
				}
			],
			messages: [],
			messagesLoaded: false,
      textMessages: {
        // ROOMS_EMPTY: 'Aucune conversation',
        // ROOM_EMPTY: 'Aucune conversation sélectionnée',
        NEW_MESSAGES: '새로운 메세지',
        MESSAGE_DELETED: '삭제되었습니다.',
        MESSAGES_EMPTY: '메세지 없음',
        CONVERSATION_STARTED: '대화 시작일 :',
        TYPE_MESSAGE: '메세지를 입력하세요.',
        SEARCH: '검색',
        // IS_ONLINE: 'est en ligne',
        // LAST_SEEN: 'dernière connexion ',
        // IS_TYPING: 'est en train de taper...'
      },
   


		}
	},

	methods: {
		fetchMessages({ options = {} }) {
			setTimeout(() => {
				if (options.reset) {
					this.messages = this.addMessages(true)
				} else {
					this.messages = [...this.addMessages(), ...this.messages]
					this.messagesLoaded = true
				}
				// this.addNewMessage()
			})
		},

		addMessages(reset) {
			const messages = []

			for (let i = 0; i < 30; i++) {
				messages.push({
					_id: reset ? i : this.messages.length + i,
					content: `${reset ? '' : 'paginated'} message ${i + 1}`,
					senderId: 4321,
					username: 'John Doe',
					date: '13 November',
					timestamp: '10:20'
				})
			}

			return messages
		},

		sendMessage(message) {
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString()
				}
			]
		},

		addNewMessage() {
			setTimeout(() => {
				this.messages = [
					...this.messages,
					{
						_id: this.messages.length,
						content: 'NEW MESSAGE',
						senderId: 4321,
						timestamp: new Date().toString().substring(16, 21),
						date: new Date().toDateString()
					}
				]
			}, 2000)
		}
	}
}
</script>

<style scoped>
  body{
    font-family: 'Quicksand', sans-serif;
  }
</style>