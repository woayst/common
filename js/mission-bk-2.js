var enableMission = false;
var wref = '';
var $ = $$woay.$;
var current_question = 0;
var count_right_answer = 0;
var questions = []
var hasLogin = false;

function getDayNo() {
    var today = new Date();
    today.setHours(0, 0, 0);
    var airDate = new Date(WHEEL_SETTINGS.Wheel.campaign_start_at);
    airDate.setHours(0, 0, 0);
    var result = Math.floor((today - airDate) / 86400000);
    if (result < 0) {
        result = 0;
    }
    return result;
}

function getQuestionAt(k) {
    var questions = $$woay.client.mission.get('wiki').meta.question;
    var i = k % questions.length;
    return questions[i];
}

function getTodayQuestions(question_per_day) {
    var firstIndex = getDayNo() * question_per_day;
    var arr = [];
    for (var i = 0; i < question_per_day; i++) {
        var k = firstIndex + i;
        arr.push(getQuestionAt(k));
    }
    return arr;
}

/// Render mission
function renderMissions(missions, template_id) {
    var missions = $$woay.client.mission.getAll();
    $('#mission-list').html('');
    var hasMissionActive = false;
    missions.forEach(function (mission) {
        if (mission.active) {
            hasMissionActive = true;
            $('#mission-list').append(tmpl(template_id, mission))
        }
    })
    if (!hasMissionActive) {
        $('.section-mission').css('display', 'none');
    }
}

$$woay.client.eventBus.on('login-done', function () {
    console.log('mission js login-done');
    $$woay.client.mission.waitToReady()
        .then(function () {
            hasLogin = true;
            if (hasLogin) {
                fetchMission()
                if (WHEEL_SETTINGS.Wheel.scheme == 'mixed' || (WHEEL_SETTINGS.Wheel.scheme == 'quick' && WHEEL_SETTINGS.Wheel.game_type == 'flipcard')) {
                    updatePlayerHistory('#history', 'history-tmpl');
                }
                updateMyPoint();
                renderPlayerPoint('#your-point', 'my-score-tmpl');

                $$woay.client.mission.fetch()
                    .then(deactiveDoneMissions)
                    .then(processMissionAutoCompleteMission)
                    .then(processGoldHourMission)
                    .then(function () {
                        var action_qr = '';
                        var secret_qr = '';
                        if ($$woay.client.utils.getParam('action') && $$woay.client.utils.getParam('secret')) {
                            action_qr = $$woay.client.utils.getParam('action');
                            secret_qr = $$woay.client.utils.getParam('secret');
                            processMissionQrCode(secret_qr);
                        }
                    })
                    .then(function () {
                        var question_per_day = $$woay.client.mission.get('wiki').meta.question_per_day; // sửa lại lấy theo format
                        questions = getTodayQuestions(question_per_day);
                        $(document).on('click', '.item-question', function () {
                            checkRightAnswer();
                            setTimeout(function () {
                                current_question++;
                                if (current_question >= question_per_day) {
                                    showResult();
                                } else {
                                    renderQuestion('question-tmpl');
                                }
                            }, 1000)
                        })

                        function renderQuestion(template_id) {
                            var question = questions[current_question]; // today current_question = 3
                            $('#box-question').removeClass('disable');
                            $('#box-question').html(tmpl(template_id, question));
                            $(".title-question").html(question.question);
                        }
                        $(document).on('click', '.btn-show-quiz', function () {
                            if (WHEEL_SETTINGS.Wheel.game_type == 'wheel') {
                                if ($$woay.checkSpinning()) return;
                            } else if (WHEEL_SETTINGS.Wheel.game_type == 'li_xi') {
                                if ($$woay.isPicking()) return;
                            }
                            current_question = 0;
                            renderQuestion('question-tmpl');
                            $$woay.client.html.pushModal('w-quiz');
                        })
                    })
            }
        })
})

function fetchAllMission() {
    $$woay.client.mission.fetchAll()
        .then(function () {
            fetchMission();
            if (!hasLogin) {
                $('.btn-challenge').html('<a class="bg-button-group color-button-group"><img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-1.png"></a>');
                $('.btn-challenge a').on('click', function () {
                    $$woay.client.auth.loginHandler();
                })
            }
        })
}

