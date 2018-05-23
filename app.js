// manage database
const database = firebase.database();
const messageRef = database.ref("messages");

new Vue({
  el: "#comment",
  data: {
    messageText: "",
    editText: null,
    messages: [],
    name: "Artdvp"
  },
  methods: {
    storeMessage: function() {
      messageRef.push({
        text: this.messageText,
        name: this.name
      });
      this.messageText = "";
      // this.name = "";
      // console.log(this.messages)
    },
    deleteMessage: function(message) {
      // delete data
      let ok = confirm("Are you want to delete this ?");
      if (ok == true) {
        messageRef.child(message.id).remove();
      }
    },
    editMessage: function(message) {
      // edit data
      // messageRef.child(message.id).remove();
      this.editText = message;
      this.messageText = message.text;
    },
    cancelMessage: function() {
      this.editText = null;
      this.messageText = "";
    },
    updateMessage: function() {
      messageRef.child(this.editText.id).update({ text: this.messageText });
      this.cancelMessage();
    }
  },
  created() {
    // after add data done set data save to firebase database
    messageRef.on("child_added", snapshot => {
      // save data from message to array
      this.messages.push({...snapshot.val(),id: snapshot.key});
      console.log(snapshot.val());
    });
    messageRef.on("child_removed", snapshot => {
      // save data from message to array
      const deleteText = this.messages.find(
        message => message.id == snapshot.key
      );
      const index = this.messages.indexOf(deleteText);
      this.messages.splice(index, 1);
      console.log(snapshot.val());
    });
    messageRef.on("child_changed", snapshot => {
      //
      const updateText = this.messages.find(
        message => message.id == snapshot.key
      );
      updateText.text = snapshot.val().text;
    });
  }
});
