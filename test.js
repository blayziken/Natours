const bookings = [
    {
        'name': 'Toluwalope',
        'id': 2
    },
    {
        'name': 'Jesufemi',
        'id': 2
    },
    {
        'name': 'Oluyipe',
        'id': 2
    },
    {
        'name': 'David',
        'id': 9
    },
    {
        'name': 'Anybody',
        'id': 6
    },
];
var picedID = 2;
const tourIDs = bookings.map(el => el.name);
console.log(tourIDs);