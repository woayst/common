var RANDOM_USER = randomUser ? randomUser : {
    enable: true,
    from: 5000,
    to: 10000,
};
var id_tab = document.getElementById("wTab");
var btns = id_tab.getElementsByClassName("nav-item");
for (var i = 0; i < btns.length; i++) {
btns[i].addEventListener("click", function() {
var current = id_tab.getElementsByClassName("active");
current[0].className = current[0].className.replace(" active", "");
this.className += " active";
});
}

function openTab(tabName) {
var i;
var x = document.getElementsByClassName("tab-pane");
for (i = 0; i < x.length; i++) {
x[i].style.display = "none";  
}
document.getElementById(tabName).style.display = "block";  
}

var boxNoti = document.getElementById('box_noti_fixed');
var boxItem = document.getElementById('noti_reward_fixed');

document.querySelector('.close-noti').addEventListener("click", function() {
boxNoti.classList.add('hidden');
})

function removeClassItem() {
boxItem.classList.remove('active');
boxItem.classList.remove('item-1');
boxItem.classList.remove('item-2');
boxItem.classList.remove('item-3');
boxItem.classList.remove('text-1');
boxItem.classList.remove('text-2');
}

function addItemNoti(name, time, award) {
boxNoti.classList.add('show');
removeClassItem();
document.querySelector('.box-noti-fixed .close-noti').classList.add('active');

// Make a new div
elChild = document.createElement('div');
elChild.classList.add('item');
elChild.classList.add('active');
elChild.innerHTML =
    '  <div class="content">' +
    '    <div class="circle"><span class="animated infinite zoomIn"></span></div>' +
    '    <div class="info-noti">' +
    '    <div class="name"><b>' + name + '</b> - <span class="time">' + time + '</span></div>' +
    '    <div class="desc">đã trúng<b> ' + award + '</b></div>' +
    '   </div>' +
    ' </div>';
boxItem.insertBefore(elChild, boxItem.firstChild);

if(boxItem.children.length > 1) {
    boxItem.childNodes[1].classList.add('item-2');
    boxItem.childNodes[1].classList.remove('active');
            var num_desc_2 = boxItem.querySelector('.item:nth-child(2) .desc').textContent.length;
}
if(boxItem.children.length > 2) {
    boxItem.childNodes[2].classList.add('item-3');
    boxItem.childNodes[2].classList.remove('item-2');
    boxItem.childNodes[2].classList.remove('text-1');
}
if(boxItem.children.length > 3) {
    boxItem.childNodes[3].remove();
}

var num_desc = boxItem.querySelector('.item:first-child .desc').textContent.length;
if(num_desc <= 33 && document.body.clientWidth > 991) {
    boxItem.querySelector('.active').classList.add('text-1');
    document.querySelector('.box-noti-fixed .close-noti').classList.add('text-1');
} else {
    document.querySelector('.box-noti-fixed .close-noti').classList.remove('text-1');
}
if(num_desc_2 > 31) {
    boxItem.childNodes[1].classList.remove('text-1');
}
}


function randomItem() {
let name = randomName();
return {
    name: name,
    email: randomEmail(name),
    reward: randomReward()
};
}

function randomReward() {
var rewards = WHEEL_SETTINGS.rewards.filter(function(x) { return x.sku != 'BADLUCK' });
var len = rewards.length;
var index = ~~(Math.random() * len);
return rewards[index].name;
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
return parts.concat(arr).join(joiner) + '@' + randomEmailDomain();
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

if (RANDOM_USER.enable) {
var t = getTime();
setTimeout(recentPlayer, t);
}

function randomInt(N) {
return ~~(Math.random() * N);
}

function getTime() {
var t = RANDOM_USER.from + randomInt(RANDOM_USER.to - RANDOM_USER.from);
return t;
}

function recentPlayer() {
item = randomItem();
    addItemNoti(item.name, 'vài giây trước', item.reward);

    var t = getTime();
setTimeout(recentPlayer, t);
}