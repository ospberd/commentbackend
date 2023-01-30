function removeBannedTags(htmlString) {
    let regex = /(?!<i>)(?!<\/i>)(?!<code>)(?!<\/code>)(?!<strong>)(?!<\/strong>)(?!<a href="[^]*">)(?!<\/a>)(<(.|\n)*?>)/ig;
    let result = htmlString.replace(regex,"");
    return result;
}

function chkHtmlTags(htmlString) {

    const allowedtags = ['<a href="</a>',  // array allowed tags
                         '<code></code>',
                         '<i></i>',
                         '<strong></strong>'];
    

    // get tag array
    let regtags = /(<(.|\n)*?>)/ig
    let tagarray = htmlString.match(regtags);
    if (!tagarray) {return []}
     let theend = false; 
    while (!theend) {
        theend = true;
        for (let index = 0; index < tagarray.length-1; index++) {
            theend = true;
            const element = tagarray[index].slice(0, 9)+tagarray[index+1].slice(0, 9);
        
            if (allowedtags.indexOf(element)!=-1){
                theend = false;
                tagarray.splice(index, 2);
                break; }
        } 
    }
    // tagarray empty if all tags are pair and do not overlap
    return tagarray;  
}

//module.exports = removeBannedTags(), chkHtmlTags() ;
module.exports = {removeBannedTags, chkHtmlTags  };