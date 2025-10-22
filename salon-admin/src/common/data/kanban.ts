import avatar5 from "assets/images/users/avatar-5.jpg"
import avatar3 from "assets/images/users/avatar-3.jpg"
import avatar10 from "assets/images/users/avatar-10.jpg"
import avatar8 from "assets/images/users/avatar-8.jpg"
import avatar2 from "assets/images/users/avatar-2.jpg"
import avatar1 from "assets/images/users/avatar-1.jpg"
import avatar4 from "assets/images/users/avatar-4.jpg"
import avatar6 from "assets/images/users/avatar-6.jpg"
import avatar7 from "assets/images/users/avatar-7.jpg"
import avatar9 from "assets/images/users/avatar-9.jpg"
import imge7 from "assets/images/small/img-7.jpg"
import imge4 from "assets/images/small/img-4.jpg"
const headData = [
  {
    id: 1,
    name: "Nancy",
    picture: avatar5,
  },
  {
    id: 2,
    name: "Frank",
    picture: avatar3,
  },
  {
    id: 3,
    name: "Tonya",
    picture: avatar10,
  },
  {
    id: 4,
    name: "Thomas",
    picture: avatar8,
  },
  {
    id: 5,
    name: "Herbert",
    picture: avatar2,
  },
];
const tasklist = [
  {
    id: "1",
    name: "Check In",
    badge: 3,
    color: "success",
    cards: [
      {
        id: "2",
        title: "Nebula Joker",
        text: "My barber took the time to understand exactly what I wanted and made some great suggestions.",
        userImages: [{ id: 1, img: avatar2 }],
        badge1: ["Mohican"],
        botId: "27 Dec, 2021 11:00 AM",
        eye: "04",
        que: "19",
        clip: "02"
      },
      {
        id: "3",
        title: "Sonic Giggles",
        text: "He atmosphere is comfortable, and they even have refreshments while you wait.",
        userImages: [{ id: 2, img: avatar3 }],
        badge1: ["Lionico"],
        botId: "07 Jan, 2022 11:30 AM",
        eye: "14",
        que: "32",
        clip: "05"
      },
      {
        id: "4",
        title: "Quantum Quipster",
        text: "Highly recommend if you're looking for quality service and a great vibe. I’ll definitely be back!",
        userImages: [{ id: 3, img: avatar4 }],
        badge1: ["Straight Razors"],
        botId: "07 Jan, 2022 12:00 PM",
        eye: "14",
        que: "32",
        clip: "05"
      },
    ],
  },
  {
    id: "5",
    name: "In Salon",
    badge: 2,
    color: "secondary",
    cards: [
      {
        id: "6",
        title: "Funky Fizz",
        text: "My barber really listened to what I wanted and delivered the perfect cut..",
        userImages: [{ id: 4, img: avatar5 }],
        badge1: ["Rusty Blade"],
        botId: "07 Jan, 2022 10:00 AM",
        eye: "13",
        que: "52",
        clip: "17"
      },
      {
        id: "7",
        title: "Hilarious Hydra",
        text: "The attention to detail was incredible, and they even offered some great styling tips for my hair type.",
        userImages: [{ id: 5, img: avatar6 }],
        badge1: ["Dark Denny"],
        botId: "27 Dec, 2021 10:30 AM",
        eye: "24",
        que: "10",
        clip: "10"
      },
    ],
  },
  {
    id: "8",
    name: "Completed",
    badge: 2,
    color: "warning",
    cards: [
      {
        id: "9",
        title: "Dandy Dose",
        text: "I had an amazing experience at Ajax! The atmosphere was welcoming and comfortable, and the staff was incredibly friendly and professional.",
        userImages: [{ id: 6, img: avatar7 }],
        badge1: ["Razor Zing"],
        botId: "22 Dec, 2021 09:00 AM",
        eye: "24",
        que: "10",
        clip: "10",
      },
      {
        id: "10",
        title: "Grin Gadget",
        text: "I left feeling fresh and confident! Highly recommend to anyone looking for quality service and a great vibe",
        userImages: [{ id: 7, img: avatar8 }],
        badge1: ["Urban Steave"],
        botId: "24 Oct, 2021 09:30 AM",
        eye: "64",
        que: "35",
        clip: "23"
      },
    ],
  },
  {
    id: "11",
    name: "Cancelled",
    badge: 3,
    color: "info",
    cards: [
      {
        id: "12",
        title: "Giddy Gizmo",
        userImages: [{ id: 8, img: avatar9 }],
        badge1: ["Gary Balsamo"],
        botId: "16 Nov, 2021 9:00 AM",
        eye: "08",
        que: "54",
        clip: "28",
        picture: imge7,
      },
      {
        id: "13",
        title: "Jester Jet",
        text: "An essential part of strategic planning is running a product feature analysis.",
        userImages: [{ id: 9, img: avatar10 }],
        badge1: ["Dashu Pat"],
        botId: "05 Jan, 2022 09:30 AM",
        eye: "14",
        que: "31",
        clip: "07"
      },
      {
        id: "14",
        title: "Joke Jazz",
        text: "To make a pie chart with equal slices create a perfect circle by selecting an Oval Tool.",
        userImages: [{ id: 10, img: avatar4 }],
        badge1: ["Shaun Marsh"],
        botId: "05 Nov, 2021 10:00 AM",
        eye: "12",
        que: "74",
        clip: "37"
      },
    ],
  },
];
const AddTeamMember = [
  { id: 1, img: avatar1, name: 'Albert Rodarte' },
  { id: 2, img: avatar2, name: 'Hannah Glover' },
  { id: 3, img: avatar3, name: 'Adrian Rodarte' },
  { id: 4, img: avatar4, name: 'Frank Hamilton' },
  { id: 5, img: avatar5, name: 'Justin Howard' },
  { id: 6, img: avatar6, name: 'Michael Lawrence' },
  { id: 7, img: avatar7, name: 'Oliver Sharp' },
  { id: 8, img: avatar8, name: 'Richard Simpson' }
]
export { headData, tasklist, AddTeamMember }