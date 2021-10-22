require("dotenv/config")
const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index");
});

let messages = [];

io.on("connection", socket => {
  console.log(`🔌 Connected Socket - ID: ${socket.id}`)

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("newMessage", data);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`🔥 Server started on port [*:${process.env.PORT}]`);
});
