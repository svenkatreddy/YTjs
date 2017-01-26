YTjs
====

Universal Youtube Javascript Library for Node JS and browser.

No Jquery needed.


## How to get Youtube API Key

[Click here](http://help.dimsemenov.com/kb/wordpress-royalslider-tutorials/wp-how-to-get-youtube-api-key)


## Node JS 

Example
    
    var youtube = require('ytjs')("API KEY");
    
    youtube.getdata({ videoId: "TlgqWeuhJj4"},function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
    });


## Browser

include yt.js

    <script type="text/javascript" src="yt.js" ></script>

Initalize the library and get Data

    var youtube  = $youtube("API KEY");

     youtube.getdata({ videoId: "TlgqWeuhJj4" },function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
     });
            
    youtube.getdata({ videoId: "PMr2NRPdpH4"}, function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
    });


Methods Available

1. getdata
2. search
3. getComments
    

### get video data (getdata)

    youtube.getdata({ videoId: "TlgqWeuhJj4" },function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
     });

### Searching for Videos (search)
    
    youtube.search({keyword: "rihanna love", fullResults: 1, order: "relevance"}, function(err, data){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(data);
    });

### Comments (getComments)

    youtube.getComments({videoId: "PMr2NRPdpH4"}, function(err, data){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(data);
    });    

## Options


### getdata

1. videoId : youtube video id
2. part: "snippet,statistics,contentDetails"  // you can pass either of three orcombination or all


#### output format (getdata)

You can get wide variety of data from `getdata` method and always youtube original data can be referred in `raw`

    "title":
    "description":
    "rating":
    "views":"",
    "publishedAt":
    "dthumbnail":
    "mthumbnail":
    "hthumbnail":
    "sthumbnail":
    "categoryId":
    "channelTitle":
    "videoId":"",
    "duration":
    "mins":
    "hr":
    "secs":
    "dimension":
    definition":
    caption":
    licensedContent":
    "viewCount":
    "likeCount":
    "dislikeCount":
    "favoriteCount":
    "commentCount":
    "kind":
    "channelId":
    "thumbnails":{}
    "tags":{}
    "liveBroadcastContent":"none"
    "localized":{}
    "projection":
    "raw":{}
    

### search

1. keyword : keyword for search
2. order: "relevance"  // date, rating, viewCount, videoCount, title
3. type : "basic" // "detailed" will provide additional information for each search video
4. navigate : "next" // would render next set of results as youtube only allows 50 videos at a time


#### output format (search)

You can get wide variety of data from `search` method. Results of search will be returned in `videos` array and always youtube original data can be referred in `raw`

    "videos" : []
    nextPageToken:
    prevPageToken:
    kind:
    
### comments

```
youtube.getComments({videoId: "PMr2NRPdpH4"}, function(err, data){
    if(err) {
      console.log(err);
      return false;
    }
    console.log(data);
    nextComments();
});

// next set of comments
function nextComments() {
    youtube.getComments({videoId: "PMr2NRPdpH4", navigate: "next"}, function(err, data){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(data);
    });
}

```        


### output format  (getComments)

You can get wide variety of data from `getComments` method. Results of comments will be returned in `items` array and always youtube original data can be referred in `raw`

`items` array item usually have different values such as `textDisplay`, `authorDisplayName`, `authorProfileImageUrl`, `likeCount` etc

    items : []
    nextPageToken:
    prevPageToken:
    resultsPerPage:
    raw:
    

### debug mode

Debug mode will print details to your console. you can enable debug mode during intialization by passing `true`

    var youtube  = $youtube("API KEY", true);

## Implemented Features

[ x ] get Video Data

[ x ] search for videos

[ x ] get Comments

[ x ] npm module

## Upcoming Plan

[ ] Related Videos

