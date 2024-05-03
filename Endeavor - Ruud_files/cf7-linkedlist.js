document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector("#questions") ?? document.querySelector(".wpcf7");
  if (container) {
    container.addEventListener("change", (e) => {
      if(!e.target.classList.contains('topic')) return true;
      topicHandler();
    });
  }
});

function topicHandler() {
  const topicSelect = document.querySelector("select.topic");
  const subtopics = document.querySelector("select.subtopic");
  const selectedOption = topicSelect.options[topicSelect.selectedIndex];

  if (!selectedOption.value) {
    showAllOptionsAndOptgroups();
    return;
  }

  hideAllOptgroups();
  const label = selectedOption.textContent;
  const matchingOptgroup = document.querySelector(
    '.subtopic optgroup[label="' + label + '"]'
  );
  subtopics.selectedIndex = 0;
  subtopics.style.visibility = "visible";
  if (matchingOptgroup) {
    matchingOptgroup.style.display = "block";
    subtopics.disabled = false;
    subtopics.style.display = "block";
    subtopics.classList.remove("hidden");
  } else {
    subtopics.style.visibility = "hidden";
    subtopics.disabled = true;
    subtopics.classList.add("hidden");
  }
}

function showAllOptionsAndOptgroups() {
  const subtopicOptgroups = document.querySelectorAll(".subtopic optgroup");
  const topicOptions = document.querySelectorAll(".topic option");

  subtopicOptgroups.forEach(function (optgroup) {
    optgroup.style.display = "block";
  });

  topicOptions.forEach(function (option) {
    option.style.display = "block";
  });
}

function hideAllOptgroups() {
  const subtopicOptgroups = document.querySelectorAll(".subtopic optgroup");

  subtopicOptgroups.forEach(function (optgroup) {
    optgroup.style.display = "none";
  });
}
