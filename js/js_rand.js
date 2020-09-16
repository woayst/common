function randomItem(rewards) {
    let name = randomName();
    let reward = false;
    if (rewards.length) {
        reward = randomReward(rewards);
    }
    return {
        name: name,
        email: randomEmail(name),
        phone: randomPhoneNumber(),
        reward: reward
    };
}

function randomName() {
    let names = ['Bảo Vy', 'Cát Tường', 'Gia Hân', 'Hoài An', 'Khả Hân', 'Khánh Ngân', 'Khánh Ngọc', 'Linh Chi', 'Ngọc Khuê', 'Phúc An', 'Thanh Hà', 'Bích Hà', 'Thanh Thúy', 'An Nhiên', 'Bích Thảo', 'Bích Thủy', 'Ðoan Trang', 'Đan Tâm', 'Hiền Nhi', 'Hiền Thục', 'Hương Thảo', 'Minh Tâm', 'Mỹ Tâm', 'Nhã Phương', 'Phương Thùy', 'Phương Trinh', 'Phương Thảo', 'Thanh Mai', 'Thảo Chi', 'Thiên Thanh', 'Thục Quyên', 'Thục Trinh', 'Hương Chi', 'Anh Dũng', 'Anh Minh', 'Anh Tuấn', 'Anh Tú', 'Anh Thái', 'Anh Khoa', 'Bảo Khánh', 'Bảo Khang', 'Bảo Long', 'Chấn Hưng', 'Chấn Phong', 'Chí Kiên', 'Chí Thanh', 'Chiến Thắng', 'Ðăng Khoa', 'Ðức Bình', 'Ðức Tài', 'Ðức Toàn', 'Ðức Thắng', 'Đình Trung', 'Đình Phúc', 'Đông Quân', 'Đức Duy', 'Gia Bảo', 'Gia Huy', 'Gia Hưng', 'Gia Khánh', 'Hải Đăng', 'Hạo Nhiên', 'Hoàng Phi', 'Hùng Cường', 'Huy Hoàng', 'Hữu Đạt', 'Hữu Nghĩa', 'Hữu Phước', 'Hữu Tâm', 'Hữu Thiện', 'Kiến Văn', 'Khôi Nguyên', 'Khôi Vĩ', 'Mạnh Hùng', 'Mạnh Khôi', 'Minh Anh', 'Minh Đức', 'Minh Khang', 'Minh Khôi', 'Minh Nhật', 'Minh Quang', 'Minh Quân', 'Minh Triết', 'Ngọc Minh', 'Nhân Nghĩa', 'Nhân Văn', 'Nhật Minh', 'Phúc Điền', 'Phúc Hưng', 'Phúc Lâm', 'Phúc Thịnh', 'Quang Khải', 'Quang Vinh', 'Quốc Bảo', 'Quốc Trung', 'Sơn Quân', 'Tài Đức', 'Tấn Phát', 'Tấn Phong', 'Toàn Thắng', 'Tuấn Kiệt', 'Tùng Quân', 'Thạch Tùng', 'Thái Dương', 'Thái Sơn', 'Thành Công', 'Thành Đạt', 'Thanh Liêm', 'Thanh Phong', 'Thanh Tùng', 'Thanh Thế', 'Thiên Ân', 'Thiện Ngôn', 'Thiện Nhân', 'Thiện Tâm', 'Thông Đạt', 'Thụ Nhân', 'Trọng Nghĩa', 'Trung Dũng', 'Trung Kiên', 'Trung Nghĩa', 'Trường An', 'Trường Phúc', 'Trường Sơn', 'Uy Vũ', 'Xuân Trường'];
    var fnames = ['Nguyễn', 'Trần', 'Lê', 'Hồ', 'Bùi', 'Lâm', 'Vũ', 'Phan'];
    let index1 = ~~(Math.random() * names.length);
    let index2 = ~~(Math.random() * fnames.length);
    return fnames[index2] + ' ' + names[index1];
}

function randomEmail(name) {
    let parts = nameToParts(name);
    let type = ~~(Math.random() * 3);
    let arr = [];
    if (type == 1) arr = [randomDate()];
    if (type == 2) arr = [~~(Math.random() * 20) + 80 + (Math.random() > 0.5 ? 1900 : 0)];
    let joiner = ['', '.', '_'][~~(Math.random() * 3)];
    return parts.concat(arr).join(joiner).slice(0, -5) + '*****@' + randomEmailDomain();
}

