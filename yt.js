(function (window) {
    
    var $youtube = function (apikey) {
       
        if(window === this ) {
            return new $youtube(apikey);
        }
        
        this.defaults = {
           apikey: "",
           version: ""
        }; 
        this.apikey = apikey;
        this.version ="1.0";
        this.title = 0;
        this.content = 0;
        this.rating = 0;
        this.views = 0;
        this.videos={};

        
    return this;
    };
    
   $youtube.fn= $youtube.prototype = {
       
       
        getdata: function(options) {
          
          var self = this,myData,videoid;
          
          videoid = options.videoid;
          
          if(this.apikey === "") { 
            return this.ErrorAll(0);
          }
          if(!videoid) { 
            return this.ErrorAll(1);
          }
         
          var myUrl="https://www.googleapis.com/youtube/v3/videos?id="+videoid+"&part=snippet,statistics,contentDetails&key="+this.apikey;
            
          $.ajax({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
            
                 var title="",description="",rating=0,views=0,numRaters,k=0,publishedAt="",dthumbnail,mthumbnail,hthumbnail,sthumbnail,categoryId="",channelTitle="",hr,mins,secs;
                 var viewCount,likeCount,dislikeCount,favoriteCount,commentCount,i;
                 var duration,dimension,definition,caption,licensedContent;
                 
                 if(data.items[0].snippet) { title= data.items[0].snippet.title; } else {title =0;}
                 if(data.items[0].snippet) { description= data.items[0].snippet.description;} else{description =undefined;}
                 if(data.items[0].snippet) { publishedAt= data.items[0].snippet.publishedAt;} else{publishedAt =undefined;}
                 if(data.items[0].snippet) { categoryId= data.items[0].snippet.categoryId;} else{categoryId =undefined;}
                 if(data.items[0].snippet) { channelTitle= data.items[0].snippet.channelTitle;} else{channelTitle =undefined;}
                
                 
                 if(data.items[0].snippet.thumbnails.default)
                 dthumbnail= data.items[0].snippet.thumbnails.default.url;
                 else dthumbnail=undefined;
                 
                 if(data.items[0].snippet.thumbnails.medium)
                 mthumbnail= data.items[0].snippet.thumbnails.medium.url;
                 else mthumbnail=undefined;
                 
                 if(data.items[0].snippet.thumbnails.high)
                 hthumbnail= data.items[0].snippet.thumbnails.high.url;
                 else hthumbnail=undefined;
                 
                 if(data.items[0].snippet.thumbnails.standard)
                 sthumbnail= data.items[0].snippet.thumbnails.standard.url;
                 else sthumbnail=undefined;
                 
                 
                 
                 if(data.items[0].contentDetails)  { duration= data.items[0].contentDetails.duration;
                 var matches = duration.match(/\d+\.?\d*/g);
                 var length=matches.length;
                 secs=parseInt(matches[length-1]);
                 if(length>1) mins=parseInt(matches[length-2]); else mins=0;
                 if(length>2) hr=parseInt(matches[length-3]); else hr=0;
                 
                 } else {duration =undefined;}
                 if(data.items[0].contentDetails)  { dimension= data.items[0].contentDetails.dimension; } else {dimension =undefined;}
                 if(data.items[0].contentDetails)  { definition= data.items[0].contentDetails.definition; } else {definition =undefined;}
                 if(data.items[0].contentDetails)  { caption= data.items[0].contentDetails.caption; } else {caption =undefined;}
                 if(data.items[0].contentDetails)  { licensedContent= data.items[0].contentDetails.licensedContent; } else {licensedContent =undefined;}
                 
                 if(data.items[0].statistics)  {viewCount= data.items[0].statistics.viewCount; } else {viewCount =undefined;}
                 if(data.items[0].statistics)  {likeCount= data.items[0].statistics.likeCount; } else {likeCount =undefined;}
                 if(data.items[0].statistics)  { dislikeCount= data.items[0].statistics.dislikeCount; } else {dislikeCount =undefined;}
                 if(data.items[0].statistics)  { favoriteCount= data.items[0].statistics.favoriteCount; } else {favoriteCount =undefined;}
                 if(data.items[0].statistics)  { commentCount= data.items[0].statistics.commentCount; } else {commentCount =undefined;}
                
                 
                 
                 self.title = title;
                 self.description = description;
                 self.rating=rating;
                 self.views=views;
                 self.publishedAt=publishedAt;
                 self.dthumbnail=dthumbnail;
                 self.mthumbnail=mthumbnail;
                 self.hthumbnail=hthumbnail;
                 self.sthumbnail=sthumbnail;
                 self.categoryId=categoryId;
                 self.channelTitle=channelTitle;
                 self.videoId =videoid;
                 
                 self.duration=duration;
                 self.mins=mins;
                 self.hr=hr;
                 self.secs=secs;
                 self.dimension=dimension;
                 self.definition=definition;
                 self.caption=caption;
                 self.licensedContent=licensedContent;
                 
                 self.viewCount=viewCount;
                 self.likeCount=likeCount;
                 self.dislikeCount=dislikeCount;
                 self.favoriteCount=favoriteCount;
                 self.commentCount=commentCount;
             
             
             
              }
            });
            

            return this;
            
            
        },
        
        
        search: function(keyword,maxResults,fullResults,order,navigate,extraparam) {
            var i;
            var self = this,myData,videos= {},k;
            if(this.apikey === "") { return this.ErrorAll(0);}
            if(!keyword) { return this.ErrorAll(2);}
            if(!maxResults) { maxResults =25;} else { if(!(maxResults<50 && maxResults>1)) return this.ErrorAll(12); }
            if(fullResults) { if(fullResults == "yes") fullResults=1; else fullResults=0;}
            if(!order){order="Relevance";}
            if(extraparam) { extraparam = "&"+extraparam;} else {extraparam="";}
            if(navigate) {
                if (navigate == "next") { if(this.videos.nextPageToken) navigate = "&pageToken="+this.videos.nextPageToken; else return this.ErrorAll(21); }
                else if (navigate == "prev") { if(this.videos.prevPageToken) navigate = "&pageToken="+this.videos.prevPageToken ; else {return this.ErrorAll(22);} }
                else navigate="";
            }
            
            console.log(keyword);
            
            
            
           var myUrl="https://www.googleapis.com/youtube/v3/search?part=snippet"+navigate+"&q="+keyword+"&maxResults="+maxResults+"&order="+order+"&key="+this.apikey+extraparam;
           
           
           console.log(myUrl);
             $.ajax({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
              var length;
              
              length= data.items.length;
              videos.total=data.pageInfo.totalResults;
              if(videos.total == 0) {return this.ErrorAll(13);}
              for(i=0;i<length;i++)
              {
              videos[i]={};     
              videos[i] = data.items[i].snippet;
              videos[i].videoId = data.items[i].id.videoId;
              
                      if(fullResults!=1)
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
                      {
                         k=self.getdata(videos[i].videoId);
                         
                         videos[i].title = k.title;
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
                      
                      }

              }
              
              
              self.videos =videos;
              if(data.nextPageToken) self.videos.nextPageToken=data.nextPageToken;
              if(data.prevPageToken) self.videos.prevPageToken=data.prevPageToken;
              console.log(videos);
              
              return videos;
              }
             });
            

          },
          
        
        standard: function(type,startindex,maxResults) {
            var i;
            var self = this,myData,videos= {0:{},1:{}},k;
            if(this.apikey === "") { return this.ErrorAll(0);}
            if(!type){type="top_rated";}
            if(type=="displayOptions") { return this.availableOptions(0);}
            if(startindex){ if(startindex>0 && startindex<1000) {} else return this.ErrorAll(0);}
            else {startindex=1;}
            if(!maxResults) { maxResults =25;} 
            else { 
              if(maxResults>50 || maxResults<1) return this.ErrorAll(12); 
            }
            console.log(type);
            
            
            
           var myUrl="https://gdata.youtube.com/feeds/api/standardfeeds/"+type+"?v=2&alt=json&start-index="+startindex+"&maxResults="+maxResults;
           
           console.log(myUrl);
             $.ajax({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
              var entries;
              
              console.log(data);
              entries= data.feed.entry;
             
              for(i=0;i<25;i++)
              {
              videos[i]={};
              //console.log(videos);
              videos[i].title = entries[i].title['$t'];
              videos[i].description =entries[i].media$group.media$description['$t'];
              videos[i].views=entries[i].yt$statistics.viewCount;
              videos[i].publishedAt=entries[i].published['$t'];
              
              videos[i].dthumbnail=entries[i].media$group.media$thumbnail[0].url;
              videos[i].mthumbnail=entries[i].media$group.media$thumbnail[1].url;
              videos[i].hthumbnail=entries[i].media$group.media$thumbnail[2].url;
              videos[i].sthumbnail=entries[i].media$group.media$thumbnail[4].url;
              videos[i].categoryId=entries[i].category[1].label;
              videos[i].channelTitle=entries[i].author[0].name['$t'];
              
              videos[i].duration=entries[i].media$group.yt$duration.seconds+"S";
              var hours = parseInt(entries[i].media$group.yt$duration.seconds / 3600);
              var remainder = parseInt(entries[i].media$group.yt$duration.seconds - hours * 3600);
              var mins =parseInt(remainder / 60);
              remainder = remainder - mins * 60;
              var secs = parseInt(remainder);
              
              videos[i].hr=hours;
              videos[i].mins=mins;
              videos[i].secs=secs;
              

              videos[i].viewCount=entries[i].yt$statistics.viewCount;
              videos[i].likeCount=entries[i].yt$rating.numLikes;
              videos[i].dislikeCount=entries[i].yt$rating.numDislikes;
              videos[i].favoriteCount=entries[i].yt$statistics.favoriteCount;
              if(entries[i].gd$comments) videos[i].commentCount=entries[i].gd$comments.gd$feedLink.countHint;
             console.log(videos);
              
              }
              
              self.videos =videos;
              console.log(videos);
              
              return videos;
              }
             });
            

          },
          
          
        getComments: function(videoid,startindex) {
            var i;
            var self = this,myData,comments= {},k;
            if(this.apikey === "") { return this.ErrorAll(0);}
            if(startindex && startindex>0 && startindex<1000) {
              return self.ErrorAll(23);
            } else if(startindex=="next" && this.comments.index<999) {
              startindex=this.comments.index+25;
            } else if(startindex=="prev" && this.comments.index>0) {
              startindex=this.comments.index-25;
            } else {
              return this.ErrorAll(0);
            }
            console.log(videoid);
            
            
            
            var myUrl="https://gdata.youtube.com/feeds/api/videos/"+videoid+"/comments?v=2&alt=json&start-index="+startindex;//+"&maxResults="+maxResults;
           
           console.log(myUrl);
             $.ajax({
              url: myUrl,
              dataType: 'json',
              async: false,
              data: myData,
              success: function(data) {
              var entries;
              
              console.log(data);
              entries= data.feed.entry;
              comments.total=data.feed.openSearch$totalResults['$t'];
              if(comments.total == 0) {return this.ErrorAll(13);}
              comments.index=startindex;
              for(i=0;i<25;i++)
              {
              comments[i]={};
              //console.log(videos);
              comments[i].title = entries[i].title['$t'];
              comments[i].content = entries[i].content['$t'];
              comments[i].publishedAt=entries[i].published['$t'];
              comments[i].authorName=entries[i].author[0].name['$t'];
              comments[i].authorUri=entries[i].author[0].uri['$t'];
              comments[i].authorId=entries[i].author[0].yt$userId['$t'];
              
              
              }
              
              self.comments =comments;
              console.log(comments);
              
              return comments;
              }
             });
            

          },
          
          
          
          
        clearAll: function() {
             var  self=this;
             self.title = undefined;
             self.content = undefined;
             self.rating=undefined;
             self.numRaters=undefined;
             self.views=undefined;
             self.publishedAt=undefined;
             self.dthumbnail=undefined;
             self.mthumbnail=undefined;
             self.hthumbnai=undefined;
             self.sthumbnail=undefined;
             self.categoryId=undefined;
             self.channelTitle=undefined;
             
             self.duration=undefined;
             self.hr=undefined;
             self.mins=undefined;
             self.secs=undefined;
             self.dimension=undefined;
             self.definition=undefined;
             self.caption=undefined;
             self.licensedContent=undefined;
             
             self.viewCount=undefined;
             self.likeCount=undefined;
             self.dislikeCount=undefined;
             self.favoriteCount=undefined;
             self.commentCount=undefined;
             
             self.videos= {};
          

          },
          
          
       ErrorAll: function(errno) {
        
        
        var errors ={
                    "0":"Please Provide Api Key using object.apikey (or) inside $youtube(apikey)",
                    "1":"Please Supply video id while calling the function ex:getdata(videoid)",
                    "11":"Please Provide Keyword to search",
                    "12":"Please Enter Valid maxResults value ranging from 0 to 50",
                    "13":"Less than zero values",
                    "21":"No Next Page",
                    "22":"No Previous Page",
                    "23":"Please enter valid start index, it shoukd range from 1 to 999"
        };
        
        var errormsg ={};
        errormsg.error =errors[errno];
        errormsg.errorno =errno;
        
        return errormsg;
        
      },
      
      
       availableOptions: function(no) {
        
        
        var available ={
                    "0":"top_favorites most_shared most_popular most_recent most_discussed most_responded recently_featured on_the_web",
                    "11":"Please Provide Keyword to search",
                    "21":"No Next Page",
                    "22":"No Previous Page"
        };
        
        var returnavaiable ={};
        returnavaiable.options =available[no];
        
        return returnavaiable;
        
      }
         
        
        
       
     
	};
    
  
    
 
    
    
    window.$youtube = $youtube;
})(window);