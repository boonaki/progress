function showFollowers() {
    let following = document.getElementById('box-2')
    let followers = document.getElementById('box-1')
    let slider = document.getElementById('slider')

    //if on left side (followers is showing) move to right (hide followers show following)
    if(following.classList.contains('hidden')) {
        slider.classList.add('translate-x-full')
        following.classList.remove('hidden')
        followers.classList.add('hidden')
    }else { //if on right side move to left
        slider.classList.remove('translate-x-full')
        following.classList.add('hidden')
        followers.classList.remove('hidden')
    }
}

const box2 = document.getElementById('box-2')

window.addEventListener("beforeunload", _ => {
    localStorage.setItem('topper', window.pageYOffset)
    let page = box2.classList.contains('hidden') ? 'one' : 'two';
    localStorage.setItem('page', page)
})

window.onload = function () {
    if(localStorage.topper > 0) {
        let position = localStorage.getItem('topper');
        if (position) setTimeout(window.scrollTo(0, position), 100);
    }
    
    if(localStorage.page === 'two'){
        showFollowers()
    }
}


let search = document.querySelector('#all-search')
// search.addEventListener('change', changeSearch())

search.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        changeSearch()
    }
})

async function changeSearch(){
    let container = document.getElementById('reelSearchContainer')
    await fetch(`/search?s=${search.value}`)
        .then(result => result.json())
        .then(result => {
            for(let i = 0; i < result.length; i++){
                container.appendChild(Object.assign(document.createElement('a'), {id: `s-${i}`}))
                let nodeElem = document.getElementById(`s-${i}`)
                nodeElem.innerHTML = ''
                let fill = `
                    <a href="/reel/view/${result[i]._id}"><div class="px-4 mx-2 bg-[#22242c] py-3 rounded-lg my-2">
                    <div class="">
                        <h2 class="text-2xl text-[#ebebeb] font-bold">${result[i].title}</h2>
                    </div>
                    <p class="text-lg">${result[i].caption}</p>
                    
                    <div class="w-full flex justify-center items-center my-1 w-fit text-[#6e6e6e]">
                        <span class="text-sm font-semibold mx-2">${result[i].userName}</span>
                        <span class="w-[5px] h-[5px] bg-[#646464] rounded-full mx-1"></span>
                        <span class="py-1 h-fit text-sm mx-2 rounded-lg flex items-center md:transition md:hover:bg-[#bgbgbg2b]">
                            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="none" fill="#ffd700" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                            </svg>
                            ${result[i].stars.length} 
                        </span>
                        <span class="w-[5px] h-[5px] bg-[#646464] rounded-full mx-1"></span>
                        <span class="py-1 h-fit text-sm mx-2 rounded-lg flex items-center md:transition md:hover:bg-[#bgbgbg2b]">
                            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="none" fill="#ff3030" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                            </svg>
                            ${result[i].likes}
                        </span>
                    </div>
                    
                    </div></a>
                `
                nodeElem.innerHTML = fill
            }
        })
        .catch(err => console.log(err))

    container.classList.remove('hidden')
}