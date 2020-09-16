if (!randomUser) {
    window.randomUser = {
        enable: false,
        from: 15000,
        to: 30000
    }
}

if (randomUser.enable) {
    var t = getTime();
    setTimeout(makeRandomPlayer, t);
}

function randomInt(N) {
    return ~~(Math.random() * N);
}

function getTime() {
    var t = randomUser.from + randomInt(randomUser.to - randomUser.from);
    return t;
}

function makeRandomPlayer() {
    var name = randomName();
    var email = randomEmail(name);
    //TODO hiện người chơi khi có name và email
    console.log({name: name, email: email})
    var t = getTime();
    setTimeout(makeRandomPlayer, t);
}

function randomName() {
    var names = ['Bảo Vy', 'Cát Tường', 'Gia Hân', 'Hoài An', 'Khả Hân', 'Khánh Ngân', 'Khánh Ngọc', 'Linh Chi', 'Ngọc Khuê', 'Phúc An', 'Thanh Hà', 'Bích Hà', 'Thanh Thúy', 'An Nhiên', 'Bích Thảo', 'Bích Thủy', 'Ðoan Trang', 'Đan Tâm', 'Hiền Nhi', 'Hiền Thục', 'Hương Thảo', 'Minh Tâm', 'Mỹ Tâm', 'Nhã Phương', 'Phương Thùy', 'Phương Trinh', 'Phương Thảo', 'Thanh Mai', 'Thảo Chi', 'Thiên Thanh', 'Thục Quyên', 'Thục Trinh', 'Hương Chi', 'Anh Dũng', 'Anh Minh', 'Anh Tuấn', 'Anh Tú', 'Anh Thái', 'Anh Khoa', 'Bảo Khánh', 'Bảo Khang', 'Bảo Long', 'Chấn Hưng', 'Chấn Phong', 'Chí Kiên', 'Chí Thanh', 'Chiến Thắng', 'Ðăng Khoa', 'Ðức Bình', 'Ðức Tài', 'Ðức Toàn', 'Ðức Thắng', 'Đình Trung', 'Đình Phúc', 'Đông Quân', 'Đức Duy', 'Gia Bảo', 'Gia Huy', 'Gia Hưng', 'Gia Khánh', 'Hải Đăng', 'Hạo Nhiên', 'Hoàng Phi', 'Hùng Cường', 'Huy Hoàng', 'Hữu Đạt', 'Hữu Nghĩa', 'Hữu Phước', 'Hữu Tâm', 'Hữu Thiện', 'Kiến Văn', 'Khôi Nguyên', 'Khôi Vĩ', 'Mạnh Hùng', 'Mạnh Khôi', 'Minh Anh', 'Minh Đức', 'Minh Khang', 'Minh Khôi', 'Minh Nhật', 'Minh Quang', 'Minh Quân', 'Minh Triết', 'Ngọc Minh', 'Nhân Nghĩa', 'Nhân Văn', 'Nhật Minh', 'Phúc Điền', 'Phúc Hưng', 'Phúc Lâm', 'Phúc Thịnh', 'Quang Khải', 'Quang Vinh', 'Quốc Bảo', 'Quốc Trung', 'Sơn Quân', 'Tài Đức', 'Tấn Phát', 'Tấn Phong', 'Toàn Thắng', 'Tuấn Kiệt', 'Tùng Quân', 'Thạch Tùng', 'Thái Dương', 'Thái Sơn', 'Thành Công', 'Thành Đạt', 'Thanh Liêm', 'Thanh Phong', 'Thanh Tùng', 'Thanh Thế', 'Thiên Ân', 'Thiện Ngôn', 'Thiện Nhân', 'Thiện Tâm', 'Thông Đạt', 'Thụ Nhân', 'Trọng Nghĩa', 'Trung Dũng', 'Trung Kiên', 'Trung Nghĩa', 'Trường An', 'Trường Phúc', 'Trường Sơn', 'Uy Vũ', 'Xuân Trường'];
    var fnames = ['Nguyễn', 'Trần', 'Lê', 'Hồ', 'Bùi', 'Lâm', 'Vũ', 'Phan'];
    var index1 = ~~(Math.random() * names.length);
    var index2 = ~~(Math.random() * fnames.length);
    return fnames[index2] + ' ' + names[index1];
}

function randomEmail(name) {
    var parts = nameToParts(name);
    var type = ~~(Math.random() * 3);
    var arr = [];
    if (type == 1) arr = [randomDate()];
    if (type == 2) arr = [~~(Math.random() * 20) + 80 + (Math.random() > 0.5 ? 1900 : 0)];
    var joiner = ['', '.', '_'][~~(Math.random() * 3)];
    return parts.concat(arr).join(joiner) + '@' + randomEmailDomain();
}

function nameToParts(_name) {
    var type = ~~(Math.random() * 3);
    var name = uname(_name).toLowerCase();
    var arr = name.split(' ');

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
    var domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
    var index = ~~(Math.random() * domains.length);
    return domains[index];
}