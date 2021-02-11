// to stop spacebar scrolling
window.addEventListener("keydown", (e) => {
	if(e.keyCode == 32 && e.target == document.body) {
		e.preventDefault();
	}
})

const countdown = () => {
	count--
	document.querySelector(".time-count").innerText = count

	if(!count) {
		clearInterval(idSI)
		document.removeEventListener("keydown", update_main)
		document.querySelector("body").classList.add("done")
		window.scrollTo(0, 0)
		document.querySelector(".current-letter").classList.remove("current-letter")
		document.querySelector(".time").style.display = "none"
		document.querySelector(".results").style.display = "block"
		document.querySelector(".go-again").addEventListener("click", () => {
			location.reload()
		})

		// console.log(current, last_correct, last_wrong)

		if(last_correct == -1 && last_wrong == -1) // last_correct == last_wrong
			wpm_res = 0, characters_res = 0, errors_res = 0
		else if(last_correct > last_wrong) {
			wpm_res = text.substring(0, current - 1).split(" ").length
			characters_res = last_correct + 1
			errors_res = 0
		} else if(last_correct < last_wrong) {
			wpm_res = text.substring(0, current - 1).split(" ").length
			characters_res = last_wrong + 1
			errors_res = characters_res - (last_correct == -1 ? 0 : last_correct + 1)
		}

		document.querySelector(".wpm-result").innerText = wpm_res
		document.querySelector(".characters-result").innerText = characters_res
		document.querySelector(".errors-result").innerText = errors_res
	}
}

let idSI
count = 60

let current = 0
last_correct = -1
last_wrong = -1

const start_countdown = () => {
	idSI = setInterval(countdown, 1000)
}

const is_letter = (key_code) => {
	// A-Z 65-90 and  a-z 97-122
	return (key_code >= 65 && key_code <= 90 || key_code >= 97 && key_code <= 122)
}

const first_key_down = (e) => {
	if(is_letter(e.keyCode)) {
		document.removeEventListener("keydown", first_key_down)
		document.querySelector(".time-msg").style.visibility = "hidden"
		update_main(e)
		document.addEventListener("keydown", update_main)
		start_countdown()
	}
}

document.addEventListener("keydown", first_key_down)

text = document.querySelector(".main").innerText

const update_classes = () => {
	document.querySelector(".main").innerHTML =
		"<span class=\"correct-letters\">" + text.substring(0, last_correct + 1) + "</span>"
		+ "<span class=\"wrong-letters\">" + (last_wrong > last_correct ? text.substring(last_correct + 1, last_wrong + 1) : "") + "</span>"
		+ "<span class=\"current-letter\">" + text.charAt(current) + "</span>"
		+ text.substring(current+1, text.length)
}

const update_main = (e) => {
	// console.log(e.key)
	if(e.key == "Backspace" && current > 0) {
		current--
		if(last_correct == current) last_correct--
		if(last_wrong == current) last_wrong--
		update_classes()
	} else if(e.key == "Backspace" && current == 0 || !(e.key == " ") && !is_letter(e.keyCode)) {
		// pass
	} else if(e.key == text.charAt(current)) {
		current++
		if(last_wrong == -1) last_correct++
		else last_wrong++
		update_classes()
	} else if(e.key != text.charAt(current)) {
		current++
		if(last_wrong == -1) last_wrong = last_correct + 1
		else last_wrong++
		update_classes()
	}

	if(last_wrong <= last_correct) last_wrong = -1

	// if(current == text.length) count = 0 // in case of cheating

	var curr_el = document.querySelector(".current-letter").getBoundingClientRect();
	// console.log(window.scrollX,  window.scrollY);
	// console.log(rect.left, rect.top)
	// console.log(window.innerHeight, window.innerWidth)

	window.scrollTo(0, curr_el.top + window.scrollY - (window.innerHeight * 0.75))
}
