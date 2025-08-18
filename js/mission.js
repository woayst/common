var missionTemplate = {
  "highscore-tmpl":
    "<div class='w-box-rank'>\n    <ul class='bg-white'>\n            {% if (!o || !o.length) { %}\n            <div style='text-align: center; padding: 15px'>Hiện chưa có dữ liệu</div>\n        {% } %}\n        {% for (var i = 0; i < o.length; i++) { %}\n            <li class='w-rank-item {%= o[i].activeClass %}' >\n                <div class='item-index'>{%= o[i].stt %}</div>\n                <div class='item-name'>{%= o[i].name %}</div>\n                <div class='item-point'>{%= o[i].point %}</div>\n            </li>\n        {% } %}\n    </ul>\n</div>",
  "history-tmpl":
    "<li class='w-item-reward'>\n    <div class='box-icon'>\n        <img src='https://working.woay.vn/assets/mission/game-icon1.png' alt='Hình phần thưởng'>\n    </div>\n    <div class='d-flex align-center justify-center flex-col pl-2'>\n        <div class='item-name'>{%= o.item_name %}</div>\n    <div class='item-time'>{%= o.updated_at %}</div>\n    </div>\n    <div class='sku'>\n    <a>{%= o.code %}</a>\n    </div>\n</li>",
  "mission-tmpl":
    "<li class='mission-{%= o.name %} m-challenge'>\n  <div class='w-flex-box'>\n    <div class='w-box-img'>\n      <img src='{%= o.image %}' alt=''>\n    </div>\n    <div class=\"w-box-info\">\n      <div class='box-info'>\n        <h5>{%= o.title %}</h5>\n      </div>\n      <div class='meta'>\n        {%= o.map_quantity %}\n      </div>\n    </div>\n    <div class='w-box-right'>\n      <div class=\"w-flex-box\">\n        <div class=\"w-mission-frequency\">\n          {%= o.map_frequency %}\n        </div>\n        {% if (SETTINGS.settings.icon_mission_detail != \"\") { %}\n        <div class=\"w-mission-des\">\n          <img src=\"{%= SETTINGS.settings.icon_mission_detail %}\" alt=\"\">\n        </div>\n        {% } %}\n      </div>\n      <div class='btn-challenge'>\n        {% if (o.name === 'share_facebook') { %}\n        <a class='btn-share-fb'>\n          Làm nhiệm vụ\n        </a>\n        {% } else if (o.name === 'invite_friend') { %}\n        <a class='btn-invite-friend'>\n          Làm nhiệm vụ\n        </a>\n        {% } else if (o.name === 'wiki') { %}\n        <a class='btn-show-quiz'>\n          Làm nhiệm vụ\n        </a>\n        {% } else if (o.name === 'explore_store') { %}\n        <a class='btn-show-qrcode'>\n          Làm nhiệm vụ\n        </a>\n        {% } else { %}\n        <a onclick='$mission.missionComplete(\"{%= o.name %}\")'>\n          Làm nhiệm vụ\n        </a>\n        {% } %}\n      </div>\n    </div>\n  </div>\n</li>",
  "my-score-tmpl":
    '<li class="w-item-score">\n  <div class="d-flex align-center justify-center flex-col">\n    <div class="item-point">{%= o.value %} điểm</div>\n    <div class="item-time">{%= o.created_at %}</div>\n  </div>\n  <div class="item-type">{%= o.type %}</div>\n</li>\n',
  "question-tmpl":
    "<div class='w-list-question'>\n  {% for (var i = 0; i < o.answer.length; i++) { %}\n  <div class='w-item-question'>\n    {%= o.answer[i] %}\n    <input type='radio' name='answer' value='{%= i %}'>\n    <span class='checkmark'><img src='<%= settings.mission_img_check %>' alt=''></<span>\n  </div>\n  {% } %}\n  {% if (!o.answer.length) { %}\n  <div class='w-item-question' style='display: none'></div>\n  {% } %}\n</div>",
};

