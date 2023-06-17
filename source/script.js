document.addEventListener('DOMContentLoaded', function() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      var bookmarkDashboard = document.getElementById('bookmark-dashboard');
      renderTopLevelFolders(bookmarkTreeNodes[0].children, bookmarkDashboard);
    });
  });
  
  function renderTopLevelFolders(bookmarkNodes, parentNode) {
    var topLevelFolderElement = document.createElement('div');
    topLevelFolderElement.classList.add('top-level-folder');
  
    bookmarkNodes.forEach(function(bookmarkNode) {
      if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        renderFolder(bookmarkNode, topLevelFolderElement);
      }
    });
  
    parentNode.appendChild(topLevelFolderElement);
  }
  
  function renderFolder(folderNode, parentNode) {
    var folderElement = document.createElement('div');
    folderElement.classList.add('folder');
    folderElement.textContent = folderNode.title;
  
    var folderChildrenElement = document.createElement('div');
    folderChildrenElement.classList.add('second-level-folder');
  
    folderNode.children.forEach(function(childNode) {
      if (childNode.url) {
        renderBookmark(childNode, folderChildrenElement);
      } else if (childNode.children && childNode.children.length > 0) {
        renderFolder(childNode, folderChildrenElement);
      }
    });
  
    folderElement.appendChild(folderChildrenElement);
    parentNode.appendChild(folderElement);
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
  