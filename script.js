let startSearchingButton = document.getElementById("start-searching");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const emailList = document.getElementById("email-list");

  if (request?.emails?.length) {
    uniqEmails = [...new Set(request.emails)];
    uniqEmails.forEach((email) => {
      let li = document.createElement("li");
      li.innerText = email;
      emailList.appendChild(li);
    });
  } else {
    let li = document.createElement("li");
    li.innerText = "Out of luck, no emails found!";
    emailList.appendChild(li);
  }
});

startSearchingButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmails,
  });
});

const scrapeEmails = () => {
  let listOfEmails = [];
  let contentToSearch = document.body.innerHTML;
  let contentAsText = contentToSearch.toString();
  listOfEmails = contentAsText.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  );
  chrome.runtime.sendMessage({ emails: listOfEmails });
};
