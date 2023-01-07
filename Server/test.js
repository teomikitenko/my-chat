let server = require("ws").Server;
let s = new server({ port: "9001" });
let users = [];

s.on("connection", (x) => {
  x.on("message", (mess) => {
    let inputMess = JSON.parse(mess);
    x.send(JSON.stringify(users));
    if (inputMess.type === "users") {
      let index = users.indexOf(inputMess.text);

      if (index >= 0) {
        let val = users[index];
        x.send(JSON.stringify({ type: "error", user: val }));
      } else if(index<=0){
        users.push(inputMess.text);
        s.clients.forEach((client) => {
         
            client.send(JSON.stringify({ type: "users", text: inputMess.text }));
          
         
        });
      }
    } else if (inputMess.type === "exit") {
      let index = users.indexOf(inputMess.user);
      console.log(index);
      users.splice(index, 1);
      s.clients.forEach((client) => {
        let data = JSON.stringify({ type: "exit", user: inputMess.user });
        client.send(data);
      });
    } else if (inputMess.type === "message") {
      s.clients.forEach((client) => {
        if (client !== x) {
          let data = JSON.stringify({
            type: "message",
            user: inputMess.user,
            text: inputMess.text,
          });
          client.send(data);
        }
      });
    }
  });

  x.on("close", () => {
    console.log("User exit");
  });

  console.log("New user");
});
