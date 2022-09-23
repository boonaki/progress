function hideProfileSettings(){
    // document.querySelector('body').classList.remove('stop-scroll')
    document.querySelector('.profile-settings').classList.remove('hide')
}

function showProfileSettings(){
    // document.querySelector('body').classList.add('stop-scroll')
    document.querySelector('.profile-settings').classList.add('hide')
}

function showCreator(){
    
    document.querySelector("#reel-form-container").style.display = "block"
}

function hideCreator(){
    document.querySelector("#reel-form-container").style.display = "none"
}