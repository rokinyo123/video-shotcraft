import {C} from '../theme';
import type {GlobeProps} from './GlobeScene';

const G = '#3ddc84';
const sc = (x: number) => x * (27.6 / 22);

export const GLOBES: Record<string, GlobeProps> = {
  GlobeSoil: {
    dur: 15.6,
    keys: [
      [0, 18, -60, 3.7],
      [15.6, 12, 150, 3.4],
    ],
    pins: [
      {lat: 39, lon: -98, color: '#c0552b', at: 1.2, s: 3.2},
      {lat: -12, lon: -58, color: '#b0a090', at: 2.6, s: 3.2},
      {lat: 5, lon: 20, color: '#8a6a4a', at: 5.4, s: 3.2},
      {lat: 50, lon: 15, color: '#efe6d2', at: 6.6, s: 3.2},
      {lat: 24, lon: 45, color: C.gold, at: 8.0, s: 3.2},
      {lat: 40, lon: 90, color: '#d9b77a', at: 10.0, s: 3.2},
      {lat: -25, lon: 134, color: '#a8452a', at: 12.6, s: 3.2},
    ],
    title: {text: 'Bir ovuc torpaq — yer üzünün hər yerindən', a: 0.8, b: 14.8},
  },
  GlobeHegra: {
    dur: 9.5,
    keys: [
      [0, 24, 55, 3.4],
      [4.2, 26.4, 39, 1.95],
      [9.5, 26.7, 38.3, 1.78],
    ],
    pins: [{lat: 26.79, lon: 37.95, color: C.gold, at: 4.4, title: 'ƏLƏ', sub: 'Mədain Saleh · Səmud yurdu', size: 0.09}],
    highlight: {'682': '#3a2c1a'},
    title: {text: 'Səmud qövmünün yurdu', a: 0.5, b: 4.6},
  },
  GlobeArrival: {
    dur: 27.8,
    keys: [
      [0, 12, 95, 4.4],
      [sc(3.5), 10, 86, 2.6],
      [sc(6.5), 8, 81, 1.75],
      [sc(9.0), 8, 80, 1.7],
      [sc(12.0), 21, 40, 1.62],
      [sc(14.5), 21, 40.5, 1.6],
      [sc(17.5), 16, 60, 2.4],
      [27.8, 17, 58, 2.8],
    ],
    pins: [
      {lat: 7.87, lon: 80.77, color: G, at: sc(5.2), title: 'ADƏM', sub: 'Şri-Lanka (Sərəndib)', dlon: 0.8},
      {lat: 21.54, lon: 39.17, color: C.gold, at: sc(10.8), title: 'HƏVVA', sub: 'Ciddə', left: true, dlon: -0.6, lift: 0.06, size: 0.085},
      {lat: 21.355, lon: 39.984, color: '#ffffff', at: sc(16.2), title: 'ƏRƏFAT', sub: 'Qovuşma yeri', dlat: -0.4, dlon: 0.6, lift: 0.03, size: 0.085},
    ],
    arcs: [
      {from: [7.87, 80.77], to: [21.355, 39.984], a: sc(13.0), b: sc(17.0), color: G, h: 0.22},
      {from: [21.54, 39.17], to: [21.355, 39.984], a: sc(14.5), b: sc(16.4), color: C.gold, h: 0.03},
    ],
    highlight: {'144': '#1f7a46', '682': '#3a2c1a'},
    title: {text: 'Adəm və Həvva harada endilər?', a: 0.6, b: 5.2},
    stamp: {text: 'ZƏİF RƏVAYƏT', at: 750.21 - 730.41},
  },
  GlobeIdris: {
    dur: 3.8,
    keys: [
      [0, 18, 33, 3.2],
      [3.8, 31.5, 44.4, 1.75],
    ],
    pins: [
      {lat: 21.35, lon: 39.98, color: C.gold, at: 0.1, s: 1.2},
      {lat: 32.54, lon: 44.42, color: '#e8d9a8', at: 1.9, title: '?', sub: 'Babil · Mesopotamiya', size: 0.09},
    ],
    arcs: [{from: [21.35, 39.98], to: [32.54, 44.42], a: 0.3, b: 2.0, color: C.gold, h: 0.12}],
  },
};
