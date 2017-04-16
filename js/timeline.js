'use strict';

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var token = GetQueryString('token');
var username = GetQueryString('username');

var visits;

(function getVisits() {
    if (token != '') {
        $.ajax({
            url: 'https://tuyang.tenhou.cn/users/visits',
            method: 'POST',
            data: JSON.stringify({
                "username": username,
                'token': token
            }),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data.status === 'success') {
                    visits = data.result;
                    getInfo();
                }
            }
        })
    }
})()

var info;

function getInfo() {
    $.ajax({
        url: 'https://tuyang.tenhou.cn/visits/info',
        method: 'POST',
        data: JSON.stringify({
            "username": username,
            "token": token,
            "id": visits
        }),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.status === 'success') {
                info = data.result;
                getPlace();
                classifyInfo();
            }
        }
    })
}

var classify = {};
var places = [];
var placesList;

function getPlace() {
    for (let i = 0; i < info.length; i++) {
        places.push(info[i].place_id);
    }
    $.ajax({
        url: 'https://tuyang.tenhou.cn/places/info',
        method: 'POST',
        data: JSON.stringify({
            "username": username,
            "token": token,
            "id": places
        }),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.status === 'success') {
                placesList = data.result;
                classifyInfo();
            }
        }
    })
}

function classifyInfo() {
    for (let i = 0; i < info.length; i++) {
        for (let j = 0; j < placesList.length; j++) {
            if (placesList[j].id == info[i].place_id) {
                info[i].place = placesList[j].name;
                break;
            }
        }
        info[i].time = moment(info[i].time, moment.ISO_8601);
        let date = info[i].time.format('YYYY年MM月DD日');
        if (typeof classify[date] === 'undefined') {
            classify[date] = {
                date: date,
                content: []
            }
        }
        info[i].time = info[i].time.format('HH:mm:ss');
        classify[date].content.push(info[i]);
    }
    startRender();
}

var app;

function startRender() {
    app = new Vue({
        el: '#timeline',
        data: {
            classify: classify
        }
    })
}