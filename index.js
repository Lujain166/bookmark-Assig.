let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

document.addEventListener('DOMContentLoaded', () => {
  displayBookmarks();

  const alertBox = document.createElement('div');
  alertBox.id = 'customAlert';
  alertBox.style = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: #fff; border-radius: 8px; width: 550px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.2); z-index: 9999;
    font-family: sans-serif; display: none;
  `;

  alertBox.innerHTML = `
    <div style="padding: 8px 12px; background: #fff; display: flex; align-items: center; position: relative;">
      <span class="dot" style="height:12px;width:12px;background:#ff5f56;border-radius:50%;margin-right:5px;display:inline-block;cursor:pointer;" id="closeDot"></span>
      <span class="dot" style="height:12px;width:12px;background:#ffbd2e;border-radius:50%;margin-right:5px;display:inline-block;"></span>
      <span class="dot" style="height:12px;width:12px;background:#27c93f;border-radius:50%;margin-right:5px;display:inline-block;"></span>
      <span id="closeCustomAlert" style="position:absolute;right:12px;font-size:28px;font-weight:bold;line-height:1;cursor:pointer;color:#000;">&times;</span>
    </div>
    <div style="padding:16px; text-align: center;">
      <p id="customAlertText" style="margin:0; font-weight:bold; font-size: 18px; color:#333;"></p>
      <ul id="customAlertList" style="padding-left:0; list-style:none; margin-top:15px; text-align:left; color:#444; font-size:16px; line-height:2;">
        <li><span class="circle-icon"><i class="fas fa-arrow-right"></i></span> Site name must contain at least 3 characters</li>
        <li><span class="circle-icon"><i class="fas fa-arrow-right"></i></span> Site URL must be a valid one</li>
      </ul>
    </div>
  `;

  document.body.appendChild(alertBox);

 
  document.getElementById('closeCustomAlert').onclick = () => {
    alertBox.style.display = 'none';
  };


  document.getElementById('closeDot').onclick = () => {
    alertBox.style.display = 'none';
  };
});

function isValidURL(url) {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

function addBookmark() {
  const nameInput = document.getElementById("bookmarkName");
  const urlInput = document.getElementById("bookmarkURL");
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!name || !url) {
    showCustomAlert('Site Name or Url is not valid, Please follow the rules below:');
    highlightEmptyFields(name, url);
    return;
  }

  if (name.length < 3) {
    showCustomAlert('Invalid Site Name: Site name must contain at least 3 characters');
    nameInput.focus();
    return;
  }

  if (!isValidURL(url)) {
    showCustomAlert('Invalid URL: Site URL must be a valid one (should start with http:// or https://)');
    urlInput.focus();
    return;
  }

  if (isDuplicate(name, url)) {
    showCustomAlert('Duplicate Bookmark: This bookmark name or URL already exists!');
    nameInput.focus();
    return;
  }

  bookmarks.push({ name, url });
  saveToLocalStorage();
  displayBookmarks();
  clearForm();
  alert("Bookmark added successfully!");
}

function showCustomAlert(message) {
  document.getElementById('customAlertText').textContent = message;
  document.getElementById('customAlert').style.display = 'block';
}

function highlightEmptyFields(name, url) {
  const nameInput = document.getElementById("bookmarkName");
  const urlInput = document.getElementById("bookmarkURL");
  
  nameInput.style.border = name ? '' : '2px solid #ffcc00';
  urlInput.style.border = url ? '' : '2px solid #ffcc00';
  
  if (!name) nameInput.focus();
  else if (!url) urlInput.focus();
}

function isDuplicate(name, url) {
  return bookmarks.some(bookmark => 
    bookmark.name.toLowerCase() === name.toLowerCase() || 
    bookmark.url.toLowerCase() === url.toLowerCase()
  );
}

function clearForm() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkURL").value = "";
  document.getElementById("bookmarkName").style.border = '';
  document.getElementById("bookmarkURL").style.border = '';
}

function displayBookmarks() {
  const tbody = document.getElementById("bookmarksTable");
  tbody.innerHTML = bookmarks.map((bookmark, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(bookmark.name)}</td>
      <td>
        <a href="${encodeURI(bookmark.url)}" target="_blank" rel="noopener noreferrer">
          <button class="btn visit-btn">Visit</button>
        </a>
      </td>
      <td>
        <button class="btn delete-btn" onclick="deleteBookmark(${index})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function deleteBookmark(index) {
  if (confirm("Are you sure you want to delete this bookmark?")) {
    bookmarks.splice(index, 1);
    saveToLocalStorage();
    displayBookmarks();
    alert("Bookmark deleted successfully!");
  }
}

function saveToLocalStorage() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
