import express, { response } from 'express';
import cors from 'cors'
import connect from './db.js'
import mongo from 'mongodb'


const app = express()  // instanciranje aplikacije
const port = 3000  // port na kojem će web server slušati
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Comment = require('./models/Comment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json()) // automatski dekodiraj JSON poruke
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/delete_post/:id',async(req,res,next)=>{
    let id = req.params.id
    let db = await connect();
    let cursor = await db.collection("posts").deleteOne({ _id:mongo.ObjectID(id)})
    let cursor_2 = await db.collection("comments").deleteMany({ post_id:id})
    let results = await cursor
    let results_2 = await cursor_2
    res.json(results,results_2)
})

app.post('/comments/:id',async(req,res,next)=>{
    let id = req.params.id
    let db = await connect();
    let cursor = await db.collection("comments").deleteOne({ _id:mongo.ObjectID(id)})
    let results = await cursor
    res.json(results)
})

app.get('/comments/:id',async(req,res,next)=>{
    let id = req.params.id
    let db = await connect();
    let cursor = await db.collection("comments").find({post_id:id}).sort({posted_at:-1});
    let results = await cursor.toArray();
    console.log(results)
    res.json(results)
})

app.post('/comments',async(req,res,next)=>{
    const newComment = new Comment({
        comment_text:req.body.comment_text,
        postedBy:req.body.postedBy,
        postedBy_id:req.body.postedBy_id,
        posted_at:req.body.posted_at,
        post_id:req.body.post_id
    })
    console.log("New Comment: ",newComment)
    let db = await connect();
    delete newComment._id
    let result= await db.collection("comments").insertOne(newComment)
    res.json(result)
})


app.get('/user',async(req,res,next)=>{
    let token = req.headers.token;
    jwt.verify(token, 'secretkey',async (err, decoded)=>{
        if(err){
            res.json({
                status:'Unauthorized!'
            })
        }
        console.log(decoded)
        let db = await connect();
        await db.collection("users").findOne({ _id:mongo.ObjectID(decoded.userId)}, (err, user)=>{
        if(err){
            console.log(err)
            res.json({
                status:'Error getting user!'
            })
        }
        console.log(user)
        res.json({
            title:'User grabbed!',
            user:{
                first_name:user.first_name,
                last_name:user.last_name,
                username:user.username,
                email:user.email,
                id:user._id
            }
        })
    })
    })
})


app.post('/login',async(req,res)=>{
    console.log("Credentials: ",req.body)
    let db = await connect();
    await db.collection("users").findOne({ email: req.body.Email }, (err, user) => {
        console.log(user)
        //Ako korisnik ne postoji
        if (!user) {
            res.json({
                error:'User not found!'
            })
          }
        //Ako je kriva lozinka
        if (!bcrypt.compareSync(req.body.Password, user.password)) {
            res.json({
                error:'Invalid password!'
            })
          }
          else{
        //Ako je sve okej kreira se token i salje na frontend
        let token = jwt.sign({ userId: user._id}, 'secretkey');
        res.json({
            title:'Login Success!',
            token:token,
            userData:user
        })
          }
      })
})


app.post('/signup',async(req,res)=>{
    const newUser = new User({
        first_name:req.body.First_Name,
        last_name:req.body.Last_Name,
        username:req.body.Username,
        email:req.body.Email,
        password:bcrypt.hashSync(req.body.Password, 10)
    })
    console.log("New User: ",newUser)

    let db = await connect();
    let check= await db.collection("users").find({email:newUser.email}).count()
    console.log(check,newUser.email + " Email u Bazi!")
    if(check>0){
        res.json({
            status:"Email already in use!"
        })
    }
    else{
    delete newUser._id;
    let result= await db.collection("users").insertOne(newUser)
    console.log("rezultat",result)
    res.json(result)
    }
})


app.patch('/posts/:id',async (req,res) =>{
    let id = req.params.id
    let data = req.body

    data.posted_at=new Date().getTime()
    delete data._id


    let db = await connect();
    let result= await db.collection("posts").updateOne({_id:mongo.ObjectID(id)},{
        $set:data
    })

    if(result && result.modifiedCount==1){
    let doc = await db.collection("posts").findOne({_id:mongo.ObjectId(id)})
    res.json(doc)
    }
    else{
        res.json({
            status:"Fail."
        })
    }
})


app.put('/posts/:id',async (req,res) =>{
    let id = req.params.id
    let data = req.body

    data.posted_at=new Date().getTime()
    delete data._id

     if(!data.postedBy || !data.title || !data.url){
        res.json({
            status:"Fail."
        })
        return
    }

    let db = await connect();
    let result= await db.collection("posts").replaceOne({_id:mongo.ObjectID(id)},data)

    if(result && result.modifiedCount==1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status:"Fail."
        })
    }
})

app.post('/posts', async (req, res) => {
    let data = req.body
    data.posted_at=new Date().getTime()
    delete data._id

    if(!data.postedBy || !data.title || !data.url){
        res.json({
            status:"Fail."
        })
        return
    }

    let db = await connect();
    let result= await db.collection("posts").insertOne(data)

    if(result && result.insertedCount==1){
        res.json(result.ops[0])
    }
    else{
        res.json({
            status:"Fail."
        })
    }

    res.json(data) // vrati podatke za referencu
})

app.get('/posts/:id',async (req,res) =>{
    let id = req.params.id
    let db = await connect();
    let doc = await db.collection("posts").findOne({_id:mongo.ObjectId(id)})
    res.json(doc)
})

app.get('/posts',async (req,res) =>{
    let db = await connect();
    let query = req.query

    let selection = {}
    if(query.title){
        selection.title = new RegExp(query.title)
    }

    if(query.postedBy){
        selection.postedBy = new RegExp('^'+ query.postedBy,'i') // 'i' je da ne bude case sensitive
    }

    if(query._any){
        let pretraga = query._any
        let terms = pretraga.split(' ')

        let atributi = ['title','postedBy','score']

        selection={
            $and:[]
        }
        terms.forEach(term => {
            let or = {
                $or:[]
            }
            atributi.forEach(atribut => {
                or.$or.push({[atribut]:new RegExp(term)})
            });
            selection.$and.push(or);
        });
    }

    let cursor = await db.collection("posts").find(selection).sort({posted_at:-1});
    let results = await cursor.toArray();

    res.json(results)
})

/* app.get('/posts_memory', (req, res) => {
    let posts = storage.posts
    let query = req.query
    
    if (query.title) {
        posts = posts.filter(e => e.title.indexOf(query.title) >= 0)
    }
    
    if (query.postedBy) {
        posts = posts.filter(e => e.postedBy.indexOf(query.postedBy) >= 0)
    }

    if (query._any) {
        let pretraga=query._any;
        let pojmovi = pretraga.split(" ");

        posts=posts.filter(post=>{
            let podaci = post.title + " " + post.postedBy;
            let rezultat = pojmovi.every(pojam=>{
                return podaci.indexOf(pojam) >= 0;
            })
            return rezultat;
        })
    }


    res.json(posts) // vraćamo postove direktno koristeći `json` metodu
}); */
    app.listen(port, () => console.log(`Slušam na portu ${port}!`))