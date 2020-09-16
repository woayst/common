function getHighScoreTable() {
    return '<div class="highscore-section">' +
                '<h1 class="header-title">Bảng xếp hạng</h1>' +
                '<ul class="highscore">' +
                '</ul>' +
    '</div>' + 
    '<style>body, html { margin: 0; } ul { list-style: none; padding-left: 0; } a { text-decoration: none; } .highscore-section { width: 100%; margin-top: 15px; margin-bottom: 15px; } .header-title { font-size: 30px; color: white; text-align: center; } .highscore { display: flex; flex-direction: column; text-align: left; } .highscore .highscore-item { display: flex; flex-wrap: wrap; align-items: center; background: rgba(255,255,255,0.25); margin-bottom: 5px; color: #fff; min-height: 70px; } .highscore .highscore-item .best-player { flex:1 ; text-align: center; display: block; } .best-player img { max-width: 50px; } .highscore .highscore-item .best-player-name { flex: 3; text-align: left; display: block; } .highscore .highscore-item .best-player-point { flex: 1; text-align: center; display: block; } </style>';
}

function getPlayerHistoryTable() {
    return '<div class="play-history-section">' +
        '<div class="play-history-list">' +
        '<h1 class="play-history-title">Lịch sử chơi</h1>' +
        '<ul class="play-history"></ul>' +
        '</div></div>' + 
        '<style>body, html { margin: 0; } ul { list-style: none; padding-left: 0; } a { text-decoration: none; } .play-history-section { width: 100%; text-align: center; position: relative; } .play-history-section .btn-back { display: block; padding: 10px; position: absolute; top: 20px; left: 0; background: #5c905e; text-transform: uppercase; border: 1px solid #dedede; border-radius: 5px; color: #fff; } .play-history-section .btn-invite-friend { width: 300px; display: block; background: #5c905e; padding: 20px; color: #fff; margin: 0px auto; text-transform: uppercase; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); } .play-history-list { width: 80%; margin: 0 auto; padding: 20px 0px; position: relative; } .play-history-list .invite-friend { display: flex; flex-wrap: wrap; color: #fff; padding: 20px 0px; } .play-history-list .invite-friend .invite-title { width: 50%; font-size: 20px; } .play-history-list .invite-friend .invite-play { width: 50%; font-size: 40px; } .play-history-list .play-more { text-align: right; font-size: 20px; color: #fff; } .play-history-list .play-more span b { color: #e4ce07; } .play-history-list .play-history-title { font-size: 30px; color: #fff; } .play-history-title .play-history { display: flex; flex-direction: column; } .play-history .play-history-item { display: flex; flex-wrap: wrap; justify-self: center; align-items: center; min-height: 70px; color: #fff; border-bottom: 1px solid #dedede; } .play-history .play-history-item .stt { flex: 1 } .play-history .play-history-item .history-play { flex: 2; text-align:left; } .play-history .play-history-item .date-history { flex: 2 } .play-history .play-history-item .cp { width: 25%; } .play-history .play-history-item .cp .btn-use { color: #fff; background: #5c905e; padding: 10px; border-radius: 4px; }</style>';
}

function getMissionTable() {
    return '<div class="mission-section">' +
    '<h1 class="header-title">Nhiệm vụ</h1>' +
    '<ul class="mission">' +
    '</ul>' +
    '</div>' + 
    '<style>body, html { margin: 0; } ul { list-style: none; padding-left: 0; } a { text-decoration: none; } .mission-section { width: 100%; margin-top: 15px; margin-bottom: 15px; } .header-title { font-size: 30px; color: white; text-align: center; } .mission { display: flex; flex-direction: column; text-align: left; } .mission .mission-item-ctn { margin-bottom: 5px; } .mission .mission-item { display: flex; flex-wrap: wrap; align-items: center; background: rgba(255,255,255,0.25); color: #fff; min-height: 70px; } .mission .mission-item .mission-index { flex:1 ; text-align: center; display: block; } .mission-index img { max-width: 50px; } .mission .mission-item .mission-name { flex: 3; text-align: left; display: block; } .mission .mission-item .mission-point { flex: 1; text-align: center; display: block; } </style>';

}