(function (window, $) {
    
    var $youtube = function (apikey) {
       
        if(window === this) {
            return new $youtube(apikey);
        }
        
        this.yt = {
            apikey : apikey,
            apiUrl : 'https://www.googleapis.com/youtube/v3/',
            version :"1.0"
        };
        
        this.videoData = {
            title : "",
            description : "",
            rating : "",
            views : "",
            publishedAt : "",
            dthumbnail : "",
            mthumbnail : "",
            hthumbnail : "",
            sthumbnail : "",
            categoryId : "",
            channelTitle : "",
            videoId  : "",
            duration : "",
            mins : "",
            hr : "",
            secs : "",
            dimension : "",
            definition : "",
            caption : "",
            licensedContent : "",
            viewCount : "",
            likeCount : "",
            dislikeCount : "",
            favoriteCount : "",
            commentCount : "",
            kind : ""
          };
        
        this.searchOptions = {};  

        return this;
    };
    
    $youtube.fn= $youtube.prototype = {
       
        getdata: function(options, callback) {
          
          var self = this;
          var myData, videoId;
          
          videoId = options.videoId;
          
          if(this.apikey === "") { 
            return this.ErrorAll(0);
          }
          
          if(!videoId) { 
            return this.ErrorAll(1);
          }
         
          var myUrl= self.yt.apiUrl+"videos?id="+videoId+"&part=snippet,statistics,contentDetails&key="+this.yt.apikey;
            
          ajaxGet({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
                 
                 if(typeof data === "string") {
                     data = JSON.parse(data);
                 } 
                 
                 var responseItems = deepExtend({},self.videoData);
        
                 var firstItem = data.items[0];
                 var snippet = firstItem ? firstItem.snippet : "";
                 var contentDetails = firstItem.contentDetails;
                 var statistics = firstItem.statistics;
                 
                 if(snippet) {
                     responseItems = deepExtend({}, responseItems, snippet);
                     /*
                     responseItems.title= snippet.title;
                     responseItems.description= snippet.description;
                     responseItems.publishedAt= snippet.publishedAt;
                     responseItems.categoryId=  snippet.categoryId;
                     responseItems.channelTitle= snippet.channelTitle;*/
                 }
                 
                 if(snippet.thumbnails) {
                    responseItems.dthumbnail =  snippet.thumbnails.default ? snippet.thumbnails.default.url : "";
                    responseItems.mthumbnail =  snippet.thumbnails.medium ? snippet.thumbnails.medium.url : "";
                    responseItems.hthumbnail =  snippet.thumbnails.high ? snippet.thumbnails.high.url : "";
                    responseItems.sthumbnail =  snippet.thumbnails.standard ? snippet.thumbnails.standard.url : "";
                 }
                 
                 
                if(contentDetails)  {
                    
                    responseItems = deepExtend({}, responseItems, contentDetails);
                    
                    /*responseItems.dimension = contentDetails.dimension;
                    responseItems.efinition = contentDetails.definition;
                    responseItems.caption = contentDetails.caption;
                    responseItems.licensedContent = contentDetails.licensedContent;
                    responseItems.duration = contentDetails.duration;*/
                    
                    var dividedTime = divideTime(responseItems.duration);
                    responseItems.secs = dividedTime[0];
                    responseItems.mins = dividedTime[1];
                    responseItems.hr = dividedTime[2];
                }
                
                if(statistics) {
                    responseItems = deepExtend({}, responseItems, statistics);
                    
                    /*responseItems.viewCount = statistics.viewCount;
                    responseItems.likeCount = statistics.likeCount;
                    responseItems.dislikeCount = statistics.dislikeCount;
                    responseItems.favoriteCount = statistics.favoriteCount;
                    responseItems.commentCount = statistics.commentCount;*/
                }
                
                responseItems.kind = data.kind;
                
                responseItems.raw = data;
                
                callback(null, responseItems);
                return false;
              },
              fail : function(data) {
                callback(data, null);
                return false;
              },
            });
            

            return self;
        },
        
        search: function(options, callback, keyword, maxResults, fullResults, order, navigate, extraparam) {
            var i;
            var self = this,myData,videos= {},k;
            var defaults = {
                maxResults : 25,
                getAllVideosMetaInfo : false,
                order : "Relevance",
                extraparam : "",
                navigate: "",
                nextPageToken: "",
                prevPageToken: ""
            };
            
            
            if(self.apikey === "") { 
                callback(self.ErrorAll(0));
                return false;
            }
            
            if(!options) {
                callback(self.ErrorAll(111));
                return false;
            }
            
            if(!options.keyword) { 
                callback(self.ErrorAll(2));
                return false;
            }
            
            options = deepExtend({}, defaults, options);
            
            if(options.maxResults > 50 || options.maxResults < 1) {
                callback(self.ErrorAll(12));
                return false;
            } 
            
            if(extraparam) { 
                extraparam = "&"+extraparam;
            }
            
            if(options.nextPageToken) {
                self.searchOptions.nextPageToken = options.nextPageToken;
                options.navigate = "next";
            }
            
            if(options.prevPageToken) {
                self.searchOptions.prevPageToken = options.prevPageToken;
                options.navigate = "prev";
            }
            
            if(options.navigate) {
                
                if (navigate == "next") { 
                    if(self.searchOptions.nextPageToken) {
                       navigate = "&pageToken=" + self.searchOptions.nextPageToken;
                    }   
                    else { 
                        callback(self.ErrorAll(21));
                        return false;
                    }
                    
                }
                
                else if (navigate == "prev") { 
                    if(self.searchOptions.prevPageToken) {
                        navigate = "&pageToken=" + self.searchOptions.prevPageToken ;
                    }
                    else { 
                        callback(self.ErrorAll(21));
                        return false;
                    }
                }
            }
            
            
            
           var myUrl = self.yt.apiUrl + "search?part=snippet"+options.navigate+"&q="+options.keyword+"&maxResults="+options.maxResults+"&order="+options.order+"&key="+self.yt.apikey+options.extraparam;
           
           console.log(myUrl);
             ajaxGet({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
                  
                  var totalResults;
                  
                  if(typeof data === "string") {
                     data = JSON.parse(data);
                  }
                  
                  totalResults = data.pageInfo.totalResults;
                  
                  if(totalResults == 0) {
                      callback(self.ErrorAll(13));
                      return false;
                  }
                  
                  var items = data.items;
                  var itemsLength = items.length;
                  var response = {};
                  var videos = [];
                  
                  response.totalResults = totalResults;
                  
                  for(i=0; i<itemsLength; i++) {
                      videos[i]={};     
                      videos[i] = items[i].snippet;
                      videos[i].videoId = items[i].id.videoId;
                  
                          /*if(fullResults!=1)
                          {
                         
                          if(data.items[i].snippet.thumbnails.default)    
                          videos[i].dthumbnail= data.items[i].snippet.thumbnails.default.url;
                          else videos[i].dthumbnail=undefined;
                          
                          if(data.items[i].snippet.thumbnails.medium) 
                          videos[i].mthumbnail= data.items[i].snippet.thumbnails.medium.url;
                          else videos[i].mthumbnail=undefined;
                          
                          if(data.items[i].snippet.thumbnails.high) 
                          videos[i].hthumbnail= data.items[i].snippet.thumbnails.high.url;
                          else videos[i].hthumbnail=undefined;
                          
                          if(data.items[i].snippet.thumbnails.standard) 
                          videos[i].sthumbnail= data.items[i].snippet.thumbnails.standard.url;
                          else videos[i].sthumbnail=undefined;
                          }
                          
                          else
                          {*/
                         
                        
                        if(options.getAllVideosMetaInfo) {
                          var videosReturned = 0;
                          self.getdata({videoId: videos[i].videoId}, function(err, videoData){
                             if(err) {
                               callback(err, response);
                               console.log(err);
                             }
                             console.log(videoData);
                             videos[i] = videoData;
                             videosReturned = videosReturned + 1;
                             
                             console.log(videosReturned);
                             console.log(itemsLength);
                             
                             if(itemsLength === videosReturned) {
                                if(data.nextPageToken) self.searchOptions.nextPageToken = data.nextPageToken;
                                if(data.prevPageToken) self.searchOptions.prevPageToken = data.prevPageToken;
                                
                                response.prevPageToken = data.prevPageToken;
                                response.nextPageToken = data.nextPageToken;
                                response.videos = videos;
                                response.raw = data;
                            
                                callback(null, response);
                             }
                          });
                        } else if(i === itemsLength -1) {
                            if(data.nextPageToken) self.searchOptions.nextPageToken = data.nextPageToken;
                            if(data.prevPageToken) self.searchOptions.prevPageToken = data.prevPageToken;
                            
                            response.prevPageToken = data.prevPageToken;
                            response.nextPageToken = data.nextPageToken;
                            response.videos = videos;
                            response.raw = data;
                            
                            callback(null, response);
                        }
                          
                        
                             
                             /*videos[i].title = k.title;
                             videos[i].description = k.description;
                             videos[i].rating=k.rating;
                             videos[i].views=k.views;
                             videos[i].publishedAt=k.publishedAt;
                             videos[i].dthumbnail=k.dthumbnail;
                             videos[i].mthumbnail=k.mthumbnail;
                             videos[i].hthumbnail=k.hthumbnail;
                             videos[i].sthumbnail=k.sthumbnail;
                             videos[i].categoryId=k.categoryId;
                             videos[i].channelTitle=k.channelTitle;
                             
                
                             
                             videos[i].duration=k.duration;
                             videos[i].hr=k.hr;
                             videos[i].mins=k.mins;
                             videos[i].secs=k.secs;
                             videos[i].dimension=k.dimension;
                             videos[i].definition=k.definition;
                             videos[i].caption=k.caption;
                             videos[i].licensedContent=k.licensedContent;
                             
                             videos[i].viewCount=k.viewCount;
                             videos[i].likeCount=k.likeCount;
                             videos[i].dislikeCount=k.dislikeCount;
                             videos[i].favoriteCount=k.favoriteCount;
                             videos[i].commentCount=k.commentCount;
                          
                          /*}*/
    
                  }
                  
               }
             });
            

          },
   }
  window.$youtube = $youtube;
})(window, jQuery);

function divideTime(duration){
    var matches = duration.match(/\d+\.?\d*/g);
    var length=matches.length;
    var secs, mins, hr;
    secs=parseInt(matches[length-1]);
    if(length>1) mins=parseInt(matches[length-2]); else mins=0;
    if(length>2) hr=parseInt(matches[length-3]); else hr=0;
    return [secs, mins, hr];
};

function ajaxGet(options) {
  if( !options ) {
    return false;  
  }
  
  if(!options.url) {
    return false;  
  }
  
  if(!options.success) {
      options.success = function(){}
  }
  
  if(!options.fail) {
      options.fail = function(){}
  }
  var request = new XMLHttpRequest();

  request.open('GET', options.url, true);
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        options.success(resp);
      } else {
        options.fail(request);
      }
    };
    
    request.onerror = function() {
      // There was a connection error of some sort
    };
    
    request.send(); 
};

var deepExtend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};
