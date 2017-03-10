var now = new Date();
var startTime = parseInt(now.getTime() / 1000 - 24 * 3600 * 7);
var endTime = parseInt(now.getTime() / 1000 - 24 * 3600);
var m_days = 0;
var m_obj, m_post_obj;
var dataArrays;
var request;
$(function() {
	$.dataPost = function() {};
	$.extend($.dataPost, {
		time: 0
	}, {
		register: 0
	}, {
		active: 0
	});
	var startDate = new Date(startTime * 1000);
	var endDate = new Date(endTime * 1000);
	$('#config-demo').daterangepicker({
		"startDate": getFormatDate(startDate),
		"endDate": getFormatDate(endDate)
	}, function(start, end, label) {
		var startDate = new Date(start);
		var endDate = new Date(end);
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 0);
		startTime = startDate.getTime() / 1000;
		endTime = endDate.getTime() / 1000;
		selectData();
	});
	$("#submit").click(function() {
		dataArrays = new Array();
		$(".data-tr").each(function() {
			//			var item = new $.dataPost();
			//			item.time = $(this).find(".timeDate").attr("data-time");
			//			item.register = $(this).find(".registerData").val();
			//			item.active = $(this).find(".activeData").val();
			//			dataArrays.push(item);
			//另一种写法
			var item2=new Object();
			item2["time"] = $(this).find(".timeDate").attr("data-time");
			item2["register"] = $(this).find(".registerData").val();
			item2["active"] = $(this).find(".activeData").val();
			dataArrays.push(item2);
		});
		m_obj = JSON.stringify(dataArrays);
		request = {
			"data": m_obj
		};
		m_days = JSON.stringify(request);
		$.ajax({
			type: "post",
			url: "http://192.168.43.2:8080/writePlan",

			async: true,
			data: {
				"data": m_obj
			},
			dataType: "json",
			crossDomain: true,
			success: function(data) {
				console.log("log2222:" + JSON.stringify(data));
				m_post_obj = eval(data);
				if (m_post_obj.retcode == "00000") {
					alert("提交成功");
				} else {
					alert("提交失败");
				}
			},
			error: function(obj, msg, msg2) {
				console.log("errorMsg:" + msg);
			},
			beforeSend: function() {
				$(".load-txt").text("正在提交...");
				$(".load-txt").show();
			},
			complete: function() {
				$(".load-txt").hide();
			}
		});

	});
});

function getFormatDate(dateTime) {
	return (dateTime.getMonth() + 1) + "/" + dateTime.getDate() + "/" + dateTime.getFullYear();
}

function getFormatDate2(dateTime) {
	return dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
}

function selectData() {
	console.log("url:" + "http://192.168.43.2:8080/readPlan?start_time=" + startTime + "&end_time=" + endTime);
	$.ajax({
		type: "post",
		//		url: "http://10.156.184.89/dataInput/index.php",
		url: "http://192.168.43.2:8080/readPlan",
		async: true,
		data: {
			"start_time": startTime,
			"end_time": endTime
		},
		dataType: "json",
		crossDomain: true,
		success: function(data) {
			m_obj = eval(data);
			//			logs = "start_time:" + startTime + ",end_time:" + endTime + "," + m_obj.data[0].time;
			//			console.log("log:" + JSON.stringify(data));
			addDays();
		},
		error: function(obj, msg, msg2) {
			console.log("errorMsg:" + msg);
		},
		beforeSend: function() {
			$(".load-txt").text("正在查询数据...");
			$(".load-txt").show();
		},
		complete: function() {
			$(".load-txt").hide();
		}
	});

}

function getDataByTime(date) {
	var registerData = 0;
	var activeData = 0;
	for (var i = 0; i < m_obj.data.length; i++) {
		var d = m_obj.data[i].time;
		if (date == getFormatDate2(new Date(d * 1000))) {
			registerData = m_obj.data[i].register;
			activeData = m_obj.data[i].active;
			break;
		}
	}
	var temp = [registerData, activeData];
	return temp;
}

function addDays() {
	var duration = endTime - startTime + 1;
	m_days = duration / (3600 * 24);
	var lines = "";
	$("#data-table tr:gt(0)").remove();
	for (var i = 0; i < m_days; i++) {
		var times = startTime + i * 3600 * 24;
		var tempDate = new Date(times * 1000);
		var tdate = getFormatDate2(tempDate);
		var info = getDataByTime(tdate);
		lines += "<tr class=\"data-tr\">\r\n" +
			"				<td class=\"timeDate\" data-time=\"" + times + "\">" + tdate + "</td>\r\n" +
			"				<td class=\"registerNum\"><input type=\"text\" class=\"registerData\" value=\"" + info[0] + "\"></td>\r\n" +
			"				<td class=\"activeNum\"><input type=\"text\" class=\"activeData\"  value=\"" + info[1] + "\"></td>\r\n" +
			"			</tr>";

	}
	$("#data-table").append(lines);
}