function fetchMission() {
    var missions = $$woay.client.mission.getAll();
    $('#w-text-share-url').val(getShareLink());
    if (mobileAndTabletCheck()) {
        renderMissions(missions, 'm-mission-tmpl');
    } else {
        renderMissions(missions, 'd-mission-tmpl');
    }
    checkMissionInviteFriend();
}

function deactiveDoneMissions() {
    var missions = $$woay.client.mission.getAll();
    missions.forEach(function (mission) {
        if (!mission.active) return;
        if (mission.isDone) {
            $('.mission-' + mission.name + ' .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-2.png">').addClass('deactive');
            return;
        }
    })
}

function removeHash(str) {
    return str.replace('#', '');
}

function missionComplete(name, new_quantity) {

    if (!$$woay.client.mission.isReady()) return;

    if (name === 'invite_friend') {
        return;
    }
    if (WHEEL_SETTINGS.Wheel.game_type == 'wheel') {
        if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == 'li_xi') {
        if ($$woay.isPicking()) return;
    }

    var player_game_id = $$woay.client.getUserInfo().player_game_id;
    $$woay.client.mission.complete(name, player_game_id, new_quantity)
        .then(function () {
            var mission_name = $$woay.client.mission.get(name).name;
            var quantity = $$woay.client.mission.get(name).quantity;
            var mission_type = $$woay.client.mission.get(name).type;
            var mission_frequency = $$woay.client.mission.get(name).frequency;
            if (!isNaN(new_quantity)) {
                quantity = new_quantity;
            }
            if (name !== 'register' || name !== 'share_facebook') {
                $$woay.client.html.pushModal('w-complete');
                if (mission_type == 'point') {
                    $('#w-complete .title-popup').html('Chúc mừng bạn đã nhận được ' + quantity + ' điểm');
                } else {
                    $('#w-complete .title-popup').html('Chúc mừng bạn đã nhận được ' + quantity + ' lượt');
                }
            }
            if (name === 'share_facebook') {
                // MicroModal.close('w-complete');
                $$woay.client.html.closeModal();
            }
            if (quantity <= 0) {
                $('#w-complete .title-popup').html('Rất tiếc bạn không được cộng lượt');
            }
            if (mission_frequency !== 'unlimited') {
                $('.mission-' + name + ' .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-2.png">').addClass('deactive');
            }
            if (mission_type == 'point') {
                updateMyPoint()
                renderPlayerPoint('#your-point', 'my-score-tmpl');
                return;
            }
            $$woay.client.reward.addTurnForMission(mission_name, quantity);
            $$woay.client.reward.updateTurnCount();
        }).catch(function (err) {
            console.error(err);
        })
}

function checkMissionInviteFriend() {
    if (WHEEL_SETTINGS.Wheel.is_test_mode) {
        $('#w-share .modal__content').css('display', 'none');
        $('#w-share .modal__footer').css('display', 'none');
        $('#w-share .modal__header .title-popup').text('Nhiệm vụ này chỉ thực hiện được khi phát hành chính thức');
    } else {
        $('#w-share .modal__content').css('display', 'block');
        $('#w-share .modal__footer').css('display', 'block');
        $('#w-share .modal__header .title-popup').text('Hãy chia sẻ cùng bạn bè');
    }
}

function processMissionAutoCompleteMission() {
    var AUTO_COMPLETE_MISSIONS = ['login'];
    var player_game_id = $$woay.client.getUserInfo().player_game_id;
    AUTO_COMPLETE_MISSIONS.forEach(function (key) {
        var m = $$woay.client.mission.get(key);
        if (m.active && !m.isDone) {
            // $$woay.client.mission.complete(m.name, player_game_id);
            missionComplete('login');
            $('.mission-' + m.name + ' .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-2.png">').addClass('deactive');
        }
    })
}

