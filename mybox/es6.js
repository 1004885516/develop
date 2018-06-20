new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
}).then(p => {
    console.log('r',p);
});