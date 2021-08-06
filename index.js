

function iterateMonths(myCallback) {
    let months = ["January", "Feburary", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
    for (month of months) {
        myCallback(month)
    }
}



let year = new URLSearchParams(window.location.search).get('year');
let username = new URLSearchParams(window.location.search).get('username');

if(year == null || year === new Date().getFullYear()) {
    year = new Date().getFullYear();
}

document.querySelector('#username').value = username;
let userList = document.querySelectorAll('.usernameInput');
let yearList = document.querySelectorAll('.yearInput');
for(user of userList){
    user.value = username;
}
for(currentYear of yearList){
    currentYear.value = year;
}
document.querySelector('#year').innerHTML = year;

document.getElementById('leftButton').addEventListener('click', () => {
    year--;
    document.querySelector('#yearDecrementInput').value = year;
})

document.getElementById('rightButton').addEventListener('click', () => {
    year++;
    document.querySelector('#yearIncrementInput').value = year;
})

if(year < new Date().getFullYear()) {
    let temp = document.querySelector('#rightButton');
    temp.disabled = false;
}