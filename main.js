const express = require('express');
const app= express();
const fs= require('fs/promises');
app.get('/user', async (req, res) => {
    let users=await fs.readFile('users.json', 'utf-8');
    res.status(200).json(JSON.parse(users));
});
app.post('/user', express.json(), async (req, res) => {
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    let emailexists=users.findIndex(user => user.email == req.body.email);
    if(emailexists !== -1){
        return res.status(400).json({message: 'Email already exists.'});
    }
    let newUser={
        id:users.length === 0 ? 1 : users[users.length - 1].id + 1,
        ...req.body
    };
    users.push(newUser);
    await fs.writeFile('users.json', JSON.stringify(users));
    res.status(201).json({message: 'User added successfully.'});
});
app.patch('/user/:id', express.json(), async (req, res) => {
    const { id } = req.params;
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    let userIndex=users.findIndex(user => user.id == id);
    if(userIndex === -1){
        return res.status(404).json({message: 'User Id not found.'});
    }
    Object.assign(users[userIndex], req.body);
    let key=Object.keys(req.body);
    await fs.writeFile('users.json', JSON.stringify(users));
    res.status(200).json({message: `User ${key} updated successfully.`});
});
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    let userIndex=users.findIndex(user => user.id == id);
    if(userIndex === -1){
        return res.status(404).json({message: 'User Id not found.'});
    }
    console.log(userIndex);
    users.splice(userIndex, 1);
    await fs.writeFile('users.json', JSON.stringify(users));
    res.status(200).json({message: 'User deleted successfully.'});
});
app.get('/user/getByName', async (req, res) => {
    const name = req.query.name;
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    if(!name){
        return res.status(400).json({message: 'Name query parameter is required.'});
    }
    let filteredUsers=users.filter(user => user.name.toLowerCase() === name.toLowerCase());
    if(filteredUsers.length === 0){
        return res.status(404).json({message: 'User name not found.'});
    }
    res.status(200).json(filteredUsers);
});
app.get('/user/filter', async (req, res) => {
    const minAge = Number(req.query.minAge);
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    if(Number.isNaN(minAge) || minAge === 0){
        return res.status(400).json({message: 'minAge query parameter is required'});
    }
    let filteredUsers=users.filter(user => user.age >= minAge);
    if(filteredUsers.length === 0){
        return res.status(404).json({message: 'no user found.'});
    }
    res.status(200).json(filteredUsers);
});
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    let users=await fs.readFile('users.json', 'utf-8');
    users=JSON.parse(users);
    let userIndex=users.findIndex(user => user.id == id);
    if(userIndex === -1){
        return res.status(404).json({message: 'User not found.'});
    }
    res.status(200).json(users[userIndex]);
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});