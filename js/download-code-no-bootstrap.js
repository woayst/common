var __download__code__ = {
    titleTop: 40,
    codeTop: 55
}

function setupDownloadCode(url, options) {
    if (options && options.titleTop) {
        __download__code__.titleTop = options.titleTop;
    }
    if (options && options.codeTop) {
        __download__code__.codeTop = options.codeTop;
    }

    var img = document.createElement('img');
    img.id = 'woay-code-bg';
    img.src = url;
    img.style.display = 'none';
    img.crossOrigin = 'Anonymous';

    // $('body').append('<img id="woay-code-bg" src="' + url + '" style="display:none" crossorigin="anonymous"/>');
    
    var modal = document.createElement('div');
    modal.classList.add('woay-modal', 'micromodal-slide');
    modal.id = 'w-modal-canvas-code';
    modal.innerHTML = '<div class="modal__overlay" tabindex="-1" data-micromodal-close>' +
        '<div class="modal__container">' +
        '<div class="modal__content" style="background-color: white;>' +
        '<button type="button" class="close" aria-label="Close" data-dismiss="modal"  style="position: absolute;right: 10px;top: 5px;"><span aria-hidden="true">&times;</span></button>' +
        '<canvas id="woay-download-code" style="max-width: 100%;max-height: 80%;" crossorigin="anonymous"></canvas>' +
        '<div style="padding:5px;"><p>Bạn đang sử dụng <b>iPhone</b>. Vui lòng chụp màn hình trúng thưởng lại</p>' +
        '</div></div></div>';

    document.body.appendChild(img);
    document.body.appendChild(modal);
    // $('body').append(
    //     '<div class="woay-modal micromodal-slide" id="w-modal-canvas-code" role="dialog">' +
    //     '<div class="modal__overlay" tabindex="-1" data-micromodal-close>' +
    //     '<div class="modal__container">' +
    //     '<div class="modal__content" style="background-color: white;>' +
    //     '<button type="button" class="close" aria-label="Close" data-dismiss="modal"  style="position: absolute;right: 10px;top: 5px;"><span aria-hidden="true">&times;</span></button>' +
    //     '<canvas id="woay-download-code" style="max-width: 100%;max-height: 80%;"></canvas>' +
    //     '<div style="padding:5px;"><p>Bạn đang sử dụng <b>iPhone</b>. Vui lòng chụp màn hình trúng thưởng lại</p>' +
    //     '</div></div></div></div>'
    // );
}

function downloadCode(targetId, title, code) {
    if (!targetId) {
        return console.log('TargetId downloadCode undefined');
    }
    title = title ? title : '';
    code = code ? code : '';
    var c = document.getElementById("woay-download-code");
    var ctx = c.getContext("2d");
    var img = document.getElementById("woay-code-bg");
    c.width = img.width;
    c.height = img.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.drawImage(img, 0, 0);

    ctx.textAlign = "center";

    var fontSize = 60;
    ctx.fillStyle = '#b6004d';
    while (fontSize > 8) {
        ctx.font = 'bold ' + fontSize + "px HelveticaNeue";
        var textLength = ctx.measureText(title).width;
        if (textLength < c.width * 0.90) {
            break;
        } else {
            fontSize -= 2;
        }
    }
    
    ctx.fillText(title, c.width/2, __download__code__.titleTop / 100* c.height);

    ctx.font = "bold 60px HelveticaNeue";
    ctx.fillStyle = 'black';
    ctx.fillText(code, c.width/2, __download__code__.codeTop / 100 * c.height);

    var ua = navigator.userAgent.toLowerCase();
    var btn_download = document.getElementById(targetId);

    if (ua.indexOf('iphone') > -1) {
        btn_download.addEventListener('click', function(e) {
            e.preventDefault();
            if (MicroModal) {
                MicroModal.show('w-modal-canvas-code');
            }
        })
        // $('#' + targetId);
        // .off('click')
        // .click(function(e) {
        //     e.preventDefault();
        //     MicroModal.show('w-modal-canvas-code')
        // });
        return;
    }

    var dataURL = c.toDataURL();
    c.toBlob(function(blob) {
        btn_download.addEventListener('click', function(e) {
            e.preventDefault();
            saveAs(blob, "ma-trung-thuong.png");
        })

        // $('#' + targetId)
        // .off('click')
        // .click(function(e) {
        //     e.preventDefault();
        //     saveAs(blob, "ma-trung-thuong.png");
        // });
    });    
}
