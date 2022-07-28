// fetch('/api/cars')
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data)
// });

// fetch('/api/people')
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data)
// });
const $people = $(".People");
const $cars = $(".Cars");
const $display = $(".display");
const $carlist = $(".carlist");

$cars.click(() => { 
    $.ajax({
        type: "GET",
        url: "/api/cars",
        success: res => {
            $carlist.empty();
            for(let i = 0; i < res.length; i++){
                const $info = $(`<h3>${res[i].year} ${res[i].make} ${res[i].model} ${res[i].color} ${res[i].person_id}</h3>`)
                $info.appendTo($carlist);
            };
            console.log(res)
        },
        contentType: "application/json"
    });
});

$people.click(() => {
    $.ajax({
        type: "GET",
        url: "/api/people",
        data: JSON.stringify(),
        success: res => {
            $display.empty();
            for(let i = 0; i < res.length; i++){
                const $info = $(`<h3>Name: ${res[i].name} - Age ${res[i].age}</h3>`)
                $info.appendTo($display);
            };
            console.log(res)
        },
        contentType: "application/json"
    });
});