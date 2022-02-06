const { result } = require('lodash');
const db = require('../dbHelper');
const Noa = require('../models/noa.model');
const auth_key = "f87ertueiwthrewpfhre7weqpbruewqr7pwqruewqyr8ew";

const PASSWORD = process.env.MY_PASSWORD;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.request_auth = async (req, res) => {
    r_pos = []
    l_pss = PASSWORD.length;
    var result = null;

    result = {};
    result.auth = {};

    if( auth_key == req.headers['auth-key'] ){
        result.auth.status = "OK";
    }else{

        while( r_pos.length < 4 ){
            var num = getRandomInt(1,l_pss+1);
            if( !r_pos.includes(num) ){
                r_pos.push(num);
            }
        }

        r_pos.sort(function(a, b) {
            return a - b;
        });

        result.auth.status = "NOK";
        result.pos = r_pos;
        result.prov = '93479543433';
    }

    res.json(result);
}

exports.auth = async (req, res) => {
    console.log(req.body);
    let isCorrect = true;

    arr_passwd = PASSWORD.split("");
    arr_pos = req.body.pos;
    arr_key = req.body.key;
    arr_pos.forEach(function(pos, index){
        idx = pos-1;
        if( arr_passwd[idx] != arr_key[index] ){
            isCorrect = false;
        }
        console.log(idx, index, isCorrect);
    });

    if( isCorrect ){
        res.json({
            auth : { status: 'OK' },
            auth_key: auth_key
        });
    }

    if( !isCorrect ){
        res.json({
            auth : { status: 'NOK' },
            auth_key: '-1'
        });
    }
}

exports.read = async (req, res) => {
    if( auth_key == req.headers['auth-key'] ){
        title_list = [];
        try {
            collection = db.collection("noas");
            var all = await collection.find({}).toArray();
            all.forEach(element => {
                title_list.push(element.title);
            });
        } catch (err) {
            console.log(err);
        }

        Noa.findOne({ title : req.params._text }, function(err, data) {
            if( data == null ){
                // RETURN
                res.json({
                    titles: title_list,
                    data: {
                        title: req.params._text,
                        desc: ''
                    }
                });
            }
            if( data != null ){
                if (err) return next(err);
                res.json({
                    titles: title_list,
                    data: data
                });
            }
        });
    }else{
        res.status(500);
        res.json({});
    }
};

exports.write = async (req, res) => {
    if( auth_key == req.headers['auth-key'] ){
        title_list = [];
        try {
            collection = db.collection("noas");
            var all = await collection.find({}).toArray();
            all.forEach(element => {
                title_list.push(element.title);
            });
        } catch (err) {
            console.log(err);
        }

        if( req.body.mode == 'title' ){ // ON TYPE TITLE
            Noa.findOne({ title : req.body.data.title }, function(err, data) {

                if( data != null ){ // title exist

                    req.body.data.desc = data.desc;

                    // CONVERT
                    req.body.data.title = req.body.data.title || '';
                    req.body.data.desc = req.body.data.desc || ''

                    // RETURN
                    res.json({
                        data: {
                            title: req.body.data.title,
                            desc: req.body.data.desc
                        }
                    });
                }
                if( data == null ){ // title not exist

                    // CONVERT
                    req.body.data.title = req.body.data.title || '';

                    // RETURN
                    res.json({
                        data: {
                            title: req.body.data.title,
                            desc: ''
                        }
                    });
                }
            });
        }
        if( req.body.mode == 'desc' ){ // ON TYPE DESC
            Noa.findOne({ title : req.body.data.title }, function(err, data) {

                if(
                    data != null // title exist
                ){
                    // DO OPERATION
                    data.desc = req.body.data.desc;

                    // CONVERT
                    req.body.data.title = req.body.data.title || '';
                    req.body.data.desc = req.body.data.desc || ''

                    // RETURN
                    data.save(function (err) {
                        res.json({
                            titles: title_list,
                            data: {
                                title: req.body.data.title,
                                desc: req.body.data.desc
                            }
                        });
                    });
                }
                if(
                    data == null // title not exist
                ){
                    // DO OPERATION
                    noa = new Noa({
                        title: req.body.data.title,
                        desc: req.body.data.desc
                    });

                    // CONVERT
                    req.body.data.title = req.body.data.title || '';
                    req.body.data.desc = req.body.data.desc || ''

                    // RETURN
                    noa.save(function (err) {
                        res.json({
                            titles: title_list,
                            data: {
                                title: req.body.data.title,
                                desc: req.body.data.desc
                            }
                        });
                    });

                }
            });
        }
    }else{
        res.status(500);
        res.json({});
    }
};
