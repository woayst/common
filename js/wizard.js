$ = jQuery;
function render() {
    var ids = [];
    if (!$('.w-game').length) {
        return;
    }
    $('.w-game').each(function() {
        var id = $(this).data('id');
        ids.push(id);
    });
    if (!base_url) {
        base_url = 'https://woay.online';
    }
    $.ajax({
        url: base_url + '/api.wheel?perpage=1000000&ids=' + ids.join(','), 
        success: function(resp) {
            var games = resp.data;
            for (let game of games) {
                renderGame(game.id, game);
            }
        },
        method: 'GET',
        headers: {
            Authorization: "Bearer " + w_jwt,
        }
    })
    console.log
}
function renderGame(id, game) {
    var selector = '#w-' + id;
    var $elem = $(selector);
    // var template = $('#tpl-game').html();
    var html = tmpl(card_tmpl, game);
    $elem.replaceWith(
        `<div id="w-${id}" class="col-12 col-sm-4">
            ${html}
        </div>`
    )
}

function gameSelect(id) {
    customEvent('gameSelect', {
        id: id
    })
}

function customEvent(eventName, payload) {
    if (window.CustomEvent && typeof window.CustomEvent === 'function') {
        var event = new CustomEvent(eventName, {detail: payload} );
      } else {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, payload);
      }
      document.dispatchEvent(event);
}


render();