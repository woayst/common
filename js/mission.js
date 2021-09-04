var enableMission = false;
var wref = '';
var $ = client.$;

/// Render mission
function renderMissions(missions, template_id) {
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

function fetchMission() {
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

function missionComplete(name, new_quantity) {

    if (!client.mission.isReady()) return;
    if (name === 'login' || name === 'invite_friend') {
        return;
    }
    var player_game_id = client.user.get().player_game_id;
    client.mission.complete(name, player_game_id, new_quantity)
        .then(function () {
            var mission_name = client.mission.get(name).name;
            var quantity = client.mission.get(name).quantity;
            var mission_type = client.mission.get(name).type;
            var mission_frequency = client.mission.get(name).frequency;
            if (!isNaN(new_quantity)) {
                console.log('update quantity', new_quantity)
                quantity = new_quantity;
            }
            console.log('quantity', quantity);
            if (name !== 'register') {
                console.log('show popup mission complete');
                client.html.closeAllModal();
                MicroModal.show('w-complete');
                if (mission_type == 'point') {
                    $('#w-complete .title-popup').html('Chúc mừng bạn đã nhận được ' + quantity + ' điểm');
                } else {
                    $('#w-complete .title-popup').html('Chúc mừng bạn đã nhận được ' + quantity + ' lượt');
                }
            }
            if (quantity <= 0) {
                $('#w-complete .title-popup').html('Rất tiếc bạn không được cộng lượt');
            }
            if (mission_frequency !== 'unlimited') {
                $('.mission-' + name + ' .btn-challenge a').html('Đã hoàn thành').addClass('deactive');
            }
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
    var uid = user && user.player_game_id;
    var share_link_url = window.location.href.split('?')[0];
    return share_link_url + (uid ? '?wref=' + uid : '');
}
function processMissionAutoCompleteMission() {
    var AUTO_COMPLETE_MISSIONS = ['login'];
    var player_game_id = client.user.get().player_game_id;
    console.log('player_game_id', player_game_id);
    AUTO_COMPLETE_MISSIONS.forEach(function (key) {
        var m = client.mission.get(key);
        console.log('m', m);
        console.log('m.isDone', m.isDone);
        if (m.active && !m.isDone) {
            client.mission.complete(m.name, player_game_id);
            $('.mission-' + m.name + ' .btn-challenge a').html('Đã hoàn thành').addClass('deactive');
            client.addTurnForMission(m.name, m.quantity);
            client.updateTurnCount();
        }
    })
}

function processGoldHourMission() {
    var date = new Date();
    var GOLD_HOUR_START = parseInt(client.mission.get('gold_hour').meta.from);
    var GOLD_HOUR_END = parseInt(client.mission.get('gold_hour').meta.to);
    console.log('gold_hour', GOLD_HOUR_START, GOLD_HOUR_END);
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

$(document).on("click", '.btn-invite-friend', function () {
    MicroModal.show('w-share');
})

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

$(document).on("click", '.my-copy-link-btn', function () {
    client.copyToClipboard('#w-text-share-url');
})