function randomPhoneNumber() {
    let headNumbers = ['3','5','7','8','9'];
    let headIndex = ~~(Math.random() * headNumbers.length);
    let tailNumber = pad(~~(Math.random()*10000), 5);
    return '0' + headNumbers[headIndex] + tailNumber + '***';
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function randomReward(rewards) {
    let rewardIndex = ~~(Math.random()*rewards.length);
    return rewards[rewardIndex];
}
function nameToParts(_name) {
    let type = ~~(Math.random() * 3);
    let name = uname(_name).toLowerCase();
    let arr = name.split(' ');

    switch (type) {
        case 0:
            return [arr.pop(), arr[0]];
        case 1:
            return arr;
        case 2:
            arr.shift();
            return arr;
    }
}

function uname(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function randomDate() {
    return (~~(Math.random() * 28) + 1) + '' + (~~(Math.random() * 12) + 1);
}

function randomEmailDomain() {
    let domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
    let index = ~~(Math.random() * domains.length);
    return domains[index];
}

// toastr.options = {
//     timeOut: 0,
//     extendedTimeOut: 100,
//     tapToDismiss: true,
//     debug: false,
//     fadeOut: 5,
//     positionClass: "toast-bottom-right"
// }

function recentPlayer(option) {
    option = option ? option : {};
    let {rewards} = option;
    rewards = (rewards && rewards.length) ? rewards : (WHEEL_SETTINGS && WHEEL_SETTINGS.rewards && WHEEL_SETTINGS.rewards.length ? WHEEL_SETTINGS.rewards : []);
    item = randomItem(rewards);
    var noti = `${option.name !== false ? item.name : ''} ${option.email !== false ? item.email : ''} ${option.phone !== false ? item.phone : ''} vừa trúng ${item.reward ? '<strong>' + item.reward.name +'</strong>' : 'thưởng'}`;
    if (!$('.custom-social-proof').length) {
        $('body').append(getWinNotiHTML());
    }
    $('.custom-notification-content').html(noti);
    $(".custom-social-proof").stop().slideToggle('slow');
    let loopTime = option.loop_time ? option.loop_time : 5;
    let sec = loopTime + ~~(Math.random() * 3);
    console.log('1');
    setTimeout(function() {
        console.log('2');
        recentPlayer(option);
    }, sec * 1000);
}

function getWinNotiHTML() {
    return `
    <section class="custom-social-proof">
        <div class="custom-notification">
        <div class="custom-notification-container">
            <div class="custom-notification-content-wrapper">
            <p class="custom-notification-content">
            </p>
            </div>
        </div>
        <div class="custom-close"></div>
        </div>
    </section>
    <style>
    .custom-social-proof {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999999999999 !important;
        font-family: 'Open Sans', sans-serif;
    }
    .custom-notification {
        width: 320px;
        border: 0;
        text-align: left;
        z-index: 99999;
        box-sizing: border-box;
        font-weight: 400;
        border-radius: 6px;
        box-shadow: 2px 2px 10px 2px hsla(0, 4%, 4%, 0.2);
        background-color: #fff;
        position: relative;
        cursor: pointer;
    }
    .custom-notification-container {
        display: flex !important;
        align-items: center;
        height: 80px;
    }
    .custom-notification-image-wrapper img{
        max-height: 75px;
        width: 90px;
        overflow: hidden;
        border-radius: 6px 0 0 6px;
        object-fit: cover;
    }
    .custom-notification-content-wrapper {
        margin: 0;
        height: 100%;
        color: gray;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 0 6px 6px 0;
        flex: 1;
        display: flex !important;
        flex-direction: column;
        justify-content: center;
    }
    .custom-notification-content {
        font-family: inherit !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 14px;
        line-height: 16px;
    }
    .custom-notification-content small {
        margin-top: 3px !important;
        display: block !important;
        font-size: 12px !important;
        opacity: .8;
    }
    .custom-close {
        position: absolute;
        top: 8px;
        right: 8px;
        height: 12px;
        width: 12px;
        cursor: pointer;
        transition: .2s ease-in-out;
        transform: rotate(45deg);
    }
    .custom-close::before {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: gray;
        position: absolute;
        left: 0;
        top: 5px;
    }
    .custom-close::after {
        content: "";
        display: block;
        height: 100%;
        width: 2px;
        background-color: gray;
        position: absolute;
        left: 5px;
        top: 0;
    }
    </style>
    <script>
    $(".custom-close").click(function() {
        $(".custom-social-proof").stop().slideToggle('slow');
    });
    </script>
    `
}