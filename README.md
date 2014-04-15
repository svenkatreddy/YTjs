YTJS
====

Youtube Javascript Library implementing Youtube API V3


Initalize the library

    var youtube  = $youtube("API KEY");

Getting the data

     var data = youtube.getdata("Video ID");
     console.log(data.title); // Video title
     console.log(data.description); //Video Description
     console.log(data.publishedAt); // Published at
     // Many more

Searching for Videos
    
    var test = youtube.search("rihanna",5,"yes","relevance","0","v=3");
    //returns 5 videos with search term rihanna ordered by relevance 


If even one person is interested in this library, i will start working on this.

Thanks for all your support. Together we can build next big thing :)



