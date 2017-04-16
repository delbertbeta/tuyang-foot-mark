'use strict';

var username = 'wallace';
var token = '';
var dataArray = [];
var visits;

(function getToken() {
    if (token === '') {
        $.ajax({
            url: 'https://tuyang.tenhou.cn/users/login',
            method: 'POST',
            data: JSON.stringify({
                "username": "wallace",
                "password": "IamSOOOOtall"
            }),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data.status === 'success') {
                    token = data.result;
                    getPuzzles();
                }
            }
        })
    }
})()

function getPuzzles() {
    if (token != '') {
        $.ajax({
            url: 'https://tuyang.tenhou.cn/users/puzzles',
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
                    startRender();
                    setUpSlider();
                }
            }
        })
    }
}

var app;

function startRender() {
    app = new Vue({
        el: '#thingsToRender',
        data: {
            visits: visits,
        },
        methods: {
            showDetail: function (id) {
                getDetail(id);
            }
        }
    })
}

function getDetail(id) {
    let detail;
    let idArray = [];
    idArray.push(id);
    $.ajax({
        url: 'https://tuyang.tenhou.cn/visits/info',
        method: 'POST',
        data: JSON.stringify({
            "username": username,
            'token': token,
            'id': idArray,
        }),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.status === 'success') {
                detail = data.result[0];
                detail.time = moment(detail.time, moment.ISO_8601).format('YYYY年MM月DD日');
                idArray = [];
                idArray.push(detail.place_id)
                $.ajax({
                    url: 'https://tuyang.tenhou.cn/places/info',
                    method: 'POST',
                    data: JSON.stringify({
                        "username": username,
                        "token": token,
                        "id": idArray
                    }),
                    contentType: 'application/json;charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        if (data.status === 'success') {
                            detail.place = data.result[0].name;
                            detailPanel.content = detail;
                            document.getElementById('detailPanel').classList.remove('out');
                            document.getElementById('mask').classList.remove('out');
                        }
                    }
                })
            }
        }
    })
}


function setUpSlider() {
    var list = document.getElementsByClassName('puzzle-page');

    for (let i = 0; i < list.length; i++) {
        var data = {
            content: list[i],
        }
        dataArray.push(data);
    }


    var S = new iSlider(document.getElementById('puzzleArea'), dataArray, {
        isLooping: 1,
        isOverspread: 1,
        // isAutoplay: 1,
        animateTime: 800,
        animateType: 'flow',
        plugins: ['dot']
    });
}

document.getElementById('timelineButton').addEventListener('click', function () {
    window.location.href = './timeline.html?username=' + username + '&token=' + token;
})

document.getElementById('mask').addEventListener('click', function(){
    document.getElementById('mask').classList.add('out');
    document.getElementById('detailPanel').classList.add('out');
})

var detailPanel = new Vue({
    el: '#detailPanel',
    data: {
        content: {},
    }
})