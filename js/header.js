getById('hamburger').addEventListener('click', function(){
    getById('navbar-menu__content').classList.toggle('open')
    getById('main').classList.toggle('open')
});

getById('dropdown-btn').addEventListener('click', function() {
    getById('my-dropdown__caret').classList.toggle('open');
    getById('my-dropdown').classList.toggle('open');

    //  Remove previously opened dropdown
    getById('my-dropdown__caret-2').classList.remove('open');
    getById('my-dropdown-2').classList.remove('open');
})

getById('dropdown-btn-2').addEventListener('click', function() {
    getById('my-dropdown__caret-2').classList.toggle('open');
    getById('my-dropdown-2').classList.toggle('open');

    //  Remove previously opened dropdown
    getById('my-dropdown__caret').classList.remove('open');
    getById('my-dropdown').classList.remove('open');
})

//  Close all dropdowns
window.onclick = function(event) {
    // console.log(event.target);
    if (!event.target.matches(['.dropdown', '.avatar', '.dropdown-icons', '.octicon-plus', '.dropdown-caret', '.dropdown-svg__path'])) {
        var dropdowns = getByClassName("dropdown-content");
        
        // Open dropdown body
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('open')) {
                openDropdown.classList.remove('open');
            }
        }

        // Open dropdown caret
        var dropdowns = getByClassName("my-dropdown__caret");
        for (var j = 0; j < dropdowns.length; j++) {
            var openDropdown = dropdowns[j];
            if (openDropdown.classList.contains('open')) {
                openDropdown.classList.remove('open');
            }
        }
    }
}