const popup = document.querySelector(".login-wraper");
const btn_noa_cancel = document.querySelector(".login-wraper button.noa_app");
const inputs = document.querySelectorAll(".block-pass input");

let arr_pos = [];
let prov = null;

document.onkeydown = function (evt) {
    if (!evt) evt = event;
    if (evt.shiftKey && evt.keyCode === 78) {
        on_open_windows();
    }
    if(evt.keyCode === 27) { // ESC
        on_close_windows();
    }
    if( evt.keyCode === 8 ){ // delete
        pos = get_cursor_pos() - 1;
        if( pos >= 0 ){
            inputs[pos].focus()
        }
    }
    if( evt.keyCode === 37 ){ // LEFT
        console.log( evt.keyCode );
    }
    if( evt.keyCode === 39 ){ // RIGHT
        console.log( evt.keyCode );   
    }
}
inputs.forEach(function(elem, index){
    elem.onkeyup = function(){
        if( elem.value.length > 0 ){
            if( inputs[index+1] !== undefined ){
                inputs[index+1].focus();
            }
            if( inputs.length-1 == index ){
                var validated=true;
                inputs.forEach(function(e, i){
                    if( e.value.length < 1 ){
                        validated=false;
                        inputs[i].focus();
                    }
                });
                if( validated ){
                    on_close_windows();
                    var arr = [];
                    inputs.forEach(function(e){
                        if( e.value.length > 0 ){
                            arr.push(e.value);
                        }
                    });
                    send_password(arr);
                }else{
                    console.log("Not verified!");
                }
            }
        }
    }
});
btn_noa_cancel.onclick = function(){
    on_close_windows();
}
let get_cursor_pos = function(){
    var pos = -1;
    inputs.forEach(function(elem, index){
        if( elem === document.activeElement ){
            pos = index;
        }
    });
    return pos;
}
let on_open_windows = function(){
    $.ajax({
        "url": `${Noa.hostname}request_auth`,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        },
        "timeout": 0,
        complete: function(xhr, textStatus) {
            if(xhr.status == 500){}
        }
    }).done(function (response) {
        if( response['auth']['status'] == 'OK' ){
            setTimeout(function(){
                on_open_windows();
            }, 1000);
            return;
        }

        if( response['auth']['status'] == 'NOK' ){
            on_close_windows();
        }

        arr_pos = response['pos'];
        prov = response['prov'];
        const desc = document.querySelectorAll("div.desc span[char]");
        const texts = document.querySelectorAll(".block-text input");
        texts.forEach(function(text, index){
            text.value=arr_pos[index];
        });
        desc.forEach(function(text, index){
            text.innerText=arr_pos[index];
        });
        popup.classList.add("show");
        inputs[0].focus();
        setTimeout(() => {
            inputs.forEach(function(e){
                e.value='';
            });
        }, 20);
    });
}
let on_close_windows = function(){
    popup.classList.remove("show");
    setTimeout(() => {
        inputs.forEach(function(e){
            e.value='';
        });
    }, 20);
}
let send_password = function(arr){
    console.log(arr);

    $.ajax({
        "url": `${Noa.hostname}auth`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            pos: arr_pos,
            key: arr,
            prov: prov
        }),
        complete: function(xhr, textStatus) {}
    }).done(function (response) {
        if( response['auth']['status'] == 'OK' ){
            location.reload();
        }
    });
}

const Noa = {
    hostname: '/api/v1/noa/',
    $input: document.querySelector(".wrapper input"),
    $textarea: document.querySelector(".wrapper textarea"),
    $datalist: document.querySelector(".main datalist#list"),
    time_out: 0,
    update_time: 500,
    time_obj_title: null,
    time_obj_desc: null,

    init: function(){
        input = Noa.$input;
        textarea = Noa.$textarea;
        value = input.value;
        textarea.disabled=true;
        if( value.length > 0 ){
            $.ajax({
                "url": `${Noa.hostname}read/${value}`,
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json"
                },
                "timeout": Noa.time_out,
                complete: function(xhr, textStatus) {
                    if(xhr.status == 500){
                        on_open_windows();
                        return;
                    }
                }
            }).done(function (response) {
                input.value = response['data']['title']
                textarea.value = response['data']['desc'];
                textarea.disabled=false;

                // Display all title
                Noa.$datalist.innerHTML='';
                response['titles'].forEach(element => {
                    var tag = document.createElement("option");
                    tag.value=element;
                    Noa.$datalist.appendChild(tag);
                });
            });
        }

        input.onkeyup = function (evt) { Noa.onsave_title(); }
        textarea.onkeyup = function (evt) { Noa.onsave_desc(); }
    },
    onsave_title: function(){
        input = Noa.$input;
        textarea = Noa.$textarea;
        textarea.disabled=true;
        clearTimeout(Noa.time_obj_title);
        Noa.time_obj_title = setTimeout(() => {
            var value = document.querySelector(".wrapper input").value;
            if( value.length > 0 ){
                $.ajax({
                    "url": `${Noa.hostname}write`,
                    "method": "POST",
                    "timeout": Noa.time_out,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        mode: 'title',
                        data: {
                            "title" : value ,
                            "desc" : textarea.value
                        }
                    }),
                    complete: function(xhr, textStatus) {
                        if(xhr.status == 500){
                            //location.href='/';
                        }
                    }
                }).done(function (response) {
                    input.value = response['data']['title']
                    textarea.value = response['data']['desc'];
                    textarea.disabled=false;

                    // Display all title
                    Noa.$datalist.innerHTML='';
                    response['titles'].forEach(element => {
                        var tag = document.createElement("option");
                        tag.value=element;
                        Noa.$datalist.appendChild(tag);
                    });
                });
            }
        }, Noa.update_time);
    },
    onsave_desc: function(){
        input = Noa.$input;
        textarea = Noa.$textarea;
        input.disabled=true;
        clearTimeout(Noa.time_obj_desc);
        Noa.time_obj_desc = callback = setTimeout(() => {
            var value = input.value;
            if( value.length > 0 ){
                if( textarea.value == '' ){
                    textarea.value = null;
                }
                $.ajax({
                    "url": `${Noa.hostname}write`,
                    "method": "POST",
                    "timeout": Noa.time_out,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        mode: 'desc',
                        data: {
                            "title" : value ,
                            "desc" : textarea.value
                        }
                    }),
                    complete: function(xhr, textStatus) {
                        if(xhr.status == 500){
                            //location.href='/';
                        }
                    }
                }).done(function (response) {
                    textarea.value = response['data']['desc'];
                    input.disabled=false;
                    console.log( response['titles'] );

                    // Display all title
                    Noa.$datalist.innerHTML='';
                    response['titles'].forEach(element => {
                        var tag = document.createElement("option");
                        tag.value=element;
                        Noa.$datalist.appendChild(tag);
                    });
                });
            }
        }, Noa.update_time);
    }
};
Noa.init();