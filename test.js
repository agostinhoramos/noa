const db = require('./dbHelper');
const Access = require('./models/access.model');

new Access({
    passwd: '934927329',
    enabled: 1,
}).save(function (err) {
    if(err) console.log("Error");
    console.log("Done!");
});

// const u_access = (call) => {
//     Access.find({ enabled: 1 }, async (err, data) => {
//         item = await data[0];
//         __name = item.name; 
//         __id = item._id.toString();
//         __passwd = item.passwd;
//         call();
//     });
// }

// u_access(() => {
//     console.log( __name, __id, __passwd );
// });

// getSmallWordSize = (numArray) => {
//     new_arr = [];
//     numArray.forEach(el => {
//         new_arr.push(el.length);
//     });
//     return Math.min.apply(null, new_arr);
// }

// console.log(getSmallWordSize(["gf", "ufh2398fuiri7f", "rtw", "98g4h9g8hg98"]));