document.addEventListener('DOMContentLoaded', function() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      var bookmarkDashboard = document.getElementById('bookmark-dashboard');
      renderTopLevelFolders(bookmarkTreeNodes[0].children, bookmarkDashboard);
    });
  });
  
  function renderTopLevelFolders(bookmarkNodes, parentNode) {
    var topLevelFolderElement = document.createElement('div');
    topLevelFolderElement.classList.add('top-level-folder');

    var folderElement = document.createElement('div');
    folderElement.classList.add('second-level-folder');

    var cardElement = document.createElement('div');
    cardElement.classList.add('card');

    var titleElement = document.createElement('h2');
    titleElement.textContent = "Bookmarks";
    folderElement.id = "TopBookmarkList"
    
    bookmarkNodes.forEach(function(bookmarkNode) {
      if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        prepareBookmarkList(bookmarkNode.children);        
        renderChildren(bookmarkNode.children, topLevelFolderElement, cardElement);
      }
    });
  
    folderElement.prepend(cardElement);
    folderElement.prepend(titleElement);
    topLevelFolderElement.prepend(folderElement);
    parentNode.appendChild(topLevelFolderElement);
  }
  
  function renderChildren(children, parentNode, TopBookmarkListParentNode) {       
    children.forEach(function(childNode) {
      if (childNode.url) {     
        if (childNode.parentId === "1"){
          renderBookmark(childNode, TopBookmarkListParentNode);
        }else{
          renderBookmark(childNode, parentNode);
        }
      } else if (childNode.children && childNode.children.length > 0) {
        var folderElement = document.createElement('div');
        folderElement.classList.add('second-level-folder');  
        
        var titleElement = document.createElement('h2');
        titleElement.textContent = childNode.title;
        titleElement.classList.add('collapsible');
 
        folderElement.prepend(titleElement);     

        var cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.classList.add('content');
        cardElement.classList.add('active');

        renderChildren(childNode.children, cardElement, TopBookmarkListParentNode);

        folderElement.appendChild(cardElement);     
        parentNode.appendChild(folderElement);          
      }
    });
  
  }

  function prepareBookmarkList(children) { 
    children.sort( (a, b) => {          
      if (a.children && b.children && a.children.length < b.children.length) return -1;
      if (a.children && b.children && a.children.length > b.children.length) return 1;
      if (a.children && !b.children) return 1;
      if (!a.children && b.children) return -1;
      return 0;
    })
  }     
  
  function renderBookmark(bookmarkNode, parentNode) {
    var bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark');
  
    var iconElement = document.createElement('img');
    iconElement.src = 'https://www.google.com/s2/favicons?domain=' + extractHostname(bookmarkNode.url);
    bookmarkElement.appendChild(iconElement);
  
    var titleElement = document.createElement('a');
    titleElement.href = bookmarkNode.url;
    titleElement.textContent = bookmarkNode.title;
    bookmarkElement.appendChild(titleElement);
  
    parentNode.appendChild(bookmarkElement);
  }
  
  function extractHostname(url) {
    var hostname;
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  }
