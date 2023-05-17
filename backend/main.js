const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");

const app = Express();
const  { hash,compare } =require("bcryptjs")

const http = require("http").Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Cors());

const mongoClient = new MongoClient(
    "mongodb+srv://pokemon:pokemon1234@cluster0.ekvb1mk.mongodb.net/?retryWrites=true&w=majority", 
    { 
        useUnifiedTopology: true 
    }
);

var collections = {};
var changesBattles;

app.get("/pokemon", async (request, response) => {
    try {
        let result = await collections.pokemon.find({}).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

app.post("/signup", async (req, res) => {
  const {email,username,password}=req.body;

  try {
    let user = await collections.signup.find({email:email}).toArray();
    if(user){
      if(user.length>0){
        res.status(200).send({ message: "user already exists",success:false });
      }else{
        const hashedPassword = await hash(password, 12);
        let new_user={
          email:email,
          password:hashedPassword,
          username:username,
          logedCount:1,
          logedCountPerDay:1,
          lastLogedTime: new Date(),
        }
        let newuser = await collections.signup.insertOne(new_user);
        if(newuser){
          res.status(200).send({ message: "Registered successfully",user:new_user,success:true  });
        }
      }
    }
} catch (e) {
  res.status(500).send({ message: e.message });
}
});

app.post("/signin", async (req, res) => {
  const {email,password}=req.body;

  try {
    let user = await collections.signup.find({email:email}).toArray();
    if(user){
      if(user.length==0){
        res.status(200).send({ message: "User not available",success:false });
      }else{
        const isPasswordCorrect = await compare(password, user[0].password);
        if(isPasswordCorrect){

          var today = new Date();
          var lastLoginDate = new Date(user[0].lastLogedTime);
          var currentStreak=0;

          if (lastLoginDate.getDate() === today.getDate() &&
            lastLoginDate.getMonth() === today.getMonth() &&
            lastLoginDate.getFullYear() === today.getFullYear()) {
            currentStreak = user[0].logedCountPerDay + 1;
          } 

          let updadtedUser = await collections.signup.updateOne({_id:user[0]._id},{$set:{logedCount:user[0].logedCount+1, lastLogedTime:new Date(),logedCountPerDay:currentStreak}});
          if(updadtedUser){
            user[0].logedCount=user[0].logedCount+1;
            user[0].lastLogedTime=new Date();
            user[0].logedCountPerDay=currentStreak;
            res.status(200).send({ message: "Login successfully", user:user[0],success:true  });
          }
          
        }else{
          res.status(400).send({ message: "Password not matched",success:false});
        }
        
      }
    }
} catch (e) {
  res.status(500).send({ message: e.message });
}
});


app.get("/battles", async (request, response) => {
    try {
        let result = await collections.battles.find({}).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


io.on("connection", (socket) => {
    console.log("A client has connected!");
    changesBattles.on("change", (next) => {
        io.to(socket.activeRoom).emit("refresh", next.fullDocument);
    });

    socket.on("join", async (battleId) => {
        try {
            let result = await collections.battles.findOne({ "_id": battleId });
            if(result){
              socket.emit("refresh", result)
            } else {
              let newBattle = await collections.battles.insertOne({
                "_id": battleId,
                playerOne: {
                  pokemon: {}
                },
                playerTwo: {
                  pokemon: {}
                }
              });
              socket.emit("refresh", newBattle.ops[0]);
            }
            
            socket.join(battleId);
            socket.activeRoom = battleId;

        } catch (ex) {
            console.error(ex);
        }
    });

    socket.on("select", async (player, pokemon) => {
      try {
        if(player === 1){
          await collections.battles.updateOne(
            {
                "_id": socket.activeRoom
            },
            {
            $set : {
                playerOne : {
                  pokemon : pokemon
                }
              }
            }
          );
        } else {
          await collections.battles.updateOne(
            {
                "_id": socket.activeRoom
            },
            {
            $set : {
                playerTwo : {
                  pokemon : pokemon
                }
              }
            }
          );
        }
        }
        catch (e){
          console.log(e);
        }
  });

    socket.on("attack", async (player, move) => {
      try{
      if(player === 1){
        await collections.battles.updateOne(
          {
              "_id": socket.activeRoom
          },
          {
            "$inc": {
                "playerOne.pokemon.pp": -move.pp,
                "playerTwo.pokemon.hp": -move.damage
            }
          }
        );
      } else {
        await collections.battles.updateOne(
          {
              "_id": socket.activeRoom
          },
          {
            "$inc": {
                "playerTwo.pokemon.pp": -move.pp,
                "playerOne.pokemon.hp": -move.damage
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
    });
    
});

http.listen(8000, async () => {
    try {
        await mongoClient.connect();
        collections.battles = mongoClient.db("game").collection("battle");
        collections.pokemon = mongoClient.db("game").collection("pokemon");
        collections.signup = mongoClient.db("game").collection("signup");
        changesBattles = collections.battles.watch([
            {
                "$match": {
                    "operationType": "update"
                }
            }
        ], { fullDocument: "updateLookup" });
        console.log("Listening on *:8000...");
    } catch (ex) {
        console.error(ex);
    }
});