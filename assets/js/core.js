var mod_elapsedSeconds = 0;
var startDate;
var data;
var config_game;

function computeDate(){
	var current_date = new Date()
	var year = current_date.getUTCFullYear()
	var month = current_date.getUTCMonth()+1
	if(month<9){
		month = '0'+month
	}
	var dat = current_date.getUTCDate()
	if(dat<9){
		dat = '0'+dat
	}
	var hour = current_date.getUTCHours()
	if(hour<9){
		hour = '0'+hour
	}
	var minutes = current_date.getUTCMinutes()
	if(minutes<9){
		minutes = '0'+minutes
	}
	return year+'-'+month+'-'+dat+' '+hour+':'+minutes
}

function loadCoreData(){
	startTimer();
	window.top.postMessage({load:true}, "*");
	window.addEventListener("message", event => {
		console.log(">>message: ",event)
		if(event.data.hasOwnProperty("game_detail")){
			data = event.data.game_detail
		}
		if(event.data.hasOwnProperty("config_game")){
			config_game = event.data.config_game
		}
		loadedCoreData()
	})
}

function sendComplete(){
	if(data){
		data = {
			score:100,
			lesson_status: "completed",
			question_attemps: [
				{
					questions:[],
					approved:true,
					time_activity: computeTime(),
					created_at: computeDate()
				}
			],
			sentence_attemps: [
				{
					statement:"",
					approved:true,
					time_activity:computeTime(),
					created_at: computeDate(),
					sentences: ["perro", "gato"]
				}
			]
		}
	}

	console.log(data)
	window.top.postMessage({completado:true, alto:null, nextContent:true, game_detail:data},"*");
}

function startTimer(){
	startDate = new Date().getTime();
}


function computeTime() {
  if (startDate != 0) {
    var currentDate = new Date().getTime();
    var elapsedSeconds = (currentDate - startDate) / 1000;
    var formattedTime = convertTotalSeconds(elapsedSeconds);
  } else {
    formattedTime = "00:00:00.0";
  }

  return formattedTime;
}

function convertTotalSeconds(ts) {
  var sec = ts % 60;

  ts -= sec;
  var tmp = ts % 3600; //# of seconds in the total # of minutes
  ts -= tmp; //# of seconds in the total # of hours

  // convert seconds to conform to CMITimespan type (e.g. SS.00)
  sec = Math.round(sec * 100) / 100;

  var strSec = new String(sec);
  var strWholeSec = strSec;
  var strFractionSec = "";

  if (strSec.indexOf(".") != -1) {
    strWholeSec = strSec.substring(0, strSec.indexOf("."));
    strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
  }

  if (strWholeSec.length < 2) {
    strWholeSec = "0" + strWholeSec;
  }
  strSec = strWholeSec;

  if (strFractionSec.length) {
    strSec = strSec + "." + strFractionSec;
  }

  if (ts % 3600 != 0) var hour = 0;
  else var hour = ts / 3600;
  if (tmp % 60 != 0) var min = 0;
  else var min = tmp / 60;

  if (new String(hour).length < 2) hour = "0" + hour;
  if (new String(min).length < 2) min = "0" + min;

  var rtnVal = hour + ":" + min + ":" + strSec;

  return rtnVal;
}
