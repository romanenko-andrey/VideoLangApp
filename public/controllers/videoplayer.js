angular.module('MyApp')

  .controller('VideoPlayerCtrl', ["$scope", "$rootScope",  "$stateParams", "Video_Factory", "Yandex_Factory", "$sce",  "$timeout", "toastr", function($scope, $rootScope,  $stateParams, Video_Factory, Yandex_Factory,  $sce,  $timeout, toastr) {
    
      //console.log($stateParams.id);
  
  TRBOXHEIGHT =  300; //высота окна с переводом. Должна совпадать с CSS-свойством у translate-box {height}
  MAXTRWIDTH = 400; //максимально допустимая ширина окна
    
  $scope.state = null;
  $scope.API = null;
  $scope.currentVideo = 0;
  $scope.myPlayer  = null;
    
  $scope.isTitleHidden = [{show: false, time: 0, str :''},  {show: false, time: 0, str :''},{show: false, time: 0, str :''},{show: false, time: 0, str :''},{show: false, time: 0, str :''}];
    
  $scope.translateBook = {};
  $scope.translateBook.visible = false;  
  $scope.translateBook.toLang = 'ru';
  $scope.translateBook.fromLang = 'ru';
  $scope.translateBook.translate  = '';
  $scope.canSpeak = true;
  trBox = document.getElementById('translate-box');
  trBoxPointer = document.getElementById('box-pointer');
  vinW = document.getElementById('videogular-wrapper');  
  myTrackWin  = document.getElementById('my-track');  
  inputTextFrom = document.getElementsByName('text-from')[0];
  inputTextTo = document.getElementsByName('text-to')[0];
  controlsBar =document.getElementsByTagName('vg-controls')[0];
    
  $scope.languages =  Yandex_Factory.languages;
       
  $scope.changeLanguage = function(ev){
    console.log(ev);
    if ($scope.translateBook.toLang != ev.target.value) {
      $scope.translateBook.toLang = ev.target.value;
       $scope.reTranslateFast();
    }
   
    console.log($scope.translateBook.toLang);
    //$scope.$apply();
  };  
  
  addEventListener('keydown',function (e) {
    var text = e.type +
      ' keyCode=' + e.keyCode +
      ' which=' + e.which +
      ' charCode=' + e.charCode +
      ' char=' + String.fromCharCode(e.keyCode || e.charCode) +
      (e.shiftKey ? ' +shift' : '') +
      (e.ctrlKey ? ' +ctrl' : '') +
      (e.altKey ? ' +alt' : '') +
      (e.metaKey ? ' +meta' : '') + "\n";

      console.log(text)
      
      
          
      if (e.shiftKey && e.keyCode == 37) { //shift+left = -10% playback speed
         $scope.changeSpeedRate(-0.1);
         return
      };
    
      if (e.shiftKey && e.keyCode == 39) { //shift+right = +10% playback speed
         $scope.changeSpeedRate(0.1);
         return
      };
    
     if (e.shiftKey && e.keyCode == 32) { //shift+space = return to normal speed
          $scope.changeSpeedRate(0);
          return
      };
    
    
      //сдвиг активных титров во времени на 0,5с
      if (e.ctrlKey && e.keyCode == 37) { //Ctrl+left 
        $scope.changeTrackTime(-0.5);
        return
      };
    
      if (e.ctrlKey && e.keyCode == 39) { //Ctrl+right 
         $scope.changeTrackTime(0.5);
         return
      };
    
      
     //отработку пробела и стрелок оставить в конце
     if (e.keyCode == 32 && !$scope.trModal) {//space = play/pause
         $scope.API.playPause();
         return
      }; 
      if (e.keyCode == 37) { //left = -5s video
         $scope.changeMediaTime(-5000);
         return
      };
      if (e.keyCode == 39) { //right = +5s video
         $scope.changeMediaTime(5000);
         return
      };
  });
  
  $scope.changeTrackTime = function(time){
    var tr = $scope.API.mediaElement[0].textTracks;
    for (var activeTrack=0; activeTrack<$scope.isTitleHidden.length;activeTrack++){
      if ($scope.isTitleHidden[activeTrack].show == true) {
          //if ($scope.isTitleHidden[activeTrack].time + time <0 ) return;
        
          $scope.isTitleHidden[activeTrack].time = $scope.isTitleHidden[activeTrack].time + time;
        
          $scope.isTitleHidden[activeTrack].str =  
          ($scope.isTitleHidden[activeTrack].time>0 ? '+': '-') +
          Math.abs($scope.isTitleHidden[activeTrack].time) + 's';
        
          if ($scope.isTitleHidden[activeTrack].time == 0) {
             $scope.isTitleHidden[activeTrack].str = '';
          }
            
        
          for (var i=0; i<tr[activeTrack].cues.length; i++){
            tr[activeTrack].cues[i].startTime = tr[activeTrack].cues[i].startTime + $scope.isTitleHidden[activeTrack].time;
            tr[activeTrack].cues[i].endTime = tr[activeTrack].cues[i].endTime + $scope.isTitleHidden[activeTrack].time;
          };
      };
    }
    $scope.$apply();
  }  
    
  $scope.changeSpeedRate = function(addSpeed){
     var showSpeedBlock = document.getElementsByTagName('vg-show-speedrate')[0];
     if (addSpeed == 0){
       $scope.API.setPlayback(1);
     } else if (($scope.API.playback + addSpeed)>0 && ($scope.API.playback)<2){
        $scope.API.setPlayback($scope.API.playback + addSpeed);
     };
    
    if ($scope.API.playback == 1){
      showSpeedBlock.innerHTML = '';
    }else{
      showSpeedBlock.innerHTML = Math.round($scope.API.playback*100) + '%';
    }
  };    
    
  $scope.changeMediaTime = function (time){
    if ($scope.API.currentTime + time > $scope.API.totalTime) {
      //to end
      $scope.API.seekTime (100, true);
      return;
    };
   if ($scope.API.currentTime + time < 0) {
      //to begin
      $scope.API.seekTime (0, true);
      return;
    };
   //to +time(ms) 
   $scope.API.seekTime( ($scope.API.currentTime + time)/1000, false);
  };
  

    
    
  $scope.addToDict = function(){
      toastr.success('Cлово/фраза: "'+$scope.translateBook.outText+'" - успешно добавлена в словарь!');
      //$scope.translateBook.outText
      //$scope.translateBook.tr
      //$scope.translateBook.translatedText
  };
    
  //иницализируем СПИКЕРА  
  $scope.speaker = Yandex_Factory.tts();  
  $scope.speakerConf = Yandex_Factory.speachConfig;   
  
  $scope.speak = function(){
    //озвучка а Яндексе возможна только для ru & en
    if ($scope.translateBook.fromLang == 'ru' ||
        $scope.translateBook.fromLang == 'en') {
      
          if ($scope.translateBook.fromLang == 'ru') 
            Yandex_Factory.speachConfig.lang = 'ru-RU';

          if ($scope.translateBook.fromLang == 'en') 
            Yandex_Factory.speachConfig.lang = 'en-US'; 
      
          console.log(Yandex_Factory.speachConfig.lang);
          console.log($scope.translateBook.outText);
          $scope.canSpeak = false;
      
          try {
          Yandex_Factory.speach(
            $scope.speaker,  
            inputTextFrom.value,
            function() {
             $scope.canSpeak = true;  
             console.log("Озвучивание текста завершено.");
             $scope.$apply();
           })
          } catch(error) {
            console.log('Жаль но озвучка слов данным браузером не поддерживается!')
            toastr.error('Жаль но озвучка слов данным браузером не поддерживается!', error.name);
            console.log(error);
          };
    };
  };
   
  //сказать случайную фразу  
  //inputTextFrom.value = Yandex_Factory.getRandomText();  
  //$scope.speak();

    
    
  $scope.showTitle = function(index){
    var tr = $scope.API.mediaElement[0].textTracks[index];
    if ($scope.isTitleHidden[index].show) {
      console.log(tr.language +' is hidden');
      $scope.isTitleHidden[index].show = false;
    }
    else {
      console.log(tr.language +' is show');
      $scope.isTitleHidden[index].show = true;
    };
    
    tr.mode = 'hidden';
  }; //showTitle
    
  $scope.closeTrModal = function(){
    $scope.trModal = false; 
    $scope.translateBook.visible = false; 
    $scope.API.play();
  }
  
  document.getElementById('my-track').addEventListener('mouseleave', function(ev){
    if ($scope.trModal) return;
    
    if (ev.clientY < controlsBar.getBoundingClientRect().top){
        $scope.API.play();
    }
    $scope.translateBook.visible = false; 
  }); 
    
 
  
  vinW.addEventListener('mousemove', function(ev){
    //console.log(event.x - vinW.offsetLeft, event.y- vinW.offsetTop);  
    /*
    var mouseXY = document.getElementById('mouseXY');
    mouseXY.innerHTML = '<p> SCREEN '+ev.screenX +';' + ev.screenY + '</p>' + 
                        '<p> PAGE   '+ev.pageX +';' + ev.pageY + '</p>' +
                        '<p> CLIENT '+ev.clientX +';' + ev.clientY + '</p>'+
                        '<p> OFFSET '+ev.offsetX +';' + ev.offsetY + '</p>';;
    */
    
  });
    
    
    
  $scope.onPlayerReady = function(API) {
    $scope.API = API;
    $scope.myPlayer = API.mediaElement[0];
    console.log(API);
    console.log($scope.myPlayer);
    console.log($scope.myPlayer.textTracks);
  //  console.log($scope.myPlayer.textTracks[0]);
   
    video = document.getElementsByTagName('video')[0];
    video.mediaGroup = 'a11';
    
    $scope.myPlayer.addEventListener('pause', function(ev) {
       //console.log("pause !")
    });

    $scope.waitTrackReady();
  };//  $scope.onPlayerReady 
    
 $scope.waitTrackReady = function() {
    if ($scope.API.mediaElement[0].textTracks.length>0){
      $scope.setMode();
    } else {
      console.log('подождем еще немного....')
      $timeout( $scope.waitTrackReady, 2000);
    }
 };
    
  $scope.setMode = function(){
      var tracks = $scope.API.mediaElement[0].textTracks;
      
      console.log('ini mode ', tracks);
      
      for (var i=0; i<tracks.length; i++){
        tracks[i].mode = "hidden";
        //tracks[i].mode = "showing";
      };
    
    
      
      for (var i=0; i<tracks.length; i++){
       if (tracks[i].activeCues){
         console.log(tracks[i])
         
         console.log(tracks[i].label)
       
            
        tracks[i].addEventListener('cuechange', function(){
            //вывод субтитров на экран
            var elId =  'my-track-'+ this.language;
            var text = '';
          
            if (this.activeCues && this.activeCues.length>0){
                var newTrackText = this.activeCues[0].text
                //console.log(newTrackText);
                //var trackTextArr = newTrackText.match(/(\w+)/g);
                
                var trackTextArr = newTrackText.match(/(\S+)/g);
                //console.log(trackTextArr);
              
                var spanText = '';
                for (var j=0; j<trackTextArr.length; j++){
                   spanText = spanText +' ' + '<span>' + trackTextArr[j] + '</span>';
                };
              
                //text = '<div><span>' + this.activeCues[0].text +'</span></div>';
                text = '<div><span>' + spanText +'</span></div>';
                document.getElementById(elId).innerHTML = text;
                
  
              
                //ставим обработчики событий на текст треков
                var newTrack = document.getElementById(elId).children[0].children[0];
                //console.log(newTrack, newTrack.children);
                newTrack.addEventListener('mouseenter', function(ev){
                    $scope.API.pause();
                    //console.log('mouseenter = ',ev)
                });

                
                //вывод выделенного мышкой слова в консоль
                for (var t=0; t<newTrack.children.length; t++){
                  newTrack.children[t].addEventListener('mouseenter', function(ev){
                    //если окно перевода не открыто по клику мышки тогда перевести слово
                     console.log('text mouseenter= ', ev.target.outerText);
                    //if (!$scope.trModal)
                    $scope.showAndTranslateThen(ev.target.outerText, ev, 'fast');
                  }); 
                };
              
                //событие по окончанию выделения или по клику на слове
                newTrack.addEventListener('mouseup', function(ev){
                  ev.stopImmediatePropagation();
                  console.log(ev);
                  console.log('text mouseup= ', ev.target.outerText);
                  $scope.translateSelection(ev)
                }); //конец обработчика выделенного текста
              
               ///событие по окончанию выделения за пределами предложения
                document.getElementById(elId).children[0].addEventListener('mouseup', function(ev){
                  console.log(ev);
                  $scope.translateSelection(ev)
                }); //конец обработчика выделенного текста
              
              
              
            } else {
              //очищаем предыдущий текст
              document.getElementById(elId).innerHTML = text;
            }
        }); //end of addEventListener('cuechange')
                                   
         console.log(' add listener');
         
        } else {
           console.log('не могу установить слушателя №...',i );
           $timeout( $scope.setMode, 2000);
          return
        }
      }; 
      console.log('after ini mode ',tracks);

  }//end of setMode function

$scope.translateSelection = function(ev){ 
    $scope.translateBook.visible = true; 
    $scope.trModal = true;
    
    $scope.$apply();
    //$scope.API.play();
    //$scope.API.pause();

    var ie = false;

    if ( window.getSelection ) {
      var selectedText = window.getSelection();
    } else if ( document.getSelection ) {
      var selectedText = document.getSelection();
    } else if ( document.selection ) {
      ie = true;
      var selectedText = document.selection.createRange();
    };

    if(!ie){
      //console.log(selectedText)//  просто выведет выделенный текст без тегов
      var theParent = selectedText.getRangeAt(0).cloneContents();

      //console.log(theParent) // собственно выделенный кусок кода

      var d = document.createElement('div');
      d.appendChild(theParent);

      //соберем віделенный фрагмент в кучу
      var t = '';
      for (var i=0; i<d.children.length; i++){
        t += ' ' + d.children[i].innerHTML;
      };

      console.log('выделен текст = ', t);
      if (t.length>0) {
        $scope.showAndTranslateThen(t, ev, 'fast');
        $scope.clearSelection();
      } else {
        // 
        //полный перевод отдельного слова ev.target.outerText
        $scope.showAndTranslateThen(ev.target.outerText, ev, 'full');
      }

    }else{
      console.log(selectedText.text) // текст
      console.log(selectedText.htmlText) // выделенный кусок кода
    };
    //console.log('selected text = ', selectedText);
}
  
 
$scope.clearSelection = function() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else { // старый IE
      document.selection.empty();
    }
};

$scope.reTranslateFull  = function(){
  //поиск словарной статьи для исправленного текста
  $scope.translateBook.translateText = '.........';
  inputTextTo.value = $scope.translateBook.translateText;
  Yandex_Factory.translateFull(
      inputTextFrom.value,
      $scope.translateBook.fromLang + '-' + $scope.translateBook.toLang,
      function(text){

            $scope.translateBook.fullTranslate = text;
            
            if (text == []) {
              $scope.translateBook.translateText = '';
              inputTextTo.value = $scope.translateBook.translateText;
            } else {
              $scope.translateBook.tr = text[0];
              $scope.translateBook.translatedText = text.slice(1);  
              $scope.translateBook.translateText = '';
              inputTextTo.value = $scope.translateBook.translateText;
              if (text[1])
                $scope.translateBook.translateText = text[1].rez[0];
                inputTextTo.value = $scope.translateBook.translateText;
           }
           $scope.$apply(); 
      })
};  
    
$scope.reTranslateFast  = function(){
  //поиск быстрого перевода для исправленного текста
  $scope.translateBook.translateText = '.........';
  inputTextTo.value = $scope.translateBook.translateText;
  Yandex_Factory.translateFast(
      inputTextFrom.value,
      $scope.translateBook.fromLang + '-' + $scope.translateBook.toLang,
      function(text){
            $scope.translateBook.translateText = text;
            inputTextTo.value = $scope.translateBook.translateText;
            $scope.translateBook.tr = '';
            $scope.translateBook.translatedText = [];
            $scope.$apply();
      });
}; 
    
$scope.showAndTranslateThen = function (text, event, translateSourse){
    //обрезать текст от лишних символов для русского и англ.языков
    if (translateSourse == 'full' &&  $scope.translateBook.fromLang == 'en') 
    {
      console.log(text, text.match(/\b.*\b/g)[0]);
      text = text.match(/\b.*\b/g)[0]
    }
  
    $scope.translateBook.outText = text;
    $scope.translateBook.target = event;
    inputTextFrom.value = text;

    //окно перевода непосредственно над словом
    var y = event.target.getBoundingClientRect().top;
    var x = event.target.getBoundingClientRect().left;
    
    var xPointer = event.target.getBoundingClientRect().left;
  
    if (x + MAXTRWIDTH > window.innerWidth)
      x= window.innerWidth - MAXTRWIDTH;
    
    if (!$scope.API.isFullScreen) {
      y -=  vinW.getBoundingClientRect().top;
      x -=  vinW.getBoundingClientRect().left;
      xPointer -=  vinW.getBoundingClientRect().left;
    }

    trBox.style.top  =  y - TRBOXHEIGHT - 5 + 'px';
    trBox.style.left = x - 20 + 'px';
    
   //указатель над словом  
    trBoxPointer.style.left = xPointer - x + 20 + 'px';

    $scope.translateBook.visible = true;
    $scope.translateBook.text = event.target.outerText;

    if (event.path) {
        $scope.translateBook.fromLang = event.path[3].dataset.lang || event.path[2].dataset.lang || event.path[1].dataset.lang  
    } else {
      $scope.translateBook.fromLang = event.target.parentNode.parentNode.parentNode.dataset.lang;
      console.log('язык перевода = ', $scope.translateBook.fromLang);
    }
    
  /*
    if ($scope.translateBook.fromLang == $scope.translateBook.toLang) {
      if ($scope.translateBook.fromLang == 'ru') {
        //не забыть заменить на язык пользователя по умолчанию
        $scope.translateBook.toLang = 'en'
      } 
      else 
        $scope.translateBook.toLang = 'ru'
    };
*/
    $scope.$apply();
  
    
    if (translateSourse == 'fast') {
      $scope.translateBook.translateText = '.........';
      inputTextTo.value = $scope.translateBook.translateText;
      Yandex_Factory.translateFast(
      $scope.translateBook.outText,
      $scope.translateBook.fromLang + '-' + $scope.translateBook.toLang,
      function(text){
            $scope.translateBook.translateText = text;
            inputTextTo.value = $scope.translateBook.translateText;
            $scope.translateBook.tr = '';
            $scope.translateBook.translatedText = [];
            
            $scope.$apply();
            //$scope.API.play();
            //$scope.API.pause();
      })
    };
   if (translateSourse == 'full') {
      Yandex_Factory.translateFull(
      $scope.translateBook.outText,
      $scope.translateBook.fromLang + '-' + $scope.translateBook.toLang,
      function(text){
            //$scope.translateBook.translateText = text;
            $scope.translateBook.fullTranslate = text;
            
            if (text == []) {
              $scope.translateBook.translateText = '';
              inputTextTo.value = $scope.translateBook.translateText;
            } else {
              $scope.translateBook.tr = text[0];
              $scope.translateBook.translatedText = text.slice(1);  
              $scope.translateBook.translateText = '';
              inputTextTo.value = $scope.translateBook.translateText;
              if (text[1])
                $scope.translateBook.translateText = text[1].rez[0];
                inputTextTo.value = $scope.translateBook.translateText;
            }
           $scope.$apply(); 
           // $scope.API.play();
           // $scope.API.pause();
      })
    };
  

};//end of $scope.showAndTranslateThen  function  
  

  $scope.onCompleteVideo = function() {
      //$scope.isCompleted = true;
      //$scope.currentVideo++;
      //if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;
      //$scope.setVideo(controller.currentVideo);
  };
    
  $scope.setVideo = function(index) {
      $scope.API.stop();
      $scope.currentVideo = index;
      $scope.config.sources = $scope.videos[index].sources;
      $timeout($scope.API.play.bind($scope.API), 100);
  };

  $scope.videoContent = Video_Factory.getOneContent($stateParams.id);
  
/*$scope.settings = { 
        "controls": true, 
        "autoplay": false, 
        "preload": "auto", 
        "aspectRatio": "640:360",
        "html5" : { "nativeTextTracks" : true },
        "techOrder" : [ "html5", "flash"], 
        "aspectRatio": "640:360",
        "playbackRates": [1, 1.5, 2], 
        "data-free": true,
        "width" : "400", 
        "height" : "150",
        "data-title": $scope.videoContent.title
      };*/
    
    $scope.config = {
        sources : $scope.videoContent.sources,
        tracks : $scope.videoContent.tracks,
        audio : $scope.videoContent.audio,
		autoHide: true,
		autoHideTime: 3000,
        theme: "css/videogular.css",
        plugins: {
            poster: $scope.videoContent.posters[0],
            cuepoints: {
                theme: {
                    url: "css/cuepoints.css",
                },
                points: [
                    { time: 18 },
                    { time: 60 },
                    { time: 160 },
                ],
            },
        }
    };
    
    //функция показа окна со списком титров
    $scope.showTitleList = false;
    $scope.showTitlesToggle = function() {
      $scope.showTitleList = !$scope.showTitleList;
      $timeout(function(){
        $scope.showTitleList = false;
      }, 5000)
       
    };
    //функция показа окна помощи по функциональным клавишам
    $scope.showHelp = false;
    $scope.showHelpToggle = function() {
      $scope.showHelp = !$scope.showHelp;
    };
    
    
 	$scope.onUpdateState = function(state) {
			$scope.state = state;
			console.log($scope.state);
	};


   
}])
.directive("myHelpSelect",
        function() {
            return {
                restrict: "E",
                require: "^videogular",
                template: "<my-help-button tabindex='22' class='iconButton' ng-click=showHelpToggle()></my-help-button>",
                link: function(scope, elem, attrs, API) {
                  scope.API = API;
                  
                }
            }
        }
    )
