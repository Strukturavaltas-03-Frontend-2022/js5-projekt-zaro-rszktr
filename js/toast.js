import { getTextFromJson } from "./translation.js";

// Alerts, toasts
// src: https://codepen.io/uxmankabir/pen/YzEmKBZ

// TOAST MESSAGES
export async function methodAlert() {
  toastEdit(await getTextFromJson('alertEdit'))
}

export async function methodAlertInvalid() {
  toastInvalid(await getTextFromJson('alertInvalid'))
}

export async function methodAlertSuccess() {
  toastSuccess(await getTextFromJson('alertSuccess'))
}

export async function methodAlertDelete() {
  toastDelete(await getTextFromJson('alertDelete'))
}


// CREATE SUCCESS TOAST
function toastSuccess(content) {
  toastPopup(content, "success");
}

// CREATE SUCCESS TOAST

async function toastEdit(content) {
  toastPopup(content, "edit");
}

function toastInvalid(content) {
  toastPopup(content, "invalidAlert");
}

function toastDelete(content) {
  toastPopup(content, "delete");
}

// CREATE TOAST
async function toastPopup(content, type) {
  // toast stack
  let toastStack = document.querySelector("#toastStack");
  if (!document.body.contains(toastStack)) {
    toastStack = document.createElement("div");
    toastStack.setAttribute("id", "toastStack");
    document.body.appendChild(toastStack);
  }

  // toast container
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(`toast--${type}`);

  // toast content
  let toastContent = document.createElement("div");
  toastContent.classList.add("toast__content");
  toastContent.textContent = content;
  toast.appendChild(toastContent);

  // close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("toast__close");
  closeButton.textContent = "✕";
  toast.appendChild(closeButton);

  closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    toast.classList.add("toast--hide");
    setTimeout(function () {
      toast.remove();
    }, 400);
  });

  toastStack.appendChild(toast);

  // automatically remove toast
  setTimeout(function () {
    toast.classList.add("toast--hide");
    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 5000);
}
