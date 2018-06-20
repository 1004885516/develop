/**
 * Created by Administrator on 2018/5/22/022.
 */
var _=require('underscore');


var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; },0);

var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num  == 2; });

var list=[{
    name:'tom',
    age:'12'
},{
    name:'jack',
    age:'12'
}];


var b=_.where(list, {age:'12'});

var tr= _.some([1,2,3,4,5,6]);
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];

console.log('pluck',_.pluck(stooges,'name'));


//遍历数组，返回age属性值最大的那个对象
console.log('max', _.max(stooges,function(stooges){
    return stooges.age;
}));


console.log('groupBy',_.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); }));



























console.log(tr);
console.log('1111',_.contains([1, 2, 3], 3));


//console.log(b);





























