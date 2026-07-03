import * as THREE from "three";

export const W = 12; // building width
export const D = 8; // building depth
export const FLOOR_H = 3.2; // floor height
export const NUM_FLOORS = 4;

export const FLOORS = [
  {
    id: 0,
    name: "Grand Lobby",
    desc: "Welcome to the world of Earth Positive",
    tags: ["Reception", "Concierge", "Café Bar"],
  },
  {
    id: 1,
    name: "T-Shirts Atelier",
    desc: "Premium organic cotton essentials",
    tags: ["Classic Tees", "Graphic Series", "Limited Drops"],
  },
  {
    id: 2,
    name: "Hoodies & Streetwear",
    desc: "Luxury sustainable streetwear",
    tags: ["Oversized", "Zip-Ups", "Collaborations"],
  },
  {
    id: 3,
    name: "Accessories Suite",
    desc: "Tote bags, caps & premium accessories",
    tags: ["Totes", "Caps", "Jewellery"],
  },
];

export const CAM = {
  exterior: {
    pos: new THREE.Vector3(22, 16, 28),
    target: new THREE.Vector3(0, 6, 0),
  },
  lobby: {
    pos: new THREE.Vector3(0, FLOOR_H * 0.5, D / 2 + 4),
    target: new THREE.Vector3(0, FLOOR_H * 0.5, -1),
  },
  floors: [
    {
      pos: new THREE.Vector3(0, FLOOR_H * 0.55, D / 2 + 3.8),
      target: new THREE.Vector3(0, FLOOR_H * 0.55, -1),
    },
    {
      pos: new THREE.Vector3(0, FLOOR_H * 1.55, D / 2 + 3.8),
      target: new THREE.Vector3(0, FLOOR_H * 1.55, -1),
    },
    {
      pos: new THREE.Vector3(0, FLOOR_H * 2.55, D / 2 + 3.8),
      target: new THREE.Vector3(0, FLOOR_H * 2.55, -1),
    },
    {
      pos: new THREE.Vector3(0, FLOOR_H * 3.55, D / 2 + 3.8),
      target: new THREE.Vector3(0, FLOOR_H * 3.55, -1),
    },
  ],
};

export const PROP_DATABASE = {
  "Tomo Koizumi Gown": {
    price: "$1,250.00",
    icon: "gown",
    desc: "A gorgeous ruffled rainbow gown hand-layered with fine sustainable colored tulle.",
    colors: [
      { name: "Rainbow Pink", hex: "#e53935" },
      { name: "Neon Green", hex: "#39e535" },
      { name: "Royal Blue", hex: "#3539e5" },
      { name: "Midnight Black", hex: "#111111" },
    ],
  },
  "Hirume Bonsai": {
    price: "$350.00",
    icon: "bonsai",
    desc: "Traditional Japanese Bonsai tree representing natural beauty and ethical balance.",
  },
  "Rod Chandelier": {
    price: "$850.00",
    icon: "light",
    desc: "Modern glowing steel rod tube chandelier that reacts to post-processing bloom.",
  },
  "Lounge Sofa": {
    price: "$1,400.00",
    icon: "sofa",
    desc: "Minimalist designer fabric sofa set with a white marble top coffee table.",
  },
  "Organic Tees": {
    price: "$45.00",
    icon: "shirt",
    desc: "Classic graphic T-shirt collection made from organic, climate-neutral cotton.",
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Charcoal", hex: "#333333" },
      { name: "Dusty Blue", hex: "#7a95b8" },
      { name: "Sage Green", hex: "#7ba082" },
    ],
  },
  "Organizer Stand": {
    price: "$180.00",
    icon: "pack",
    desc: "Black steel organizer shelf displaying backpacks, shoes, and canvas tote bags.",
  },
  "Organic Hoodies": {
    price: "$95.00",
    icon: "hoodie",
    desc: "Heavyweight organic cotton hoodies and jackets with a comfortable relaxed fit.",
    colors: [
      { name: "Terracotta", hex: "#c85a32" },
      { name: "Mustard", hex: "#d8a032" },
      { name: "Lavender", hex: "#9586b8" },
      { name: "Slate Grey", hex: "#5a6268" },
    ],
  },
  "Accessories Collection": {
    price: "$65.00",
    icon: "cap",
    desc: "Premium sustainable baseball caps, tote bags, and everyday accessories.",
    colors: [
      { name: "Black", hex: "#222222" },
      { name: "Off-White", hex: "#eae5e0" },
      { name: "Olive", hex: "#556b2f" },
    ],
  },
};
