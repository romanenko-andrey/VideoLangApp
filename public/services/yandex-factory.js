angular.module('MyApp')
  .factory('Yandex_Factory', function() {
  
  return {
		lines : {},
		keyFast : 'trnsl.1.1.20160912T091343Z.90296b524e8e6868.d9057501c990662b360acc4f0c68d3b757d2bcf0',
		apiFast : 'https://translate.yandex.net/api/v1.5/tr.json/translate',
    
    //ключ от словаря
		keyDict : 'dict.1.1.20160916T043121Z.c8b0dc3e8bcb4dbe.2aef0e2c020ad3c309acb0b5f29e65fe96d8c65e',
		apiDict : 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
		
		errorParse : function (err){
			switch (err) {
				case 200:
				  return "ERR_OK. Операция выполнена успешно."
				  break
				case 401:
				  return "ERR_KEY_INVALID. Ключ API невалиден."
				  break
				case 402:
				  return "ERR_KEY_BLOCKED. Ключ API заблокирован."
				  break
				case 403:
				  return "ERR_DAILY_REQ_LIMIT_EXCEEDED. Превышено суточное ограничение на количество запросов."
				  break
				case 413:
				  return "ERR_TEXT_TOO_LONG. Превышен максимальный размер текста."
				  break
				case 501:
				  return "ERR_LANG_NOT_SUPPORTED. Заданное направление перевода не поддерживается."
				  break  
				default:
				  return "Error. Неизвестная ошибка."
				  break
			}	
		},
		
		rezParse: function(text){
			var arr = [];
			var isTr = false;
			for (var i=0; i<text.def.length; i++){
				if (!isTr){
					arr.unshift(text.def[i].ts );
					isTr = true;
				};
				var o = {};
				switch (text.def[i].pos) {
				case "noun":
				  o.pos = 'имя существительное';
				  break
				case "adjective":
				   o.pos = 'имя прилагательное';
				  break
				case "adverb":
				   o.pos =  'наречие';
				  break
				case "verb":
				   o.pos =  'глагол'
				  break
				case "pronoun":
				   o.pos = 'местоимение';
				  break
				case "particle":
				   o.pos = 'частица';
				  break  
                case "participle":
				   o.pos = 'причастие';
				  break    
				case "conjunction":
				   o.pos = 'союз';
				  break
				case "numeral":
				   o.pos = 'числительное';
				  break	
				case "preposition":
				   o.pos = 'предлог';	
				  break
				default:
				   o.pos = text.def[i].pos ;
				  break
				};
				
				
				o.rez = [];
				for (var j=0; j<text.def[i].tr.length; j++){
					o.rez.push( text.def[i].tr[j].text );
				};
				arr.push(o);
				
			}
			return arr
		},
    
    
        translateFull : function (text, lang, callback){
			var url = this.apiDict + '?';
			url += 'key=' + this.keyDict;
			url += '&lang=' + (lang || 'ru-en');
			url += '&text=' + encodeURIComponent(text);
			
			console.log(url);
			
			var that  = this;
			
			var ajax = new XMLHttpRequest();
			ajax.open('GET', url, true);
			ajax.onreadystatechange = function(){
				if (ajax.readyState == 4) {
					if (ajax.status == 200) {
						text = ajax.responseText;
						text = JSON.parse(text);
                        callback(that.rezParse(text));
					} else {
                      console.log(that.errorParse(ajax.status));
                    }
				}
			};
			ajax.send(null);
		},
    
		translateFast : function (text, lang, callback){
			var url = this.apiFast + '?';
			url += 'key=' + this.keyFast;
			url += '&text=' + encodeURIComponent(text);
			url += '&lang=' + (lang || 'ru-en');
		
            //console.log(url);	
          
			var that  = this;
			
			var ajax = new XMLHttpRequest();
			ajax.open('GET', url, true);
			ajax.onreadystatechange = function(){
				if (ajax.readyState == 4) {
					if (ajax.status == 200) {
						text = ajax.responseText;
                 		text = JSON.parse(text);
                        text = text.text[0];
   						callback(text);
					} else {
                      console.log(that.errorParse(ajax.status));
                    }
				}
			};
			ajax.send(null);
		},
        
        speachConfig : {
          // API-ключ. Может быть задан глобально через объект ya.speechkit.settings.
          apikey: '92618208-e2eb-477d-9f28-d13eb5456fdf',
          // Эмоциональная окраска: добрый голос.
          emotion: 'good', //good, evil, neutral
          // Скорость речи.
          speed: 1.0,
          //Язык воспроизведения 
          //Сейчас поддерживаются русский (ru-RU) и английский (en-US) языки
          lang: 'ru-RU',
          // Имя диктора.
          speaker: 'jane',  //;женские = jane, oksana, alyss и omazh, мужские = zahar и ermil.
          /*stopCallback: function () {
              console.log("Озвучивание текста завершено.");
          }*/
        },
    
        tts: function(){
          if (!!ya)
            return new ya.speechkit.Tts(this.speachConfig)
          else 
            return undefined;
        },
    
        speach : function(o,  text, callback) {
            this.speachConfig.stopCallback = callback;
		    o.speak(
			// Текст для озвучивания.
			text,
			// Переопределяем настройки синтеза.
			this.speachConfig)
        },
        
        languages : ["ru", "en", "pl", "uk", "de", "fr", "es", "it", "tr"],
    
        getRandomText : function() {
            var text = [
              "Мы говорим с тобой на разных языках... но вещи, о которых мы говорим, от этого не меняются.",
              "Кто не работает, тот понарошку! А кто понарошку работает — тот всё равно понарошку!",
              "Человек должен быть честным по натуре, а не по обстоятельствам.",
              "Надо покорять умом то, что нельзя одолеть силой",
              "Я всегда говорю, что думаю, и думаю, что говорю.",
              "Своим долголетием я обязана спорту. Я им никогда не занималась.",
              "Ты навсегда в ответе за всех, кого приручил.",
              "- Вы утверждаете, что человек может поднять себя за волосы? — Обязательно! Мыслящий человек просто обязан время от времени это делать."
              
            ];
            var r = Math.floor( Math.random()*text.length);
            console.log(r, text[r]);
            return text[r];
        }
	}; //end of yandex Translater
})
           

  