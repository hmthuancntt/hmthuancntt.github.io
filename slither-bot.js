﻿(function(w) {
    var modVersion = "v1.0",
        renderMode = 3, // 3 - normal, 2 - optimized, 1 - simple (mobile)
        normalMode = false,
        gameFPS = null,
        positionHUD = null,
        ipHUD = null,
        fpsHUD = null,
        styleHUD = "color: #FFF; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 14px; position: fixed; opacity: 0.35; z-index: 7;",
        inpNick = null,
        currentIP = null,
        retry = 0,
        bgImage = null;
        loopingSkin = false;
		var f = false;
		var colorr = 1;
		var sizee = 1;
		var crazie = false;
        loopInterval = 400;
        skinLoop = null;
		foodLoop = null;
        nextSkin = 0;
    function init() {
        // Append DIVs
        appendDiv("position-hud", "nsi", styleHUD + "right: 30px; bottom: 120px;");
        appendDiv("ip-hud", "nsi", styleHUD + "right: 30px; bottom: 150px;");
        appendDiv("fps-hud", "nsi", styleHUD + "right: 30px; bottom: 170px;");
        positionHUD = document.getElementById("position-hud");
        ipHUD = document.getElementById("ip-hud");
        fpsHUD = document.getElementById("fps-hud");
        w.onkeydown = function(e) {
            switch (e.keyCode) {
                case 9: //tab
                    e.preventDefault();
                    positionHUD.style.display = positionHUD.style.display == "none" ? positionHUD.style.display = null : positionHUD.style.display = "none";
                    ipHUD.style.display = ipHUD.style.display == "none" ? ipHUD.style.display = null : ipHUD.style.display = "none";
                    fpsHUD.style.display = fpsHUD.style.display == "none" ? fpsHUD.style.display = null : fpsHUD.style.display = "none";
                    break;
                case 27: //esc
                    forceConnect();
                    break;
                case 81: //q
                    die();
                    break;
          
                case 16: //shift
                    setAcceleration(true);
                    break;
            }
        }
        
        w.onkeyup = function(e) {
            switch (e.keyCode){
                case 16: // shift
                    setAcceleration(false);
                    break;
            }
        }

        setMenu();
        setLeaderboard();
        setGraphics();
        updateLoop();
        showFPS();
    }
    // Append DIV
    function appendDiv(id, className, style) {
        var div = document.createElement("div");
        if (id) {
            div.id = id;
        }
        if (className) {
            div.className = className;
        }
        if (style) {
            div.style = style;
        }
        document.body.appendChild(div);
    }
    // Zoom
    function zoom(e) {
        if (!w.gsc) {
            return;
        }
        w.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
    }
    function changeSkin() {
		if (w.playing && w.snake != null) {
			var skin = w.snake.rcv;
			skin++;
			if (skin > w.max_skin_cv) {
				skin = 0;
			}
			w.setSkin(w.snake, skin);
		}
	}
    function getConsoleLog(log) {
        if (log.indexOf("FPS") != -1) {
            gameFPS = log;
        }
    }
	
    function setMenu() {
        var login = document.getElementById("login");
        if (login) {
            // Load settings
            loadSettings();
            // Message
            if(document.getElementById("nick").value == "" || document.getElementById("nick").value == null){document.getElementById("nick").value = "karaokeyoutube.net";}
            
            document.getElementById("nick_holder").style.marginTop = "10px";
            var element = document.getElementById("playh");
            element.parentNode.removeChild(element);
            document.getElementById("login").style.marginTop = "30px";
            document.getElementById("logo").style.marginTop = "0px";
            
            // Menu container
            var sltMenu = document.createElement("div");
            sltMenu.style.width = "360px";
            sltMenu.style.color = "#8058D0";
            sltMenu.style.backgroundColor = "#1e262e";
            sltMenu.style.fontFamily = "'Arial', sans-serif";
            sltMenu.style.fontSize = "14px";
            sltMenu.style.textAlign = "center";
            sltMenu.style.margin = "40px auto";
            sltMenu.style.padding = "20px 14px";
            sltMenu.innerHTML = "Chọn server";
            login.appendChild(sltMenu);
            
            // IP input container
            var div = document.createElement("div");
            div.style.color = "#8058D0";
            div.style.backgroundColor = "#4C447C";
            div.style.margin = "15px auto";
            div.style.padding = "10px";
            sltMenu.appendChild(div);
            
            // IP input
            var input = document.createElement("input");
            input.id = "server-ip";
            input.type = "text";
            input.placeholder = "IP Của Bạn";
            input.style.height = "26px";
            input.style.display = "inline-block";
            input.style.background = "none";
            input.style.color = "#ffffff";
            input.style.border = "none";
            input.style.outline = "none";
            input.style.width = "100%";
            input.style.textAlign = "center";
            div.appendChild(input);

            // Select server
            var select = document.createElement("select");
            select.id = "select-srv";
            select.style.width = "100%";
            select.style.margin = "10px auto";
            select.style.height = "30px";
            select.style.padding = "0px 10px";
            var option = document.createElement("option");
            option.value = "";
            option.text = "Chơi Với Bạn Bè - Chọn Sever";
            select.appendChild(option);
            div.appendChild(select);
            
             // Connect (play) button
            var button = document.createElement("input");
            button.id = "connect-btn";
            button.type = "button";
            button.value = "Chơi";
            button.style.display = "inline-block";
            button.style.borderRadius = "30px";
            button.style.color = "#FFF";
            button.style.border = "none";
            button.style.outline = "none";
            button.style.cursor = "pointer";
            button.style.padding = "0px 40px";
            button.style.margin = "15px";
            button.style.height = "40px";
            button.style.backgroundColor = "rgb(86, 172, 129)";
            div.appendChild(button);
            
           
            // Menu footer
            sltMenu.innerHTML += '<BR><a href="http://hatvoinhau.net" target="_blank" style="color: #85f9ae; opacity: 2;">hatvoinhau.net</a> | ';
            sltMenu.innerHTML += '<a href="http://kythuatphancung.net" target="_blank" style="color: #85f9ae; opacity: 2;">kythuatphancung.net</a>';
            // Get IP input
            inpIP = document.getElementById("server-ip");
            // Get nick
            var nick = document.getElementById("nick");
            nick.addEventListener("input", getNick, false);
            // Force connect
            var connectBtn = document.getElementById("connect-btn");
            connectBtn.onclick = forceConnect;
            // Get servers list
            getServersList();
            
            resizeView();
        } else {
            setTimeout(setMenu, 100);
        }
    }
    // Load settings
    function loadSettings() {
        if (w.localStorage.getItem("nick") != null) {
            var nick = w.localStorage.getItem("nick");
            document.getElementById("nick").value = nick;
        }
        if (w.localStorage.getItem("rendermode") != null) {
            var mode = parseInt(w.localStorage.getItem("rendermode"));
            if (mode >= 1 && mode <= 3) {
                renderMode = mode;
            }
        }
    }
    // Get nick
    function getNick() {
        var nick = document.getElementById("nick").value;
        w.localStorage.setItem("nick", nick);
    }
    // Connection status
    function connectionStatus() {
        if (!w.connecting || retry == 10) {
            w.forcing = false;
            retry = 0;
            return;
        }
        retry++;
        setTimeout(connectionStatus, 1000);
    }
    // Force connect
    function forceConnect() {
        if (inpIP.value.length == 0 || !w.connect) {
            	var select = document.getElementById('select-srv');
		var items = select.getElementsByTagName('option');
		var index = Math.floor(Math.random() * items.length);
		var strIp = select.options[index].value;
		
		 w.forcing = true;
	        if (!w.bso) {
	            w.bso = {};
	        }
	        var srv = strIp.trim().split(":");
	        w.bso.ip = srv[0];
	        w.bso.po = srv[1];
	        w.connect();
	        setTimeout(connectionStatus, 1000);
        }
        else
        {
	        w.forcing = true;
	        if (!w.bso) {
	            w.bso = {};
	        }
	        var srv = inpIP.value.trim().split(":");
	        w.bso.ip = srv[0];
	        w.bso.po = srv[1];
	        w.connect();
	        setTimeout(connectionStatus, 1000);
        }
    }
    // Get servers list
    function getServersList() {
    	var serverlist = w.sos;
    	 serverlist.sort(sort_by('ip', true, function (a) { return a }));
        if (serverlist && serverlist.length > 0) {
            var selectSrv = document.getElementById("select-srv");
	    var j = 1;
            for (var i = 0; i < serverlist.length; i++) {		
                var srv = serverlist[i];
	    	if(!srv.ip.startsWith("43")) continue;
                var option = document.createElement("option");
                option.value = srv.ip + ":" + srv.po;
                option.text = (j) + ". " + option.value;
                selectSrv.appendChild(option);
		j++;
            }
            selectSrv.onchange = function() {
                var srv = selectSrv.value;
                inpIP.value = srv;
            };
        } else {
            setTimeout(getServersList, 100);
        }
    }
    
   var sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) { return primer(x[field]) } :
            function (x) { return x[field] };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    // Resize view
    function resizeView() {
        if (w.resize) {
            w.lww = 0; // Reset width (force resize)
            w.wsu = 0; // Clear ad space
            w.resize();
            var wh = Math.ceil(w.innerHeight);
            if (wh < 800) {
                var login = document.getElementById("login");
                w.lgbsc = wh / 800;
                login.style.top = - (Math.round(wh * (1 - w.lgbsc) * 1E5) / 1E5) + "px";
                if (w.trf) {
                    w.trf(login, "scale(" + w.lgbsc + "," + w.lgbsc + ")");
                }
            }
        } else {
            setTimeout(resizeView, 100);
        }
    }
    // Set leaderboard
    function setLeaderboard() {
        if (w.lbh) {
            w.lbh.textContent = "10 Top Rắn To Nhất";
            w.lbh.style.fontSize = "20px";
        } else {
            setTimeout(setLeaderboard, 100);
        }
    }
    // Set normal mode
    function setNormalMode() {
        normalMode = true;
        w.ggbg = true;
        if (!w.bgp2 && bgImage) {
            w.bgp2 = bgImage;
        }
        w.render_mode = 2;
    }
    // Set graphics
    function setGraphics() {
        if (renderMode == 3) {
            if (!normalMode) {
                setNormalMode();
            }
            return;
        }
        if (normalMode) {
            normalMode = false;
        }
        if (w.want_quality && w.want_quality != 0) {
            w.want_quality = 0;
            w.localStorage.setItem("qual", "0");
            w.grqi.src = "/s/lowquality.png";
        }
        if (w.ggbg && w.gbgmc) {
            w.ggbg = false;
        }
        if (w.high_quality) {
            w.high_quality = false;
        }
        if (w.gla && w.gla != 0) {
            w.gla = 0;
        }
        if (w.render_mode && w.render_mode != renderMode) {
            w.render_mode = renderMode;
        }
    }
    // Show FPS
    function showFPS() {
        if (w.playing && fpsHUD && w.fps && w.lrd_mtm) {
            if (Date.now() - w.lrd_mtm > 970) {
                fpsHUD.textContent = "FPS: " + w.fps;
            }
        }
        setTimeout(showFPS, 30);
    }
    // Update loop
    function updateLoop() {
        setGraphics();
        if (w.playing) {
            if (positionHUD) {
                positionHUD.textContent = "X: " + (~~w.view_xx || 0) + " Y: " + (~~w.view_yy || 0);
            }
            if (inpIP && w.bso && currentIP != w.bso.ip + ":" + w.bso.po) {
                currentIP = w.bso.ip + ":" + w.bso.po;
                inpIP.value = currentIP;
                if (ipHUD) {
                    ipHUD.textContent = "IP: " + currentIP;
                }
            }
        }
        setTimeout(updateLoop, 1000);
    }
    //Die
    function die() {
        if (w.playing) {
            w.want_close_socket = -1;
            w.dead_mtm = Date.now() - 5E3;
            w.ws.close();
            w.ws = null;
            w.playing = !1;
            w.connected = !1;
            w.resetGame();
            w.play_btn.setEnabled(!0);
        }
    }
	function foodinterval(){
			skinLoop = setInterval(function() { 
			if (f === true && colorr != 7 && crazie !== true) {
				newFood(3,snake.xx,snake.yy,sizee,5,colorr);
			  } else if (f === true && colorr == 7 && crazie !== true) {
				  newFood(3,snake.xx,snake.yy,sizee,5,Math.floor(Math.random() * 7) + 1);
			  } else if (f === true && crazie === true) {
				  newFood(3,snake.xx,snake.yy,Math.floor(Math.random() * 20) + 1,5,Math.floor(Math.random() * 7) + 1);
			  }
            }, 100);
	}
    function toggleInterval(){
        if (loopingSkin == false) {
            loopingSkin = true;
            skinLoop = setInterval(function() { 
                if (nextSkin > 25){
                    nextSkin = 0; 
                }
                if (snake !== null){
                    setSkin(snake, nextSkin); 
                    nextSkin++; 
                }
            }, 400);
        }else{
            loopingSkin = false;
            clearInterval(skinLoop);
            skinLoop = null;
        }
    }
    // Init
    init();
})(window);

//Get local image src
    function localImage(){
        //selects the query named img
        var file    = document.querySelector('input[type=file]').files[0]; //sames as here
        var reader  = new FileReader();

        reader.onloadend = function () {
            theImage = reader.result;
            localStorage.setItem("savei", theImage);
            ii.src = localStorage.getItem("savei");
        };

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
    }
