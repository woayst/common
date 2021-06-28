function getTopPlayerHTML(rank, name, point) {
    var image = '';
    switch (rank) {
        case 1:
            image = 'trophy';
            break;
        case 2:
        case 3:
            image = 'stars-burst';
            break;
        default:
            image = 'little-stars';
    }

    return '<li class="highscore-item">' +
        '<div class = "best-player">' +
        '<img src="https://cdn.jsdelivr.net/gh/woayst/common@1.2/images/' + image + '.png"></div>' +
        '<div class="best-player-name">' +
        '<span class="player-name" title="' + name + '">' + name + '</span></div>' +
        '<div class="best-player-point">' +
        '<span class="player-point">' + point + ' điểm</span>' +
        '</div>' +
        '</li>';
}

function getTopPlayer() {
    if (!WHEEL_SETTINGS) {
        return;
    }
    var BASE_URL = WHEEL_SETTINGS.Wheel.SERVER_URL;
    var game_id = WHEEL_SETTINGS.Wheel.id;

    var endpoint = BASE_URL + '/api.point/top10/' + game_id;
    if (!$$woay) {
        return;
    }
    var $ = $$woay.$;
    $$woay.http.get(endpoint)
        .then(function(resp) {
            var topPlayers = resp.data;
            if (topPlayers.length) {
                $('.highscore').html('');
                topPlayers.forEach(function(player, index) {
                    $('.highscore').append(getTopPlayerHTML(index + 1, player.name, (player.sum || 0)))
                })
            } else {
                $('.highscore').append('<div style="color: white; text-align:center: font-size: 16px">Chưa có người chơi nào</div>');
            }
        })

}