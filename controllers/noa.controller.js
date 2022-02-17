const { result } = require('lodash');
var crypto = require('crypto');
const mongoose = require('mongoose');

const db = require('../dbHelper');
const Noa = require('../models/noa.model');
const Auth = require('../models/auth.model');
const Access = require('../models/access.model');

const identify_client = (req) => {
    var fingerprint = `${req.socket.remoteAddress}`;
    if( fingerprint.length > 2 ){
        fingerprint = crypto.createHash('sha256')
        .update(fingerprint).digest('base64');
        return fingerprint;
    }
    return "-1";
}

const ip_address = (req) => {
    var ip = `${req.socket.remoteAddress}`;
    if( ip.length > 8 ){
        return ip;
    }
    return "-1";
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

getSmallWordSize = (numArray) => {
    new_arr = [];
    numArray.forEach(el => {
        new_arr.push(el.length);
    });
    return Math.min.apply(null, new_arr);
}

const u_access = (req, res, call) => {
    
    Access.findOne({ enabled: 1 }, async (err, data) => {

        __key = data.auth_key;
        __name = data.name; 
        __id = data._id.toString();
        __passwd = data.passwd;

       const n_auth = JSON.stringify({
            id: __id,
            ak: process.env.AUTH_KEY,
            fp: identify_client(req),
            ip: ip_address(req)
        });

        __auth_key = crypto.createHash('sha256')
                    .update(n_auth).digest('base64');

        collection = db.collection("noas");

        Auth.find({ ip_address : ip_address(req), status: 0 }, function(err, auth) {
            __auth = auth;
            call();
        });

    });
}

exports.create = async (req, res) => {
    Access.find({ enabled: 1 }, async (err, data) => {
        if( data.length == 0 ){
            //console.log( req.body.passwd );
            new Access({
                passwd: req.body.passwd,
                enabled: 1,
            }).save(function (err) {
                if(err){
                    res.json({
                        status: 'NOK'
                    });
                } else {
                    res.json({
                        status: 'OK'
                    });
                }
            });
        }else{
            res.json({
                status: 'NOK'
            });
        }
    });
}

exports.request_auth = async (req, res) => {
    u_access(req, res, () => {
        r_pos = []
        l_pss = __passwd.length;
        var result = null;
        result = {};
        result.auth = {};

        if( __auth.length >= process.env.MAX_NUMBER_OF_ATTEMPTS ){
            return res.status(200).json({
                auth: {
                    status: 'NOK',
                    pos: [],
                    prov: null
                }
            });
        } else {
            if( __auth_key == req.cookies['auth-key'] ){
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
            return res.status(200).json(result);
        }
    });
}

exports.auth = async (req, res) => {
    u_access(req, res, async () => {

        let isCorrect = true;

        if( __auth.length < process.env.MAX_NUMBER_OF_ATTEMPTS ){

            isCorrect = true;
            arr_passwd = __passwd.split("");
            arr_pos = req.body.pos;
            arr_key = req.body.key;
            
            arr_pos.forEach(function(pos, index){
                idx = pos-1;
                if( arr_passwd[idx] != arr_key[index] ){
                    isCorrect = false;
                }
            });

            if( isCorrect ){
                new Auth({
                    fingerprint: identify_client(req),
                    ip_address: ip_address(req),
                    status: 1
                }).save(function (err) {
                    res.cookie('auth-key', __auth_key, { maxAge: (((1000 * 60) * 60) * (24 * process.env.MAX_SESSION_TIME)) });

                    res.status(200).json({
                        auth : { status: 'OK' }
                    });
                });
                Auth.find({ fingerprint: identify_client(req) }, function (err, data) {
                    if( !data ){
                        res.send({"Error" : "Data not found"});
                        return false;
                    }
                    data.forEach(function(item){
                        item.status = 1;
                        item.save(function (err) {});
                    });
                });
            }

            if( !isCorrect ){
                new Auth({
                    fingerprint: identify_client(req),
                    ip_address: ip_address(req),
                    status: 0
                }).save(function (err) {
                    res.status(200).json({
                        auth : { status: 'NOK' },
                        auth_key: '-1'
                    });
                });
            }
        } else { res.status(200).json({}); }

    });
}

exports.read = async (req, res) => {
    
    u_access(req, res, async () => {
        if( __auth.length < process.env.MAX_NUMBER_OF_ATTEMPTS ){
            if( __auth_key == req.cookies['auth-key'] ){
                title_list = [];
                try {
                var all = await collection.find({ author: mongoose.Types.ObjectId(__id), title: { '$regex': req.params._text } }).toArray();
                    all.forEach(element => {
                        title_list.push(element.title);
                    });
                } catch (err) {
                    console.log(err);
                }
        
                Noa.findOne({ title : req.params._text, author: mongoose.Types.ObjectId(__id) }, function(err, data) {
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
                res.status(500).json({});
            }
        }
    });
};

exports.write = async (req, res) => {
    u_access(req, res, async () => {
        if( __auth.length < process.env.MAX_NUMBER_OF_ATTEMPTS ){
            if( __auth_key == req.cookies['auth-key'] ){
                
                title_list = [];
                try {
                    var all = await collection.find({author: mongoose.Types.ObjectId(__id), title: { '$regex': req.body.data.title } }).toArray();
                    all.forEach(element => {
                        title_list.push(element.title);
                    });
                } catch (err) {
                    console.log(err);
                }

                if( req.body.mode == 'title' ){ // ON TYPE TITLE
                    Noa.findOne({ title : req.body.data.title, author: mongoose.Types.ObjectId(__id) }, function(err, data) {

                        if( data != null ){ // title exist

                            req.body.data.desc = data.desc;

                            // CONVERT
                            req.body.data.title = req.body.data.title || '';
                            req.body.data.desc = req.body.data.desc || ''

                            // RETURN
                            res.json({
                                titles: title_list,
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
                                titles: title_list,
                                data: {
                                    title: req.body.data.title,
                                    desc: ''
                                }
                            });
                        }
                    });
                }
                if( req.body.mode == 'desc' ){ // ON TYPE DESC
                    Noa.findOne({ title : req.body.data.title, author: mongoose.Types.ObjectId(__id) }, function(err, data) {

                        if(
                            data != null // title exist
                        ){
                            // DO OPERATION
                            data.desc = req.body.data.desc;
                            data.author = __id;

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
                                desc: req.body.data.desc,
                                author: __id
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
                res.status(500).json({});
            }
        }
    });
};
