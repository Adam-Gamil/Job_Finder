document.getElementById("searchBox").addEventListener("keyup", getSuggestions);

function getSuggestions() {
  console.log("getSuggestions called");
  const query = document.getElementById("searchBox").value;
  const suggestionsContainer = document.getElementById("suggestions");

  if (query.length === 0) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../data/words.txt", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const words = xhr.responseText.split('\n');
      const matches = words.filter(word => word.toLowerCase().startsWith(query.toLowerCase()));

      suggestionsContainer.innerHTML = "";

      matches.forEach(word => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = word;

        div.onclick = function () {
          document.getElementById("searchBox").value = word;
          suggestionsContainer.innerHTML = "";
        };

        suggestionsContainer.appendChild(div);
      });

      if (matches.length === 0) {
        suggestionsContainer.innerHTML = "<div class='suggestion-item'>No match</div>";
      }
    }
  };
  xhr.send();
}

// Optional: hide suggestions when clicking outside
document.addEventListener("click", function (event) {
  const box = document.getElementById("searchBox");
  const suggestions = document.getElementById("suggestions");

  if (!box.contains(event.target) && !suggestions.contains(event.target)) {
    suggestions.innerHTML = "";
  }
});