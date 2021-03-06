if(typeof exports === 'object' ) {
   var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.$youtube = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    
    var $youtube = function (apikey, debug) {
       
     if(root === this) {
        return new $youtube(apikey, debug);
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
      this.commentOptions = {};
      this.debug = debug || false;
      this.logs = [];

      return this;
    };
    
    $youtube.fn = $youtube.prototype = {
       
      getdata: function (passedOptions, callback) {
          
          var self = this;
          //var deepExtend = self.util.deepExtend;
          var myData;
          var defaults = {
            videoId: "",
            part: "snippet,statistics,contentDetails"
          };
          
          self.util.debug(self,'Method: getdata');
          self.util.debug(self,passedOptions);
          
          if(!self.yt.apikey) {
            callback(self.util.AllErrors(0));
            return false;
          }
          
          var options = self.util.deepExtend({}, defaults, passedOptions);
          
          if(!options.videoId) {
            callback(self.util.AllErrors(1));
            return false;
          }
         
          var myUrl= self.yt.apiUrl+"videos?id="+options.videoId+"&part=snippet,statistics,contentDetails&key="+self.yt.apikey;
          self.util.debug(self,myUrl);
            
          self.util.ajaxGet({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
                 
                 self.util.debug(self,data);
                 
                 if(typeof data === "string") {
                     data = JSON.parse(data);
                 }
                 
                 var responseItems = self.util.deepExtend({},self.videoData);
        
                 var firstItem = data.items[0];
                 var snippet = firstItem ? firstItem.snippet : "";
                 var contentDetails = firstItem.contentDetails;
                 var statistics = firstItem.statistics;
                 
                 if(snippet) {
                     responseItems = self.util.deepExtend({}, responseItems, snippet);
                 }
                 
                 if(snippet.thumbnails) {
                    responseItems.dthumbnail =  snippet.thumbnails.default ? snippet.thumbnails.default.url : "";
                    responseItems.mthumbnail =  snippet.thumbnails.medium ? snippet.thumbnails.medium.url : "";
                    responseItems.hthumbnail =  snippet.thumbnails.high ? snippet.thumbnails.high.url : "";
                    responseItems.sthumbnail =  snippet.thumbnails.standard ? snippet.thumbnails.standard.url : "";
                 }
                 
                 
                if(contentDetails)  {
                    
                    responseItems = self.util.deepExtend({}, responseItems, contentDetails);
                    
                    var dividedTime = self.util.divideTime(responseItems.duration);
                    responseItems.secs = dividedTime[0];
                    responseItems.mins = dividedTime[1];
                    responseItems.hr = dividedTime[2];
                }
                
                if(statistics) {
                    responseItems = self.util.deepExtend({}, responseItems, statistics);
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
        
      search: function (options, callback) {
        var self = this, myData, i;
        var defaults = {
            maxResults : 25,
            type : "basic",
            order : "Relevance",
            extraparam : "",
            navigate: "",
            nextPageToken: "",
            prevPageToken: ""
        };
        
        self.util.debug(self,'Method: search');
        self.util.debug(self,options);
        
        if(self.apikey === "") { 
            callback(self.util.AllErrors(0));
            return false;
        }
        
        if(!options) {
            callback(self.util.AllErrors(111));
            return false;
        }
        
        if(!options.keyword && !options.extraparam) { 
            callback(self.util.AllErrors(2));
            return false;
        }
        
        options = self.util.deepExtend({}, defaults, options);
        
        if(options.maxResults > 50 || options.maxResults < 1) {
            callback(self.util.AllErrors(12));
            return false;
        } 
        
        if(options.extraparam) { 
            options.extraparam = "&"+options.extraparam;
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
            
            if (options.navigate == "next") { 
                if(self.searchOptions.nextPageToken) {
                   options.navigate = "&pageToken=" + self.searchOptions.nextPageToken;
                }   
                else { 
                    callback(self.util.AllErrors(21));
                    return false;
                }
                
            }
            
            else if (options.navigate == "prev") { 
                if(self.searchOptions.prevPageToken) {
                    options.navigate = "&pageToken=" + self.searchOptions.prevPageToken ;
                }
                else { 
                    callback(self.util.AllErrors(21));
                    return false;
                }
            }
        }
        
       
       if(options.keyword) {
         options.keyword = "&q="+options.keyword;
       }  
        
        
       var myUrl = self.yt.apiUrl + "search?part=snippet"+options.navigate+"&maxResults="+options.maxResults+"&order="+options.order+"&key="+self.yt.apikey+options.extraparam;
       
       self.util.debug(self,myUrl);
       
         self.util.ajaxGet({
          url: myUrl,
          dataType: 'json',
          async: false,
          data: myData,
          success: function(data) {
              
              var totalResults;
              
              self.util.debug(self,'Data success');
              self.util.debug(self,data);
              
              if(typeof data === "string") {
                 data = JSON.parse(data);
              }
              
              totalResults = data.pageInfo.totalResults;
              
              if(totalResults == 0) {
                  callback(self.util.AllErrors(13));
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
                     
                    
                if(options.type.toLowerCase() === "detailed") {
                  var videosReturned = 0;
                  self.getdata({videoId: videos[i].videoId}, function(err, videoData){
                     if(err) {
                       callback(err, response);
                       self.util.debug(self,err);
                     }
                     
                     videos[i] = videoData;
                     videosReturned = videosReturned + 1;
                     
                     
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

              }
              
           }
         });
            

      },
      
      getComments: function (options, callback) {
        var self = this, myData, i, navigate="";
        var defaults = {
          maxResults : 25,
          type : "basic",
          extraparam : "",
          navigate: "",
          nextPageToken: "",
          prevPageToken: "",
          startindex: 1
        };
        
        
        self.util.debug(self,'Method: getComments');
        self.util.debug(self,options);
        
        
        if(self.apikey === "") { 
          callback(self.util.AllErrors(0));
          return false;
        }
        
        if(!options) {
          callback(self.util.AllErrors(111));
          return false;
        }
        
        options = self.util.deepExtend({}, defaults, options);
        
        if(!options.videoId) { 
          callback(self.util.AllErrors(2));
          return false;
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
            
            if (options.navigate == "next") { 
                if(self.commentOptions.nextPageToken) {
                   navigate = "&pageToken=" + self.commentOptions.nextPageToken;
                }   
                else { 
                    callback(self.util.AllErrors(21));
                    return false;
                }
                
            }
            
            else if (options.navigate == "prev") { 
                if(self.commentOptions.prevPageToken) {
                    navigate = "&pageToken=" + self.commentOptions.prevPageToken ;
                }
                else { 
                    callback(self.util.AllErrors(21));
                    return false;
                }
            }
        }
        
        
        options = self.util.deepExtend({}, defaults, options);
        
        var myUrl= self.yt.apiUrl+"commentThreads?part=snippet&videoId="+options.videoId+navigate+"&maxesults="+options.maxResults+"&key="+self.yt.apikey; //+"&maxResults="+maxResults;
        self.util.debug(self,myUrl);

        self.util.ajaxGet({
          url: myUrl,
          dataType: 'json',
          async: false,
          data: myData,
          success: function(data) {
            var entries;
            var comments = {};
            
            self.util.debug(self,'Data success');
            self.util.debug(self,data);
          
            if(typeof data === "string") {
              data = JSON.parse(data);
            }
            
            comments.raw = data;
          
            if(data.items) {
              comments.resultsPerPage = data.pageInfo.resultsPerPage;
              comments.totalResults = data.pageInfo.totalResults;
              comments.nextPageToken = data.nextPageToken;
              comments.prevPageToken = data.prevPageToken;
              self.commentOptions.nextPageToken = data.nextPageToken;
              self.commentOptions.prevPageToken = data.prevPageToken;
              
              if(comments.totalResults == 0) {
                return this.ErrorAll(13);
              }
              
              //comments.index = startindex;
              
              comments.items = [];
              
              for(i=0; i<comments.resultsPerPage; i++) {
                comments.items[i] = data.items[i].snippet.topLevelComment.snippet;
              }
              callback(null, comments);
              return true;
             }
             callback(self.util.AllErrors(404), comments);
             return false;
          }
       });
      },
      
      getRelatedVideos: function (options, callback) {
        var self = this;
        var defaults = {
          maxResults : 25,
          type : "basic",
          extraparam : "",
          navigate: "",
          nextPageToken: "",
          prevPageToken: "",
          startindex: 1,
          videoId: "",
        };
        
        
        self.util.debug(self,'Method: getRelatedVideos');
        self.util.debug(self,options);
        
        
        if(self.apikey === "") { 
          callback(self.util.AllErrors(0));
          return false;
        }
        
        if(!options) {
          callback(self.util.AllErrors(111));
          return false;
        }
        
        options = self.util.deepExtend({}, defaults, options);
        
        options.extraparam = options.extraparam + "&type=video&relatedToVideoId=" + options.videoId;
        
        self.search(options, callback);
      }
        
        
    };
    
    $youtube.prototype.util = {
      
        AllErrors: function(errno) {
        
            var errors ={
                "0":["NO_API_KEY", "Please Provide Api Key using object.apikey (or) inside $youtube(apikey)"],
                "1":["NO_VIDEO_ID", "Please Supply video id while calling the function ex:getdata(videoid)"],
                "11":["NO_KEYWORD", "Please Provide Keyword to search"],
                "12":["MAX_RESULTS_OUT_OF_RANGE", "Please Enter Valid maxResults value ranging from 0 to 50"],
                "13":["OUT_OF_RANGE", "Less than zero values"],
                "21":["NO_NEXT_PAGE", "No Next Page"],
                "22":["NO_PREV_PAGE", "No Previous Page"],
                "23":["INVALID_INDEX_OUT_OF_RANGE", "Please enter valid start index, it shoukd range from 1 to 999"],
                "404": ["NOT_FOUND", 'not found']
            };
            
            var errormsg ={};
            
            errormsg.type = errors[errno][0];
            errormsg.msg = errors[errno][1];
            errormsg.number = errno;
            
            return errormsg;
        },
        
        divideTime : function(duration) {
            var matches = duration.match(/\d+\.?\d*/g);
            var length=matches.length;
            var secs, mins, hr;
            secs=parseInt(matches[length-1]);
            if(length>1) mins=parseInt(matches[length-2]); else mins=0;
            if(length>2) hr=parseInt(matches[length-3]); else hr=0;
            return [secs, mins, hr];
        },
        
        ajaxGet : function(options) {
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
        },
        
        deepExtend : function(out) {
          out = out || {};
          
        
          for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
        
            if (!obj)
              continue;
        
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                  out[key] = this.deepExtend(out[key], obj[key]);
                else
                  out[key] = obj[key];
              }
            }
          }
        
          return out;
        },
        
        debug: function(instance, msg) {
          var self = instance;
          
          self.logs.push(msg);
          
          if(self.debug) {
            console.log(msg);
          }
          
          return true;
        }
    };
   
   return $youtube;
  
});


