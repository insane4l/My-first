var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var list = document.getElementById("list");
var ul = document.getElementsByTagName("ul");
var popup = document.getElementsByClassName("popup")[0];
var close = document.querySelector(".close");
var listItem = document.getElementsByClassName("item");

console.log(btn1);
console.log(ul);
console.log(close);

function addItem() {
	var newLi = document.createElement("li");
	newLi.innerHTML = "Новая Задача";
	newLi.className = "item";
	list.appendChild(newLi);
	popup.style.display = "none";
}

function delItem() {
	list.removeChild(listItem[0]);

	if(listItem.length == 0) {
		popup.style.display = "block";
	}
}

function closePopup() {
	popup.style.display = "none";
}


btn1.addEventListener("click", addItem);
btn2.addEventListener("click", delItem);
close.addEventListener("click", closePopup);