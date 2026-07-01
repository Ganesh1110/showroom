import * as THREE from 'three';

export const W = 12;          // building width
export const D = 8;           // building depth
export const FLOOR_H = 3.2;   // floor height
export const NUM_FLOORS = 4;

export const FLOORS = [
  { id: 0, name: 'Grand Lobby',        desc: 'Welcome to the world of Earth Positive', tags: ['Reception', 'Concierge', 'Café Bar'] },
  { id: 1, name: 'T-Shirts Atelier',   desc: 'Premium organic cotton essentials',       tags: ['Classic Tees', 'Graphic Series', 'Limited Drops'] },
  { id: 2, name: 'Hoodies & Streetwear', desc: 'Luxury sustainable streetwear',         tags: ['Oversized', 'Zip-Ups', 'Collaborations'] },
  { id: 3, name: 'Accessories Suite',  desc: 'Tote bags, caps & premium accessories',   tags: ['Totes', 'Caps', 'Jewellery'] },
];

export const CAM = {
  exterior: {
    pos: new THREE.Vector3(22, 16, 28),
    target: new THREE.Vector3(0, 6, 0)
  },
  lobby: {
    pos: new THREE.Vector3(0, FLOOR_H * 0.5, D / 2 + 4),
    target: new THREE.Vector3(0, FLOOR_H * 0.5, -1)
  },
  floors: [
    { pos: new THREE.Vector3(0, FLOOR_H * 0.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 0.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 1.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 1.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 2.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 2.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 3.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 3.55, -1) },
  ]
};

export const PROP_DATABASE = {
  'Tomo Koizumi Gown': { price: '$1,250.00', icon: 'gown', desc: 'A gorgeous ruffled rainbow gown hand-layered with fine sustainable colored tulle.' },
  'Hirume Bonsai': { price: '$350.00', icon: 'bonsai', desc: 'Traditional Japanese Bonsai tree representing natural beauty and ethical balance.' },
  'Rod Chandelier': { price: '$850.00', icon: 'light', desc: 'Modern glowing steel rod tube chandelier that reacts to post-processing bloom.' },
  'Lounge Sofa': { price: '$1,400.00', icon: 'sofa', desc: 'Minimalist designer fabric sofa set with a white marble top coffee table.' },
  'Organic Tees': { price: '$45.00', icon: 'shirt', desc: 'Classic graphic T-shirt collection made from organic, climate-neutral cotton.' },
  'Organizer Stand': { price: '$180.00', icon: 'pack', desc: 'Black steel organizer shelf displaying backpacks, shoes, and canvas tote bags.' },
  'Organic Hoodies': { price: '$95.00', icon: 'hoodie', desc: 'Heavyweight organic cotton hoodies and jackets with a comfortable relaxed fit.' },
  'Accessories Collection': { price: '$65.00', icon: 'cap', desc: 'Premium sustainable baseball caps, tote bags, and everyday accessories.' }
};

export const SEARCH_FOCUS = {
  'Tomo Koizumi Gown': { floor: 0, pos: { x: 2.1, y: 1.2, z: 1.2 }, target: { x: 3.4, y: 0.9, z: -0.4 } },
  'Hirume Bonsai': { floor: 0, pos: { x: -1.2, y: 1.1, z: 1.0 }, target: { x: -2.8, y: 0.7, z: -0.4 } },
  'Rod Chandelier': { floor: 0, pos: { x: 0, y: 1.5, z: 3.5 }, target: { x: 0, y: 2.3, z: 0 } },
  'Organic Tees': { floor: 1, pos: { x: 0, y: FLOOR_H + 1.25, z: 1.1 }, target: { x: 0, y: FLOOR_H + 1.2, z: -1.8 } },
  'Organizer Stand': { floor: 1, pos: { x: -1.2, y: FLOOR_H + 1.1, z: 0.8 }, target: { x: -2.8, y: FLOOR_H + 1.0, z: -0.3 } },
  'Organic Hoodies': { floor: 2, pos: { x: 0, y: FLOOR_H * 2 + 1.25, z: 1.1 }, target: { x: 0, y: FLOOR_H * 2 + 1.2, z: -1.8 } },
  'Accessories Collection': { floor: 3, pos: { x: 0, y: FLOOR_H * 3 + 1.25, z: 1.1 }, target: { x: 0, y: FLOOR_H * 3 + 1.2, z: -1.8 } }
};
