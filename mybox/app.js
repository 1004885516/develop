/**
 * Created by Administrator on 2018/6/8/008.
 */
const express = require('express');
const path = require('path');
const app = express();
var jwt=require('jsonwebtoken');

app.use(express.static(path.join(__dirname, 'view')));

app.get('/go',function(req,res){
    res.send('asdasdasdasd');
});
app.get('/jwt',function(req,res){

    res.send('<body>'+'你好啊linux'+'</body>');
});







app.listen(8080, () => {
    console.log(`App listening at port 8080`)
})

