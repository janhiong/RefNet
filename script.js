const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
let linkTag = searchWrapper.querySelector("a");
let webLink;

// press & release key
inputBox.onkeyup = (e) => {
  let userData = e.target.value; //user entered data
  let emptyArray = [];
  if (userData) {
    emptyArray = suggestions.filter((data) => {
      //filter array to return only those words which are start with user enetered chars
      return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // takes the data and passes it into link tags
      return data = `<li>${data}</li>`;
    });
    searchWrapper.classList.add("active");
    searchWrapper.classList.add("active"); // shows the autocomplete box
    showSuggestions(emptyArray);
    let allList = suggBox.querySelectorAll("li"); // takes all listed items in suggestion box
  }
  else {
    searchWrapper.classList.remove("active");
  }
}

function showSuggestions(list) {
  let listData;
  if(!list.length) {
    userValue = inputBox.value;
    listData = `<li>${userValue}</li>`;
  }
  else {
    listData = list.join("");
  }
  suggBox.innerHTML = listData;
}

