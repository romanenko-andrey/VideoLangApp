angular.module('MyApp')
  .factory('Nav_Factory', function() {
  
})
           

  .factory('Video_Factory', function() {
    var content = [
      {"_id" : 1,
       "type" : "сериал",
       "title" : "История христианства.",
       "sub_title": "Эпизод 1. Первые христиане.",
       "lang" : "en",//язык озвучки
       "rating": 5,
       "length": "59 мин",
        'about' : "Donec id elit non mi porta gravida at eget metus. <br> Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. <br> Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui",
       sources: [
                {
                    src: "video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.mp4",
                    type: 'video/mp4'
                },
                {
                    src: 'video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.webm',
                    type: 'video/webm'
                }
            ],
       tracks: [
                {
                    kind: 'subtitles',
                    label: 'Руские титры',
                    src: 'video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.ru.vtt',
                    srclang: 'ru',
                    default: true
                },
          ],
     
        audioTrack  : [
          {
           "lang" : "en",
           "src"  : "video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.eng.ac3", 
           type: "audio/ogg",
           default: true}
        ],
       
        "posters" : [
          "video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.poster2.jpg",
          "video/2009 - BBC - История христианства. Эпизод 1 - Первые христиане.poster1.jpg",
        ],
        "year": "2009"},
      
      {"_id" : 2,
        "type" : "документальный фильм",
       "title" : "JamesVeitch",
       "sub_title": "Очерки...",
       "lang" : "ru",
       "rating": 4,
       "length": "8 мин",
       'about' : "Donec id elit non mi porta gravida at eget metus. <br> Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. <br> Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui",
        sources: [
                {
                    src: "video/JamesVeitch_2016T-480p-en.mp4",
                    type: 'video/mp4'
                },
                {
                    src: '',
                    type: 'video/webm'
                }
            ],
       tracks: [
                {
                    kind: 'subtitles',
                    label: 'English track',
                    src: 'video/JamesVeitch_2016T.vtt',
                    srclang: 'en',
                    default: true,
                   
                },
                {
                    kind: 'subtitles',
                    label: 'Espaniol',
                    src: 'video/JamesVeitch_2016T.es.vtt',
                    srclang: 'es',
                    default: false,
                    
                },
                {
                    kind: 'subtitles',
                    label: 'Latvia',
                    src: 'video/JamesVeitch_2016T.lt.vtt',
                    srclang: 'lt',
                    default: false,
                    
                },
          ],
        "audio" : [
          
        ],
        "posters" : [
          "video/JamesVeitch_2016T.1.jpg",
          "video/JamesVeitch_2016T.2.jpg",
        ],
        "year": "2016"},  
      
      {"_id" : 3,
        "type" : "документальный фильм",
       "title" : "PaoloCardini.",
       "sub_title": "Очерки...",
       "lang" : "en",
       "rating": 3,
       "length": "2 мин 50 с",
        'about' : "Donec id elit non mi porta gravida at eget metus. <br> Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. <br> Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui",
        sources: [
                {
                    src: "video/PaoloCardini_2012G-480p-en.mp4",
                    type: 'video/mp4'
                },
                {
                    src: '',
                    type: 'video/webm'
                }
            ],
       tracks: [
                {
                    kind: 'subtitles',
                    label: 'English',
                    src: 'video/PaoloCardini_2012G.en.vtt',
                    srclang: 'en',
                    default: true
                },
                {
                    kind: 'subtitles',
                    label: 'Русские титры',
                    src: 'video/PaoloCardini_2012G.ru.vtt',
                    srclang: 'ru',
                    default: false
                },
          ],
        "audio" : [
          {"lang" : "en",
           "src"  : "video/PaoloCardini_2012G.en.mp3"}
        ],
        "posters" : [
          "video/PaoloCardini_2012G.1.jpg",
          "video/PaoloCardini_2012G.2.jpg",
        ],
        "year": "2009"}, 
      
      {"_id" : 4,
        "type" : "мультсериал",
       "title" : "Симпсоны",
       "sub_title": "СПРИНГФИЛДСКАЯ АТОМНАЯ ЭЛЕКТРОСТАНЦИЯ",
       "lang" : "ru",
       "rating": 3,
       "length": "59 мин",
        'about' : "Donec id elit non mi porta gravida at eget metus. <br> Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. <br> Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui",
        sources: [
                {
                    src: "video/The.Simpsons.S27E01. WEB-DLRip.mp4",
                    type: 'video/mp4'
                }
                
            ],
       tracks: [
                {
                    kind: 'subtitles',
                    label: 'Руские титры',
                    src: 'video/The.Simpsons.S27E01. WEB-DLRip.rus.vtt',
                    srclang: 'ru',
                    default: true
                },
                {
                    kind: 'subtitles',
                    label: 'English',
                    src: 'video/The.Simpsons.S27E01. WEB-DLRip.eng.vtt',
                    srclang: 'en',
                    default: false
                },
          ],
        "audio" : [
          
        ],
        "posters" : [
          "video/The.Simpsons.S27E01. WEB-DLRip.1.jpg",
          "video/The.Simpsons.S27E01. WEB-DLRip.2.jpg",
        ],
        "year": "2009"}, 
     
    ];
        
    return {
      getOneContent: function(id) {
        for (var i=0; i<content.length; i++){
          if (content[i]._id == id) return content[i]
        }
        return {} 
      },
      
      getContentList: function() {
        return content
      },
      
    };
  });