let createFeedViews = (feeds) => {

    let feedGrid = document.getElementById("feed-grid");
    
    feeds.forEach( item => {
        
        let entryElements = item.entries.slice(0,3).reduce( (last,entry)=>{
            return last+`<div class='__entry-view'>
                <a href='${entry.link}'>${entry.title}</a>
            </div>`
        },'');
        let newItem = document.createElement('div');
        newItem.innerHTML = `
                <div class="__item-body">
                    ${entryElements}
                
                </div>
                <div class="__item-label">
                    <p>${item.searchText}</p>
                    <small>${item.lastDatetime}</small>
                </div>
        `;
        feedGrid.appendChild(newItem);
    });
    
}

let processQueries = (queries) => {
    
    let arrayPromises = queries.map( searchText => {

        return new Promise(function(resolve, reject){
            
            let feed = new google.feeds.Feed(`https://news.google.com/rss/search?q=${encodeURIComponent(searchText)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`);
            
            feed.load((result)=>{
                if (result.error) reject('fodeo');        
                resolve({
                    searchText,
                    entries:result.feed.entries
                });
            });
        });
    });
    
    Promise.all(arrayPromises).then((values) => {
        sortedFeeds = sortFeedsByPriority(values);
        createFeedViews(sortedFeeds);
    });

}

let sortFeedsByPriority = (feeds)=>{
    let sortedFeeds = feeds.map( feed => {
        let sortedEntries = feed.entries.sort(function(a,b){
            return new Date(b.publishedDate) - new Date(a.publishedDate);
        });

        return {
            searchText:feed.searchText,
            entries:sortedEntries,
            lastDatetime:sortedEntries[0].publishedDate
        }
    });
    
    return sortedFeeds.sort(function(a,b){
        return new Date(b.lastDatetime) - new Date(a.lastDatetime);
    });

}

google.load("feeds", "1");
google.setOnLoadCallback(processQueries([
    'CIEL3',
    'BTOW3',
    'ITSA4',
    'ABEV3',
    'IRBR3',
    'ODPV3',
    'BBSE3',
    'AZUL4',
    'Bom dia mercado',
    'LCAM3'
]));