function processGoldHourMission() {
    var date = new Date();
    var GOLD_HOUR_START = parseInt($$woay.client.mission.get('gold_hour').meta.from);
    var GOLD_HOUR_END = parseInt($$woay.client.mission.get('gold_hour').meta.to);
    var current_hour = date.getHours();
    var isValid = (GOLD_HOUR_START <= current_hour && current_hour < GOLD_HOUR_END);
    var isDone = $$woay.client.mission.get('gold_hour').isDone;
    if (!isValid && !isDone) {
        $('.mission-gold_hour .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-3.png">').addClass('deactive');
    } else if (isValid && !isDone) {
        $('.mission-gold_hour .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-1.png">').addClass('active');
    } else {
        $('.mission-gold_hour .btn-challenge a').html('<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.5.16/images/button-status-2.png">').addClass('active');
    }
}

$(document).on("click", '.btn-invite-friend', function () {
    if (WHEEL_SETTINGS.Wheel.game_type == 'wheel') {
        if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == 'li_xi') {
        if ($$woay.isPicking()) return;
    }
    $$woay.client.html.pushModal('w-share');
})
$(document).on("click", '.btn-share-fb', function () {
    if (WHEEL_SETTINGS.Wheel.game_type == 'wheel') {
        if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == 'li_xi') {
        if ($$woay.isPicking()) return;
    }
    var url = window.location.href.split('#')[0];
    url = decodeURIComponent(url);
    share(url);
    processShareFbMission();
})

function getShareLink() {
    var user = $$woay.client.getUserInfo();
    var uid = user && user.player_game_id;
    var share_link_url = window.location.href.split('?')[0];
    return share_link_url + (uid ? '?wref=' + uid : '');
}

function getShareUrl(url, quote) {
    var s = 'https://www.facebook.com/sharer/sharer.php?u=';
    var user = $$woay.client.getUserInfo();
    var uid = user && user.player_game_id;
    s += encodeURIComponent(url);
    if (typeof quote === 'string' && quote.trim()) {
        s += '&quote=' + encodeURIComponent(quote);
    }
    return s + (uid ? '?wref=' + uid : '');
}

function share(url) {
    var sharedUrl = getShareUrl(url);
    window.open(sharedUrl, "_blank", "width=700,height=500,left=200,top=100");
}

function processShareFbMission() {
    var shareMission = $$woay.client.mission.get('share_facebook');
    var checkCompleteShare = shareMission && !shareMission.isDone && shareMission.active;
    if (checkCompleteShare) {
        setTimeout(function () {
            missionComplete('share_facebook');
        }, 20000)
    }
}

$(document).on("click", '.my-copy-link-btn', function () {
    $$woay.client.utils.copyToClipboard('#w-text-share-url');
})

$(document).on('click', '.btn-show-qrcode', function () {
    if (WHEEL_SETTINGS.Wheel.game_type == 'wheel') {
        if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == 'li_xi') {
        if ($$woay.isPicking()) return;
    }
    checkQrCode();
})

$(document).on('click', '#w-complete .modal__close', function () {
    // MicroModal.close('w-complete');
    $$woay.client.html.closeModal();
})

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
        console.log('esc click');
        event.stopImmediatePropagation();
    }
});

function checkQrCode() {
    var action_qr = $$woay.client.utils.getParam('action');
    var secret_qr = $$woay.client.utils.getParam('secret');
    if (!action_qr && !secret_qr) {
        $('.text-qrcode').text('Nhiệm vụ quét mã QR CODE chỉ áp dụng khi đến cửa hàng');
    }
    $$woay.client.html.pushModal('w-qrcode');
}


function processMissionQrCode(secret_qr) {
    var secret_key = $$woay.client.mission.get('explore_store').meta.hash;
    var mission_done = $$woay.client.mission.get('explore_store').isDone;
    var passhash = CryptoJS.MD5(secret_qr).toString();
    if (passhash.localeCompare(secret_key) == 0) {
        missionComplete('explore_store');
    } else {
        $('.text-qrcode').text('Mã QR CODE không chính xác');
    }
    if (mission_done) {
        $('.text-qrcode').text('Nhiệm vụ QR CODE đã hoàn thành');
    }
}

