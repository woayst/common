function getMissionHTML(title, type, quantity, isDone, frequency, meta) {
    var check_img = isDone ? 'https://cdn.jsdelivr.net/gh/woayst/common@1.2/images/quest-check.png' : 'https://cdn.jsdelivr.net/gh/woayst/common@1.2/images/quest-uncheck.png'
    var missionHTML = '<li class="mission-item-ctn">' +
        '<div class="mission-item">' +
        '<div class = "mission-index" style="margin-top: 10px; margin-bottom: 10px;">' +
        '<img src="' + check_img + '">' +
        '</div>' +
        '<div class="mission-name">' + title + '</div>' +
        '<div class="mission-point">' + quantity + (type === 'point' ? ' điểm' : ' lượt') +
        '</div></div>';
    if (meta) {
        missionHTML += '<div class="mission-collapse-ctn">' + meta + '</div>';
    }
    missionHTML += '</li>';
    return missionHTML;
}

function getMission() {
    if (!WHEEL_SETTINGS) {
        return;
    }
    if (!$$woay) {
        return;
    }
    var css = '<style>' +
        '.mission-collapse-ctn {' +
        'background: rgba(255,255,255,0.9);' +
        'width: 100%;' +
        'max-height: 0;' +
        'overflow: hidden;' +
        'position: relative;' +
        'transition: max-height 0.2s ease-out;' +
        '}' +
        '.mission-collapse-ctn.active {' +
        'max-height: none;' +
        'padding: 10px;' +
        '}' +
        '.mission-item {' +
        'cursor: pointer;' +
        '}' +
        '</style>';
    var BASE_URL = WHEEL_SETTINGS.Wheel.SERVER_URL;
    var WHEEL_ID = WHEEL_SETTINGS.Wheel.id;
    var endpoint = BASE_URL + '/api.wheel/' + WHEEL_ID + '/mission-data';
    var $ = $$woay.$;
    $$woay.http.get(endpoint)
        .then(function (resp) {
            if (resp && resp.data && resp.data.missions) {
                $('.mission').html('');
                var hasMissionActive = false;
                resp.data.missions.forEach(function (mission, index) {
                    if (mission.active) {
                        hasMissionActive = true;
                        mission.isDone = false;
                        $('.mission').append(getMissionHTML(mission.title, mission.type, mission.quantity, mission.isDone, mission.frequency, mission.meta));
                    }
                })
                if (!hasMissionActive) {
                    $('.mission-section').css('display', 'none');
                }
            }
        })
    $('.mission').after(css);

    $(document).on('click', '.mission-item', function () {
        $(this).siblings('.mission-collapse-ctn').toggleClass('active');
    })
}
/// Render mission
function renderMissions(missions, template_id) {
    console.log('missions', missions, 'template_id', template_id);
    var $ = Woay.$;
    $('#mission-list').html('');
    var hasMissionActive = false;
    for (var mission in missions) {
        if (mission.active) {
            hasMissionActive = true;
            mission.isDone = false;
            $('#mission-list').append(tmpl(template_id, mission))
        }
    }
}