$(document).ready(begin());

function begin() {
    $(".head").addClass("w3-teal").addClass("w3-border-0");
    $(".unit").addClass("w3-teal").addClass("w3-small")
    $(".section").hide();
}


function openSection(section) {
    $(".section").hide();
    var k = "#" + section;
    $(k).slideDown(100);
    $('.section-selector .tab').removeClass('active-tab');
    $('#' + section + '-tab').addClass('active-tab');
}


////////////////////// vanila navigation

document.querySelector('.menu-icon').addEventListener('click', () => {
    document.querySelector('.small-menu').classList.toggle('hide');
})






