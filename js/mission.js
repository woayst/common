var enableMission = false;
var wref = '';

function checkParam() {
    if (client.getParam('wref')) {
        wref = client.getParam('wref');
    }
}
checkParam();
/// Render mission
function renderMissions(missions, template_id) {
    var $ = Woay.$ || Flipcard.$ || Matching.$;
    var missions = client.mission.getAll();
    $('#mission-list').html('');
    var hasMissionActive = false;
    missions.forEach(function (mission) {
        console.log('after for mission', mission);
        if (mission.active) {
            console.log('mission active', mission.active);
            hasMissionActive = true;
            $('#mission-list').append(tmpl(template_id, mission))
        }
    })
    if (!hasMissionActive) {
        $('.section-mission').css('display', 'none');
    }
}
client.eventBus.on('login-done', function () {
    hasLogin = true;
    if (hasLogin) {
        fetchMission()
    }

    client.mission.fetch()
        .then(deactiveDoneMissions)
        .then(processMissionAutoCompleteMission)
        .then(processGoldHourMission)
})

function fetchAllMission() {
    var enableMission = true;
    if (enableMission) {
        client.mission.fetchAll()
            .then(function () {
                fetchMission();
                if (!hasLogin) {
                    $('.btn-challenge').html('<a class="bg-button-group color-button-group">Làm nhiệm vụ</a>');
                    $('.btn-challenge a').on('click', function () {
                        client.login.loginHandler();
                    })
                }
            })
    }
}
fetchAllMission();

function fetchMission() {
    var $ = client.$;
    var missions = client.mission.getAll();
    $('#w-text-share-url').val(getShareLink());
    console.log('missions', typeof missions);
    if (mobileAndTabletCheck()) {
        renderMissions(missions, 'm-mission-tmpl');
    } else {
        renderMissions(missions, 'd-mission-tmpl');
    }
}

function deactiveDoneMissions() {
    var $ = client.$;
    var missions = client.mission.getAll();
    console.log('deactive done mission');
    missions.forEach(function (mission) {
        if (!mission.active) return;
        if (mission.isDone) {
            console.log('mission is done');
            $('.mission-' + mission.name + ' .btn-challenge a').html('Đã hoàn thành').addClass('deactive');
            return;
        }
    })
}
function removeHash(str) {
    return str.replace('#', '');
}

function missionComplete(name) {
    var $ = client.$;
    if (!client.mission.isReady()) return;
    if (name === 'login' || name === 'invite_friend') {
        return;
    }
    var player_id = client.user.get().player_id;
    client.mission.complete(name, player_id)
        .then(function () {
            var mission_name = client.mission.get(name).name;
            var quantity = client.mission.get(name).quantity;
            if (name !== 'register') {
                console.log('show popup mission complete');
                client.html.closeAllModal();
                Woay.Modal.show('w-complete');
                $('#w-complete .title-popup').html('Chúc mừng bạn đã nhận được ' + quantity + ' lượt');
            }
            $('.mission-' + name + ' .btn-challenge a').html('Đã hoàn thành').addClass('deactive');
            client.addTurnForMission(mission_name, quantity);
            client.updateTurnCount();
        }).catch(function (err) {
            console.log(name, ' error');
            console.error(err);
        })
}

function getShareLink() {
    var user = client.user.get();
    console.log('user', user);
    var uid = user && user.player_id;
    var share_link_url = window.location.href.split('?')[0];
    return share_link_url + (uid ? '?wref=' + uid : '');
}
function processMissionAutoCompleteMission() {
    var $ = client.$;
    var AUTO_COMPLETE_MISSIONS = ['login'];
    var player_id = client.user.get().player_id;
    console.log('player_id', player_id);
    AUTO_COMPLETE_MISSIONS.forEach(function (key) {
        var m = client.mission.get(key);
        console.log('m', m);
        console.log('m.isDone', m.isDone);
        if (m.active && !m.isDone) {
            client.mission.complete(m.name, player_id);
            $('.mission-' + m.name + ' .btn-challenge a').html('Đã hoàn thành').addClass('deactive');
            client.addTurnForMission(m.name, m.quantity);
            client.updateTurnCount();
        }
    })
}

function processGoldHourMission() {
    var $ = client.$;
    var date = new Date();
    var GOLD_HOUR_START = 9;
    var GOLD_HOUR_END = 23;
    var current_hour = date.getHours();
    var isValid = (GOLD_HOUR_START <= current_hour && current_hour < GOLD_HOUR_END);
    var isDone = client.mission.get('gold_hour').isDone;
    if (!isValid && !isDone) {
        $('.mission-gold_hour .btn-challenge a').html('Chưa thực hiện').addClass('deactive');
    } else if (isValid && !isDone) {
        $('.mission-gold_hour .btn-challenge a').html('Làm nhiệm vụ').addClass('active');
    } else {
        $('.mission-gold_hour .btn-challenge a').html('Đã hoàn thành').addClass('active');
    }
}

$(document).on("click", '.btn-share-fb', function () {
    FB.ui({
        method: 'share',
        href: getShareLink(),
    }, function (response) {
        if (response) {
            missionComplete('share_facebook');
        }
    });
})