function checkRightAnswer() {
    var question = questions[current_question];
    var quantity_per_question = $$woay.client.mission.get('wiki').meta.quantity_per_question;
    var answers = $('input[name="answer"]');
    var answer_val;
    var answer_right = question.rightAnswer;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            answer_val = answers[i].value;
            if (answer_right == answer_val) {
                $(answers[i]).parent('.item-question').addClass('correct');
                $(answers[i]).parent('.item-question').find('.checkmark').css('display', 'block');
                count_right_answer += quantity_per_question;
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
    var quantity = count_right_answer;
    // MicroModal.close('w-quiz');
    $$woay.client.html.closeModal();
    missionComplete('wiki', quantity);
    count_right_answer = 0;
}


var myUserId = null;

function getTopPlayer(id, from, to) {
    var $ = $$woay.$;
    $$woay.client.api.getTopPlayer(from, to)
        .then(function (data) {
            var topPlayers = data.map(function (x, i) {
                x.stt = i + 1;
                x.percent = x.sum / data[0].sum * 100;
                x.point = x.sum;
                x.activeClass = x.user_id == myUserId ? 'active' : '';
                return x;
            })
            var html = tmpl('highscore-tmpl', topPlayers);
            $('.tab-content #' + id).html(html);
        })
}

function renderRankChart() {
    getTopPlayer('thang', false, false);
    var $ = $$woay.$;
    var startDate = new Date(onAirDate);
    var startTime = startDate.getTime();
    var currentDate = new Date();
    for (var i = 1; i < 5; i++) {
        var from = new Date(startTime + (i - 1) * 7 * 86400000);
        var to = new Date(startTime + (i) * 7 * 86400000);
        if (currentDate > from) {
            var html = '<li class="item-button"><a data-target="tuan' + i + '" class="tablinks">Tuần ' + i + '</a></li>'
            var html_tab_content = '<div class="tabcontent" id="tuan' + i + '"></div>'
            $('.wrap-item-button').append(html);
            $('.wrap-bxh').append(html_tab_content);
            getTopPlayer('tuan' + i, from, to);
        }
    }
}


function updatePlayerHistory(table_selector, template_id) {
    var rewards = $$woay.client.reward.getRewardData().rewards;
    $(table_selector).html('');
    if (rewards.length) {
        rewards.forEach(function (reward) {
            if (reward.sku == 'BADLUCK' || reward.item_type == 'point') {
                $(table_selector).append('');
                return;
            }
            reward.updated_at = new Date(reward.updated_at).toLocaleString();
            $(table_selector).append(tmpl(template_id, reward));
        })
    } else {
        $(table_selector).html('<div style="text-align: center; padding: 15px">Bạn chưa có phần thưởng nào</div>');
    }
}

function padLeft(n, len) {
    var s = '' + n;
    while (s.length < len) {
        s = '0' + s;
    }
    return s;
}

function renderPlayerPoint(table_selector, template_id) {
    $$woay.client.api.getHistoryPoint()
        .then(function (data) {
            var points = data;
            $(table_selector).html('');
            if (points.length) {
                points.forEach(function (point) {
                    if (point.type == 'mission') {
                        point.type = 'Nhiệm vụ: ' + $$woay.client.mission.get(point.type_name).title;
                    } else if (point.type == 'reward') {
                        point.type = 'Chơi game được ' + point.type_name;
                    }
                    var d = new Date(point.created_at);
                    var hour = d.toTimeString().split(' ')[0];
                    var date = padLeft(d.getDate(), 2) + '/' + padLeft(d.getMonth() + 1, 2) + '/' + d.getFullYear();
                    point.created_at = date + ' ' + hour;
                    $(table_selector).append(tmpl(template_id, point));
                })
            } else {
                $(table_selector).html('<div style="text-align: center; padding: 15px">Bạn hiện chưa có điểm</div>');
            }
        })
}

function updateMyPoint() {
    $$woay.client.api.getMyRank()
        .then(function (data) {
            $('.total-point').css('opacity', '1');
            $('.your-point').html(data.sum);
        })
}