.directive("myTitlesSelect",
        function() {
            return {
                restrict: "E",
                require: "^videogular",
                template: "<my-titles-select-button tabindex='11' ng-click=showTitlesToggle() class='iconButton'></my-titles-select-button>",
                
             // template: "<span class='glyphicon glyphicon-subtitles'></span>",
               // template: "<div class='iconButton' ng-click='API.stop()'>STOP</div>",
                link: function($scope, elem, attrs, API) {
                   
                    
                }
            }
        }
    )
.directive(
		'vgCuepoints',
		[function() {
			return {
				restrict: 'E',
				require: '^videogular',
				templateUrl: 'templates/cuepoints.html',
				scope: {
					cuepoints: '=vgCuepointsConfig',
					theme: '=vgCuepointsTheme',
				},
				link: function($scope, elem, attr, API) {
					// shamelessly stolen from part of videogular's updateTheme function
					function updateTheme(value) {
						if (value) {
							var headElem = angular.element(document).find("head");
							headElem.append("<link rel='stylesheet' href='" + value + "'>");
						}
					}

					$scope.calcLeft = function(cuepoint) {
						if (API.totalTime === 0) return '-1000';

						var videoLength = API.totalTime / 1000;
						return (cuepoint.time * 100 / videoLength).toString();
					};

					$scope.onCuePointClick = function(cuepoint){
						API.seekTime(cuepoint.time);
					};

					updateTheme($scope.theme);
				},
			};
		}])



 