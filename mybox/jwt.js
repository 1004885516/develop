/**
 * Created by Administrator on 2018/5/18/018.
 */
var jwt=require('jsonwebtoken');
var app=require('express')();


var key='aas2d13as51d5as1d3as1d23as';

app.get('/jwt',function(req,res){
    var token=jwt.sign({phone:1596333333},key);
    res.send('<body>'+token+'</body>');
});
var server=app.listen(3000,function(){
    console.log('启动成功');
});