(function (g) {
  var enableMission = false;
  var wref = "";
  var $ = $$woay.$;
  var eventBus = $$woay.eventBus;
  var utils = $$core.client.utils;
  var mission = $$core.client.mission;
  var html = $$core.client.html;
  var auth = $$core.client.auth;
  var reward = $$core.client.reward;
  var current_question = 0;
  var count_right_answer = 0;
  var questions = [];
  var hasLogin = false;
  var myUserId = null;
  var output = {};

  var checkMultipleClick = false;

  output.getDayNo = function getDayNo() {
    var today = new Date();
    today.setHours(0, 0, 0);
    var airDate = new Date(WHEEL_SETTINGS.Wheel.campaign_start_at);
    airDate.setHours(0, 0, 0);
    var result = Math.floor((today - airDate) / 86400000);
    if (result < 0) {
      result = 0;
    }
    return result;
  };

  output.getQuestionAt = function getQuestionAt(k) {
    var questions = mission.get("wiki").meta.question;
    var i = k % questions.length;
    return questions[i];
  };

  output.getTodayQuestions = function getTodayQuestions(question_per_day) {
    var firstIndex = output.getDayNo() * question_per_day;
    var arr = [];
    for (var i = 0; i < question_per_day; i++) {
      var k = firstIndex + i;
      arr.push(output.getQuestionAt(k));
    }
    return arr;
  };
  /// Render mission
  output.renderMissions = function renderMissions(missions, template_id) {
    var template = missionTemplate[template_id];

    var missions = mission.getAll();
    $("#w-mission-list").html("");
    var hasMissionActive = false;
    missions.forEach(function (mission) {
      if (mission.active) {
        hasMissionActive = true;
        $("#w-mission-list").append(tmpl(template, mission));
      }
    });
    if (!hasMissionActive) {
      $(".section-mission").css("display", "none");
    }
  };
  output.zeropad = function zeropad(num, length) {
    var num_str = String(num);
    while (num_str.length < length) {
      num_str = "0" + num_str;
    }
    return num_str;
  };
  eventBus.on("login-done", function () {
    console.log("mission js login-done");
    mission.waitToReady().then(function () {
      hasLogin = true;
      if (hasLogin) {
        output.fetchMission();
        if (
          WHEEL_SETTINGS.Wheel.scheme == "mixed" ||
          (WHEEL_SETTINGS.Wheel.scheme == "quick" &&
            WHEEL_SETTINGS.Wheel.game_type == "flipcard")
        ) {
          output.updatePlayerHistory("#history", "history-tmpl");
        }
        output.updateMyPoint();
        output.renderPlayerPoint("#w-your-point", "my-score-tmpl");
        mission
          .fetch()
          .then(output.deactiveDoneMissions)
          .then(output.processMissionAutoCompleteMission)
          .then(output.processGoldHourMission)
          .then(function () {
            var action_qr = "";
            var secret_qr = "";
            if (utils.getParam("action") && utils.getParam("secret")) {
              action_qr = utils.getParam("action");
              secret_qr = utils.getParam("secret");
              output.processMissionQrCode(secret_qr);
            }
          })
          .then(function () {
            var question_per_day = mission.get("wiki").meta.question_per_day; // sửa lại lấy theo format
            questions = output.getTodayQuestions(question_per_day);
            $(document).on("click", ".w-item-question", function () {
              if (checkMultipleClick) return;
              checkMultipleClick = true;
              output.checkRightAnswer();
              setTimeout(function () {
                current_question++;
                if (current_question >= question_per_day) {
                  output.showResult();
                } else {
                  output.renderQuestion("question-tmpl");
                }
                checkMultipleClick = false;
              }, 1000);
            });

            output.renderQuestion = function renderQuestion(template_id) {
              var template = missionTemplate[template_id];
              var question_per_day = mission.get("wiki").meta.question_per_day; // sửa lại lấy theo format
              var questions = output.getTodayQuestions(question_per_day);
              var question = questions[current_question]; // today current_question = 3
              var questionTime = 10;
              $("#w-box-question").removeClass("disable");
              $("#w-box-question").html(tmpl(template, question));
              $(".w-title-question").html(question.question);
              output.countDownQuestionTime(questionTime);
            };
            $(document).on("click", ".btn-show-quiz", function () {
              if (WHEEL_SETTINGS.Wheel.game_type == "wheel") {
                if ($$woay.checkSpinning()) return;
              } else if (WHEEL_SETTINGS.Wheel.game_type == "li_xi") {
                if ($$woay.isPicking()) return;
              }
              current_question = 0;
              output.renderQuestion("question-tmpl");
              html.pushModal("w-quiz");
            });
          });
      }
    });
  });

  output.countDownQuestionTime = function countDownQuestionTime(question_time) {
    var inter = setInterval(function () {
      question_time--;
      $(".w-progress__number").html(question_time);
      if (question_time <= 0) {
        clearInterval(inter);
      }
    }, 1000);
  };

  output.fetchAllMission = function fetchAllMission() {
    console.log("mission", mission);
    console.log('SETTINGS', SETTINGS);
    mission.fetchAll().then(function () {
      output.fetchMission();
      if (!hasLogin) {
        $(".btn-challenge").html("<a>Làm nhiệm vụ</a>");
        $(".btn-challenge a").on("click", function () {
          auth.loginHandler();
        });
      }
    });
  };

  output.fetchMission = function fetchMission() {
    var missions = mission.getAll();
    console.log("missions", missions);
    output.mapMissions(missions);
    $("#w-text-share-url").val(output.getShareLink());
    output.renderMissions(missions, "mission-tmpl");
    output.checkMissionInviteFriend();
  };

  output.mapMissions = function mapMissions(missions) {
    missions.forEach((m) => {
      m.map_frequency = output.getFrequencyMission(m);
      m.map_quantity = `${output.zeropad(m.quantity, 2)} ${
        m.type === "turn" ? " lượt chơi" : " điểm"
      }`;
    });
  };

  output.getFrequencyMission = function getFrequencyMission(mission) {
    switch (mission.frequency) {
      case "once":
        return `${output.zeropad(mission.limit, 2)} lần duy nhất`;
      case "daily":
        return `${output.zeropad(mission.limit, 2)} lần / ngày`;
      case "weekly":
        return `${output.zeropad(mission.limit, 2)} lần / tuần`;
      case "monthly":
        return `${output.zeropad(mission.limit, 2)} lần / tháng`;
      default:
        return "Không giới hạn";
    }
  };

  output.deactiveDoneMissions = function deactiveDoneMissions() {
    var missions = mission.getAll();
    missions.forEach(function (mission) {
      if (!mission.active) return;
      if (mission.isDone) {
        $(".mission-" + mission.name + " .btn-challenge a")
          .html(
            "<img src='https://app.woay.vn/lib/game_assets/images/icons/icon-checked.png' alt=''>" +
              "<span>Hoàn thành</span>"
          )
          .addClass("completed");
        return;
      }
    });
  };

  output.removeHash = function removeHash(str) {
    return str.replace("#", "");
  };

  output.missionComplete = function missionComplete(name, new_quantity) {
    if (!mission.isReady()) return;
    if (name === "invite_friend") {
      return;
    }
    if (WHEEL_SETTINGS.Wheel.game_type == "wheel") {
      if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == "li_xi") {
      if ($$woay.isPicking()) return;
    }
    var player_game_id = $$core.client.getUserInfo().player_game_id;
    mission
      .complete(name, player_game_id, new_quantity)
      .then(async function () {
        var mission_name = mission.get(name).name;
        var quantity = mission.get(name).quantity;
        var mission_type = mission.get(name).type;
        var mission_frequency = mission.get(name).frequency;
        if (!isNaN(new_quantity)) {
          quantity = new_quantity;
        }

        if (name !== "register" || name !== "share_facebook") {
          html.pushModal("w-complete");
          if (mission_type == "point") {
            $("#w-complete .title-popup").html(
              "Chúc mừng bạn đã nhận được " + quantity + " điểm"
            );
          } else {
            $("#w-complete .title-popup").html(
              "Chúc mừng bạn đã nhận được " + quantity + " lượt"
            );
          }
          if (mission_name === "wiki") {
            $("#w-complete .title-popup").append(
              '<div class="quiz-quantity">Bạn đã hoàn thành ' +
                count_right_answer +
                "/" +
                questions.length +
                "</div>"
            );
          }
        }
        if (name === "explore_store") {
          // MicroModal.close('w-complete');
          html.closeModal();
        }
        if (name === "share_facebook") {
          // MicroModal.close('w-complete');
          html.closeModal();
        }
        if (quantity <= 0) {
          $("#w-complete .title-popup").html(
            "Rất tiếc bạn không được cộng lượt"
          );
        }

        var missionData = await mission.fetch();

        if (mission_frequency !== "unlimited" && missionData[name].isDone) {
          $(".mission-" + name + " .btn-challenge a")
            .html(
              "<img src='https://app.woay.vn/lib/game_assets/images/icons/icon-checked.png' alt=''>" +
                "<span>Hoàn thành</span>"
            )
            .addClass("completed");
        }
        if (mission_type == "point") {
          output.updateMyPoint();
          output.renderPlayerPoint("#w-your-point", "my-score-tmpl");
          return;
        }
        reward.addTurnForMission(mission_name, quantity);
        reward.updateTurnCount();
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  output.checkMissionInviteFriend = function checkMissionInviteFriend() {
    if (WHEEL_SETTINGS.Wheel.is_test_mode) {
      $("#w-share .modal__content").css("display", "none");
      $("#w-share .modal__footer").css("display", "none");
      $("#w-share .modal__header .title-popup").text(
        "Nhiệm vụ này chỉ thực hiện được khi phát hành chính thức"
      );
    } else {
      $("#w-share .modal__content").css("display", "block");
      $("#w-share .modal__footer").css("display", "block");
      $("#w-share .modal__header .title-popup").text("Hãy chia sẻ cùng bạn bè");
    }
  };

  output.processMissionAutoCompleteMission =
    function processMissionAutoCompleteMission() {
      var AUTO_COMPLETE_MISSIONS = ["login"];
      AUTO_COMPLETE_MISSIONS.forEach(function (key) {
        var m = mission.get(key);
        if (
          $$core &&
          $$core.client &&
          $$core.client.mission &&
          $$core.client.mission.isReady() &&
          m &&
          m.active &&
          !m.isDone
        ) {
          output.missionComplete("login");
          $(".mission-" + name + " .btn-challenge a")
            .html(
              "<img src='https://app.woay.vn/lib/game_assets/images/icons/icon-checked.png' alt=''>" +
              "<span>Hoàn thành</span>"
            )
            .addClass("completed");
        }
      });
    };

  output.processGoldHourMission = function processGoldHourMission() {
    var missionGoldHour = mission.get("gold_hour");
    if (!missionGoldHour) return;
    var timeStart = mission.get("gold_hour").meta.from;
    var timeEnd = mission.get("gold_hour").meta.to;

    // Lấy thời gian hiện tại
    var now = new Date();

    // Chuyển đổi thời gian từ biến 'timeStart' và 'timeEnd' thành đối tượng Date
    var startTimeParts = timeStart.split(":");
    var endTimeParts = timeEnd.split(":");

    var startDate = new Date();
    startDate.setHours(parseInt(startTimeParts[0], 10));
    startDate.setMinutes(parseInt(startTimeParts[1], 10));

    var endDate = new Date();
    endDate.setHours(parseInt(endTimeParts[0], 10));
    endDate.setMinutes(parseInt(endTimeParts[1], 10));

    // So sánh thời điểm hiện tại với khoảng thời gian
    var isValid = now >= startDate && now <= endDate;

    console.log("GOLD_HOUR_STARTGOLD_HOUR_START", isValid);

    var isDone = mission.get("gold_hour").isDone;
    if (!isValid && !isDone) {
      $(".mission-gold_hour .btn-challenge a")
        .html("Chưa thực hiện")
        .addClass("deactive");
    } else if (isValid && !isDone) {
      $(".mission-gold_hour .btn-challenge a")
        .html("Làm nhiệm vụ")
        .addClass("active");
    } else {
      $(".mission-gold_hour .btn-challenge a")
        .html(
          "<img src='https://app.woay.vn/lib/game_assets/images/icons/icon-checked.png' alt=''>" +
          "<span>Hoàn thành</span>"
        )
        .addClass("active");
    }
  };
  $(document).on("click", ".btn-invite-friend", function () {
    if (WHEEL_SETTINGS.Wheel.game_type == "wheel") {
      if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == "li_xi") {
      if ($$woay.isPicking()) return;
    }
    html.pushModal("w-share");
  });
  $(document).on("click", ".btn-share-fb", function () {
    if (WHEEL_SETTINGS.Wheel.game_type == "wheel") {
      if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == "li_xi") {
      if ($$woay.isPicking()) return;
    }
    // var url = window.location.href.split('#')[0];
    // url = decodeURIComponent(url);
    // share(url);
    // processShareFbMission();
    output.shareFbByRedirect();
  });

  output.shareFbByRedirect = function shareFbByRedirect() {
    var currentUrl = window.location.origin + window.location.pathname;
    var sep = currentUrl.indexOf("?") == -1 ? "?" : "&";
    var shareSuccessUrl = currentUrl + sep + "shared=true";
    var base_url = WHEEL_SETTINGS.Wheel.SERVER_URL;
    var redirectUrl = base_url + "/api.player/redirect?u=" + shareSuccessUrl;
    var FB_APP_ID = WHEEL_SETTINGS.Facebook.APP_ID;
    var url = [
      "https://www.facebook.com/dialog/share?app_id=" + FB_APP_ID,
      "&href=" + currentUrl,
      "&display=page",
      "&redirect_uri=" + encodeURIComponent(redirectUrl),
    ].join("");

    window.open(url, "_self");
  };

  output.processShareFbMission = function processShareFbMission() {
    console.log("go there");
    var shared = $$core.client.utils.getParam("shared");
    var shareMission = $$core.client.mission.get("share_facebook");
    var checkCompleteShare =
      shareMission && !shareMission.isDone && shareMission.active && shared;
    if (checkCompleteShare) {
      console.log("checkCompleteShare", checkCompleteShare);
      output.missionComplete("share_facebook");
    }
  };

  var checkShareFbInterval = setInterval(function () {
    if (
      $$core &&
      $$core.client &&
      $$core.client.mission &&
      $$core.client.mission.isReady()
    ) {
      output.processShareFbMission();
      clearInterval(checkShareFbInterval);
    }
  }, 1000);

  output.getShareLink = function getShareLink() {
    var user = $$core.client.getUserInfo();
    var uid = user && user.player_game_id;
    var share_link_url = window.location.href.split("?")[0];

    return share_link_url + (uid ? "?wref=" + uid : "");
  };
  output.getShareUrl = function getShareUrl(url, quote) {
    var s = "https://www.facebook.com/sharer/sharer.php?u=";
    var user = $$core.client.getUserInfo();
    var uid = user && user.player_game_id;
    s += encodeURIComponent(url);
    if (typeof quote === "string" && quote.trim()) {
      s += "&quote=" + encodeURIComponent(quote);
    }
    return s + (uid ? "?wref=" + uid : "");
  };
  $(window).on("load", function () {
    console.log("All assets are loaded");
    var completeQuiz = $$core.client.local.get("completeQuiz");
    mission.waitToReady().then(function () {
      if (completeQuiz || completeQuiz == 0) {
        console.log("go there");
        output.missionComplete("wiki", parseInt(completeQuiz));
        $$core.client.local.remove("completeQuiz");
      }
    });
  });

  output.share = function share(url) {
    var sharedUrl = output.getShareUrl(url);
    window.open(sharedUrl, "_blank", "width=700,height=500,left=200,top=100");
  };

  $(document).on("click", ".my-copy-link-btn", function () {
    utils.copyToClipboard("#w-text-share-url");
  });
  $(document).on("click", ".btn-show-qrcode", function () {
    if (WHEEL_SETTINGS.Wheel.game_type == "wheel") {
      if ($$woay.checkSpinning()) return;
    } else if (WHEEL_SETTINGS.Wheel.game_type == "li_xi") {
      if ($$woay.isPicking()) return;
    }
    output.checkQrCode();
  });
  $(document).on("click", "#w-complete .modal__close", function () {
    // MicroModal.close('w-complete');
    html.closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 27) {
      console.log("esc click");
      event.stopImmediatePropagation();
    }
  });

  output.checkQrCode = function checkQrCode() {
    var action_qr = utils.getParam("action");
    var secret_qr = utils.getParam("secret");
    if (!action_qr && !secret_qr) {
      $(".text-qrcode").text(
        "Nhiệm vụ quét mã QR CODE chỉ áp dụng khi đến cửa hàng"
      );
    }
    html.pushModal("w-qrcode");
  };

  output.processMissionQrCode = function processMissionQrCode(secret_qr) {
    var missionQrCode = mission.get("explore_store");
    if (!missionQrCode) return;
    var secret_key = mission.get("explore_store").meta.hash;
    var mission_done = mission.get("explore_store").isDone;
    var passhash = CryptoJS.MD5(secret_qr).toString();
    if (passhash.localeCompare(secret_key) == 0) {
      output.missionComplete("explore_store");
    } else {
      $(".text-qrcode").text("Mã QR CODE không chính xác");
    }
    if (mission_done) {
      $(".text-qrcode").text("Nhiệm vụ QR CODE đã hoàn thành");
    }
  };

  output.checkRightAnswer = function checkRightAnswer() {
    var question = questions[current_question];
    var quantity_per_question = mission.get("wiki").meta.quantity_per_question;
    var answers = $('input[name="answer"]');
    var answer_val;
    var answer_right = question.rightAnswer;
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        answer_val = answers[i].value;
        if (answer_right == answer_val) {
          $(answers[i]).parent(".w-item-question").addClass("correct");
          $(answers[i])
            .parent(".w-item-question")
            .find(".checkmark")
            .css("display", "block");
          count_right_answer += quantity_per_question;
        } else {
          $(answers[i]).parent(".w-item-question").addClass("wrong");
        }
      }
      if (!answers[i].checked && answers[i].value == answer_right) {
        $(answers[i]).parent(".w-item-question").addClass("correct");
        $(answers[i])
          .parent(".w-item-question")
          .find(".checkmark")
          .css("display", "block");
      }
    }
    $$core.client.local.set("completeQuiz", count_right_answer, 1);
    $("#w-box-question").addClass("disable");
  };

  output.showResult = function showResult() {
    var quantity = count_right_answer;
    // MicroModal.close('w-quiz');
    html.closeModal();
    output.missionComplete("wiki", quantity).then(function () {
      count_right_answer = 0;
    });
  };

  output.getTopPlayer = function getTopPlayer(id, from, to, limit) {
    $$core.client.api.getTopPlayer(from, to, limit).then(function (data) {
      var topPlayers = data.map(function (x, i) {
        x.stt = i + 1;
        x.percent = (x.sum / data[0].sum) * 100;
        x.point = x.sum;
        x.activeClass = x.player_game_id == myUserId ? "active" : "";
        if (x.stt === 1) {
          x.activeClass += " top-1";
        } else if (x.stt === 2) {
          x.activeClass += " top-2";
        } else if (x.stt === 3) {
          x.activeClass += " top-3";
        }
        x.stt = i + 1 < 10 ? "0" + x.stt : rank;
        return x;
      });
      var top3 = topPlayers.slice(0, 3);
      var others = topPlayers.slice(3);

      var top3Html = tmpl(missionTemplate["highscore-tmpl"], top3);
      $(".w-tab-content #" + id + "-top3").html(top3Html);

      var othersHtml = tmpl(missionTemplate["highscore-tmpl"], others);
      $(".w-tab-content #" + id + "-others").html(othersHtml);
    });
  };

  output.renderRankChart = function renderRankChart(limit) {
    output.getTopPlayer("thang", false, false, limit);
    // var startDate = new Date(onAirDate);
    // var startTime = startDate.getTime();
    // var currentDate = new Date();
    // for (var i = 1; i < 5; i++) {
    //   var from = new Date(startTime + (i - 1) * 7 * 86400000);
    //   var to = new Date(startTime + i * 7 * 86400000);
    //   if (currentDate > from) {
    //     var html =
    //       '<li class="item-button"><a data-target="tuan' +
    //       i +
    //       '" class="tablinks">Tuần ' +
    //       i +
    //       "</a></li>";
    //     var html_tab_content =
    //       '<div class="w-tabcontent" id="tuan' + i + '"></div>';
    //     $(".wrap-item-button").append(html);
    //     $(".wrap-bxh").append(html_tab_content);
    //     output.getTopPlayer("tuan" + i, from, to, limit);
    //   }
    // }
  };

  output.updatePlayerHistory = function updatePlayerHistory(
    table_selector,
    template_id
  ) {
    var template = missionTemplate[template_id];
    console.log(table_selector, template_id);
    var rewards = reward.getRewardData().rewards;
    $(table_selector).html("");
    if (rewards.length) {
      rewards.forEach(function (reward) {
        if (reward.sku == "BADLUCK" || reward.item_type == "point") {
          $(table_selector).append("");
          return;
        }
        reward.updated_at = new Date(reward.updated_at).toLocaleString();
        $(table_selector).append(tmpl(template, reward));
      });
    } else {
      $(table_selector).html(
        '<div style="text-align: center; padding: 15px">Bạn chưa có phần thưởng nào</div>'
      );
    }
  };

  output.padLeft = function padLeft(n, len) {
    var s = "" + n;
    while (s.length < len) {
      s = "0" + s;
    }
    return s;
  };

  output.renderPlayerPoint = function renderPlayerPoint(
    table_selector,
    template_id
  ) {
    var template = missionTemplate[template_id];
    $$core.client.api.getHistoryPoint().then(function (data) {
      var points = data;
      $(table_selector).html("");
      if (points.length) {
        points.forEach(function (point) {
          if (point.type == "mission") {
            point.type =
              "Nhiệm vụ: " + $$woay.client.mission.get(point.type_name).title;
          } else if (point.type == "reward") {
            point.type = "Chơi game được " + point.type_name;
          }
          var d = new Date(point.created_at);
          var hour = d.toTimeString().split(" ")[0];
          var date =
            output.padLeft(d.getDate(), 2) +
            "/" +
            output.padLeft(d.getMonth() + 1, 2) +
            "/" +
            d.getFullYear();
          point.created_at = date + " " + hour;
          $(table_selector).append(tmpl(template, point));
        });
      } else {
        $(table_selector).html(
          '<div style="text-align: center; padding: 15px">Bạn hiện chưa có điểm</div>'
        );
      }
    });
  };

  output.updateMyPoint = function updateMyPoint() {
    $$core.client.api.getMyRank().then(function (data) {
      $(".w-total-point").css("opacity", "1");
      $(".w-my-rank--index").html(
        data.rank
          ? data.rank < 10
            ? `#0${data.rank}`
            : `#${data.rank}`
          : "#100+"
      );
      $(".w-your-point").html(data.sum);
    });
  };
  output.countRightAnswer = count_right_answer;

  g.$mission = output;
})(window);
