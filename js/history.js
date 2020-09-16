function getPlayerHistoryHTML(time, name, index) {
    if (moment !== undefined) {
        time = moment(time).format('L LTS');
    }
    return '<li class="play-history-item">' +
        '<div class="stt">' +
        index +
        '</div>' +
        '<div class="history-play">' +
        '<span class="player-name">' + name + '</span>' +
        '</div>' +
        '<div class="date-history">' +
        '<span class="player-point">' + time + '</span>' +
        '</div>' +
        '</li>';
}
function updatePlayerHistory() {
    if (!WHEEL_SETTINGS) {
        return;
    }
    if (!$$woay) {
        return;
    }
    var $ = $$woay.$;
    var rewards = $$woay.showOptions().userAward && $$woay.showOptions().userAward.data.rewards || [];
    $('.play-history').html('')
    if (!rewards.length) {
        $('.play-history-section').css('display', 'none');
        return;
    }
    rewards.forEach(function(reward, index) {
        $('.play-history').append(getPlayerHistoryHTML(reward.updated_at, reward.item_name, index + 1))
    })

}