var enableMission = false;
var wref = '';
var $ = client.$;
var QUESTION_START_DATE = '2021-09-04';
console.log('QUESTION_START_DATE', QUESTION_START_DATE)
var QUESTION_DIFF_DATE = Math.floor((Date.now() - new Date(QUESTION_START_DATE)) / 86400000);
console.log('QUESTION_DIFF_DATE', QUESTION_DIFF_DATE)
QUESTION_DIFF_DATE = QUESTION_DIFF_DATE % 14;

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

    var question_per_day = client.mission.get('wiki').meta.question_per_day;
    var max_question = client.mission.get('wiki').meta.question.length;
    current_question = QUESTION_DIFF_DATE * question_per_day;
    max_question = current_question + question_per_day;
    console.log({
        currentQuestion: current_question,
        MAX_QUESTION: max_question
    })

    client.mission.fetch()
        .then(deactiveDoneMissions)
        .then(processMissionAutoCompleteMission)
        .then(processGoldHourMission)
        .then(function () {
            var action_qr = '';
            var secret_qr = '';
            if (client.getParam('action') && client.getParam('secret')) {
                action_qr = client.getParam('action');
                secret_qr = client.getParam('secret');
                processMissionQrCode(secret_qr);
            }
        })
        .then(function () {
            $(document).on('click', '.item-question', function () {
                checkRightAnswer();
                setTimeout(function () {
                    current_question++;
                    console.log('current_question', current_question);
                    if (current_question >= max_question) {
                        console.log('show result');
                        showResult();
                    } else {
                        console.log('render tiếp câu hỏi');
                        renderQuestion('question-tmpl');
                    }
                }, 1000)
            })
        })
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

$(document).on('click', '.btn-show-quiz', function () {
    renderQuestion('question-tmpl');
    MicroModal.show('w-quiz');
})

$(document).on('click', '.btn-show-qrcode', function () {
    checkQrCode();
})

function checkQrCode() {
    var action_qr = client.getParam('action');
    var secret_qr = client.getParam('secret');
    console.log('action_qr', action_qr, 'secret_qr', secret_qr);
    if (!action_qr && !secret_qr) {
        $('.text-qrcode').text('Nhiệm vụ quét mã QR CODE chỉ áp dụng khi đến cửa hàng');
    }
    MicroModal.show('w-qrcode');
}


function processMissionQrCode(secret_qr) {
    console.log('process mission qr code');
    var secret_key = client.mission.get('explore_store').meta.hash;
    var mission_done = client.mission.get('explore_store').isDone;
    var passhash = CryptoJS.MD5(secret_qr).toString();
    console.log('passhash', passhash, typeof passhash);
    console.log('secret_key', secret_key, typeof secret_key);
    console.log('mission_done', mission_done);
    console.log('compare string', passhash.localeCompare(secret_key));
    if (passhash.localeCompare(secret_key) == 0) {
        console.log('mission complete qr code');
        missionComplete('explore_store');
    } else {
        $('.text-qrcode').text('Mã QR CODE không chính xác');
    }
    if (mission_done) {
        $('.text-qrcode').text('Nhiệm vụ QR CODE đã hoàn thành');
    }
}

function renderQuestion(template_id) {
    var questions = client.mission.get('wiki').meta.question;
    var question = questions[current_question];
    var answers = question.answer;
    var answer_1 = answers[0];
    console.log('answer_1', answer_1)
    $('#box-question').removeClass('disable');
    $('#box-question').html(tmpl(template_id, question));
    $(".title-question").html(question.question);
    console.log('question of question', question.question);
}

function checkRightAnswer() {
    var questions = client.mission.get('wiki').meta.question;
    var question = questions[current_question];
    var quantity_per_question = client.mission.get('wiki').meta.quantity_per_question;
    console.log('question', question);
    var answers = $('input[name="answer"]');
    var answer_val;
    var answer_right = question.rightAnswer;
    console.log('answer_right', answer_right);
    for (var i = 0; i < answers.length; i++) {
        // console.log('answers value', answers[i].checked);
        if (answers[i].checked) {
            answer_val = answers[i].value;
            if (answer_right == answer_val) {
                $(answers[i]).parent('.item-question').addClass('correct');
                $(answers[i]).parent('.item-question').find('.checkmark').css('display', 'block');
                count_right_answer += quantity_per_question;
                console.log('count_right_answer', count_right_answer);
            } else {
                $(answers[i]).parent('.item-question').addClass('wrong');
            }
        }
        if (!answers[i].checked && answers[i].value == answer_right) {
            $(answers[i]).parent('.item-question').addClass('correct');
            $(answers[i]).parent('.item-question').find('.checkmark').css('display', 'block');
        }
    }
    $('#box-question').addClass('disable');
}

function showResult() {
    var question_per_day = client.mission.get('wiki').meta.question_per_day;
    var quantity = count_right_answer;
    console.log('quantity', quantity);
    MicroModal.close('w-quiz');
    missionComplete('wiki', quantity);
}