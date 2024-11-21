

const navEl = document.getElementById("nav-mobile-menu");
const nav = document.getElementsByTagName("nav");

navEl.addEventListener("click", () => {
    nav[1].classList.toggle("active");
});


 // float social media panel

 const floating_btn = document.querySelector('.floating-btn');
 const close_btn = document.querySelector('.close-btn');
 const social_panel_container = document.querySelector('.social-panel-container');
 
 floating_btn.addEventListener('click', () => {
	 social_panel_container.classList.toggle('visible')
 });
 
 close_btn.addEventListener('click', () => {
	 social_panel_container.classList.remove('visible')
 });
  // ------------------------------------JavaScript code to handle chatbot-------------------------------------------------
// MESSAGE INPUT
const textarea = document.querySelector('.chatbox-message-input')
const chatboxForm = document.querySelector('.chatbox-message-form')

textarea.addEventListener('input', function () {
	let line = textarea.value.split('\n').length

	if(textarea.rows < 6 || line < 6) {
		textarea.rows = line
	}

	if(textarea.rows > 1) {
		chatboxForm.style.alignItems = 'flex-end'
	} else {
		chatboxForm.style.alignItems = 'center'
	}
})
// TOGGLE CHATBOX
const chatboxToggle = document.querySelector('.chatbox-toggle')
const chatboxMessage = document.querySelector('.chatbox-message-wrapper')

chatboxToggle.addEventListener('click', function () {
	chatboxMessage.classList.toggle('show')
})



// DROPDOWN TOGGLE
const dropdownToggle = document.querySelector('.chatbox-message-dropdown-toggle')
const dropdownMenu = document.querySelector('.chatbox-message-dropdown-menu')

dropdownToggle.addEventListener('click', function () {
	dropdownMenu.classList.toggle('show')
})

document.addEventListener('click', function (e) {
	if(!e.target.matches('.chatbox-message-dropdown, .chatbox-message-dropdown *')) {
		dropdownMenu.classList.remove('show')
	}
})

// CHATBOX MESSAGE
const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
const chatboxNoMessage = document.querySelector('.chatbox-message-no-message')

chatboxForm.addEventListener('submit', function (e) {
	e.preventDefault()

	if(isValid(textarea.value)) {
		writeMessage()
		setTimeout(autoReply, 1000)
	}
})
function addZero(num) {
	return num < 10 ? '0'+num : num
}
function writeMessage() {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textarea.value.trim().replace(/\n/g, '<br>\n')}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	chatboxForm.style.alignItems = 'center'
	textarea.rows = 1
	textarea.focus()
	textarea.value = ''
	chatboxNoMessage.style.display = 'none'
	scrollBottom()
}
function autoReply() {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
				Kindly Contact to our toll free +91-422-2605577❤️

			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	scrollBottom()
}
function scrollBottom() {
	chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
}
function isValid(value) {
	let text = value.replace(/\n/g, '')
	text = text.replace(/\s/g, '')

	return text.length > 0
}


  //------------------------------------ JavaScript code to handle image preview------------------------------------------------------
  const storyElements = document.querySelectorAll(".story-gallery .story");
  const previewModal = document.getElementById("preview-modal");
  const previewImage = document.getElementById("preview-image");
  
  storyElements.forEach((story, index) => {
	const image = story.querySelector("img");
	const backgroundImage = story.style.backgroundImage; // Get the background image URL
  
	// Check if the story is not a profile story and the background image is available
	if (!story.classList.contains("profile-story") && backgroundImage) {
	  story.addEventListener("click", () => {
		previewImage.src = backgroundImage.slice(4, -1).replace(/["']/g, ""); // Extract the URL and remove quotes
		previewModal.style.display = "flex";
	  });
	}
  });
  
  previewModal.addEventListener("click", (event) => {
	if (event.target === previewModal) {
	  previewModal.style.display = "none";
	}
  });

  var plus = document.getElementById('plus');

  function plusToggle() {
	 plus.classList.toggle('plus--active');
 }
 plus.addEventListener('click', plusToggle);


 